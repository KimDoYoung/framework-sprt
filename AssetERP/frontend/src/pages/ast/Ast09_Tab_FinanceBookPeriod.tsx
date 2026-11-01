/**
 * [1239] 고유자산 > 30. 고유자산 현황 > 금융상품 보유내역(기간조회) (W14)
 * AS-IS: myApp/client/vi/ast/Ast09_Tab_FinanceBookPeriod.java (242줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L52-84: BorderLayout 가운데(여백 20, 테두리) = 툴바 50(조회일자 100 ~ 100 · 검색 200 "구분/계좌" · [조회][엑셀다운로드]) + 그리드(행번호·단일 선택·17열·맨 아래 합계 "계")
 * retrieve() L145-168: 서버가 조회하면서 내 sys99_print 자료를 다시 쌓는다(U02 예금잔고조회와 같은 방식, astType "2"). createRdExcel() L170-224: 엑셀 양식 자료를 쌓고 RD 내려받기.
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { astApi } from '@/api/ast';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { rdDownload } from '@/utils/rdDownload';
import { AstFinanceBook } from '@/types/ast';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<AstFinanceBook>();
const FORMAT = 'YYYY-MM-DD';

export const Ast09_Tab_FinanceBookPeriod: React.FC = () => {
  // settings() L86-117: 조회일자 = 오늘 ~ 오늘(100), 검색 200 "구분/계좌"
  const sp = useSearchParams(() => ({ startDate: dayjs(), closeDate: dayjs(), searchText: '' }));
  const { startDate, closeDate, searchText } = sp.values;
  const [rows, setRows] = useState<AstFinanceBook[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L145-168: ast.Ast09_Book.selectByHoldDatePeriod(companyId, personId, windowClassName, startDate, closeDate, astType "2", searchText "%…%")
  //   → 첫 행이 있으면 첫 행 선택(AS-IS select(0)) — 선택은 보이기만 하고 동작은 없다
  const retrieve = async () => {
    const v = sp.current.current;
    setLoading(true);
    try {
      setRows(await astApi.searchFinancePeriod(v.startDate.format(FORMAT), v.closeDate.format(FORMAT), v.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L52-84) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] downloadButton[엑셀다운로드].Select (L111) → createRdExcel() L170-224: sys.Sys99_Print.insertRdFinanceBookPeriod(companyId, personId, "Ast09_Tab_FinanceBookPeriod", startDate, closeDate, astType "2", searchText)
  //   → 성공이면 RDUtil.download(page CommonInvokerDownload.jsp · mrd Ast09_Rd_FinanceBookPeriod · options "/rexportopt [6] /rxlsopt [100]"
  //      · 파일 "금융상품 잔고조회(시작 ~ 종료).xlsx" · rv companyId·personId·rdGroupId·startDate·closeDate)
  const createRdExcel = async () => {
    const v = sp.current.current;
    const start = v.startDate.format(FORMAT);
    const close = v.closeDate.format(FORMAT);
    setLoading(true);   // grid.mask("Loading")
    try {
      const groupId = await astApi.rdFinanceBookPeriod(start, close, v.searchText);
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Ast09_Rd_FinanceBookPeriod',
        options: '/rexportopt [6] /rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `금융상품 잔고조회(${start} ~ ${close}).xlsx`,
        rv: { rdGroupId: String(groupId), startDate: start, closeDate: close },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setLoading(false);
    }
  };

  // buildGrid() L119-143 — 열 17개, 합계 "계"(2번 열) + 7~12번 열
  const columnDefs = useMemo(() => [
    gb.date('holdDate', 90, '보유일자'),                       // L124 (원본 100 — UX-08)
    gb.text('keepCorpAccountName', 250, '보관처/계좌'),        // L125
    gb.text('astClassName', 150, '종목유형'),                  // L126
    gb.text('astClassTreeName', 250, '종목명'),                // L127
    gb.text('accountTypeName', 120, '회계구분'),               // L128
    gb.double('holdQty', 100, '보유수량'),                     // L129
    gb.long('purAmt', 150, '취득금액'),                        // L130
    gb.long('bookAmt', 150, '장부금액'),                       // L131
    gb.long('acrIntAmt', 100, '타인경과이자'),                 // L132
    gb.long('evalAmt', 150, '평가금액'),                       // L133
    gb.long('evalPl', 100, '평가손익'),                        // L134
    gb.long('oci', 100, '기타포괄손익'),                       // L135
    gb.date('firstPurDate', 90, '최초취득일자'),               // L136
    gb.long('firstPurAmt', 150, '최초취득금액'),               // L137
    gb.textCenter('lockUpPeriodName', 100, '확약기간'),        // L138
    gb.date('lockUpDate', 90, '매도제한일'),                   // L139
    gb.double('lockUpQty', 100, '매도제한수량'),               // L140
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L105) → retrieve(), [E1] searchText.KeyPress [Enter] (L96) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading} extra={<Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>}>
          <SearchBar.Field label="조회일자">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && sp.set('startDate', d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && sp.set('closeDate', d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="구분/계좌" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstFinanceBook> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.bookId)} loading={loading}
            sumRow={{ labelField: 'keepCorpAccountName', label: '계', sum: ['purAmt', 'bookAmt', 'acrIntAmt', 'evalAmt', 'evalPl', 'oci'] }} />
        </div>
      </div>
    </div>
  );
};
