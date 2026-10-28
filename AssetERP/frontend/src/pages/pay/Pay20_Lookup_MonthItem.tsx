/**
 * 급여항목 List 조회창 (S17) — Pay10_Tab_MonthItem의 [항목] 칸과 [일괄생성]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay20_Lookup_MonthItem.java (155줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-109: 550×400 "항목 List", 툴바 = 검색(항목명) + [조회], 단일 체크 그리드(항목구분 150 가운데 · 항목명 300) + 아래 [확인][취소].
 * openMonthItem(callback) L44-47이 바로 조회한다. [취소]는 callback(null)을 부른다(항목 칸을 "전체"로 되돌리는 데 쓴다)
 * Pay20_Lookup_ItemList(E22, 전 항목)와 다른 창이다 — 지급·공제 항목만(pay20_item.getMonthItem)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayItem } from '@/types/pay';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<PayItem>();

interface Props {
  open: boolean;
  /** AS-IS callback.execute(itemModel): [확인]·더블클릭이면 고른 항목, [취소]면 null (뒤이어 창이 닫힌다) */
  onResult: (item: PayItem | null) => void;
}

export const Pay20_Lookup_MonthItem: React.FC<Props> = ({ open, onResult }) => {
  const gridRef = useRef<AgGridReact<PayItem>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PayItem[]>([]);

  // buildGrid() L111-121 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.textCenter('itemTypeName', 150, '항목구분'),
    gb.text('itemName', 300, '항목명'),
  ], []);

  // [E1][E2] retrieve() L123-134: "%"+검색어+"%" → pay.Pay20_Item.getMonthItem
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await payApi.lookupMonthItems(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L49-109, openMonthItem L44-47) → 열 때마다 검색을 비우고 바로 조회
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // [E3][E5] confirm() L136-146: 고른 것이 없으면 "선택된 항목이 없습니다"(닫지 않음), 있으면 callback(항목) 뒤 닫기
  const confirm = () => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('선택된 항목이 없습니다');
      return;
    }
    onResult(selected[0]);
  };

  return (
    <LookupModal
      open={open}
      title="항목 List"
      width={650}
      maskClosable={false}
      onCancel={() => onResult(null)}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] confirmButton[확인].Select (L79) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L85) → callback(null), hide() */}
            <Button type="cancel" onClick={() => onResult(null)}>취소</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L73) → retrieve(). 초기화(UX-02)는 조건이 1개라 없음 */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L65) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="항목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E5] grid.CellDoubleClick (L97) → confirm() */}
          <SingleGrid<PayItem>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.itemId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
