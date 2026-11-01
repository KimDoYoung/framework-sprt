/**
 * 시세입력 조회창 (W09) — Ast06_Tab_EvalFinance [시세입력]이 연다. W10 Ast25_Tab_Price도 같은 API를 쓴다.
 * AS-IS: myApp/client/vi/ast/Ast25_Lookup_Price.java (209줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(stdDate, callback) L60-63: 기준일자(막힘)를 받아 setting() L84-150 — 툴바(기준일자 100 · 종목유형 콤보 130 `ItemMClassCode001` "전체" · 검색 200 "종목코드/종목명" · [조회][저장]) + 단일 그리드(종목유형 150 · 종목코드 120 · 종목명 350 · 평가단가 150 편집)
 * 닫기 [닫기] (E3). 조회창이므로 모달은 LookupModal
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), [저장(n)] UX-03, 조회창 UX-05·06
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { astApi } from '@/api/ast';
import { AstPrice } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AstPrice>();
const FORMAT = 'YYYY-MM-DD';

interface Props {
  /** open(stdDate, …)의 기준일자('yyyy-MM-dd') — 값이 있으면 열린다 */
  stdDate: string | null;
  onClose: () => void;
}

export const Ast25_Lookup_Price: React.FC<Props> = ({ stdDate, onClose }) => {
  const open = stdDate !== null;
  const itemType = useRef('%');
  const searchText = useRef('');
  const [itemTypeValue, setItemTypeValue] = React.useState('%');
  const [searchValue, setSearchValue] = React.useState('');
  const dateRef = useRef(stdDate ?? '');
  dateRef.current = stdDate ?? dateRef.current;

  // retrieve() L164-180: ast.Ast25_Price.selectHoldItem(companyId, holdDate, abroType "1", itemType, searchText "%…%")
  const search = useCallback(() => astApi.searchPriceHoldItems(dateRef.current, itemType.current, searchText.current), []);
  // update() L182-200: 변경이 없으면 "변동내역이 없습니다."(TOBE는 [저장(0)] 비활성) → ast.Ast25_Price.insert → "저장이 완료되었습니다." → retrieve()
  const save = useCallback(async (changed: AstPrice[]) => {
    await astApi.savePrices(changed.map(r => ({ stdDate: r.stdDate, itemType: r.itemType, itemCode: r.itemCode, itemName: r.itemName, evalPrice: r.evalPrice })));
    return changed;
  }, []);
  const remove = useCallback(async () => 0, []);
  const newRow = useCallback((): Partial<AstPrice> => ({}), []);

  const crud = useGridCrud<AstPrice>({ idField: 'priceId', search, save, remove, newRow, reloadAfterSave: true });
  const { retrieve } = crud;

  // [E0] 화면 열림 → show() / [E1] 콤보 만들어지면 retrieve() — 열 때마다 새 창이라 조건을 처음으로 되돌리고 조회한다
  useEffect(() => {
    if (!open) return;
    itemType.current = '%';
    searchText.current = '';
    setItemTypeValue('%');
    setSearchValue('');
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L152-162: SingleGrid, 평가단가 DoubleField 편집(색 456EA6)
  const columnDefs = useMemo(() => [
    gb.textCenter('itemTypeName', 150, '종목유형'),   // L155
    gb.textCenter('itemCode', 120, '종목코드'),       // L156
    gb.text('itemName', 350, '종목명'),               // L157
    gb.double('evalPrice', 150, '평가단가', { editor: 'number' }),  // L158
  ], []);

  return (
    <LookupModal open={open} title="시세입력" width={960} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] updateButton[저장].Select (L121) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E3] cancleButton[닫기].Select (L109) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L115) → retrieve(), [E6] searchText.KeyPress [Enter] (L130) → retrieve() */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="기준일자">
            <DatePicker style={{ width: 120 }} allowClear={false} disabled value={dayjs(stdDate ?? undefined)} format={FORMAT} />
          </SearchBar.Field>
          <SearchBar.Field label="종목유형">
            {/* [E1] itemTypeComboBox.callbackOnCreate (L93) / [E2] itemTypeComboBox.Collapse (L102) → retrieve() */}
            <SystemCodeComboBox kindGroupCd="ItemMClassCode001" altCode={['%', '전체']} style={{ width: 130 }} value={itemTypeValue}
              onChange={code => { itemType.current = code ?? '%'; setItemTypeValue(code ?? '%'); void retrieve(); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="종목코드/종목명" value={searchValue}
              onChange={e => { searchText.current = e.target.value; setSearchValue(e.target.value); }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AstPrice> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
