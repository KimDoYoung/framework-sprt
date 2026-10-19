/**
 * [1203] I/F > 10. ICAM > ICAM 보수(관리자용) (D08)
 * AS-IS: myApp/client/vi/icam/Icam10_Tab_FeeAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L70-115: 위 = 툴바(기간 ~ · 구분 · ICAM운용사 · 검색 · 조회 · ICAM 발생보수 가져오기), 아래 = 그리드(행번호, 체크박스 없음, 10열) + 페이징 툴바(100)
 * UX보강(10): 툴바 = SearchBar(UX-01). 원본에 초기화 버튼이 없고 툴바가 이미 길어 onReset(UX-02)은 넣지 않는다
 * 버튼 type: 조회 `search`, ICAM 발생보수 가져오기 = `download`(원본 문구가 button-types에 없어 '외부에서 가져오기' 뜻으로 고름).
 * 가져오기(BatchMain 서블릿)는 외부 ICAM DB를 읽는 작업이라 서버가 거절한다 — 작업기록 의존
 */
import React, { useCallback, useRef, useState } from 'react';
import { DatePicker, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { IcamFee } from '@/types/icam';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { SearchBar } from '@/components/search';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const FORMAT = 'YYYY-MM-DD';
const OFFICE_FEE = '20407';   // 사무관리보수 — 회사 1로 고정, 운용사 칸을 쓰지 않는다
const gb = gbFor<IcamFee>();

/** AS-IS buildGrid() */
const columnDefs = [
  gb.date('stdDate', 100, '기준일'),
  gb.textCenter('icamCompanyCode', 70, '운용사코드'),
  gb.text('icamCompanyName', 200, '운용사명'),
  gb.text('fundName', 250, '펀드'),
  gb.text('rmkName', 180, '적요'),
  gb.double('fee', 100, '금액'),
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

// [E0] 화면 열림 (생성자 L70-115) → setting() L117-188: 기간 어제~어제, 구분 "사무관리보수"(20407), 운용사 칸 비활성·읽기 전용. 열 때 조회하지 않는다
export const Icam10_Tab_FeeAdmin: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcamFee>>(null);
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [feeType, setFeeType] = useState<string>(OFFICE_FEE);
  const [searchText, setSearchText] = useState('');
  const [lookupOpen, setLookupOpen] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyText, setCompanyText] = useState('');
  const [rows, setRows] = useState<IcamFee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  /** 조회한 때의 조건 — 페이지를 넘길 때 같은 조건으로 (gridToolBar.addParam) */
  const cond = useRef<Condition | null>(null);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L298-300) */
  const selectFirst = useRef(false);

  // [E1] feeTypecomboBox[FundFeeType].Collapse (L129) → 인라인 L129-140: 사무관리보수(20407)면 운용사 칸을 비우고 끄고, 아니면 켠다
  const onFeeType = (code?: string) => {
    setFeeType(code ?? '');
    if (code === OFFICE_FEE) {
      setCompanyText('');
      setCompanyId(null);
    }
  };

  // [E3] companyField.TriggerClick [result != null] (L156) → Sys01_Lookup_Company.open() L156-174: 운용사 칸에 ICAM 운용사 코드만, 선택안함이면 비움
  const onCompany = (company: Company | null) => {
    setLookupOpen(false);
    if (company) {
      setCompanyText(company.icamCompanyCd ?? '');
      setCompanyId(company.companyId);
    } else {
      setCompanyText('');
      setCompanyId(null);
    }
  };

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

  // [E2] searchTextField.KeyPress [Enter] (L143)·[E4] retrieveButton[조회].Select (L176) → retrieve() L268-304
  // 사무관리보수면 회사 1, 아니면 고른 운용사. 없으면 "운용사를 선택해주세요" → 1페이지부터 조회, 행이 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    const company = feeType === OFFICE_FEE ? 1 : companyId;
    if (company == null) {
      message.warning('운용사를 선택해주세요');
      return;
    }
    cond.current = { companyId: company, feeType, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText };
    await getPaging(1);
  }, [feeType, companyId, startDate, closeDate, searchText, getPaging]);

  // batchRun() L242-265: BatchMain?actionCode=icamOfficeMngFee|icamFundMngFee&worker=…&companyId=…&startDate=…&closeDate=…
  const batchRun = async (target: string) => {
    try {
      await icamApi.runFeeBatch({
        actionCode: feeType === OFFICE_FEE ? 'icamOfficeMngFee' : 'icamFundMngFee',
        companyId: target,
        startDate: startDate.format(FORMAT),
        closeDate: closeDate.format(FORMAT),
      });
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    }
  };

  // [E5] batchButton[ICAM 발생보수 가져오기].Select (L182) → batch() L208-240
  // 운용사가 없으면 확인창(전체운용사) → [E6] msgBox.DialogHide [YES] (L220) → batchRun("ALL"), 있으면 바로
  const batch = () => {
    const company = feeType === OFFICE_FEE ? 1 : companyId;
    if (company == null) {
      Modal.confirm({
        title: '확인',
        content: '전체운용사의 발생보수를 가져오시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        onOk: () => batchRun('ALL'),
      });
    } else {
      void batchRun(String(company));
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, background: '#fff' }}>
      <SearchBar
        onSearch={retrieve}
        extra={<Button type="download" onClick={batch}>ICAM 발생보수 가져오기</Button>}
      >
        <SearchBar.Field label="기간">
          <Space size={4}>
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            ~
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </Space>
        </SearchBar.Field>
        <SearchBar.Field label="구분">
          <SystemCodeComboBox kindCd="FundFeeType" style={{ width: 140 }} allowClear={false} value={feeType} onChange={onFeeType} />
        </SearchBar.Field>
        <SearchBar.Field label="ICAM운용사">
          <LookupInput
            width={100}
            placeholder="전체"
            disabled={feeType === OFFICE_FEE}
            value={companyText}
            onOpen={() => setLookupOpen(true)}
            onClear={() => onCompany(null)}
          />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
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
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      <Sys01_Lookup_Company open={lookupOpen} onResult={onCompany} onClose={() => setLookupOpen(false)} />
    </div>
  );
};
