/**
 * 증빙자료 창 (EE34) — 지출결의서(pay50)·ERP 계약사(biz51) 등 여러 화면의 [증빙자료]가 연다 (공통 com 컴포넌트)
 * AS-IS: myApp/client/vi/com/Com01_Lookup_RelateAppr.java (358줄) + Com01_Grid_RelateFile — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L70-95: 모달 880×550(크기 조절) 제목 "증빙자료"(파란 굵은 글씨), 툴바 [조회][불러오기][신규문서 작성][연결제거] + 연결된 상신문서 그리드(buildGrid L181-222:
 *   체크박스 다중, 제목 370 · 등록일 90 · 시행일 90 · 등록자 80 · 상신상태 80 · 상세보기 70) + 아래 200 = Com01_Grid_RelateFile, 창 아래 가운데 [닫기]
 * open(keyTable, keyTableId, callback) L97-114: 파일 칸도 올리기·지우기 가능 / view(…) L116-128: [불러오기]·[신규문서 작성]·[연결제거]를 숨기고 파일 칸은 보기만(setDisable L348-352)
 * [신규문서 작성]은 erpProductCode 가 S1인 회사에는 없다(생성자 L78). 불러오기(Apr05_Lookup_LoadDoc2 "MULTI", 결재완료 문서만)는 keyTable 이 tdm52이면 다른 목록을 쓴다 — tdm52 는 다음 단계
 * 서버: com.Com01_RelateAppr.selectByKeyTableId·listUpdate·delete, apr.Apr01_Appr.permissionsCheck
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { comRelateApprApi } from '@/api/com';
import { errorMessage } from '@/api/client';
import { ComRelateAppr } from '@/types/com';
import { AprLoadDoc2 } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Apr05_Lookup_LoadDoc2 } from '../apr/Apr05_Lookup_LoadDoc2';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Com01_Grid_RelateFile } from './Com01_Grid_RelateFile';

const gb = gbFor<ComRelateAppr>();

interface Props {
  open: boolean;
  /** view(…) — 보기만 */
  mode?: 'open' | 'view';
  /** 연결 테이블명 앞 5자리 (예: 'pay50', 'biz51') */
  keyTable: string | null;
  keyTableId: number | null;
  /** 연결·제거·파일 변경 뒤와 [닫기] (AS-IS callback.execute()) — 부르는 쪽이 증빙자료 건수를 다시 센다 */
  onChanged?: () => void;
  onClose: () => void;
  /** 하위 클래스가 모달 폭을 바꾼다 (Tdm00_Lookup_RelateAppr 1000). 기본 880 */
  width?: number;
  /** 하위 클래스가 파일 목록 아래에 더하는 칸 (Tdm00_Lookup_RelateAppr의 외부보관 증빙자료, 높이 200 — AS-IS `vlc.add(extrEvidVlc, 200)`) */
  extra?: React.ReactNode;
}

export const Com01_Lookup_RelateAppr: React.FC<Props> = ({ open, mode = 'open', keyTable, keyTableId, onChanged, onClose, width = 880, extra }) => {
  const gridRef = useRef<AgGridReact<ComRelateAppr>>(null);
  const [rows, setRows] = useState<ComRelateAppr[]>([]);
  const [loading, setLoading] = useState(false);
  const [apprButton, setApprButton] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [newClassTreeId, setNewClassTreeId] = useState<number | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const readOnly = mode === 'view';

  // retrieve() L224-228: com.Com01_RelateAppr.selectByKeyTableId(keyTableId)
  const retrieve = useCallback(async () => {
    if (!open || keyTableId == null) { setRows([]); return; }
    setLoading(true);
    try {
      setRows(await comRelateApprApi.search(keyTableId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [open, keyTableId]);

  // [E0] 열림 (생성자 L70-95, open L97-114·view L116-128) → fileList.open(), settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);
  useEffect(() => {
    if (!open) return;
    comRelateApprApi.apprButton().then(setApprButton).catch(() => setApprButton(false));
  }, [open]);

  // insert(apprList) L280-305: com.Com01_RelateAppr.listUpdate(문서마다 keyTable·keyTableId·apprId 한 행) → callback.execute(), retrieve()
  const insert = async (apprIds: number[]) => {
    if (keyTable == null || keyTableId == null) return;
    try {
      await comRelateApprApi.add(keyTable, keyTableId, apprIds);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    onChanged?.();
    await retrieve();
  };

  // [E2] insertButton[불러오기].Select (L137) → selectAppr() L230-257: Apr05_Lookup_LoadDoc2("MULTI", aprStatusYn=true) → insert(apprList)
  const onLoadDocs = (docs: AprLoadDoc2[]) => {
    setLoadOpen(false);
    void insert(docs.map(d => d.apprId));
  };

  // [E5] apprButton[신규문서 작성].Select (L164) → selectDcrClass() L320-328: Dcr01_Lookup_Class.open(null, null) → createAppr(dcrModel) L330-346
  const onClassResult = (c: { classTreeId: number }) => {
    setClassOpen(false);
    if (!c?.classTreeId) { message.warning('문서분류를 선택하세요'); return; }
    setNewClassTreeId(c.classTreeId);  // Apr01_Edit_ApprDoc.insertApproval(dcrModel, false, callback → insert(apprId))
  };

  // [E3] deleteButton[연결제거].Select (L143) → 선택이 없으면 "문서를 선택하세요", 있으면 확인 "삭제"/"선택한 연결문서를 제거하시겠습니까?"(폭 350) [E4] [YES] (L152) → delete() L307-318
  const removeCheck = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('문서를 선택하세요'); return; }
    Modal.confirm({
      title: '삭제',
      content: '선택한 연결문서를 제거하시겠습니까?',
      okText: '예', cancelText: '아니오', width: 350,
      onOk: async () => {
        try {
          const n = await comRelateApprApi.delete(checked.map(r => r.relateApprId));
          message.success(`${n}건 삭제되었습니다.`);
          onChanged?.();
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E7] actionCell (ImageCell "View").callbackOnCreate (L196) → ApprCallbackResult(apprId) 열람권한 없으면 "해당문서의 열람권한이 없습니다", 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false)
  const viewDoc = async (row: ComRelateAppr) => {
    try {
      if (await comRelateApprApi.permission(row.apprId)) {
        setViewApprId(row.apprId);
      } else {
        message.info('해당문서의 열람권한이 없습니다');
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L181-222 — setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.text('title', 370, '제목'),  // L214
    gb.date('regDate', 90, '등록일'),  // L215
    gb.date('effectDate', 90, '시행일'),  // L216
    gb.textCenter('regEmpName', 80, '등록자'),  // L217
    gb.textCenter('statusName', 80, '상신상태'),  // L218
    iconCell<ComRelateAppr>('view', 'actionCell', 70, '상세보기', row => { void viewDoc(row); }),  // L219
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // [E6] closeButton[닫기].Select [callback != null] (L170) → callback.execute(), hide()
  const close = () => { onChanged?.(); onClose(); };

  return (
    <>
      <LookupModal
        open={open}
        title={<span style={{ color: '#0069B4', fontWeight: 'bold' }}>증빙자료</span>}
        width={width}
        closable={false}
        maskClosable={false}
        onCancel={close}
        destroyOnClose
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={close}>닫기</Button></div>}
      >
        <div style={{ height: `min(${extra ? 648 : 440}px, calc(100vh - 230px))`, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space>
            {/* [E1] retrieveButton[조회].Select (L131) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {!readOnly && <Button type="register" onClick={() => setLoadOpen(true)}>불러오기</Button>}
            {!readOnly && apprButton && <Button type="register" onClick={() => setClassOpen(true)}>신규문서 작성</Button>}
            {!readOnly && <Button type="delete" onClick={removeCheck}>연결제거</Button>}
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<ComRelateAppr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateApprId)} loading={loading} />
          </div>
          <div style={{ height: 200 }}>
            <Com01_Grid_RelateFile keyTableId={keyTableId} readOnly={readOnly} onChanged={onChanged} />
          </div>
          {extra && <div style={{ height: 200 }}>{extra}</div>}
        </div>
      </LookupModal>
      <Apr05_Lookup_LoadDoc2 open={loadOpen} multi aprStatusYn onSelectedList={onLoadDocs} onClose={() => setLoadOpen(false)} />
      <Dcr01_Lookup_Class open={classOpen} classTreeId={null} onResult={onClassResult} onClose={() => setClassOpen(false)} />
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        newClassTreeId={newClassTreeId}
        onLinkSaved={id => { void insert([id]); }}
        onClose={() => { setViewApprId(null); setNewClassTreeId(null); }}
      />
    </>
  );
};
