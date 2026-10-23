/**
 * 이익제공 상세현황 (L08) — 준법감시 > 40. 이익제공(수령)현황 > 이익제공 상세현황 #1136
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_PriorApproval.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L71-105: north = 툴바(조회기간 ~ · 제공/수령 · 제공(수령)자 · 거래상대방 콤보+칸 · [조회][출력/다운로드]), center = 상세현황 그리드(단일 선택, 합계 행)
 * 열어도 자동으로 조회하지 않는다(생성자에 retrieve() 없음) — [조회]를 눌러야 읽는다.
 * 제공/수령이 이익제공(1)이면 거래상대방 열을 숨기고 회사·직원·부서(머리글 "거래상대방" 묶음)를 보이며, 이익수령(2)이면 반대다(setting() L132-148).
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 버튼이 많아 UX-02 초기화는 뺀다), 그리드 날짜 폭(UX-08)
 */
import React, { useMemo, useRef, useState } from 'react';
import { DatePicker, message, Select, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizPromoApi } from '@/api/biz';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BizProvideList } from '@/types/biz';
import { MktTarget } from '@/types/mkt';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Mkt01_Lookup_Select2, MktSelectType } from '@/components/lookup/Mkt01_Lookup_Select2';
import { RdViewer } from '@/components/lookup/RdViewer';

const gb = gbFor<BizProvideList>();

/** lookupComboBox 목록 (setting() L117-120) */
const LOOKUP_TYPES = ['전체', '회사별', '직원별'];
const DATE_FORMAT = 'YYYY-MM-DD';

export const Biz01_Tab_PriorApproval: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizProvideList>>(null);
  // [E0] 화면 열림 (생성자 L71-105) → setting() L107-189: 조회기간 = 올해 1월 1일 ~ 오늘, 제공/수령 = 이익제공, 거래상대방 = 전체(칸은 잠김). 자동 조회는 없다
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [provideRcv, setProvideRcv] = useState('1');
  const [lookupType, setLookupType] = useState('전체');
  const [crmName, setCrmName] = useState('');
  const [empId, setEmpId] = useState<number | null>(null);
  const [empName, setEmpName] = useState('');
  const [rows, setRows] = useState<BizProvideList[]>([]);
  const [busy, setBusy] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);
  const [mktType, setMktType] = useState<MktSelectType | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  // retrieve() L280-311 · provideListRd() L215-278 의 조건: 거래상대방이 전체면 "%", 아니면 칸의 글자
  const condition = () => ({
    startDate: startDate.format(DATE_FORMAT),
    endDate: endDate.format(DATE_FORMAT),
    provideRcvType: provideRcv,
    crmName: lookupType === '전체' ? '%' : crmName,
    empId,
  });

  // [E5] retrieveButton[조회].Select (L177) → retrieve() L280-311: 서비스 biz.Biz01_Promo.selectProvideList(companyId, personId, startDate, endDate, provideRcvType, crmName, empId)
  const retrieve = async () => {
    setBusy(true);
    try {
      setRows(await bizPromoApi.searchProvideList(condition()));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E1] provideRcvComboBox[ProvideRcvType].Collapse (L132) → 열 보이기 바꾸고(1이면 거래상대방 열 숨김) retrieve()
  const onProvideRcvChange = (code: string) => {
    setProvideRcv(code);
    setBusy(true);
    bizPromoApi.searchProvideList({ ...condition(), provideRcvType: code })
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => setBusy(false));
  };

  // [E2] lookupComboBox[전체].Collapse (L151): 전체면 거래상대방 칸을 잠그고 비운다, 아니면 칸을 연다
  const onLookupTypeChange = (value: string) => {
    setLookupType(value);
    if (value === '전체') setCrmName('');
  };

  // [E3] crmNameLookupField.TriggerClick (L164) → openMktLookup() L330-364: 직원별이면 'emp', 회사별이면 'cmp'
  const openMktLookup = () => {
    if (lookupType === '직원별') setMktType('emp');
    else if (lookupType === '회사별') setMktType('cmp');
  };
  const onMktResult = (row: MktTarget | null) => {
    if (!row) {
      setCrmName('');
    } else if (lookupType === '직원별') {
      let name = row.targetCompanyName ?? '';
      if (row.managerName != null) name += ` ${row.managerName}`;
      if (row.managerOrgName != null) name += `(${row.managerOrgName})`;
      setCrmName(name);
    } else {
      setCrmName(row.targetCompanyName ?? '');
    }
    setMktType(null);
  };

  // [E4] empNameLookupField.TriggerClick (L171) → openEmpLookup() L313-328: lookup.openAll(조회기간 시작일, "One") — [전체]는 제공(수령)자 조건 없음
  const onEmpResult = (row: { personId: number; korNm?: string | null } | null) => {
    setEmpId(row ? row.personId : null);
    setEmpName(row ? row.korNm ?? '' : '');
    setEmpOpen(false);
  };

  // [E6] provideListButton[출력/다운로드].Select (L183) → provideListRd() L215-278: 서비스 sys.Sys99_Print.insertRdProvideList(companyId, personId, "Biz01_Tab_PriorApproval", startDate, endDate, provideRcvType, crmName, empId)
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd 이익제공 Biz01_Rd_ProvideList / 이익수령 Biz01_Rd_ReceiveList · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId)
  const provideListRd = async () => {
    const cond = condition();
    setBusy(true);
    try {
      const groupId = await bizPromoApi.rdPrintProvideList(cond);
      if (cond.provideRcvType !== '1' && cond.provideRcvType !== '2') {
        message.error('[에러] 제공/수령 구분을 읽을 수 없습니다.');
        return;
      }
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: cond.provideRcvType === '1' ? 'Biz01_Rd_ProvideList' : 'Biz01_Rd_ReceiveList',
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

  // buildGrid() L191-213: 열 6(거래상대방)은 이익제공이면 숨기고, 7~9(회사·직원·부서)는 이익수령이면 숨긴다. 머리글 "거래상대방" 묶음 = 회사·직원·부서
  const provide = provideRcv === '1';
  const columnDefs = useMemo(() => [
    gb.date('provideDate', 90, '일자'),                                   // L196 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.text('orgName', 150, '제공(수령)부서'),                           // L197
    gb.textCenter('regEmpName', 150, '제공(수령)자'),                     // L198
    gb.textCenter('providePurName', 100, '목적'),                         // L199
    gb.textCenter('provideContentName', 100, '내용'),                     // L200
    gb.text('targetName', 300, '거래상대방', { hide: provide }),          // L201
    gb.group('거래상대방', [
      gb.text('targetCompanyName', 200, '회사', { hide: !provide }),      // L202
      gb.text('targetEmpName', 100, '직원', { hide: !provide }),          // L203
      gb.text('targetOrgName', 150, '부서', { hide: !provide }),          // L204
    ]),
    gb.long('averagePrice', 120, '인당 경제적가치'),                      // L205
    gb.text('note', 350, '비고'),                                         // L206
  ], [provide]);

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
          <SystemCodeComboBox kindCd="ProvideRcvType" style={{ width: 100 }} value={provideRcv} onChange={code => onProvideRcvChange(code ?? '1')} />
        </SearchBar.Field>
        <SearchBar.Field label="제공(수령)자">
          <LookupInput width={100} value={empName} placeholder="전체" onOpen={() => setEmpOpen(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="거래상대방">
          <Select<string> style={{ width: 100 }} value={lookupType} options={LOOKUP_TYPES.map(v => ({ value: v, label: v }))} onChange={onLookupTypeChange} />
          <LookupInput width={300} value={crmName} placeholder="전체" disabled={lookupType === '전체'} onOpen={openMktLookup} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <SingleGrid<BizProvideList>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.rowId)}
          sumRow={{ labelField: 'provideDate', label: '합계', sum: ['averagePrice'] }}
        />
        {busy && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin tip="Loading" />
          </div>
        )}
      </div>
      <Emp00_Lookup_SelectSingle open={empOpen} transDate={startDate.format(DATE_FORMAT)} onResult={onEmpResult} onClose={() => setEmpOpen(false)} />
      <Mkt01_Lookup_Select2 type={mktType} onResult={onMktResult} onClose={() => setMktType(null)} />
      <RdViewer url={rdUrl} title="이익제공 상세현황" onClose={() => setRdUrl(null)} />
    </div>
  );
};
