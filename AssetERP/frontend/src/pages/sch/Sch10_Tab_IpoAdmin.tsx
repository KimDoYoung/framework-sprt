/**
 * [1293] 기초자료 > 30. 자산&경영 > 공모주 일정등록 (E20)
 * AS-IS: myApp/client/vi/sch/Sch10_Tab_IpoAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L89-143: 위(90) = 툴바 1줄(조회일자 [콤보 100 · 시작 100 ~ 종료 100] · 시장구분 [콤보 100 "전체"] · 검색 250 "종목명/주간사/발행기관코드" · [조회][등록][저장][삭제] · [주식등록])
 *   + 툴바 2줄([템플릿][엑셀업로드][홈페이지 등록][미일치내역][종목코드매칭]), 아래 = 공모주 일정 셀 편집 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { schApi } from '@/api/sch';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Sch10Ipo } from '@/types/sch';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Com50_Lookup_StkItem } from '../com/Com50_Lookup_StkItem';
import { Sch12_Lookup_IpoCorp } from './Sch12_Lookup_IpoCorp';
import { Sch14_Lookup_IpoMismatch } from './Sch14_Lookup_IpoMismatch';
import { Sch15_Lookup_IpoItemMatching } from './Sch15_Lookup_IpoItemMatching';

const gb = gbFor<Sch10Ipo>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L257-290 — 시장구분 콤보(MarketCode)는 코드를 불러온 뒤 만든다 */
const buildGrid = (marketCodes: Code[]) => [
  // L275 + [E13] marketCodeComboBox[MarketCode].Collapse (L262) → 인라인 L262-269: 고른 이름으로 marketName·marketCode를 함께 바꾼다
  gb.textCenter('marketName', 100, '시장구분', {
    editor: 'select',
    values: marketCodes.map(c => c.name),
    valueSetter: p => {
      p.data.marketName = p.newValue;
      p.data.marketCode = marketCodes.find(c => c.name === p.newValue)?.code ?? p.data.marketCode;
      return true;
    },
  }),
  gb.text('itemName', 250, '종목', { editor: 'text' }),                                                   // L276
  gb.textCenter('issCorpCode', 80, '발행기관', { editor: 'text' }),                                      // L277
  // L271 addHeaderGroupMap(0, 5, "수요예측일정", 1, 2), L272 addHeaderGroupMap(0, 7, "청약일정", 1, 2)
  gb.group('수요예측일정', [
    gb.date('demandStartDate', 95, '시작일', { editor: 'date' }),                                         // L278
    gb.date('demandCloseDate', 95, '종료일', { editor: 'date' }),                                         // L279
  ]),
  gb.group('청약일정', [
    gb.date('subscriptionStartDate', 95, '시작일', { editor: 'date' }),                                   // L280
    gb.date('subscriptionCloseDate', 95, '종료일', { editor: 'date' }),                                   // L281
  ]),
  gb.date('payDate', 120, '납입(환불)일', { editor: 'date' }),                                             // L282
  gb.date('listDate', 120, '상장(예정)일', { editor: 'date' }),                                            // L283
  gb.textCenter('priceBracket', 150, '희망공모가', { editor: 'text' }),                                   // L284
  gb.long('price', 80, '공모가', { editor: 'number' }),                                                   // L285
  gb.textArea('note', 250, '주간사', { editor: 'largeText' }),                                            // L286
  gb.boolean('cancelYn', 100, '미사용', { editable: true }),                                              // L287
];

const deleteConfirm = (n: number) => `${n}건의 정보를 삭제하시겠습니까?`;

export const Sch10_Tab_IpoAdmin: React.FC = () => {
  const excelForm = useRef<FileUpdownFormHandle>(null);
  // settings() L145-255: 조회일자 콤보 "수요예측일"(코드 1), 시작 올해 1/1, 종료 올해 12/31, 시장구분 "전체"
  const [dateType, setDateType] = useState('1');
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs().endOf('year'));
  const [marketCode, setMarketCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [marketCodes, setMarketCodes] = useState<Code[]>([]);
  const [corpOpen, setCorpOpen] = useState(false);
  const [mismatchOpen, setMismatchOpen] = useState(false);
  const [matchingOpen, setMatchingOpen] = useState(false);
  const [stkItemOpen, setStkItemOpen] = useState(false);
  const columnDefs = useMemo(() => buildGrid(marketCodes), [marketCodes]);

  useEffect(() => {
    sysApi.searchCodes('MarketCode').then(setMarketCodes).catch(() => setMarketCodes([]));
  }, []);

  const crud = useGridCrud<Sch10Ipo>({
    idField: 'ipoId',
    // retrieve() L292-328: 검색어 "%검색어%"(없으면 %), 시장구분(없으면 %), ManagerYn=true → sch.Sch10_Ipo.selectBySearchTextAdmin
    search: useCallback(() => schApi.searchIpos({
      dateType, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText, marketCode,
    }), [dateType, startDate, closeDate, searchText, marketCode]),
    // update() L331-347: GridUpdate → sch.Sch10_Ipo.update, 성공하면 retrieve()
    save: schApi.updateIpos,
    reloadAfterSave: true,
    // deleteRow() L358-389: [E14] msgBox.DialogHide [YES] (L371) → sch.Sch10_Ipo.delete
    remove: schApi.deleteIpos,
    deleteConfirm,
    // insertRow() L350-355: 회사 = 로그인 회사(서버가 채움)
    newRow: useCallback(() => ({ cancelYn: 'false' }), []),
    firstEditField: 'marketName',
  });

  // [E0] 화면 열림 (생성자 L89-143) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, []);

  // [E5] deleteButton[삭제].Select (L193) → deleteRow() L358-389: 고른 행이 없으면 "삭제대상을 선택해주세요", 일정공유된 공모주가 있으면 막는다
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제대상을 선택해주세요');
      return;
    }
    if (selected.some(r => (r.shareCount ?? 0) !== 0)) {
      message.warning('일정공유된 공모주가 포함되어있습니다.');
      return;
    }
    crud.deleteChecked();
  };

  // [E7] excelUploadButton[엑셀업로드].Select (L205) → excelUpload() L391-408: 파일을 고르면 ExcelUpload?uploadType=ipoUpload
  // [E15] fileUploadField.Change (L400) → uploadExcelForm.submit(), [E12] uploadExcelForm.SubmitComplete (L249) → retrieve()
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await schApi.uploadIposExcel(file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    void crud.retrieve();
  };

  // [E6] tempDownloadButton[템플릿].Select (L199) → downloadForm.submit(): ./excelTemplete/Template_공모주 일정등록.xlsx
  const downloadTemplate = async () => {
    try {
      await schApi.downloadIpoTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L175) → retrieve(), [E1] searchText.KeyPress [Enter] (L166) → retrieve() */}
      <SearchBar
        onSearch={crud.retrieve}
        loading={crud.loading}
        extra={<>
          {/* [E3] insertButton[등록].Select (L181) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E4] updateButton[저장].Select (L187) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={deleteRow}>삭제</Button>
          {/* [E11] stkItemButton[주식등록].Select (L231) → Com50_Lookup_StkItem.edit(…) */}
          <Button type="register" onClick={() => setStkItemOpen(true)}>주식등록</Button>
        </>}
      >
        <SearchBar.Field label="조회일자">
          <SystemCodeComboBox kindCd="IpoScheduleDateType" style={{ width: 100 }} value={dateType} onChange={code => setDateType(code ?? '1')} />
          <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          <span> ~ </span>
          <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="시장구분">
          <SystemCodeComboBox kindCd="MarketCode" altCode={['%', '전체']} style={{ width: 100 }} value={marketCode} onChange={code => setMarketCode(code ?? '%')} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="종목명/주간사/발행기관코드" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="download" onClick={downloadTemplate}>템플릿</Button>
        <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
        {/* [E8] insertHomepageButton[홈페이지 등록].Select (L211) → lookupIpoCorp() L410-413: Sch12_Lookup_IpoCorp.open() */}
        <Button type="register" onClick={() => setCorpOpen(true)}>홈페이지 등록</Button>
        {/* [E9] mismatchButton[미일치내역].Select (L217) → Sch14_Lookup_IpoMismatch.open() — ColorButtonBar에 없는 제목이라 기본 버튼 */}
        <Button onClick={() => setMismatchOpen(true)}>미일치내역</Button>
        {/* [E10] itemMatchingButton[종목코드매칭].Select (L224) → Sch15_Lookup_IpoItemMatching.open() — ColorButtonBar에 없는 제목이라 기본 버튼 */}
        <Button onClick={() => setMatchingOpen(true)}>종목코드매칭</Button>
        <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Sch10Ipo> crud={crud} columnDefs={columnDefs} />
      </div>
      <Sch12_Lookup_IpoCorp open={corpOpen} onClose={() => setCorpOpen(false)} />
      <Sch14_Lookup_IpoMismatch open={mismatchOpen} onClose={() => setMismatchOpen(false)} />
      <Sch15_Lookup_IpoItemMatching open={matchingOpen} onClose={() => setMatchingOpen(false)} />
      <Com50_Lookup_StkItem mode={stkItemOpen ? 'EDIT' : null} onClose={() => setStkItemOpen(false)} />
    </div>
  );
};
