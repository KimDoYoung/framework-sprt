/**
 * 급여대장 (S18) — 경영관리 > 04. 급여관리 > 급여대장 #1271
 * AS-IS: myApp/client/vi/pay/Pay10_Tab_List.java (626줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * init() L273-305: 위 툴바 45 (해당 연도 45 · 구분 칸 "구분을 선택해주세요" · [조회][은행이체명세서][임금계산방법][급여출금계좌][전표확인][비고작성][문서분류지정])
 *   + 가운데 RD 보고서 폼(Pay10_Lookup_Rd_List) + 아래 70 (문서분류 800 · 상신상태 250 · [상신][문서보기]). 그리드는 없다(buildGrid()는 열 정의가 모두 주석).
 * 1단계: [상신]의 결재문서 작성(Pay05_RelateAppr.insert·PDFCreate.createPayMonth10·Apr01_Edit_ApprDoc.insertLinkApproval·updateApprId L495-612)과
 *   [문서보기]의 결재문서 보기(Apr01_Edit_ApprDoc.retrieveApproval, 다른 도메인 apr)는 다음 단계 — 상신 검사까지만 하고 안내한다.
 *   계좌연결(Pay03_Lookup_PayAccount)의 자산 조회창(Ast01_Lookup_Info, 다른 도메인 ast)도 다음 단계.
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { rdApi } from '@/api/rd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { PayMonthGroup } from '@/types/pay';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Pay03_Lookup_PayAccount } from './Pay03_Lookup_PayAccount';
import { Pay04_Lookup_Formula } from './Pay04_Lookup_Formula';
import { Pay09_Lookup_Note } from './Pay09_Lookup_Note';
import { Pay10_Lookup_GroupList } from './Pay10_Lookup_GroupList';
import { Pay10_Lookup_Journal } from './Pay10_Lookup_Journal';
import { Pay10_Lookup_Rd_List } from './Pay10_Lookup_Rd_List';

const LABEL_STYLE: React.CSSProperties = { width: 105, textAlign: 'right', paddingRight: 10, fontWeight: 'bold', flex: 'none' };

export const Pay10_Tab_List: React.FC = () => {
  // [E0] 화면 열림 (생성자 L100-104) → init(), eventSetting(), defaultName(): 연도 = 올해, 구분 = "구분을 선택해주세요", 상신상태 = "미상신"
  const [yearText, setYearText] = useState(dayjs().format('YYYY'));
  // payGroupName: 값 = 지급구분 코드(payCode), 글자 = 구분명, payDate = 그 구분의 지급일
  const [payCode, setPayCode] = useState<string | null>(null);
  const [payGroupText, setPayGroupText] = useState('');
  const [payDate, setPayDate] = useState<string | null>(null);
  // classTreeFullName: 고른 문서분류(없으면 빈 칸 — 관리자가 지정한 문서분류로 상신)
  const [classTreeFullName, setClassTreeFullName] = useState('');
  const [classTreeEmptyText, setClassTreeEmptyText] = useState('미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.');
  // apprStepCode "00" = 미상신 (retrieve()가 정한다). [상신]·[문서보기]는 처음엔 꺼져 있다
  const [apprStepCode, setApprStepCode] = useState('00');
  const [apprStepName, setApprStepName] = useState('미상신');
  const [apprButtonEnabled, setApprButtonEnabled] = useState(false);
  const [apprViewEnabled, setApprViewEnabled] = useState(false);
  const [rdListUrl, setRdListUrl] = useState<string | null>(null);
  const [rdViewerUrl, setRdViewerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [noteTarget, setNoteTarget] = useState<{ payCode: string; payDate: string } | null>(null);
  const [journalTarget, setJournalTarget] = useState<{ payDate: string; payType: string } | null>(null);

  // defaultName() L106-125: 연결 코드 A02(급여대장)의 문서분류가 하나면 그 이름을 안내 글자로, 아니면 "문서분류가 미지정 상태입니다…"
  useEffect(() => {
    dcrApi.searchClassTreeByLinkCode('A02')
      .then(list => setClassTreeEmptyText(list.length === 1
        ? list[0].classTreeFullName
        : '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요'))
      .catch(() => undefined);
  }, []);

  // [E5] retrieveButton[조회].Select (L212) / [E4] apprViewButton → retrieve() L376-435
  const retrieve = async () => {
    if (payCode == null || payDate == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    setLoading(true);
    try {
      // rdForm.retrieve(payCode, "yyyy-MM-dd", "PayList(yy.MM.dd)")
      const fileName = `PayList(${dayjs(payDate).format('YY.MM.DD')})`;
      const page = await rdApi.buildUrl({ kind: 'page', mrd: 'Pay10_Rd_List', rv: { payCode, payDate, fileName } });
      setRdListUrl(page.url);

      // 상신 체크 → pay.Pay05_RelateAppr.selectByCompanyId (한 건일 때만 상신 상태)
      setApprStepName('');
      const appr = await payApi.getRelateAppr(payCode, payDate);
      if (appr == null || appr.statusCode == null) {
        setApprStepCode('00');
        setApprStepName('미상신');
        setApprButtonEnabled(true);
        setApprViewEnabled(false);
      } else if (appr.statusCode === '40') {
        // 40 = 반려 → 다시 상신할 수 있다
        setApprStepCode(appr.statusCode);
        setApprStepName(appr.statusName ?? '');
        setApprButtonEnabled(true);
        setApprViewEnabled(true);
      } else {
        setApprStepCode(appr.statusCode);
        setApprStepName(appr.statusName ?? '');
        setApprButtonEnabled(false);
        setApprViewEnabled(true);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E2] payGroupName.TriggerClick (L160) → lookupPayGroup() L449-461: 연도·"001"(퇴직정산 제외 코드) → 구분·지급일을 채운다(조회는 안 함)
  const lookupPayGroup = (g: PayMonthGroup) => {
    setGroupOpen(false);
    setPayCode(g.payCd);
    setPayGroupText(g.payGroupNm);
    setPayDate(g.date);
  };

  // [E6] bankStatementButton[은행이체명세서].Select (L218) → bankRd() L352-374: RDViewer.viewer(mrd Pay10_Rd_Trans, rv startDate·payCode)
  const bankRd = async () => {
    if (payCode == null || payDate == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    try {
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Pay10_Rd_Trans', options: '/rhtmlimportopt [2]', rv: { startDate: payDate, payCode } });
      setRdViewerUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E8] noteButton[비고작성].Select (L230): 구분이 없으면 "구분을 선택해주세요", 있으면 Pay09_Lookup_Note.open(payCode, payDate)
  const openNote = () => {
    if (payCode == null || payDate == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    setNoteTarget({ payCode, payDate });
  };

  // [E10] journalButton[전표확인].Select (L259) → lookupJournal() L468-476
  const lookupJournal = () => {
    if (payCode == null || payDate == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    setJournalTarget({ payDate, payType: payCode });
  };

  // [E3] apprButton[상신].Select [선택>0] (L166): pay.Pay03_Account.selectByStartDate가 비면 "급여출금계좌를 먼저 지정해주세요"
  //   → insertPayRelateAppr() L495-532: 구분 없음 / 이미 상신 중(10·20·30) 검사 → (다음 단계) 상신 행·PDF·Apr01_Edit_ApprDoc
  const apprRequest = async () => {
    try {
      const account = payDate == null ? null : await payApi.getAccountByDate(payDate);
      if (account == null) {
        message.warning('급여출금계좌를 먼저 지정해주세요');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '확인 실패'));
      return;
    }
    if (payCode == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    if (apprStepCode === '10' || apprStepCode === '20' || apprStepCode === '30') {
      message.warning('이미 상신 중입니다');
      return;
    }
    message.info('전자결재 상신(결재문서 작성)은 다음 단계에서 제공됩니다.');
  };

  // [E4] apprViewButton[문서보기].Select (L187): apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval — 다음 단계
  const apprView = () => {
    message.info('결재문서 보기는 다음 단계에서 제공됩니다.');
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', display: 'flex', flexDirection: 'column' }}>
        {/* [E5] retrieveButton[조회].Select (L212) → retrieve() */}
        <div style={{ padding: 10 }}>
          <SearchBar
            onSearch={retrieve}
            loading={loading}
            extra={<>
              {/* [E6] bankStatementButton[은행이체명세서].Select (L218) → bankRd() */}
              <Button type="view" onClick={bankRd}>은행이체명세서</Button>
              {/* [E7] formulaButton[임금계산방법].Select (L224) → lookupformula() */}
              <Button type="view" onClick={() => setFormulaOpen(true)}>임금계산방법</Button>
              {/* [E11] payAccountButton[급여출금계좌].Select (L265) → lookupPayAccount() */}
              <Button type="view" onClick={() => setAccountOpen(true)}>급여출금계좌</Button>
              {/* [E10] journalButton[전표확인].Select (L259) → lookupJournal() */}
              <Button type="view" onClick={lookupJournal}>전표확인</Button>
              {/* [E8] noteButton[비고작성].Select (L230) */}
              <Button type="view" onClick={openNote}>비고작성</Button>
              {/* [E9] dcrLinkButton[문서분류지정].Select (L247) → Dcr30_Lookup_Link.open("A02", callback{}) */}
              <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>
            </>}
          >
            <SearchBar.Field label="해당 연도">
              <SearchBar.Input style={{ width: 70 }} value={yearText} onChange={e => setYearText(e.target.value)} />
            </SearchBar.Field>
            <SearchBar.Field label="구분">
              {/* [E2] payGroupName.TriggerClick (L160) → lookupPayGroup() */}
              <LookupInput value={payGroupText} placeholder="구분을 선택해주세요" width={200} onOpen={() => setGroupOpen(true)} />
            </SearchBar.Field>
          </SearchBar>
        </div>
        {/* rdForm — Pay10_Lookup_Rd_List: RD 보고서(Pay10_Rd_List)를 폼 안에 끼워 넣는다 */}
        <div style={{ flex: 1, minHeight: 0, borderTop: '1px solid #d9d9d9' }}>
          <Pay10_Lookup_Rd_List url={rdListUrl} />
        </div>
        {/* cp — init() L273-305: 문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120 (라벨 폭 105) */}
        <div style={{ borderTop: '1px solid #d9d9d9', height: 70, boxSizing: 'border-box', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10, flex: 'none', overflowX: 'auto' }}>
          <span style={LABEL_STYLE}>문서분류</span>
          {/* [E1] classTreeFullName[문서분류].TriggerClick (L154) → openLookupDoc() — Dcr30_Move_DcrClass.open(callback) */}
          <LookupInput value={classTreeFullName} placeholder={classTreeEmptyText} width={800} onOpen={() => setClassOpen(true)} />
          <span style={LABEL_STYLE}>상신상태</span>
          <Input readOnly value={apprStepName} style={{ width: 250, flex: 'none' }} />
          {/* [E3] apprButton[상신].Select [선택>0] (L166) → insertPayRelateAppr() */}
          <Button type="register" disabled={!apprButtonEnabled} onClick={apprRequest}>상신</Button>
          {/* [E4] apprViewButton[문서보기].Select (L187) → retrieve()·Apr01_Edit_ApprDoc.retrieveApproval */}
          <Button type="search" disabled={!apprViewEnabled} onClick={apprView}>문서보기</Button>
        </div>
      </div>
      <Pay10_Lookup_GroupList open={groupOpen} year={yearText} code="001" onResult={lookupPayGroup} onClose={() => setGroupOpen(false)} />
      <Dcr30_Move_DcrClass
        open={classOpen}
        hideNull
        onResult={r => setClassTreeFullName(r.classTreeFullName ?? '')}
        onClose={() => setClassOpen(false)}
      />
      <Pay04_Lookup_Formula open={formulaOpen} onClose={() => setFormulaOpen(false)} />
      <Pay03_Lookup_PayAccount open={accountOpen} onClose={() => setAccountOpen(false)} />
      <Pay10_Lookup_Journal target={journalTarget} onClose={() => setJournalTarget(null)} />
      <Pay09_Lookup_Note target={noteTarget} onClose={() => setNoteTarget(null)} />
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="A02" onClose={() => setLinkOpen(false)} />
      {/* 은행이체명세서는 RdViewer (AS-IS RDViewer.viewer) */}
      <RdViewer url={rdViewerUrl} title="은행이체명세서" onClose={() => setRdViewerUrl(null)} />
    </div>
  );
};
