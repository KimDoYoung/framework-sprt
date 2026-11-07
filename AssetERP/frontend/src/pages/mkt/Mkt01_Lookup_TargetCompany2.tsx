/**
 * 활동처 선택 창 (Z06) — Mkt03_Tab_HistoryManager 툴바의 활동처 조회 트리거에서 연다
 * AS-IS: myApp/client/vi/mkt/Mkt01_Lookup_TargetCompany2.java (223줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L61-108: 모달 "활동처 선택" 650×500, 위 = 구분 콤보(250, 전체)·검색(활동처 150)·[조회], 아래 = 단일 체크 그리드(활동처 200·구분 350) + 페이징(100), 아래 가운데 [확인][전체][닫기]
 * 스타일: MG 조회창(그리드형) — 견본 Mkt01_Lookup_SelectCompany(Z05)
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktTargetCompanyApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { MktTargetItem } from '@/types/mkt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<MktTargetItem>();
const LIMIT = 100;
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

// buildGrid() L167-176
const columnDefs = [
  gb.text('targetCompanyName', 200, '활동처'),  // L172
  gb.text('itemTypeName', 350, '구분'),         // L173
];

interface Props {
  open: boolean;
  /** confirm() L203-214 → callback(model) / [전체] → callback(null) (L150-158) */
  onResult: (row: MktTargetItem | null) => void;
  onClose: () => void;
}

export const Mkt01_Lookup_TargetCompany2: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<MktTargetItem>>(null);
  const [itemType, setItemType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<MktTargetItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  const last = useRef({ itemType: '%', text: '' });

  // retrieve() L178-201: 구분 코드·검색어 "%…%"·미사용 제외(unUseYn true). 읽은 뒤 첫 행 선택
  const load = async (toPage: number, type: string, text: string) => {
    last.current = { itemType: type, text };
    setBusy(true);
    try {
      const res = await mktTargetCompanyApi.searchLookup({ itemTypeCode: type, searchText: text, offset: (toPage - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      setAfterLoad(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E1] itemTypeComboBox.callbackOnCreate (L45), [E2] gridToolBar.callbackOnCreate (L87) → retrieve()
  useEffect(() => {
    if (!open) return;
    setItemType('%');
    setSearchText('');
    setRows([]);
    setTotal(0);
    void load(1, '%', '');
  }, [open]);

  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(String(rows[0].targetCompanyId))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E5] grid.RowDoubleClick (L130), [E7] confirmButton[확인].Select (L143) → confirm() L203-214
  const confirm = (row?: MktTargetItem) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) {
      message.warning('활동처를 선택해주세요');
      return;
    }
    onResult(target);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="활동처 선택"
      width={740}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E8] selectAllButton[전체].Select [callback != null] (L150) → callback(null), hide() */}
            <Button type="select" onClick={() => { onResult(null); onClose(); }}>전체</Button>
            {/* [E9] cancelButton[닫기].Select (L159) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] searchText.KeyPress [Enter] (L121), [E6] retrieveButton[조회].Select (L137) → retrieve() */}
        <SearchBar onSearch={() => load(1, itemType, searchText)} loading={busy}>
          <SearchBar.Field label="구분">
            {/* [E3] itemTypeComboBox[CrmItemTypeCode].Collapse (L112) → retrieve() */}
            <SystemCodeComboBox
              kindCd="CrmItemTypeCode"
              altCode={['%', '전체']}
              style={{ width: 250 }}
              value={itemType}
              onChange={code => { const v = code ?? '%'; setItemType(v); void load(1, v, searchText); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="활동처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<MktTargetItem>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.targetCompanyId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => confirm(e.data)}
          />
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={busy} onChange={p => void load(p, last.current.itemType, last.current.text)} />
      </div>
    </LookupModal>
  );
};
