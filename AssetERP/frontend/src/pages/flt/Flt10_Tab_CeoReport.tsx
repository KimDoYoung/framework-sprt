/**
 * 책임자보고 (J08) — 준법감시 > 11. 임직원매매(준감인) > 책임자보고 #1464
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_CeoReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L81-114: center = vlc = 툴바(기준년월 · 재직구분 · [조회] · 상신상태 · [결재요청][문서보기][엑셀다운로드]) / 탭 3개
 * (임직원계좌신고내역 · 매월신고대상임직원 · 임직원매매명세 — 각각 별도 클래스). 열릴 때와 탭을 고를 때마다 활성 탭을 조회하고 상신상태를 읽는다.
 * 1단계: 조회·상신상태·엑셀. 엑셀은 RD 리포트 서버(Flt10_Rd_CeoReport) 대신 서버가 세 구간을 시트 3개 xlsx로 만든다.
 * [결재요청]·[문서보기]가 여는 전자결재 편집창(Apr01_Edit_ApprDoc)·문서 목록(Apr01_Lookup_ApprLink)·문서분류(Dcr01_Lookup_Class)와
 * RD 첨부파일 생성은 다른 도메인이라 다음 단계 — 안내만 한다.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message, Select, Tabs } from 'antd';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltCeoAppr, FltCeoTabHandle } from '@/types/flt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { Flt03_TabPage_Account } from './Flt03_TabPage_Account';
import { Flt10_TabPage_ReportPerson } from './Flt10_TabPage_ReportPerson';
import { Flt10_TabPage_TrList } from './Flt10_TabPage_TrList';

const DATE_FORMAT = 'YYYY-MM-DD';
const TRANS_NAMES = ['전체', '재직', '퇴직'];  // transName.getStore().add(...) L142-144
const NEXT_STEP = '전자결재 문서 창은 다음 단계에서 연결합니다.';

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

  // [E5] apprButton[결재요청].Select (L167) → dcrChk() L353-377 → createRd() → insertLinkApproval() — 전자결재·RD 첨부파일 생성은 다음 단계
  const dcrChk = () => { message.info(NEXT_STEP); };

  // [E7] apprViewButton[문서보기].Select (L182) → getStdDate(), apprChk(): 상신 문서를 다시 읽어 0건이면 안내, 있으면 편집창(다음 단계)
  const viewAppr = async () => {
    const period = periodOf(params.year, params.month);
    if (!period) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    try {
      const list = await fltApi.searchCeoApprs(period.startDate);
      message.info(list.length === 0 ? '문서가 조회되지 않습니다.' : NEXT_STEP);
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

  // [E9 생략] messageBox.DialogHide [YES] (L469) → insertLinkApproval() — [결재요청]의 후속(전자결재 상신)이라 다음 단계

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
    </div>
  );
};
