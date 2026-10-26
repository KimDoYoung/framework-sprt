/**
 * [1426] 펀드관리 > 02. 펀드관리 > 펀드보유주식등록(타사무) (P11)
 * AS-IS: myApp/client/vi/fnd/Fnd11_Tab_BookExtr.java (359줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-112: 툴바 1줄(기준일 100 · 검색 250 "펀드코드/펀드명/종목코드/종목명" · [조회][등록][저장][삭제] · [템플릿][엑셀업로드]) + 셀 편집 그리드(행번호, 체크박스 다중)
 * 열 때 기준일을 오늘 이전 가장 최근 기준일로 바꾸고 조회한다(setStdDate L314-330)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, DatePicker, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { BookExtr } from '@/types/fnd';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Com50_Lookup_StkItem } from '@/components/lookup/Com50_Lookup_StkItem';

const gb = gbFor<BookExtr>();
const FORMAT = 'YYYY-MM-DD';
const ITEM_TYPE_STOCK = '2010';  // insertRow() L238-245: setItemType("2010") (2010:주식)

export const Fnd11_Tab_BookExtr: React.FC = () => {
  const excelForm = useRef<FileUpdownFormHandle>(null);
  // [E0] 화면 열림 (생성자 L80-112) → settings() L114-187: 기준일 100 = 오늘, 검색칸 250
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [lookupRow, setLookupRow] = useState<BookExtr | null>(null);
  /** 조회·행추가는 stdDate.getCurrentValue()를 읽는 시점의 값 */
  const stdDateRef = useRef(stdDate);
  stdDateRef.current = stdDate;
  const searchTextRef = useRef(searchText);
  searchTextRef.current = searchText;

  const crud = useGridCrud<BookExtr>({
    idField: 'bookExtrId',
    // retrieve() L223-236: fnd.Fnd11_BookExtr.selectByStdDate (기준일, "%검색어%")
    search: useCallback(() => fndApi.searchBookExtrs({ stdDate: stdDateRef.current.format(FORMAT), searchText: searchTextRef.current }), []),
    // update() L247-291: GridUpdate → fnd.Fnd11_BookExtr.update
    save: fndApi.saveBookExtrs,
    validate: (changed) => {
      for (const r of changed) {
        if (!r.stdDate) return '기준일을 입력하세요';
        if (!r.fundCode) return '펀드코드를 입력하세요';
        if (!r.fundName) return '펀드명를 입력하세요';
        if (!r.itemCode) return '종목코드를 입력하세요';
      }
      return undefined;
    },
    // delete() L293-312: [E10] messageBox.DialogHide [YES] (L298) → fnd.Fnd11_BookExtr.delete
    remove: fndApi.deleteBookExtrs,
    deleteConfirm: '선택한 내역을 삭제하시겠습니까?',
    // insertRow() L238-245: 회사 = 로그인 회사(서버가 채움), 기준일 = 툴바 기준일, 종목구분 "2010"
    newRow: useCallback(() => ({ stdDate: stdDateRef.current.format(FORMAT), itemType: ITEM_TYPE_STOCK }), []),
    firstEditField: 'fundCode',
  });

  // setStdDate() L314-330: fnd.Fnd11_BookExtr.selectRecentStdDate(오늘 이전 가장 최근 기준일) → 기준일을 바꾸고 retrieve()
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const recent = await fndApi.getBookExtrRecentStdDate(stdDateRef.current.format(FORMAT));
        if (recent) {
          stdDateRef.current = dayjs(recent);
          if (alive) setStdDate(stdDateRef.current);
        }
      } catch (err) {
        message.error(errorMessage(err, '기준일 조회 실패'));
      }
      if (alive) void crud.retrieve();
    })();
    return () => { alive = false; };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E7] tempDownloadButton[템플릿].Select (L168) → downloadForm.submit(): ./excelTemplete/Template_펀드보유주식등록(타사무).xlsx
  const downloadTemplate = async () => {
    try {
      await fndApi.downloadBookExtrTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E6] excelUploadButton[엑셀업로드].Select (L161) → excelUpload() L332-349: 파일을 고르면 ExcelUpload?uploadType=bookFndExtrUpload
  // [E11] fileUploadField.Change (L341) → uploadExcelForm.submit(), [E8] uploadExcelForm.SubmitComplete (L175): "Y"면 "업로드가 완료되었습니다" 뒤 retrieve(), 아니면 서버 메시지
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await fndApi.uploadBookExtrsExcel(file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
      return;
    }
    message.success('업로드가 완료되었습니다');
    void crud.retrieve();
  };

  // [E9] lookupItemField.TriggerClick (L192) → lookupItem() L210-221: Com50_Lookup_StkItem.view → 고른 행의 종목코드·종목명을 바꾼다
  const columnDefs = useMemo(() => [
    gb.date('stdDate', 120, '기준일', { editor: 'date' }),                           // L196 (UX-08: 편집 가능 날짜는 120)
    gb.textCenter('fundCode', 100, '펀드코드', { editor: 'text' }),                  // L197
    gb.text('fundName', 350, '펀드명', { editor: 'text' }),                          // L198
    gb.textCenter('itemCode', 150, '종목코드', {                                     // L199 (LookupTriggerField, 글자 입력 불가)
      cellStyle: { color: '#1677ff', textAlign: 'center' },
      cellRenderer: (p: { data?: BookExtr; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setLookupRow(p.data); }} />
          {p.value}
        </>
      ),
    }),
    gb.text('itemName', 350, '종목명'),                                              // L200
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L137) → retrieve(), [E1] searchText.KeyPress [Enter] (L128) → retrieve() */}
      <SearchBar
        onSearch={crud.retrieve}
        loading={crud.loading}
        extra={<>
          {/* [E3] insertRowButton[등록].Select (L143) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E4] updateButton[저장].Select (L149) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E5] deleteButton[삭제].Select (L155) → delete() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          <Button type="download" onClick={downloadTemplate}>템플릿</Button>
          <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
          <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
        </>}
      >
        <SearchBar.Field label="기준일">
          <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="펀드코드/펀드명/종목코드/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<BookExtr> crud={crud} columnDefs={columnDefs} />
      </div>
      <Com50_Lookup_StkItem
        mode={lookupRow ? 'VIEW' : null}
        onResult={item => {
          if (lookupRow) crud.updateRow(lookupRow.bookExtrId, { itemCode: item.itemCode, itemName: item.itemName });
        }}
        onClose={() => setLookupRow(null)}
      />
    </div>
  );
};
