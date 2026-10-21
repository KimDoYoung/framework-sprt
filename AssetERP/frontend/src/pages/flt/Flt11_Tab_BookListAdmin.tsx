/**
 * 보유내역조회 (J04) — 준법감시 > 11. 임직원매매(준감인) > 보유내역조회 #1154
 * AS-IS: myApp/client/vi/flt/Flt11_Tab_BookListAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-87: vlc = 툴바(50: 조회기준일 · 사원명 · [조회][엑셀다운로드] ※ 기준일부터 현재일까지 정리됩니다) / 읽기 전용 그리드(단일 선택)
 * 개인용 I09 Flt11_Tab_BookList의 준감인 짝 — 같은 SQL(flt11_book.selectByBookList)에 사원 선택(personId, 비우면 회사 전체)이 다르다.
 * [보유원장 정리](arrangeButton)는 원본에서 주석 처리돼 화면에 없다.
 * 원본 엑셀은 RD 리포트 서버(Sys99_Print.insertRdBookListAdmin) → TOBE는 서버가 조회 결과를 xlsx로 만든다(I09와 같은 방식)
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltBookList } from '@/types/flt';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const gb = gbFor<FltBookList>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL = '전체';

export const Flt11_Tab_BookListAdmin: React.FC = () => {
  const [baseDate, setBaseDate] = useState<Dayjs>(() => dayjs().startOf('month').subtract(1, 'day'));
  // settings() L89-145: empKorName은 비어 있고(emptyText "전체") personId = null
  const [empName, setEmpName] = useState('');
  const [personId, setPersonId] = useState<number | null>(null);
  const [empOpen, setEmpOpen] = useState(false);
  const [rows, setRows] = useState<FltBookList[]>([]);
  const paramRef = useRef({ baseDate, personId });
  paramRef.current = { baseDate, personId };

  // retrieve() L165-178: 서비스 flt.Flt11_Book.selectByBookList(companyId, personId, baseDate) — 검색어 없음(서버가 %%)
  const retrieve = useCallback(async () => {
    const p = paramRef.current;
    try {
      setRows(await fltApi.searchBookListAdmin(p.personId, p.baseDate.format(DATE_FORMAT), ''));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L54-87) → settings(), setInitData() L236-252:
  // 기준일 = 이번 달 1일의 전날(전월 말일)을 flt.Flt10_Tr.getBizDate(companyId, baseDate)에 보내 받은 영업일
  // (원본은 열릴 때 조회하지 않지만 개인용 I09 화면과 맞춰 기준일을 받은 뒤 조회한다)
  useEffect(() => {
    const initDate = dayjs().startOf('month').subtract(1, 'day').format(DATE_FORMAT);
    fltApi.getBizDate(initDate)
      .then(d => {
        const base = d ? dayjs(d) : dayjs(initDate);   // 영업일을 못 받으면 전월 말일로
        setBaseDate(base);
        paramRef.current = { ...paramRef.current, baseDate: base };
        void retrieve();
      })
      .catch(() => undefined);
  }, [retrieve]);

  // buildGrid() — 사원명(부서) 열이 첫 열이다
  const columnDefs = useMemo(() => [
    gb.text('personOrgName', 150, '사원명', { pinned: 'left' }),  // 가로 스크롤해도 사원명은 항상 보이게 왼쪽 고정
    gb.textCenter('checkCycleName', 100, '점검주기'),
    gb.date('buyDate', 90, '최근매매일'),  // 원본 100 → UX-08
    gb.text('accountNo', 200, '계좌'),
    gb.text('itemTypeName', 150, '종목유형'),
    gb.text('itemName', 250, '종목명'),
    gb.double('bookQty', 80, '보유수량'),
    gb.long('bookAmt', 120, '보유금액'),
    gb.textCenter('bookDays', 120, '보유기간'),
    gb.long('yearInvestLimit', 120, '연간투자금액'),
    gb.long('totalInvestAmt', 120, '총누적투자금액'),
    gb.double('turnoverRate', 125, '월간매매회전율(%)'),  // 원본 120 → 제목이 잘려 125 (I09와 같음)
  ], []);

  // [E1] empKorName.TriggerClick [result == null] (L97) → Emp00_Lookup_SelectSingle.open(true, 오늘, …): [전체]는 null → "전체", personId = null
  const onEmpResult = (emp: TransInfo | null) => {
    setEmpOpen(false);
    if (emp == null) {
      setEmpName(ALL);
      setPersonId(null);
    } else {
      setEmpName(emp.korNm ?? '');
      setPersonId(emp.personId);
    }
  };

  // [E2] empKorName.Change (L116) → 칸이 비면 personId = null. 칸이 읽기 전용(setEditable(false))이라 글자를 지울 수 없어 별도 처리 없음 —
  // 비우는 길은 조회창의 [전체]뿐이고 그건 위 E1이 같은 일(전체 · personId null)을 한다

  // [E4] downloadButton[엑셀다운로드].Select (L139) → createRdExcel() L254-305 (RD 대신 서버 xlsx)
  const createRdExcel = async () => {
    const p = paramRef.current;
    const date = p.baseDate.format(DATE_FORMAT);
    try {
      await fltApi.downloadBookListAdminExcel(p.personId, date, '', `임직원매매 보유내역(${date}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L125) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          extra={(
            <>
              <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
              <Typography.Text type="secondary">※ 기준일부터 현재일까지 정리됩니다</Typography.Text>
            </>
          )}
        >
          <SearchBar.Field label="조회기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} value={baseDate} format={DATE_FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            <LookupInput width={100} value={empName} placeholder={ALL} onOpen={() => setEmpOpen(true)} />
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
      <Emp00_Lookup_SelectSingle open={empOpen} transDate={dayjs().format(DATE_FORMAT)} onResult={onEmpResult} onClose={() => setEmpOpen(false)} />
    </div>
  );
};
