/**
 * [1267] 기초자료 > 00. 내부통제 > 임직원매매 종목유형관리 (E08)
 * AS-IS: myApp/client/vi/flt/Flt05_Tab_ItemTypeAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L80-120: 가운데(왼쪽) = 툴바(검색 200 · 조회 · 등록 · 저장 · 삭제) + 로그인 회사 종목유형 셀 편집 그리드(행번호, 체크박스 다중),
 *   동쪽(오른쪽, 분할) = 툴바(고객사 150 · 조회 · 등록 · 등록(복사) · 저장 · 삭제) + 고른 고객사 종목유형 셀 편집 그리드(행번호, 체크박스 없음 — 한 행 선택)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03). 초기화(UX-02)는 원본에 없는 동작이라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltItemType } from '@/types/flt';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';

const gb = gbFor<FltItemType>();

const START_DATE = '2000-01-01';

/** AS-IS buildGrid() L256-273 */
const buildGrid = () => [
  gb.textCenter('itemTypeCode', 40, '코드', { editor: 'text' }),  // L262
  gb.text('itemTypeName', 200, '유형명', { editor: 'text' }),  // L263
  gb.longCenter('seq', 40, '순서', { editor: 'number' }),  // L264
  gb.date('startDate', 90, '적용시작일', { editor: 'date' }),  // L265
  gb.boolean('targetYn', 80, '신고대상', { editable: true }),  // L266
  gb.boolean('sellPreApprYn', 80, '매도<br>사전승인', { editable: true }),  // L267
  gb.boolean('lockUpCheckYn', 95, '의무보유기간<br>체크여부', { editable: true }),  // L268
  gb.boolean('stkPriceYn', 95, '주식시세적용', { editable: true }),  // L269
  gb.boolean('listStkYn', 95, '상장지분증권', { editable: true }),  // L270
];

/** AS-IS tgtBuildGrid() L275-292 */
const tgtBuildGrid = () => [
  gb.text('companyName', 100, '고객사명'),  // L280
  gb.textCenter('itemTypeCode', 40, '유형', { editor: 'text' }),  // L281
  gb.text('itemTypeName', 200, '유형명', { editor: 'text' }),  // L282
  gb.longCenter('seq', 40, '순서', { editor: 'number' }),  // L283
  gb.date('startDate', 90, '적용시작일', { editor: 'date' }),  // L284
  gb.boolean('targetYn', 80, '신고대상', { editable: true }),  // L285
  gb.boolean('sellPreApprYn', 80, '매도<br>사전승인', { editable: true }),  // L286
  gb.boolean('lockUpCheckYn', 95, '의무보유기간<br>체크여부', { editable: true }),  // L287
  gb.boolean('stkPriceYn', 95, '주식시세적용', { editable: true }),  // L288
  gb.boolean('listStkYn', 95, '상장지분증권', { editable: true }),  // L289
];

const deleteConfirm = (n: number) => `${n}건의 정보를 삭제하시겠습니까?`;

export const Flt05_Tab_ItemTypeAdmin: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  const tgtColumnDefs = useMemo(tgtBuildGrid, []);
  const [searchText, setSearchText] = useState('');
  // 오른쪽: 고른 고객사 (AS-IS companyField·companyId)
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [lookupCompany, setLookupCompany] = useState(false);

  const crud = useGridCrud<FltItemType>({
    idField: 'itemTypeId',
    // retrieve() L323-337: 로그인 회사, searchText = "%검색어%" → flt.Flt05_ItemType.selectBySearchText
    search: useCallback(() => fltApi.searchItemTypes(searchText), [searchText]),
    // update() L360-363: GridUpdate → flt.Flt05_ItemType.update
    save: useCallback((rows: FltItemType[]) => fltApi.updateItemTypes(rows), []),
    remove: useCallback((ids: number[]) => fltApi.deleteItemTypes(ids), []),
    // insertRow() L371-378: 회사 = 로그인 회사(서버가 채움), 적용시작일 2000-01-01
    newRow: useCallback(() => ({ startDate: START_DATE }), []),
    firstEditField: 'itemTypeCode',
    deleteConfirm,
  });

  const tgtCrud = useGridCrud<FltItemType>({
    idField: 'itemTypeId',
    // retrieveCompany() L338-357: 고른 고객사, searchText = "%"
    search: useCallback(() => fltApi.searchItemTypes('', companyId ?? undefined), [companyId]),
    save: useCallback((rows: FltItemType[]) => fltApi.updateItemTypes(rows, companyId ?? undefined), [companyId]),
    remove: useCallback((ids: number[]) => fltApi.deleteItemTypes(ids, companyId ?? undefined), [companyId]),
    // insertRowCompany() L380-393: 회사 = 고른 고객사, 적용시작일 2000-01-01
    newRow: useCallback(() => ({ companyId: companyId ?? undefined, companyName, startDate: START_DATE }), [companyId, companyName]),
    firstEditField: 'itemTypeCode',
    deleteConfirm,
  });

  // [E0] 화면 열림 (생성자 L75-123) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, []);

  // [E2] companyField.TriggerClick [result != null] (L138) → Sys01_Lookup_Company.open(): 고른 고객사로 retrieveCompany(), 선택안함이면 칸을 비우고 오른쪽 그리드를 비운다
  useEffect(() => {
    if (companyId == null) tgtCrud.clear();
    else tgtCrud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  /** 고객사를 안 골랐으면 알리고 막는다 (AS-IS retrieveCompany·insertRowCompany·initData L339·L381·L296) */
  const needCompany = () => {
    if (companyId == null) {
      message.warning('고객사를 선택해주세요');
      return false;
    }
    return true;
  };

  // AS-IS retrieveCompany() L338-357
  const retrieveCompany = () => { if (needCompany()) tgtCrud.retrieve(); };

  // AS-IS insertRowCompany() L380-393
  const insertRowCompany = () => { if (needCompany()) tgtCrud.addRow(); };

  /** 삭제 전에 선택이 없으면 알린다 (AS-IS deleteButton·deleteRButton 핸들러 L181-184·L225-228) */
  const deleteWithCheck = (c: typeof crud) => () => {
    if ((c.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    c.deleteChecked();
  };

  // AS-IS initData() L294-321: 왼쪽에서 체크한 종목유형을 고른 고객사로 복사하고 오른쪽을 다시 조회
  const initData = async () => {
    if (!needCompany()) return;
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    try {
      await fltApi.copyItemTypes(companyId!, selected.map(r => r.itemTypeId));
      message.success('생성이 완료되었습니다.');
      tgtCrud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  return (
    <>
      <Splitter style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel defaultSize="50%" min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 4px 12px 12px', boxSizing: 'border-box' }}>
            {/* [E3] retrieveButton[조회].Select (L160) → retrieve(), [E1] searchText.KeyPress [Enter] (L127) → retrieve() */}
            <div style={{ overflowX: 'auto' }}>
              <SearchBar onSearch={crud.retrieve} loading={crud.loading} style={{ flexWrap: 'nowrap' }} extra={<>
                {/* [E4] insertButton[등록].Select (L166) → insertRow() */}
                <Button type="register" onClick={crud.addRow}>등록</Button>
                {/* [E5] updateButton[저장].Select (L172) → update(). 저장(n)은 UX-03 */}
                <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                {/* [E6] deleteButton[삭제].Select [YES] (L178) → deleteRow() L396-400, [E7] msgBox.DialogHide [YES] (L187) → flt.Flt05_ItemType.delete */}
                <Button type="delete" onClick={deleteWithCheck(crud)}>삭제</Button>
              </>}>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<FltItemType> crud={crud} columnDefs={columnDefs} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 12px 4px', boxSizing: 'border-box' }}>
            {/* [E8] retrieveRButton[조회].Select (L204) → retrieveCompany() */}
            <div style={{ overflowX: 'auto' }}>
              <SearchBar onSearch={retrieveCompany} loading={tgtCrud.loading} style={{ flexWrap: 'nowrap' }} extra={<>
                {/* [E9] insertRButton[등록].Select (L210) → insertRowCompany() */}
                <Button type="register" onClick={insertRowCompany}>등록</Button>
                {/* [E13] copyButton[등록(복사)].Select (L248) → initData() */}
                <Button type="register" onClick={initData}>등록(복사)</Button>
                {/* [E10] updateRButton[저장].Select (L216) → updateCompany() L365-368 */}
                <Button type="save" count={tgtCrud.changes} onClick={tgtCrud.saveRows}>저장</Button>
                {/* [E11] deleteRButton[삭제].Select [YES] (L222) → deleteRowCompany() L402-406, [E12] msgBox.DialogHide [YES] (L231) */}
                <Button type="delete" onClick={deleteWithCheck(tgtCrud)}>삭제</Button>
              </>}>
                <SearchBar.Field label="고객사">
                  <Input readOnly style={{ width: 150 }} value={companyName} suffix={<SearchOutlined />} onClick={() => setLookupCompany(true)} />
                </SearchBar.Field>
              </SearchBar>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<FltItemType> crud={tgtCrud} columnDefs={tgtColumnDefs}
                rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Sys01_Lookup_Company open={lookupCompany}
        onResult={c => {
          setCompanyId(c ? c.companyId : null);
          setCompanyName(c ? c.companyNm : '');
          setLookupCompany(false);
        }}
        onClose={() => setLookupCompany(false)} />
    </>
  );
};
