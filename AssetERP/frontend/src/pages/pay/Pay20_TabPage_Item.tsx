/**
 * 지급/공제 항목관리 탭 (E22) — Pay20_Tab_DeductAdmin 하위 1번째 탭
 * AS-IS: myApp/client/vi/pay/Pay20_TabPage_Item.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L59-79: 툴바(항목구분 콤보 150 · 검색 300 · 조회 · [관리자만] 등록·저장·삭제) + 체크박스 다중 셀 편집 그리드
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 원본에 초기화 버튼이 없어 onReset(UX-02)은 넣지 않는다
 * 부모(Pay20_Tab_DeductAdmin)가 forwardRef 핸들로 retrieve()를 부른다(탭을 고를 때 retrieveTabpage)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { PayItem } from '@/types/pay';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<PayItem>();

export interface PayTabPageHandle {
  retrieve: () => Promise<unknown>;
}

/**
 * AS-IS buildGrid() L138-169: setChecked(MULTI).
 * [E7] itemTypeComboBox[PayItemType].Collapse (L142), [E8] nonTaxTypeComboBox[NonTaxType].Collapse (L151) → 고른 이름에 맞춰 코드(itemType·nonTaxType)도 바꾼다
 */
const buildGrid = (itemTypes: Code[], nonTaxTypes: Code[]) => [
  gb.text('itemTypeName', 150, '항목구분', {  // L161
    editor: 'select',
    values: itemTypes.map(c => c.name),
    valueSetter: p => {
      p.data.itemTypeName = p.newValue;
      p.data.itemType = itemTypes.find(c => c.name === p.newValue)?.code ?? p.data.itemType;
      return true;
    },
  }),
  gb.textCenter('itemCd', 100, '코드', { editor: 'text' }),  // L162
  gb.text('itemName', 400, '항목명', { editor: 'text' }),  // L163
  gb.text('nonTaxTypeName', 100, '과세구분', {  // L164
    editor: 'select',
    values: nonTaxTypes.map(c => c.name),
    valueSetter: p => {
      p.data.nonTaxTypeName = p.newValue;
      p.data.nonTaxType = nonTaxTypes.find(c => c.name === p.newValue)?.code ?? p.data.nonTaxType;
      return true;
    },
  }),
  gb.long('seq', 80, '조회순서', { editor: 'number' }),  // L165
  gb.boolean('useYn', 80, '사용여부', { editable: true }),  // L166 addBoolean (GXT CheckBoxCell — 클릭으로 바뀐다, 05 §6)
];

// [E0] 화면 열림 (생성자 L59-79) → settings() L81-136: 항목구분 "전체"(%), 검색칸 빈칸 글자 "문자열을 입력하세요", 마지막에 retrieve()
export const Pay20_TabPage_Item = forwardRef<PayTabPageHandle>((_props, ref) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // L68 LoginUser.getCompanyId() == 0일 때만 등록·저장·삭제
  const [itemTypes, setItemTypes] = useState<Code[]>([]);
  const [nonTaxTypes, setNonTaxTypes] = useState<Code[]>([]);
  const [itemType, setItemType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const columnDefs = useMemo(() => buildGrid(itemTypes, nonTaxTypes), [itemTypes, nonTaxTypes]);

  const crud = useGridCrud<PayItem>({
    idField: 'itemId',
    // retrieve() L182-193: itemType(콤보 코드, 없으면 "%") · "%"+검색어+"%" → pay.Pay20_Item.selectBySearchText
    search: useCallback(() => payApi.searchItems(itemType, searchText), [itemType, searchText]),
    save: payApi.saveItems,
    remove: payApi.deleteItems,
    // insertRow() L212-216: 빈 모델
    newRow: useCallback(() => ({}), []),
    firstEditField: 'itemTypeName',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // deleteRow() L219-234
  });

  useImperativeHandle(ref, () => ({ retrieve: crud.retrieve }));

  useEffect(() => {
    sysApi.searchCodes('PayItemType').then(setItemTypes).catch(() => {});
    sysApi.searchCodes('NonTaxType').then(setNonTaxTypes).catch(() => {});
  }, []);

  // [E0] 열 때 조회 + [E1] itemTypeComboBox[PayItemType].Collapse (L92) → retrieve(): 항목구분을 고르면 바로 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, [itemType]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E2] searchText.KeyPress [Enter] (L101) → retrieve(), [E3] retrieveButton[조회].Select (L110) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={isAdminCompany && <>
        {/* [E4] insertButton[등록].Select (L116) → insertRow() L212-216 */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E5] updateButton[저장].Select (L122) → update() L196-209. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E6] deleteButton[삭제].Select (L128) → deleteRow() L219-234 → [E9] messageBox.DialogHide [YES] (L222) → pay.Pay20_Item.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </>}>
        <SearchBar.Field label="항목구분">
          <SystemCodeComboBox kindCd="PayItemType" altCode={['%', '전체']} style={{ width: 150 }} value={itemType} onChange={v => setItemType(v ?? '%')} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="문자열을 입력하세요" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayItem> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );
});
