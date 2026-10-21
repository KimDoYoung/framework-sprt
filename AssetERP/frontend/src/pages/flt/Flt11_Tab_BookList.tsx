/**
 * 보유내역조회 (I09) — 준법감시 > 10. 임직원매매 > 보유내역조회 #1143
 * AS-IS: myApp/client/vi/flt/Flt11_Tab_BookList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-102: vlc = 툴바(50: 조회기준일 · 검색 · [조회][엑셀다운로드][보유원장 정리] ※ 기준일부터 현재일까지 정리됩니다) / 읽기 전용 그리드(단일 선택)
 * 열릴 때 조회는 하지 않는다(원본 settings()는 retrieve()를 부르지 않는다) — 기준일만 setInitData()로 채운다.
 * [최초원장 등록](createButton, E4)은 원본에서 툴바·컬럼에 연결되지 않은 버튼이라 화면에 없다 → Flt13_Lookup_BookInit도 이 화면에서는 쓰지 않는다
 * 원본 엑셀은 RD 리포트 서버(Flt11_Rd_BookList) → TOBE는 서버가 조회 결과를 xlsx로 만든다(E10·G03과 같은 방식)
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltBookList } from '@/types/flt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<FltBookList>();
const DATE_FORMAT = 'YYYY-MM-DD';

export const Flt11_Tab_BookList: React.FC = () => {
  const [baseDate, setBaseDate] = useState<Dayjs>(() => dayjs().startOf('month').subtract(1, 'day'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltBookList[]>([]);
  const paramRef = useRef({ baseDate, searchText });
  paramRef.current = { baseDate, searchText };

  // [E0] 화면 열림 (생성자 L64-102) → settings(), setInitData() L237-253:
  // 기준일 = 이번 달 1일의 전날(전월 말일)을 flt.Flt10_Tr.getBizDate(companyId, baseDate)에 보내 받은 영업일
  useEffect(() => {
    const initDate = dayjs().startOf('month').subtract(1, 'day').format(DATE_FORMAT);
    fltApi.getBizDate(initDate)
      .then(d => { 
        const base = d ? dayjs(d) : dayjs(initDate);   // 영업일을 못 받으면 전월 말일로
        setBaseDate(base);
        paramRef.current = { ...paramRef.current, baseDate: base };   // ★ 이 줄이 핵심
        void retrieve();        
      })
      .catch(() => undefined);
  }, []);

  // retrieve() L163-177: 서비스 flt.Flt11_Book.selectByBookList(companyId, personId, baseDate, searchText "%…%")
  const retrieve = useCallback(async () => {
    const p = paramRef.current;
    try {
      setRows(await fltApi.searchBookList(p.baseDate.format(DATE_FORMAT), p.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // buildGrid() L147-161
  const columnDefs = useMemo(() => [
    gb.text('accountNo', 200, '계좌', {pinned: 'left'}),
    gb.text('itemTypeName', 150, '종목유형'),
    gb.text('itemName', 250, '종목명'),
    gb.double('bookQty', 120, '보유수량'),
    gb.long('bookAmt', 120, '보유금액'),
    gb.textCenter('bookDays', 120, '보유기간'),
    gb.date('buyDate', 90, '최근매매일'),  // 원본 100 → UX-08
    gb.long('yearInvestLimit', 120, '연간투자금액'),
    gb.long('totalInvestAmt', 120, '총누적투자금액'),
    gb.double('turnoverRate', 125, '월간매매회전율(%)'),
  ], []);

  // [E3] arrangeButton[보유원장 정리].Select (L126) → preArrange() L179-204
  const preArrange = () => {
    const startDateStr = paramRef.current.baseDate.format(DATE_FORMAT);
    const closeDateStr = dayjs().format(DATE_FORMAT);
    // [E6] msgBox.DialogHide [YES] (L188) → arrange()
    Modal.confirm({
      title: '확인',
      content: <div>보유원장 정리를 시작하시겠습니까? <br />(정리기간 : {startDateStr} ~ {closeDateStr})</div>,
      width: 400,
      okText: '예',
      cancelText: '아니오',
      onOk: arrange,
    });
  };

  // arrange() L206-230: 서비스 flt.Flt10_Tr.insertFloorTrBook(accountId·itemType·itemName·itemCode "%", startDate 기준일) → "정상적으로 완료되었습니다"
  const arrange = async () => {
    try {
      await fltApi.insertFloorTrBook(paramRef.current.baseDate.format(DATE_FORMAT));
    } catch (err) {
      message.error(errorMessage(err, '보유원장 정리 실패'));
      return;
    }
    message.success('정상적으로 완료되었습니다');
  };

  // [E5] downloadButton[엑셀다운로드].Select (L139) → createRdExcel() L265-315 (RD 대신 서버 xlsx)
  const createRdExcel = async () => {
    const p = paramRef.current;
    const date = p.baseDate.format(DATE_FORMAT);
    try {
      await fltApi.downloadBookListExcel(date, p.searchText, `임직원매매 보유내역(${date}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L120) → retrieve(). [E1] searchText.KeyPress [Enter] (L111) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          extra={(
            <>
              <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
              <Button type="view" onClick={preArrange}>보유원장 정리</Button>
              <Typography.Text type="secondary">※ 기준일부터 현재일까지 정리됩니다</Typography.Text>
            </>
          )}
        >
          <SearchBar.Field label="조회기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} value={baseDate} format={DATE_FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="계좌/종목유형/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltBookList>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.bookId)}
          />
        </div>
      </div>
    </div>
  );
};
