/**
 * 연관문서 창 (W18) — Bmt10_Tab_Info의 연관문서 아이콘이 연다 (장비에 연결된 전자결재 문서)
 * AS-IS: myApp/client/vi/bmt/Bmt20_Lookup_RelateAppr.java (205줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L86-105: 모달 550×500 "연관문서", 위 툴바 45([조회][등록][삭제]) + 그리드(상신일 100 · 상신명 300 · 상세보기 80), 아래 가운데 [닫기]
 * [등록]은 Apr05_Lookup_LoadDoc(불러오기)으로 고른 문서를 연결하고, 상세보기는 Apr01_Edit_ApprDoc(문서 읽기)을 연다
 * 03 원칙 21: 열 폭 합계 480 + 60 + 130 = 670
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bmtRelateApprApi } from '@/api/bmt';
import { errorMessage } from '@/api/client';
import { BmtRelateAppr } from '@/types/bmt';
import { AprLoadDoc } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Apr05_Lookup_LoadDoc } from '../apr/Apr05_Lookup_LoadDoc';

const gb = gbFor<BmtRelateAppr>();

interface Props {
  /** 장비 ID — 값이 있으면 열림 (AS-IS open(infoId)) */
  infoId: number | null;
  onClose: () => void;
}

export const Bmt20_Lookup_RelateAppr: React.FC<Props> = ({ infoId, onClose }) => {
  const gridRef = useRef<AgGridReact<BmtRelateAppr>>(null);
  const [rows, setRows] = useState<BmtRelateAppr[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadDocOpen, setLoadDocOpen] = useState(false);
  const [detailApprId, setDetailApprId] = useState<number | null>(null);

  // retrieve() L144-149: bmt.Bmt20_RelateAppr.selectByInfoId(companyId, infoId)
  const retrieve = useCallback(async () => {
    if (infoId == null) return;
    setLoading(true);
    try {
      setRows(await bmtRelateApprApi.search(infoId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [infoId]);

  // [E0] 화면 열림 (생성자 L86-105, open L53-57) → settings(), retrieve()
  useEffect(() => {
    setRows([]);
    if (infoId != null) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoId]);

  // [E2] insertButton[등록].Select (L66) → insert() L151-177: Apr05_Lookup_LoadDoc → 고른 문서로 Bmt20_RelateApprModel(apprId, infoId, regDate, title) → bmt.Bmt20_RelateAppr.modelUpdate → retrieve()
  const insert = async (appr: AprLoadDoc) => {
    if (infoId == null) return;
    try {
      await bmtRelateApprApi.create(infoId, appr.apprId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] deleteButton[삭제].Select (L72) → delete() L179-200: 확인(400) "해당 연관문서를 삭제하시겠습니까?" → [E6] msgBox.DialogHide [YES] (L182) → bmt.Bmt20_RelateAppr.delete(고른 행)
  const remove = () => {
    Modal.confirm({
      title: '확인',
      content: '해당 연관문서를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        const checked = gridRef.current?.api?.getSelectedRows() ?? [];
        if (checked.length === 0) return;
        try {
          await bmtRelateApprApi.remove(checked.map(r => r.relateApprId));
          const gone = new Set(checked.map(r => r.relateApprId));
          setRows(prev => prev.filter(r => !gone.has(r.relateApprId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L107-142
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '상신일'),  // L138
    gb.text('title', 300, '상신명'),  // L139
    // [E5] actionCell (ImageCell "Detail").callbackOnCreate (L124): apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false)
    iconCell<BmtRelateAppr>('view', 'actionCell', 80, '상세보기', row => setDetailApprId(row.apprId)),  // L140
  ], []);

  return (
    <LookupModal
      open={infoId != null}
      title="연관문서"
      width={670}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] closeButton[닫기].Select (L78) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L60) → retrieve() */}
          <Button type="search" onClick={retrieve} loading={loading}>조회</Button>
          <Button type="register" onClick={() => setLoadDocOpen(true)}>등록</Button>
          <Button type="delete" onClick={remove}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BmtRelateAppr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateApprId)} />
        </div>
      </div>
      <Apr01_Edit_ApprDoc apprId={detailApprId} onClosed={() => void retrieve()} onClose={() => setDetailApprId(null)} />
      <Apr05_Lookup_LoadDoc open={loadDocOpen} onResult={doc => void insert(doc)} onClose={() => setLoadDocOpen(false)} />
    </LookupModal>
  );
};
