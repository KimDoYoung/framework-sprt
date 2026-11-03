/**
 * 연관문서 창 (EE20) — Biz11_TabPage_ContHistory 이력 행의 "연관문서" 칸이 연다 (이력 ID = relateId)
 * AS-IS: myApp/client/vi/biz/Biz14_Lookup_RelateAppr.java (300줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L154-178: 모달 850×400 "연관문서", 위 줄 문서분류(조회창 칸 400) + [신규문서 작성], 둘째 줄 [조회][불러오기][연결제거], 연관문서 그리드(체크 다중: 제목 370 · 등록일 90 · 시행일 90 · 등록자 80 · 상신상태 80 · 상세보기 70), [닫기]
 * 조회창 규격(11a): LookupModal, 머리 아래 선·푸터 위 선, 모달 폭 = 열 합계 780 + 60 + 130
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizContCorpApi } from '@/api/bizCont';
import { errorMessage } from '@/api/client';
import { BizContRelateAppr } from '@/types/bizCont';
import { AprLoadDoc } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Apr05_Lookup_LoadDoc } from '../apr/Apr05_Lookup_LoadDoc';

const gb = gbFor<BizContRelateAppr>();

interface Props {
  /** open(relateId) — 이력 ID, 값이 있으면 열린다 */
  contHistoryId: number | null;
  /** [닫기] 단추 (AS-IS callback != null이면 callback.execute() 뒤 hide) — 이 화면의 부르는 쪽은 callback이 없다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Biz14_Lookup_RelateAppr: React.FC<Props> = ({ contHistoryId, onClosed, onClose }) => {
  const gridRef = useRef<AgGridReact<BizContRelateAppr>>(null);
  const [rows, setRows] = useState<BizContRelateAppr[]>([]);
  const [loading, setLoading] = useState(false);
  /** classTreeModel — 고른 문서분류 (settings L86: dcrClassTreeId가 없으면 비어 있다) */
  const [classTree, setClassTree] = useState<{ classTreeId: number; classTreeFullName: string } | null>(null);
  const [classPickOpen, setClassPickOpen] = useState(false);
  const [loadDocOpen, setLoadDocOpen] = useState(false);
  const [newDocClassId, setNewDocClassId] = useState<number | null>(null);
  const [detailApprId, setDetailApprId] = useState<number | null>(null);

  // retrieve() L256-260: 서비스 biz.Biz14_RelateAppr.selectByContHistoryId(contHistoryId)
  const retrieve = useCallback(async () => {
    if (contHistoryId == null) return;
    setLoading(true);
    try {
      setRows(await bizContCorpApi.searchRelateApprs(contHistoryId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [contHistoryId]);

  // [E0] 화면 열림 (생성자 L154-178) → show() · open(relateId) L79-84 → settings(), retrieve()
  useEffect(() => {
    setRows([]);
    setClassTree(null);
    if (contHistoryId != null) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contHistoryId]);

  // [E2] insertButton[불러오기].Select (L112) → insert() L262-285: Apr05_Lookup_LoadDoc → 고른 문서로 biz.Biz14_RelateAppr.modelUpdate(apprId, contHistoryId) → retrieve()
  const insert = async (doc: AprLoadDoc) => {
    if (contHistoryId == null) return;
    try {
      await bizContCorpApi.createRelateAppr(doc.apprId, contHistoryId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E6] apprButton[신규문서 작성].Select [classTreeModel == null] (L142) → 문서분류를 고르지 않았으면 "문서분류를 선택해주세요", 아니면 insertApproval() L231-254
  //   Apr01_Edit_ApprDoc.insertApproval(classTreeModel, isAdmin, cb) → 저장한 문서를 biz.Biz14_RelateAppr.modelUpdate → retrieve()
  //   (AS-IS는 insertModel에 apprId만 넣고 contHistoryId를 넣지 않는다 — 그대로는 biz14_cont_history_id(NOT NULL)가 비어 저장이 안 되므로 이력 ID를 함께 보낸다. 작업기록 "AS-IS 결함 의심")
  const insertApproval = () => {
    if (classTree == null) {
      message.warning('문서분류를 선택해주세요');
      return;
    }
    setNewDocClassId(classTree.classTreeId);
  };
  const onNewDocSaved = async (apprId: number) => {
    if (contHistoryId == null) return;
    try {
      await bizContCorpApi.createRelateAppr(apprId, contHistoryId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] deleteButton[연결제거].Select (L118) → delete() L287-291: GridDeleteData biz.Biz14_RelateAppr.delete(체크된 행 목록) — 확인창이 없다
  const remove = async () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    try {
      await bizContCorpApi.deleteRelateApprs(checked.map(r => r.relateApprId));
      const gone = new Set(checked.map(r => r.relateApprId));
      setRows(prev => prev.filter(r => !gone.has(r.relateApprId)));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L180-217
  const columnDefs = useMemo(() => [
    gb.text('title', 370, '제목'),  // L209
    gb.date('regDate', 90, '등록일'),  // L210
    gb.date('effectDate', 90, '시행일'),  // L211
    gb.textCenter('regEmpNm', 80, '등록자'),  // L212
    gb.textCenter('statusNm', 80, '상신상태'),  // L213
    // [E7] actionCell (ImageCell "Detail").callbackOnCreate (L196): apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, cb → grid.unmask())
    iconCell<BizContRelateAppr>('view', 'detailAction', 70, '상세보기', row => setDetailApprId(row.apprId)),  // L214
  ], []);

  return (
    <LookupModal
      open={contHistoryId != null}
      title="연관문서"
      width={970}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] closeButton[닫기].Select [callback != null] (L124) → callback(), hide() */}
            <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 60, textAlign: 'right', fontSize: 12, fontWeight: 'bold' }}>문서분류</span>
          {/* [E5] classTreeFullName.TriggerClick (L136) → openLookupDoc() L220-229: Dcr30_Move_DcrClass.open(defaultModel, cb) → classTreeModel, classTreeFullName */}
          <LookupInput value={classTree?.classTreeFullName ?? ''} placeholder="문서분류를 선택해주세요" width={400} onOpen={() => setClassPickOpen(true)} />
          <Button type="register" onClick={insertApproval}>신규문서 작성</Button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L106) → retrieve() */}
          <Button type="search" onClick={retrieve} loading={loading}>조회</Button>
          <Button type="register" onClick={() => setLoadDocOpen(true)}>불러오기</Button>
          <Button type="delete" onClick={remove}>연결제거</Button>
        </div>
        <div style={{ flex: 1, minHeight: 120 }}>
          <MultiGrid<BizContRelateAppr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateApprId)} />
        </div>
      </div>
      <Dcr30_Move_DcrClass open={classPickOpen} authCheck
        onResult={c => { if (c.classTreeId != null) setClassTree({ classTreeId: c.classTreeId, classTreeFullName: c.classTreeFullName ?? '' }); }}
        onClose={() => setClassPickOpen(false)} />
      <Apr05_Lookup_LoadDoc open={loadDocOpen} onResult={doc => void insert(doc)} onClose={() => setLoadDocOpen(false)} />
      <Apr01_Edit_ApprDoc apprId={detailApprId} onClosed={() => void retrieve()} onClose={() => setDetailApprId(null)} />
      <Apr01_Edit_ApprDoc apprId={null} newClassTreeId={newDocClassId} onLinkSaved={id => void onNewDocSaved(id)} onClosed={() => void retrieve()} onClose={() => setNewDocClassId(null)} />
    </LookupModal>
  );
};
