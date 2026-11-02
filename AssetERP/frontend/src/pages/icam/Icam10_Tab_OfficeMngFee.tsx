/**
 * [1199] 관리회계 > 30. 사무관리보수관리 > ICAM 펀드보수 발생내역 (X23)
 * AS-IS: myApp/client/vi/icam/Icam10_Tab_OfficeMngFee.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L57-105: 위 = 툴바(기간 ~ · 검색 운용사/펀드/적요 250 · 조회 · ICAM발생내역 가져오기 · BATCH 재실행), 아래 = 그리드(행번호 + 13열, 체크박스 없음) + 페이징 툴바(100)
 * 보수구분은 20407(미지급사무관리보수) 고정(L55). 같은 테이블을 보는 D08 `Icam10_Tab_FeeAdmin`(관리자용)과 API(`icam/fees`)를 같이 쓴다
 * 함께: Icam10_Lookup_getICAM(가져오기 창), Icam10_Lookup_FundFee(행 더블클릭 발생보수 수정 창)
 * 스타일: SG (조회 툴바 + 그리드 하나 — yunhee 판별은 비어 있는 insertRow/deleteRow 때문에 CG로 나오지만 편집 그리드가 아니다, D08과 같음)
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 2개라 초기화(UX-02)는 넣지 않는다
 * 버튼 type: 조회 `search`, ICAM발생내역 가져오기 = `download`(가져오기), BATCH 재실행 = `generate`(원본 문구가 button-types에 없어 '다시 만든다' 뜻으로 고름)
 */
import React, { useCallback, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFee } from '@/types/icam';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Icam10_Lookup_FundFee } from './Icam10_Lookup_FundFee';
import { Icam10_Lookup_getICAM } from './Icam10_Lookup_getICAM';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const FORMAT = 'YYYY-MM-DD';
const FEE_TYPE = '20407';   // L55: 미지급사무관리보수
const gb = gbFor<IcamFee>();

/** AS-IS buildGrid() L162-181 */
const columnDefs = [
  gb.date('stdDate', 100, '기준일'),
  gb.textCenter('icamCompanyCode', 70, '운용사코드'),
  gb.text('icamCompanyName', 200, '운용사명'),
  gb.textCenter('fundCode', 70, '펀드코드'),
  gb.text('fundName', 250, '펀드명'),
  gb.text('rmkName', 180, '적요'),
  gb.textCenter('curCode', 55, '통화'),
  gb.double('fee', 100, '발생보수'),
  gb.double('fxRate', 100, '적용환율'),
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
  searchText: string;
}

// [E0] 화면 열림 (생성자 L57-105) → setting() L107-160: 기간 어제~어제, 검색칸 안내 "운용사/펀드/적요". 열 때 조회하지 않는다
export const Icam10_Tab_OfficeMngFee: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<IcamFee>>(null);
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcamFee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [getIcamOpen, setGetIcamOpen] = useState(false);
  const [editRow, setEditRow] = useState<IcamFee | null>(null);
  /** 조회한 때의 조건 — 페이지를 넘길 때 같은 조건으로 (gridToolBar.addParam) */
  const cond = useRef<Condition | null>(null);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L219-223) */
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

  // [E1] searchTextField.KeyPress [Enter] (L119)·[E3] retrieveButton[조회].Select (L142) → retrieve() L204-227
  // 조건(회사·구분·기간·검색어) 저장 → 1페이지부터 조회, 행이 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    cond.current = { companyId: user.companyId, feeType: FEE_TYPE, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText };
    await getPaging(1);
  }, [user.companyId, startDate, closeDate, searchText, getPaging]);

  // [E5] batchButton[BATCH 재실행].Select (L154) → batch() L188-201: BatchMain?actionCode=icamOfficeMngFee&worker=…&companyId=…&startDate=…&closeDate=…
  // (외부 ICAM DB 연동이 없어 서버가 거절한다 — D08과 같음)
  const batch = async () => {
    try {
      await icamApi.runFeeBatch({
        actionCode: 'icamOfficeMngFee',
        companyId: String(user.companyId),
        startDate: startDate.format(FORMAT),
        closeDate: closeDate.format(FORMAT),
      });
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={retrieve}
          extra={
            <Space>
              {/* [E4] getIcamButton[ICAM발생내역 가져오기].Select (L148) → lookupGetIcam() L183-186: Icam10_Lookup_getICAM.open(시작일, 종료일, feeType) */}
              <Button type="download" onClick={() => setGetIcamOpen(true)}>ICAM발생내역 가져오기</Button>
              <Button type="generate" onClick={batch}>BATCH 재실행</Button>
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
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="운용사/펀드/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
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
            // [E2] grid.RowDoubleClick (L128) → Icam10_Lookup_FundFee.open(feeModel, callback): 저장하면 그 행을 갱신 (L133-137)
            onRowDoubleClicked={e => e.data && setEditRow(e.data)}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      <Icam10_Lookup_getICAM open={getIcamOpen} startDate={startDate} closeDate={closeDate} feeType={FEE_TYPE} onClose={() => setGetIcamOpen(false)} />
      <Icam10_Lookup_FundFee
        model={editRow}
        onClose={() => setEditRow(null)}
        onDone={saved => setRows(prev => prev.map(r => (r.feeId === saved.feeId ? saved : r)))}
      />
    </div>
  );
};
