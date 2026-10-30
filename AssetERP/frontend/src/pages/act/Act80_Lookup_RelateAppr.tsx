/**
 * 연관문서 창 (W05 2단계 ⓑ) — 거래(trId) 또는 전표(journalId)에 연결된 전자결재 문서와 첨부파일
 * AS-IS: myApp/client/vi/act/Act80_Lookup_RelateAppr.java (329줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L126-149: 모달 900×550, 위 툴바 50([조회][불러오기][신규문서 작성][연결제거]) + 연관문서 그리드(체크 다중: 제목 370 · 등록일 90 · 시행일 90 · 등록자 80 · 상신상태 80 · 상세보기 70 · 잠금 40)
 *   + 아래 200 = Act80_LookupGrid_RelateFile(첨부파일), 아래 가운데 [닫기]
 * 조회창 규격(11a): LookupModal, 머리 아래 선·푸터 위 선, 선은 최소(그리드 사이는 간격 8)
 * [불러오기]는 Apr05_Lookup_LoadDoc(ⓒ 완료: 문서분류 트리 + 문서 목록 + 미리보기)을 열어 고른 문서를 POST act/relate-apprs로 연결하고, [신규문서 작성]은 Dcr01_Lookup_Class(ⓒ 완료)로 문서분류를 정한다.
 * 상세보기는 Apr01_Edit_ApprDoc.retrieveApproval(V01 문서 읽기, 2026-10-30)을 연다. 문서분류를 정한 뒤 여는 Apr01_Edit_ApprDoc.insertApproval(createAppr)은 V03에서 연결하기 전까지 안내만 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { ActRelateAppr } from '@/types/act';
import { AprLoadDoc } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Act80_LookupGrid_RelateFile } from './Act80_LookupGrid_RelateFile';
import { Apr05_Lookup_LoadDoc } from '../apr/Apr05_Lookup_LoadDoc';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';

const gb = gbFor<ActRelateAppr>();
const NEXT_STEP = '전자결재 문서 창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.';

/** 열 때 받는 값 (AS-IS open(title, code, relateId, dcrClassTreeId, callback)) */
export interface ActRelateApprTarget {
  title: string;
  code: 'trId' | 'journalId';
  relateId: number;
  /** [신규문서 작성]의 문서분류 시작 위치 — Dcr01_Lookup_Class가 채워 연다 */
  dcrClassTreeId?: number | null;
}

interface Props {
  /** 값이 있으면 열림 */
  target: ActRelateApprTarget | null;
  /** [닫기] 단추 (AS-IS callback.execute() 뒤 hide) — X로 닫을 때는 부르지 않는다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Act80_Lookup_RelateAppr: React.FC<Props> = ({ target, onClosed, onClose }) => {
  const gridRef = useRef<AgGridReact<ActRelateAppr>>(null);
  const [rows, setRows] = useState<ActRelateAppr[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadDocOpen, setLoadDocOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [detailApprId, setDetailApprId] = useState<number | null>(null);

  // retrieve() L194-206: code가 trId면 act.Act80_RelateAppr.selectByTrId, journalId면 selectByJournalId
  const retrieve = useCallback(async () => {
    if (!target) return;
    setLoading(true);
    try {
      setRows(await actApi.searchRelateApprs(target.code, target.relateId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [target]);

  // [E0] 화면 열림 (생성자 L126-149, open L79-88) → fileList.open(code, relateId), settings(), retrieve()
  useEffect(() => {
    setRows([]);
    if (target) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E2] insertButton[불러오기].Select (L97) → insert() L208-238: Apr05_Lookup_LoadDoc → 고른 문서로 Act80_RelateApprModel(apprId, trId|journalId, regDate, title) → act.Act80_RelateAppr.modelUpdate → retrieve()
  const insert = async (appr: AprLoadDoc) => {
    if (!target) return;
    try {
      await actApi.addRelateAppr({ apprId: appr.apprId, trId: target.code === 'trId' ? target.relateId : null, journalId: target.code === 'journalId' ? target.relateId : null });
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] deleteButton[연결제거].Select (L103) → preDelete() L240-259: 확인(350) "n건의 문서연결을 제거하시겠습니까?" → [E7] msgBox.DialogHide [YES] (L243) → delete() L261-272
  const preDelete = () => {
    const count = gridRef.current?.api.getSelectedRows().length ?? 0;
    Modal.confirm({
      title: '확인', content: `${count}건의 문서연결을 제거하시겠습니까?`, width: 350, okText: '예', cancelText: '아니오',
      onOk: async () => {
        const checked = gridRef.current?.api.getSelectedRows() ?? [];
        if (checked.some(r => r.lockYn)) { message.warning('제거할 수 없는 문서(Lock)가 선택되어 있습니다.'); return; }
        if (checked.length === 0) return;
        try {
          await actApi.deleteRelateApprs(checked.map(r => r.relateApprId));
          const gone = new Set(checked.map(r => r.relateApprId));
          setRows(prev => prev.filter(r => !gone.has(r.relateApprId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L151-192
  const columnDefs = useMemo(() => [
    gb.text('title', 370, '제목'),  // L183
    gb.date('regDate', 90, '등록일'),  // L184
    gb.date('effectDate', 90, '시행일'),  // L185
    gb.textCenter('regEmpName', 80, '등록자'),  // L186
    gb.textCenter('statusName', 80, '상신상태'),  // L187
    // [E6] actionCell (ImageCell "Detail").callbackOnCreate (L168): apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false) — V01 문서 읽기 창 (승인·반려 등은 V02~V04)
    iconCell<ActRelateAppr>('view', 'detailAction', 70, '상세보기', row => setDetailApprId(row.apprId)),  // L188
    gb.booleanIcon('lockYn', 40, ''),  // L189 addBooleanIcon
  ], []);

  return (
    <LookupModal
      open={target != null}
      title={target?.title ?? ''}
      width={960}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] closeButton[닫기].Select [callback != null] (L115) → callback(), hide() */}
            <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 470, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L91) → retrieve() */}
          <Button type="search" onClick={retrieve} loading={loading}>조회</Button>
          <Button type="register" onClick={() => setLoadDocOpen(true)}>불러오기</Button>
          {/* [E4] apprButton[신규문서 작성].Select (L109) → selectDcrClass() L274-283: Dcr01_Lookup_Class.open(dcrClassTreeId, null, cb) → createAppr() L285-323 (Apr01_Edit_ApprDoc.insertApproval) — ⓓ 다음 단계(안내만) */}
          <Button type="register" onClick={() => setClassOpen(true)}>신규문서 작성</Button>
          <Button type="delete" onClick={preDelete}>연결제거</Button>
        </div>
        <div style={{ flex: 1, minHeight: 120 }}>
          <MultiGrid<ActRelateAppr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateApprId)} />
        </div>
        <div style={{ height: 200 }}>
          <Act80_LookupGrid_RelateFile code={target?.code ?? null} relateId={target?.relateId ?? null} />
        </div>
      </div>
      <Apr01_Edit_ApprDoc apprId={detailApprId} onClose={() => setDetailApprId(null)} />
      <Apr05_Lookup_LoadDoc open={loadDocOpen} onResult={doc => void insert(doc)} onClose={() => setLoadDocOpen(false)} />
      <Dcr01_Lookup_Class open={classOpen} classTreeId={target?.dcrClassTreeId} onResult={() => message.info(NEXT_STEP)} onClose={() => setClassOpen(false)} />
    </LookupModal>
  );
};
