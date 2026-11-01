/**
 * 책임자보고 (J08) — 준법감시 > 11. 임직원매매(준감인) > 책임자보고 #1464
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_CeoReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L81-114: center = vlc = 툴바(기준년월 · 재직구분 · [조회] · 상신상태 · [결재요청][문서보기][엑셀다운로드]) / 탭 3개
 * (임직원계좌신고내역 · 매월신고대상임직원 · 임직원매매명세 — 각각 별도 클래스). 열릴 때와 탭을 고를 때마다 활성 탭을 조회하고 상신상태를 읽는다.
 * 1단계: 조회·상신상태·엑셀. 엑셀은 RD 리포트 서버(Flt10_Rd_CeoReport) 대신 서버가 세 구간을 시트 3개 xlsx로 만든다.
 * [결재요청]·[문서보기]는 V41(2026-11-01)에서 전자결재 편집창(Apr01_Edit_ApprDoc, 링크코드 A72)·문서 목록(Apr01_Lookup_ApprLink)·문서분류(Dcr01_Lookup_Class)에 연결했다.
 *   RD 첨부파일 생성(createRd — insertRdCeoReport + RDUtil.download)은 TOBE에 RD가 없어 원본의 "개발계는 파일생성기능 제한" 길로 옮겼다(첨부 없이 상신, RD 연동 때 다시).
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message, Select, Tabs } from 'antd';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { FltCeoAppr, FltCeoTabHandle } from '@/types/flt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Apr01_Lookup_ApprLink } from '../apr/Apr01_Lookup_ApprLink';
import { Flt03_TabPage_Account } from './Flt03_TabPage_Account';
import { Flt10_TabPage_ReportPerson } from './Flt10_TabPage_ReportPerson';
import { Flt10_TabPage_TrList } from './Flt10_TabPage_TrList';

const DATE_FORMAT = 'YYYY-MM-DD';
const TRANS_NAMES = ['전체', '재직', '퇴직'];  // transName.getStore().add(...) L142-144

const TABS = [
  { key: 'account', label: '임직원계좌신고내역' },  // L229-231
  { key: 'person', label: '매월신고대상임직원' },
  { key: 'tr', label: '임직원매매명세' },
];

/** 재직구분 이름 → transCode (retrieve() L259-268) */
const transCodeOf = (name: string) => (name === '퇴직' ? '900' : name === '재직' ? '100' : '000');

interface Params {
  year: string;
  month: string;
  transName: string;
}

/** getStdDate() L570-584 / getStdDateEnd() L586-602: 기준월 1일·말일. 기준년도를 읽을 수 없으면 null (원본은 파싱 예외) */
function periodOf(year: string, month: string) {
  if (!/^\d{4}$/.test(year.trim())) return null;
  const first = dayjs(`${year.trim()}-${month}-01`);
  if (!first.isValid()) return null;
  return { startDate: first.format(DATE_FORMAT), stdDate: first.endOf('month').format(DATE_FORMAT) };
}

export const Flt10_Tab_CeoReport: React.FC = () => {
  // settings() L116-256: 기준년월 = 오늘이 속한 달, 재직구분 = 재직
  const [params, setParams] = useState<Params>(() => ({ year: dayjs().format('YYYY'), month: dayjs().format('MM'), transName: '재직' }));
  const [activeTab, setActiveTab] = useState('account');
  const [apprStepName, setApprStepName] = useState('');
  const [apprEnabled, setApprEnabled] = useState(false);  // apprButton
  const [apprViewEnabled, setApprViewEnabled] = useState(false);  // apprViewButton
  const [classPickOpen, setClassPickOpen] = useState(false);  // dcrChk(): 문서분류가 없을 때 Dcr01_Lookup_Class
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; stdDate: string; stdDateStr: string } | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [lookupApprIds, setLookupApprIds] = useState<number[] | null>(null);  // 문서가 둘 이상이면 Apr01_Lookup_ApprLink
  const accountRef = useRef<FltCeoTabHandle>(null);
  const personRef = useRef<FltCeoTabHandle>(null);
  const trRef = useRef<FltCeoTabHandle>(null);
  const paramRef = useRef(params);
  paramRef.current = params;
  const tabRef = useRef(activeTab);
  tabRef.current = activeTab;

  // apprChk() L284-351: 상신 체크 — 기준월에 상신된 A72(임직원매매 책임자보고) 문서로 상신상태와 버튼을 정한다
  const apprChk = useCallback(async (startDate: string) => {
    const list: FltCeoAppr[] = await fltApi.searchCeoApprs(startDate);
    const unsubmitted = () => { setApprStepName('미상신'); setApprEnabled(true); setApprViewEnabled(false); };
    if (list.length < 1) { unsubmitted(); return; }
    const inProgress = list.find(m => m.statusCode === '10' || m.statusCode === '20' || m.statusCode === '99');
    if (inProgress) {
      setApprStepName(inProgress.statusName ?? ''); setApprEnabled(false); setApprViewEnabled(true);
      return;
    }
    const first = list[0];
    if (first.statusCode == null) unsubmitted();
    else if (first.statusCode === '30' || first.statusCode === '40') {  // 반려·취소는 다시 상신할 수 있다
      setApprStepName(first.statusName ?? ''); setApprEnabled(true); setApprViewEnabled(true);
    } else {
      setApprStepName(first.statusName ?? ''); setApprEnabled(false); setApprViewEnabled(true);
    }
  }, []);

  // retrieve() L258-282: 활성 탭의 retrieve(말일, 1일, 재직구분 코드) 뒤 apprChk(). 값을 막 바꾼 콤보는 `next`로 넘긴다(상태 반영 전)
  const retrieve = useCallback(async (next?: Partial<Params>) => {
    const p = { ...paramRef.current, ...next };
    const period = periodOf(p.year, p.month);
    if (!period) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    const handle = { account: accountRef, person: personRef, tr: trRef }[tabRef.current as 'account' | 'person' | 'tr'];
    try {
      await Promise.all([
        handle.current?.retrieve(period.stdDate, period.startDate, transCodeOf(p.transName)),
        apprChk(period.startDate),
      ]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [apprChk]);

  // [E0] 화면 열림 (생성자 L81-114) → settings(), retrieve()
  // [E8] tabPanel.Selection [arg0 != null] (L247) → retrieve()
  useEffect(() => { void retrieve(); }, [activeTab, retrieve]);

  // [E5] apprButton[결재요청].Select (L167) → apprButton.setEnabled(false), dcrChk() L353-377
  //   dcr.Dcr30_Link.selectByLinkCode("A72") — 문서분류가 있으면 첫 건으로, 없으면 Dcr01_Lookup_Class로 골라 createRd(classTreeModel, "A72")
  const dcrChk = async () => {
    const period = periodOf(paramRef.current.year, paramRef.current.month);
    if (!period) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    setApprEnabled(false);
    try {
      const list = await dcrApi.searchClassTreeByLinkCode('A72');
      if (list.length > 0) createRd(list[0].classTreeId);
      else setClassPickOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      setApprEnabled(true);
    }
  };

  // createRd() L397-497: sys.Sys99_Print.insertRdCeoReport → sys.Sys10_File.getServerPath → RDUtil.download(Flt10_Rd_CeoReport, xlsx) →
  //   성공 확인("첨부파일생성 완료 … 문서상신을 진행하시겠습니까?") 뒤 insertLinkApproval(classTreeModel, "A72", fileName, fileType).
  //   서버 경로가 없거나 c:로 시작하면(개발계) Info "개발계는 파일생성기능 제한" 뒤 바로 insertLinkApproval — TOBE는 RD가 없어 이 길만 쓴다(첨부 없이 상신)
  const createRd = (classTreeId: number) => {
    const period = periodOf(paramRef.current.year, paramRef.current.month);
    if (!period) return;
    message.info('개발계는 파일생성기능 제한');
    // insertLinkApproval() L379-395: param stdDate·stdDateStr(yyyyText + "년 " + 월 코드 + "월") → Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A72", param, false, callback → apprChk)
    setLinkDoc({ classTreeId, stdDate: period.startDate, stdDateStr: `${paramRef.current.year}년 ${paramRef.current.month}월` });
    setApprEnabled(true);
  };

  // [E7] apprViewButton[문서보기].Select (L182) → apr.Apr01_Appr.selectByLinkCode(stdDate, "A72"):
  //   2건 이상이면 Apr01_Lookup_ApprLink(→ 닫으면 apprChk()), 1건이면 apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(→ apprChk()), 0건이면 "문서가 조회되지 않습니다."
  const viewAppr = async () => {
    const period = periodOf(params.year, params.month);
    if (!period) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    try {
      const list = await fltApi.searchCeoApprs(period.startDate);
      if (list.length > 1) setLookupApprIds(list.map(m => m.apprId));
      else if (list.length === 1) setViewApprId(list[0].apprId);
      else message.info('문서가 조회되지 않습니다.');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E6] downloadButton[엑셀다운로드].Select (L175) → createRdExcel() L499-568 (RD 대신 서버 xlsx)
  const createRdExcel = async () => {
    const period = periodOf(params.year, params.month);
    if (!period) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    try {
      await fltApi.downloadCeoReportExcel(period.stdDate, period.startDate, transCodeOf(params.transName),
        `임직원 금융투자상품 매매명세 보고(${params.year}년 ${params.month}월)`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E9 생략] messageBox.DialogHide [YES] (L469) → insertLinkApproval() — RD 파일 생성 성공 확인창이라 RD가 없는 TOBE에는 없다(위 createRd)

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L160) → retrieve(). [E1] yyyyText.KeyPress [Enter] (L126) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <>
              <SearchBar.Field label="상신상태">
                <Input style={{ width: 100 }} readOnly value={apprStepName} />
              </SearchBar.Field>
              <Button type="register" disabled={!apprEnabled} onClick={dcrChk}>결재요청</Button>
              <Button type="search" disabled={!apprViewEnabled} onClick={viewAppr}>문서보기</Button>
              <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
            </>
          }
        >
          <SearchBar.Field label="기준년월">
            <SearchBar.Input
              style={{ width: 60 }}
              maxLength={4}
              allowClear={false}
              value={params.year}
              onChange={e => setParams(p => ({ ...p, year: e.target.value }))}
            />
            {/* [E2] monthComboBox[MonthsCode].Collapse (L139) → retrieve() */}
            <SystemCodeComboBox
              kindCd="MonthsCode"
              style={{ width: 80 }}
              allowClear={false}
              value={params.month}
              onChange={code => { if (code) { setParams(p => ({ ...p, month: code })); void retrieve({ month: code }); } }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="재직구분">
            {/* [E3] transName[재직].Collapse (L153) → retrieve() */}
            <Select
              style={{ width: 100 }}
              value={params.transName}
              options={TRANS_NAMES.map(n => ({ value: n, label: n }))}
              onChange={v => { setParams(p => ({ ...p, transName: v })); void retrieve({ transName: v }); }}
            />
          </SearchBar.Field>
        </SearchBar>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={TABS}
          style={{ flex: 'none' }}
          tabBarStyle={{ marginBottom: 0 }}
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          {activeTab === 'account' && <Flt03_TabPage_Account ref={accountRef} />}
          {activeTab === 'person' && <Flt10_TabPage_ReportPerson ref={personRef} />}
          {activeTab === 'tr' && <Flt10_TabPage_TrList ref={trRef} />}
        </div>
      </div>
      {/* dcrChk() 문서분류가 없을 때: Dcr01_Lookup_Class.open(null, null, callback → createRd(classTreeModel, "A72")) */}
      <Dcr01_Lookup_Class
        open={classPickOpen}
        onResult={r => { setClassPickOpen(false); createRd(r.classTreeId); }}
        onClose={() => { setClassPickOpen(false); setApprEnabled(true); }}
      />
      <Apr01_Lookup_ApprLink apprIds={lookupApprIds} onClosed={() => void retrieve()} onClose={() => setLookupApprIds(null)} />
      {/* insertLinkApproval() L379-395 / apprViewButton L182-233: Apr01_Edit_ApprDoc.insertLinkApprovals(…) / retrieveApproval(…) 뒤 apprChk() */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? { classTreeId: linkDoc.classTreeId, linkCode: 'A72', args: { stdDate: linkDoc.stdDate, stdDateStr: linkDoc.stdDateStr } } : null}
        onLinkSaved={() => void retrieve()}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </div>
  );
};
