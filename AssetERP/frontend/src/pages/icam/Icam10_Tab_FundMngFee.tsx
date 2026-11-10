/**
 * [1214] 관리회계 > 30. 펀드운용보수관리 > ICAM 운용보수 발생내역 (X29)
 * AS-IS: myApp/client/vi/icam/Icam10_Tab_FundMngFee.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L72-123: 위 = 툴바(기간 ~ · 펀드 350 "전체" · 검색 150 "펀드/적요" · 조회 · 출력/다운로드 · ICAM발생내역 가져오기), 그 아래 안내 "※ 더블클릭하여 발생보수를 수정할 수 있습니다.",
 *   아래 = 그리드(행번호 + 9열, 체크박스 없음) + 페이징 툴바(100). 보수구분은 20402(미지급운용보수) 고정(L70)
 * X23 `Icam10_Tab_OfficeMngFee`의 짝 — 같은 `icam/fees` API를 보수구분 20402 + 펀드 조건(fundCode)으로 쓴다
 * 함께: Icam10_Lookup_FundCode(펀드 조회창), Icam10_Lookup_FundFee(행 더블클릭 발생보수 수정 창), Icam10_Lookup_getICAM(가져오기 창)
 * 원본 batchButton[BATCH 재실행](E6)은 만들어 두고 툴바에 넣지 않았다(L98-101 주석 처리) — 버튼을 그리지 않는다
 * 스타일: SG (조회 툴바 + 그리드 하나 — yunhee 판별은 비어 있는 insertRow/deleteRow/update 때문에 CG로 나오지만 편집 그리드가 아니다, X23·D08과 같음)
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 3개지만 펀드 칸이 350이라 줄바꿈을 피하려고 초기화(UX-02)는 넣지 않는다
 * 버튼 type: 조회 `search`, 출력/다운로드 `download`, ICAM발생내역 가져오기 `download`(X23과 같음)
 */
import React, { useCallback, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { IcamFee, IcamFeeFund } from '@/types/icam';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Icam10_Lookup_FundCode } from './Icam10_Lookup_FundCode';
import { Icam10_Lookup_FundFee } from './Icam10_Lookup_FundFee';
import { Icam10_Lookup_getICAM } from './Icam10_Lookup_getICAM';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const FORMAT = 'YYYY-MM-DD';
const FEE_TYPE = '20402';   // L70: 미지급운용보수
const gb = gbFor<IcamFee>();

/** AS-IS buildGrid() L242-257 */
const columnDefs = [
  gb.date('stdDate', 100, '기준일'),
  gb.textCenter('fundCode', 100, '펀드코드'),
  gb.text('fundName', 300, '펀드명'),
  gb.text('rmkName', 200, '적요'),
  gb.double('fee', 100, '발생보수'),
  gb.date('afPayDate', 100, '다음보수인출일'),
  gb.date('bfPayDate', 100, '전보수인출일'),
  gb.textCenter('workDateString', 150, '생성일시'),
  gb.textCenter('worker', 150, '생성자'),
];

interface Condition {
  companyId: number;
  feeType: string;
  startDate: string;
  closeDate: string;
  fundCode: string | null;
  searchText: string;
}

// [E0] 화면 열림 (생성자 L72-123) → setting() L125-240: 기간 어제~어제, 펀드 "전체", 검색칸 안내 "펀드/적요". 열 때 조회하지 않는다
export const Icam10_Tab_FundMngFee: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<IcamFee>>(null);
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [fundCode, setFundCode] = useState<string | null>(null);
  const [fundName, setFundName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcamFee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [getIcamOpen, setGetIcamOpen] = useState(false);
  const [editRow, setEditRow] = useState<IcamFee | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  /** 조회한 때의 조건 — 페이지를 넘길 때 같은 조건으로 (gridToolBar.addParam) */
  const cond = useRef<Condition | null>(null);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L296-300) */
  const selectFirst = useRef(false);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = useCallback(async (p: number) => {
    const c = cond.current;
    if (!c) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await icamApi.searchFees({ ...c, offset: (p - 1) * LIMIT, limit: LIMIT });
      selectFirst.current = true;
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  // [E2] searchTextField.KeyPress [Enter] (L160)·[E4] retrieveButton[조회].Select (L183) → retrieve() L280-304
  // 조건(회사·구분·기간·펀드·검색어) 저장 → 1페이지부터 조회, 행이 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    cond.current = { companyId: user.companyId, feeType: FEE_TYPE, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), fundCode, searchText };
    await getPaging(1);
  }, [user.companyId, startDate, closeDate, fundCode, searchText, getPaging]);

  // [E1] fundName.TriggerClick (L138) → Icam10_Lookup_FundCode.open(시작일, callback): 고르면 코드·"코드 이름", [전체]면 둘 다 비운다 (L138-156)
  const onFundResult = (fund: IcamFeeFund | null) => {
    setFundCode(fund ? fund.fundCode : null);
    setFundName(fund ? `${fund.fundCode} ${fund.fundName ?? ''}` : '');
  };

  // [E7] downLoadButton[출력/다운로드].Select (L201) → sys.Sys99_Print.insertRdFundMngFee → RDViewer(mrd Icam10_Rd_FundMngFee, rv rdGroupId·companyId·personId·startDate·closeDate "yyyy-MM-dd")
  const downLoad = async () => {
    setLoading(true);
    try {
      const groupId = await icamApi.insertFundMngFeeRd({
        feeType: FEE_TYPE,
        startDate: startDate.format(FORMAT),
        closeDate: closeDate.format(FORMAT),
        fundCode,
        searchText,
      });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Icam10_Rd_FundMngFee', options: '/rpdflinebreak [1]',
        rv: { rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId), startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT) },
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
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={retrieve}
          extra={
            <Space>
              <Button type="download" onClick={downLoad}>출력/다운로드</Button>
              {/* [E5] getIcamButton[ICAM발생내역 가져오기].Select (L189) → lookupGetIcam() L259-262: Icam10_Lookup_getICAM.open(시작일, 종료일, feeType) */}
              <Button type="download" onClick={() => setGetIcamOpen(true)}>ICAM발생내역 가져오기</Button>
            </Space>
          }
        >
          <SearchBar.Field label="기간">
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
            <SearchBar.Input style={{ width: 150 }} placeholder="펀드/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        {/* buttonBar02 L93-96: 안내 문구 (batchForm은 숨김) */}
        <div style={{ color: '#888', fontSize: 12 }}>※ 더블클릭하여 발생보수를 수정할 수 있습니다.</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcamFee>
            gridRef={gridRef}
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => p.data.feeId}
            onRowDataUpdated={e => {
              if (selectFirst.current) {
                selectFirst.current = false;
                e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
              }
            }}
            // [E3] grid.RowDoubleClick (L169) → Icam10_Lookup_FundFee.open(feeModel, callback): 저장하면 그 행을 갱신 (L169-180)
            onRowDoubleClicked={e => e.data && setEditRow(e.data)}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      <Icam10_Lookup_FundCode open={fundOpen} stdDate={startDate.format(FORMAT)} onResult={onFundResult} onClose={() => setFundOpen(false)} />
      <Icam10_Lookup_getICAM open={getIcamOpen} startDate={startDate} closeDate={closeDate} feeType={FEE_TYPE} onClose={() => setGetIcamOpen(false)} />
      <Icam10_Lookup_FundFee
        model={editRow}
        onClose={() => setEditRow(null)}
        onDone={saved => setRows(prev => prev.map(r => (r.feeId === saved.feeId ? saved : r)))}
      />
      <RdViewer url={rdUrl} title="운용보수 발생내역" onClose={() => setRdUrl(null)} />
    </div>
  );
};
