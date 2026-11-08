/**
 * 상세이력 창 (W18) — Bmt10_Tab_Info의 History 아이콘이 연다 (왼쪽 사용자 이력 + 오른쪽 장비(PC) 이력)
 * AS-IS: myApp/client/vi/bmt/Bmt10_Lookup_History.java (222줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-82: 모달 1650×750 "상세이력"(닫기 X 없음), 왼쪽 800 = Bmt11_TabPage_History, 오른쪽 = 툴바 45("▶ 장비이력" · [조회][등록][삭제]) + 그리드(수정 40 · 시작일자 90 · 호스트 100 · 설치(포맷) 90 · 내부IP 120 · MAC주소 170 · 기타사항 300), 아래 가운데 [닫기]
 * 03 원칙 21: 폭은 AS-IS 1650 그대로(화면보다 크면 줄인다), 12 원칙: 안쪽은 선 하나씩
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bmtPcHistoryApi } from '@/api/bmt';
import { errorMessage } from '@/api/client';
import { BmtPcHistory } from '@/types/bmt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bmt11_TabPage_History } from './Bmt11_TabPage_History';
import { Bmt12_Edit_PcHistory, BmtPcHistoryEditTarget } from './Bmt12_Edit_PcHistory';

const gb = gbFor<BmtPcHistory>();

/** 열 때 받는 값 (AS-IS open(infoId, astClassTreeName, callback)) */
export interface BmtHistoryTarget {
  infoId: number;
  astClassTreeName: string | null;
}

interface Props {
  /** 값이 있으면 열림 */
  target: BmtHistoryTarget | null;
  /** [닫기] 단추 (AS-IS callback.execute() 뒤 hide) — 닫기 X는 없다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Bmt10_Lookup_History: React.FC<Props> = ({ target, onClosed, onClose }) => {
  const gridRef = useRef<AgGridReact<BmtPcHistory>>(null);
  const [rows, setRows] = useState<BmtPcHistory[]>([]);
  const [editTarget, setEditTarget] = useState<BmtPcHistoryEditTarget | null>(null);
  const infoId = target?.infoId ?? null;

  // retrieve() L153-166: bmt.Bmt12_PcHistory.selectByInfoId(companyId, infoId) → 첫 행을 고른다
  const retrieve = useCallback(async () => {
    if (infoId == null) return;
    try {
      setRows(await bmtPcHistoryApi.search(infoId));
      setTimeout(() => {
        const api = gridRef.current?.api;
        if (api && api.getDisplayedRowCount() > 0) api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
      }, 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [infoId]);

  // [E0] 화면 열림 (생성자 L54-82, open L84-93) → settings(), retrieve(), tabPage.retrieve(infoId)
  useEffect(() => {
    setRows([]);
    if (target) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E2] insertButton[등록].Select (L102) → insert() L168-186: 고른 행이 없으면 insert(infoId, 장비명) "신규등록", 있으면 add(고른 행) "추가등록"
  const insert = () => {
    if (!target) return;
    const sel = gridRef.current?.api?.getSelectedRows()[0];
    setEditTarget(sel ? { mode: 'add', row: sel } : { mode: 'insert', infoId: target.infoId, astClassTreeName: target.astClassTreeName });
  };

  // [E3] deleteButton[삭제].Select (L108) → deleteCheck() L188-207: 확인(400) "해당 이력을 삭제하시겠습니까?" → [E6] msgBox.DialogHide [YES] (L191) → delete() L209-213: bmt.Bmt12_PcHistory.delete(고른 행)
  const deleteCheck = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) return;
    Modal.confirm({
      title: '확인',
      content: '해당 이력을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        try {
          await bmtPcHistoryApi.remove(checked.map(r => r.pcHistoryId));
          const gone = new Set(checked.map(r => r.pcHistoryId));
          setRows(prev => prev.filter(r => !gone.has(r.pcHistoryId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L125-151 — [E5] editCell (ImageCell "Edit").callbackOnCreate (L132) → Bmt12_Edit_PcHistory.edit(고른 행) "정보수정" → retrieve()
  const columnDefs = useMemo(() => [
    iconCell<BmtPcHistory>('edit', 'actionCell', 40, '수정', row => setEditTarget({ mode: 'edit', row })),  // L142
    gb.date('startDate', 90, '시작일자'),  // L143
    gb.text('hostName', 100, '호스트'),  // L144
    gb.date('settingDate', 90, '설치(포맷)'),  // L145
    gb.text('internalIp', 120, '내부IP'),  // L146
    gb.text('macAddress', 170, 'MAC주소'),  // L147
    gb.textArea('etc', 300, '기타사항'),  // L148
  ], []);

  return (
    <LookupModal
      open={target != null}
      title="상세이력"
      width="min(1650px, calc(100vw - 32px))"
      style={{ top: 20 }}
      closable={false}
      maskClosable={false}
      keyboard={false}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] closeButton[닫기].Select [callback != null] (L114) → callback(), hide() */}
            <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'calc(100vh - 230px)', minHeight: 420, display: 'flex', gap: 8 }}>
        <div style={{ width: 800, flex: 'none' }}>
          <Bmt11_TabPage_History infoId={infoId} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, padding: 10, boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, marginRight: 8 }}>▶ 장비이력</span>
            {/* [E1] retrieveButton[조회].Select (L96) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            <Button type="register" onClick={insert}>등록</Button>
            <Button type="delete" onClick={deleteCheck}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<BmtPcHistory> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.pcHistoryId)} />
          </div>
        </div>
      </div>
      <Bmt12_Edit_PcHistory target={editTarget} onClose={() => setEditTarget(null)} onDone={() => void retrieve()} />
    </LookupModal>
  );
};
