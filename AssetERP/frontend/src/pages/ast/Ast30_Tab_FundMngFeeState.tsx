/**
 * [1216] 관리회계 > 30. 펀드운용보수관리 > 펀드보수원장 (X31)
 * AS-IS: myApp/client/vi/ast/Ast30_Tab_FundMngFeeState.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-97: 위 = 툴바(조회기간 ~ · 펀드 350 "전체" · 검색 200 "펀드" · 조회 · 출력/다운로드), 아래 = 그리드 하나(행번호 + 10열, 체크박스 없음, 페이징 없음)
 * 열 때 setting(), retrieve() — 화면을 열면 곧바로 어제~어제로 조회한다
 * 함께: Icam10_Lookup_FundCode(펀드 조회창, X29), Ast30_Lookup_FeeDetail(행 더블클릭 — 증감액 상세 창, X25)
 * 스타일: SG (판별기도 SG)
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 3개지만 펀드 칸이 350이라 줄바꿈을 피하려고 초기화(UX-02)는 넣지 않는다
 * 버튼 type: 조회 `search`, 출력/다운로드 `download`
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstBookFundFeeState } from '@/types/ast';
import { IcamFeeFund } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Icam10_Lookup_FundCode } from '../icam/Icam10_Lookup_FundCode';
import { Ast30_Lookup_FeeDetail, FeeDetailTarget } from './Ast30_Lookup_FeeDetail';

const FORMAT = 'YYYY-MM-DD';
const gb = gbFor<AstBookFundFeeState>();

/** AS-IS buildGrid() L208-224 */
const columnDefs = [
  gb.date('holdDate', 100, '보유일자'),
  gb.textCenter('fundCode', 80, '펀드코드'),
  gb.text('fundName', 400, '펀드명'),
  gb.long('preFee', 120, '전일잔액'),
  gb.long('diffFee', 120, '증감액'),
  gb.long('fee', 120, '당일잔액'),
  gb.long('monthOccFee', 120, '당월 발생액'),
  gb.long('occFee', 120, '당일 발생액'),
  gb.long('drawFee', 120, '당일 인출액'),
  gb.long('unRcvFee', 120, '유보분'),
];

export const Ast30_Tab_FundMngFeeState: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<AstBookFundFeeState>>(null);
  // setting() L99-106: 조회기간 어제 ~ 어제
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [fundCode, setFundCode] = useState<string | null>(null);
  const [fundName, setFundName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstBookFundFeeState[]>([]);
  const [loading, setLoading] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [detail, setDetail] = useState<FeeDetailTarget | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L238-242) */
  const selectFirst = useRef(false);

  // [E2] searchText.KeyPress [Enter] (L134)·[E4] retrieveButton[조회].Select (L154) → retrieve() L226-245
  const retrieve = useCallback(async () => {
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await astApi.searchFundFeeBook({ startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), fundCode, searchText });
      selectFirst.current = true;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, [startDate, closeDate, fundCode, searchText]);

  // [E0] 화면 열림 (생성자 L61-97) → setting(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] fundName.TriggerClick (L112) → Icam10_Lookup_FundCode.open(시작일, callback): 고르면 코드·"코드 이름", [전체]면 둘 다 비운다
  const onFundResult = (fund: IcamFeeFund | null) => {
    setFundCode(fund ? fund.fundCode : null);
    setFundName(fund ? `${fund.fundCode} ${fund.fundName ?? ''}` : '');
  };

  // [E5] downloadButton[출력/다운로드].Select (L160) → sys.Sys99_Print.insertRdFundMngFeeState → RDViewer(mrd Ast30_Rd_FundMngFeeState, rv rdGroupId·companyId·personId·retrieveDate "시작 ~ 종료")
  const download = async () => {
    setLoading(true);
    try {
      const start = startDate.format(FORMAT);
      const close = closeDate.format(FORMAT);
      const groupId = await astApi.insertFundFeeBookRd({ startDate: start, closeDate: close, fundCode, searchText });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Ast30_Rd_FundMngFeeState', options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId), retrieveDate: `${start} ~ ${close}` },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={<Button type="download" onClick={download}>출력/다운로드</Button>}
        >
          <SearchBar.Field label="조회기간">
            <Space size={4}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
              ~
              <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
            </Space>
          </SearchBar.Field>
          <SearchBar.Field label="펀드">
            <LookupInput width={350} value={fundName} placeholder="전체" onOpen={() => setFundOpen(true)} onClear={() => onFundResult(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="펀드" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstBookFundFeeState>
            gridRef={gridRef}
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.holdDate}|${p.data.corpId}|${p.data.fundCode}`}
            onRowDataUpdated={e => {
              if (selectFirst.current) {
                selectFirst.current = false;
                e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
              }
            }}
            // [E3] grid.RowDoubleClick [model != null] (L143) → Ast30_Lookup_FeeDetail.open(corpId, fundCode, holdDate)
            onRowDoubleClicked={e => e.data && setDetail({ corpId: e.data.corpId, fundCode: e.data.fundCode, stdDate: e.data.holdDate })}
          />
        </div>
      </div>
      <Icam10_Lookup_FundCode open={fundOpen} stdDate={startDate.format(FORMAT)} onResult={onFundResult} onClose={() => setFundOpen(false)} />
      <Ast30_Lookup_FeeDetail target={detail} onClose={() => setDetail(null)} />
      <RdViewer url={rdUrl} title="펀드보수원장" onClose={() => setRdUrl(null)} />
    </div>
  );
};
