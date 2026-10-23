/**
 * (s)이익제공 상세현황 (L12) — 준법감시 > 40. 이익제공(수령)현황 > (s)이익제공 상세현황 #1322
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_PriorApprovalSimple.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L62-93: north = 툴바(조회기간 ~ · 제공/수령 · 조회구분 콤보+칸 · [조회][출력/다운로드]), center = 한도초과 내역 그리드(단일 선택)
 * L08 `Biz01_Tab_PriorApproval`의 간이판: 제공(수령)자 칸·합계 행·머리글 묶음이 없고, 조회구분 콤보는 전체/회사별 둘뿐이며 칸은 `Crm09_Lookup_SelectSingle`(영업 거래처)을 연다.
 *   서버는 한도초과(인당 경제적가치 > 기준) 내역만 준다(selectProvideListSimple). 열어도 자동 조회하지 않는다(생성자에 retrieve() 없음) — [조회]를 눌러야 읽는다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04, UX-02 초기화는 L08처럼 뺀다), 그리드 날짜 폭(UX-08)
 */
import React, { useMemo, useRef, useState } from 'react';
import { DatePicker, message, Select, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizPromoApi } from '@/api/biz';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BizProvideSimple } from '@/types/biz';
import { CrmContact } from '@/types/crm';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Crm09_Lookup_SelectSingle } from '@/components/lookup/Crm09_Lookup_SelectSingle';
import { RdViewer } from '@/components/lookup/RdViewer';

const gb = gbFor<BizProvideSimple>();

/** lookupComboBox 목록 (setting() L109-110) */
const LOOKUP_TYPES = ['전체', '회사별'];
/** 콤보 빈칸 "전체"의 코드 (ComboBoxField("ProvideRcvType", "%", "전체")) */
const ALL = '%';
const DATE_FORMAT = 'YYYY-MM-DD';

export const Biz01_Tab_PriorApprovalSimple: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizProvideSimple>>(null);
  // [E0] 화면 열림 (생성자 L62-93) → setting() L95-160: 조회기간 = 올해 1월 1일 ~ 오늘, 제공/수령 "전체", 조회구분 "전체"(칸은 잠김). 자동 조회는 없다
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [provideRcv, setProvideRcv] = useState(ALL);
  const [lookupType, setLookupType] = useState('전체');
  const [crmName, setCrmName] = useState('');
  const [rows, setRows] = useState<BizProvideSimple[]>([]);
  const [busy, setBusy] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  // retrieve() L232-266 · provideListRd() L179-230 의 조건: 거래상대방이 전체면 "%", 아니면 칸의 글자
  const condition = () => ({
    startDate: startDate.format(DATE_FORMAT),
    endDate: endDate.format(DATE_FORMAT),
    provideRcvType: provideRcv,
    crmName: lookupType === '전체' ? ALL : crmName,
  });

  // [E3] retrieveButton[조회].Select (L148) → retrieve() L232-266: 서비스 biz.Biz01_Promo.selectProvideListSimple(companyId, personId, startDate, endDate, provideRcvType, crmName)
  const retrieve = async () => {
    setBusy(true);
    try {
      setRows(await bizPromoApi.searchProvideListSimple(condition()));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E1] lookupComboBox[전체].Collapse (L131-141): "회사별"이면 칸을 열고, 아니면 칸을 비우고 잠근다
  const onLookupTypeChange = (value: string) => {
    setLookupType(value);
    if (value !== '회사별') setCrmName('');
  };

  // [E2] crmName.TriggerClick (L142) → openLookup() L268-284: Crm09_Lookup_SelectSingle.open("keyInCompany") — 한 행을 고르면 회사명을 칸에 넣는다
  const onCrmResult = (row: CrmContact) => {
    setCrmName(row.contactName);
  };

  // [E4] provideListButton[출력/다운로드].Select (L154) → provideListRd() L179-230: 서비스 sys.Sys99_Print.insertRdProvideListSimple(companyId, personId, "Biz01_Tab_PriorApprovalSimple", startDate, endDate, provideRcvType, crmName)
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Biz01_Rd_ProvideListSimple · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId)
  const provideListRd = async () => {
    setBusy(true);
    try {
      const groupId = await bizPromoApi.rdPrintProvideListSimple(condition());
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Biz01_Rd_ProvideListSimple',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setBusy(false);
    }
  };

  // buildGrid() L162-177
  const columnDefs = useMemo(() => [
    gb.textCenter('provideRcvTypeName', 120, '제공/수령'),  // L164
    gb.textCenter('regEmpName', 120, '제공자'),              // L165
    gb.date('provideDate', 90, '제공일자'),                  // L166 (원본 120 — UX-08 읽기 전용 날짜는 90)
    gb.textCenter('providePurName', 120, '제공목적'),        // L167
    gb.textCenter('provideContentName', 120, '제공내용'),    // L168
    gb.text('provideCompany', 300, '거래상대방'),            // L169
    gb.longCenter('pepleCount', 80, '인원'),                 // L170
    gb.long('averagePrice2', 120, '인당 경제적가치'),        // L171
    gb.text('note', 350, '비고'),                            // L172
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SearchBar
        onSearch={retrieve}
        loading={busy}
        extra={<Button type="download" onClick={provideListRd}>출력/다운로드</Button>}
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="제공/수령">
          <SystemCodeComboBox kindCd="ProvideRcvType" altCode={[ALL, '전체']} style={{ width: 100 }} value={provideRcv} onChange={code => setProvideRcv(code ?? ALL)} />
        </SearchBar.Field>
        <SearchBar.Field label="조회구분">
          <Select<string> style={{ width: 100 }} value={lookupType} options={LOOKUP_TYPES.map(v => ({ value: v, label: v }))} onChange={onLookupTypeChange} />
          <LookupInput width={200} value={crmName} disabled={lookupType !== '회사별'} onOpen={() => setCrmOpen(true)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <SingleGrid<BizProvideSimple>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.rowId)}
        />
        {busy && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin tip="Loading" />
          </div>
        )}
      </div>
      <Crm09_Lookup_SelectSingle open={crmOpen} onResult={onCrmResult} onClose={() => setCrmOpen(false)} />
      <RdViewer url={rdUrl} title="(s)이익제공 상세현황" onClose={() => setRdUrl(null)} />
    </div>
  );
};
