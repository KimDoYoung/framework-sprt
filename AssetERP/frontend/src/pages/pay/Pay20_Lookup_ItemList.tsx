/**
 * 급여항목 조회창 (E22) — Pay04_TabPage_Formula [행 추가]에서 연다.
 * AS-IS: myApp/client/vi/pay/Pay20_Lookup_ItemList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L45-106: 모달 370×500 "급여항목", 위 툴바(항목명 100 · 조회) + 체크박스 다중 그리드(구분 140 · 항목명 150), 아래 가운데 [확인][취소]
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayItem } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<PayItem>();

/** AS-IS buildGrid() L108-116 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('itemTypeName', 140, '구분'),  // L112
  gb.text('itemName', 150, '항목명'),  // L113
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(itemModelList): 확인이면 고른 급여항목 목록 */
  onResult: (items: PayItem[]) => void;
  /** 취소: hide()만 (callback 없음) */
  onClose: () => void;
}

export const Pay20_Lookup_ItemList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<PayItem>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PayItem[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L118-128: "%"+검색어+"%" → pay.Pay20_Item.selectByText
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await payApi.lookupItems(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L45-106: 원본은 열 때마다 새 창 → 입력을 비우고 마지막에 retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    retrieve('');
  }, [open, retrieve]);

  // confirm() L130-139: 선택이 없으면 메시지(닫지 않음), 있으면 callback(목록) + 닫기
  const confirm = () => {
    const itemList = gridRef.current?.api.getSelectedRows() ?? [];
    if (itemList.length < 1) {
      message.warning('항목을 선택해주세요');
      return;
    }
    onResult(itemList);
  };

  return (
    <LookupModal
      open={open}
      title="급여항목"
      width={370}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] oKButton[확인].Select (L76) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E5] cancelButton[취소].Select (L82) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L70) → retrieve(). 초기화(UX-02)는 조건이 1개라 없음 */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="항목명">
            {/* [E1] searchText.KeyPress [Enter] (L56) → retrieve() */}
            <SearchBar.Input autoFocus style={{ width: 100 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.RowDoubleClick (L64) → confirm() */}
          <MultiGrid<PayItem> rowClick
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.itemId)}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
