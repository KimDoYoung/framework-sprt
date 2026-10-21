/**
 * 종목 찾기 창 (I03) — Flt10_Tab_BuyReport(·I04 매도 사전신고)의 종목명 칸에서 연다 (주식시세 미적용 종목유형).
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_Item.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(stdDate, itemName, callback) L49-62: 500×500 모달, 툴바 "종목명"(150) + [조회], 그리드(종목유형 150 · 종목명 270), [선택][닫기]
 * UX보강(10): 툴바 = SearchBar(UX-01), 조회창 UX-05·06
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltTrItem } from '@/types/flt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FltTrItem>();

/** AS-IS buildGrid() — 행 하나 선택(setChecked 없음) */
const buildGrid = () => [
  gb.text('itemTypeName', 150, '종목유형'),
  gb.text('itemName', 270, '종목명'),
];

interface Props {
  open: boolean;
  /** open(stdDate, …): 기준일(YYYY-MM-DD) */
  stdDate: string;
  /** open(stdDate, itemName, …): 검색칸에 미리 넣는 글자 */
  searchText?: string | null;
  /** callback.execute(itemName) L155-166 */
  onResult: (itemName: string) => void;
  onClose: () => void;
}

export const Flt10_Lookup_Item: React.FC<Props> = ({ open, stdDate, searchText: initialText, onResult, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltTrItem[]>([]);
  const [selected, setSelected] = useState<FltTrItem | undefined>(undefined);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L139-153: 서비스 flt.Flt10_Tr.selectItemName(companyId, personId, stdDate, searchText "%…%")
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await fltApi.searchTrItemNames(stdDate, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [stdDate]);

  // open() L62-90: 열 때 검색칸을 채우고 retrieve()
  useEffect(() => {
    if (!open) return;
    const text = initialText ?? '';
    setSearchText(text);
    setSelected(undefined);
    setRows([]);
    void retrieve(text);
  }, [open, initialText, retrieve]);

  // [E3] oKButton[선택].Select (L108) · [E5] grid.CellDoubleClick (L121) → confirm() L155-166
  const confirm = (picked?: FltTrItem) => {
    const item = picked ?? selected;
    if (!item?.itemName) {
      message.warning('선택된 종목이 없습니다');
      return;
    }
    onResult(item.itemName);
  };

  return (
    <LookupModal
      open={open}
      title="종목 찾기"
      width={610}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => confirm()}>선택</Button>
            {/* [E4] cancelButton[닫기].Select (L114) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L102) → retrieve(). [E1] searchText.KeyPress [Enter] (L93) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="종목명">
            <SearchBar.Input style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltTrItem>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trId)}
            onSelect={setSelected}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
