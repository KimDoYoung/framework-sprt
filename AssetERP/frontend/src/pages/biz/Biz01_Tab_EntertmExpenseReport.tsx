/**
 * 접대비 현황 (U18) — 자금관리 > 30. 법인카드관리 > 접대비 현황 #1335
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_EntertmExpenseReport.java (488줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L81-173: BorderLayout — north 50(여백 20/20/-1/20) = 툴바(기준년월 [yyyy 45] [월 콤보 60, 기본 "전체"] [관리자|실사용자 콤보 80 — 회사가 실사용자 관리를 쓸 때만] [조회] [출력/다운로드]),
 *   center(여백 0/20/0/20) = 탭 3개(월별 제공금액 누계 · 제공 내역 · 거래처별 제공금액), south 70(여백 -1/20/20/20) = 테두리 칸(문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120)
 * 함께: Biz01_TabPage_MonthEntertmExpense · Biz01_TabPage_EntertmExpenseHistory(+ 기존 Biz02_Grid_PersonList·InternalList·ExternalList) · Biz02_TabPage_CompanyEntertmExpense · Dcr30_Move_DcrClass(문서분류, 기존)
 * 1단계(다른 U 화면과 같은 사유): 상신·문서보기가 여는 전자결재 편집창 `Apr01_Edit_ApprDoc`(apr 도메인)은 다음 단계 — [상신]은 AS-IS 점검·확인 창까지 하고 편집창 자리에 안내만 띄운다
 * 스타일: STP (견본 Pay10_Tab_Retire — docs/page-style.md) + 아래 문서분류·상신상태 줄은 SG처럼 flex none 70 한 줄
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 조건이 3개이나 버튼이 둘이라 UX-02 초기화는 뺀다)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, Modal, Select, message } from 'antd';
import dayjs from 'dayjs';
import { bizCardManagementApi, bizPromoApi, bizRelateApprApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';
import { Button } from '@/components/button';
import { PageTabs } from '@/components/tabs';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Biz01_TabPage_EntertmExpenseHistory } from './Biz01_TabPage_EntertmExpenseHistory';
import { Biz01_TabPage_MonthEntertmExpense } from './Biz01_TabPage_MonthEntertmExpense';
import { Biz02_TabPage_CompanyEntertmExpense } from './Biz02_TabPage_CompanyEntertmExpense';
import { EntertmTabHandle } from './bizEntertmTab';

/** AS-IS 링크코드 A36 = 접대비 현황 */
const LINK_CODE = 'A36';
const ALL = '전체';

const TABS = [
  { key: 'month', label: '월별 제공금액 누계' },
  { key: 'history', label: '제공 내역' },
  { key: 'company', label: '거래처별 제공금액' },
];

/** monthComboBox 항목 (L105-121): 1월~12월, 전체 */
const MONTH_OPTIONS = [
  ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: `${i + 1}월` })),
  { value: ALL, label: ALL },
];

/** 상신 상태 (apprChk() L386-435) */
interface ApprState {
  code: string;
  name: string;
  apprId: number | null;
  apprEnabled: boolean;
  viewEnabled: boolean;
}
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };

export const Biz01_Tab_EntertmExpenseReport: React.FC = () => {
  // settings() L175-182: 기준 = 지난달의 연도, 월 콤보는 "전체"
  const [year, setYear] = useState(() => dayjs().subtract(1, 'month').format('YYYY'));
  const [month, setMonth] = useState<string>(ALL);
  const [cardRealUserType, setCardRealUserType] = useState('관리자');
  const [realUser, setRealUser] = useState(false);
  const [activeKey, setActiveKey] = useState('month');
  const [opened, setOpened] = useState<string[]>(['month']);
  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(NOT_SUBMITTED);
  const [rd, setRd] = useState<{ url: string } | null>(null);
  const refs = useRef<Record<string, EntertmTabHandle | null>>({});
  const bind = (key: string) => (h: EntertmTabHandle | null) => { refs.current[key] = h; };
  const cond = useRef({ year, month, cardRealUserType, realUser });
  cond.current = { year, month, cardRealUserType, realUser };

  // getMonth() L447-479: "전체"는 12월
  const getMonth = () => (cond.current.month === ALL ? '12' : cond.current.month);
  const validYear = () => /^\d{4}$/.test(cond.current.year.trim());

  // apprChk() L386-435: 서비스 biz.Biz05_RelateAppr.selectByDataYm(companyId, yyyy + "." + 월, linkCode A36) — 한 건이면 그 상태(없으면 미상신, 40 반려면 [상신] 다시 가능), 아니면 미상신
  const apprChk = useCallback(async () => {
    if (!validYear()) return;
    try {
      const r = await bizRelateApprApi.getByDataYm(`${cond.current.year.trim()}.${getMonth()}`, LINK_CODE);
      if (!r || r.statusCode == null) setAppr(NOT_SUBMITTED);
      else if (r.statusCode === '40') setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: true, viewEnabled: true });
      else setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: false, viewEnabled: true });
    } catch (err) {
      message.error(errorMessage(err, '상신 상태 조회 실패'));
    }
  }, []);

  // retrieveTabpage() L270-286: 활성 탭의 retrieve({year, closeDate, cardRealUserType}) → apprChk()
  //   cardRealUserType = 회사가 실사용자 관리를 쓰면 콤보 값, 아니면 "관리자"
  const retrieveTabpage = (key = activeKey) => {
    if (!validYear()) {
      message.warning('기준년월을 확인해주세요');
      return;
    }
    const c = cond.current;
    void refs.current[key]?.retrieve({ year: c.year.trim(), month: c.month, cardRealUserType: c.realUser ? c.cardRealUserType : '관리자' });
    void apprChk();
  };

  // [E1] tabPanel.Selection [arg0 != null] (L84) → retrieveTabpage(). 처음 여는 탭은 마운트한 뒤 조회한다
  const onTabChange = (key: string) => {
    setActiveKey(key);
    if (opened.includes(key)) retrieveTabpage(key);
    else {
      setOpened(prev => [...prev, key]);
      setTimeout(() => retrieveTabpage(key));
    }
  };

  // defaultName() L300-320: 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, "A36") — 한 건이면 그 분류, 아니면 안내 문구 → apprChk()
  // [E0] 화면 열림 (생성자 L81-173) → settings(), defaultName()
  useEffect(() => {
    bizCardManagementApi.getCardRealUser().then(setRealUser).catch(() => undefined);
    bizPromoApi.getDocClass(LINK_CODE)
      .then(d => {
        const model = d ? { classTreeId: d.classTreeId, classTreeFullName: d.classTreeFullName } : null;
        setDefaultDoc(model);
        setClassTree(model);
      })
      .catch(() => undefined)
      .finally(() => { void apprChk(); });
  }, [apprChk]);

  // [E4] rdDownloadButton[출력/다운로드].Select (L200) → getCloseDate() L437-445: RDViewer.viewer(mrd Biz01_Rd_EntertmExpenseReport · options "/rhtmlimportopt [2]"
  //   · rv companyId·personId(서버가 채움)·year·closeDate(고른 달 말일, 전체는 12월)·cardRealUserType) — 출력 자료 테이블 없이 rv만 넘긴다
  const rdDownload = async () => {
    if (!validYear()) {
      message.warning('기준년월을 확인해주세요');
      return;
    }
    const c = cond.current;
    const closeDate = dayjs(`${c.year.trim()}-${getMonth()}-01`).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD');
    try {
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Biz01_Rd_EntertmExpenseReport',
        options: '/rhtmlimportopt [2]',
        rv: { year: c.year.trim(), closeDate, cardRealUserType: c.realUser ? c.cardRealUserType : '관리자' },
      });
      setRd({ url: res.url });
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E6] apprButton[상신].Select (L235) → insertLinkApproval() L322-366: 문서분류가 없으면 "문서분류를 선택해주세요." / 월이 "전체"면 "상신할 월을 선택하여 주세요."
  //   → 확인(400) "yyyy년 n월 상신을 진행하시겠습니까?" → [E8] msgBox.DialogHide [YES] (L339) → Apr01_Edit_ApprDoc.insertLinkApproval(분류, "A36", 출력 자료(년·월), …)
  //   → updateApprId() L368-384 (biz.Biz05_RelateAppr.insert, "정상적으로 상신이 완료되었습니다") — 전자결재 편집창은 다음 단계
  const insertLinkApproval = () => {
    if (classTree?.classTreeId == null) {
      message.warning('문서분류를 선택해주세요.');
      return;
    }
    if (cond.current.month === ALL) {
      message.warning('상신할 월을 선택하여 주세요.');
      return;
    }
    const label = MONTH_OPTIONS.find(o => o.value === cond.current.month)?.label ?? '';
    Modal.confirm({
      title: '확인',
      content: `${cond.current.year}년 ${label} 상신을 진행하시겠습니까?`,
      width: 400,
      okText: '예',
      cancelText: '아니오',
      onOk: () => { message.info('전자결재 작성 창은 다음 단계에서 연결됩니다'); },
    });
  };

  // [E7] apprViewButton[문서보기].Select (L242) → 서비스 apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(…, callback → apprChk()) — 전자결재 편집창은 다음 단계
  const apprView = () => { message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다'); };

  const docText = classTree?.classTreeFullName ?? '';
  const docPlaceholder = defaultDoc?.classTreeFullName ?? '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';

  const page = (key: string): React.ReactNode => {
    switch (key) {
      case 'month': return <Biz01_TabPage_MonthEntertmExpense ref={bind(key)} />;
      case 'history': return <Biz01_TabPage_EntertmExpenseHistory ref={bind(key)} />;
      case 'company': return <Biz02_TabPage_CompanyEntertmExpense ref={bind(key)} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ boxSizing: 'border-box', padding: 10, flex: 'none' }}>
        {/* [E3] retrieveButton[조회].Select (L193) · [E2] yyyyText.KeyPress [Enter] (L184) → retrieveTabpage() */}
        <SearchBar
          onSearch={() => retrieveTabpage()}
          extra={
            // [E4] rdDownloadButton[출력/다운로드].Select (L200)
            <Button type="download" onClick={rdDownload}>출력/다운로드</Button>
          }
        >
          <SearchBar.Field label="기준년월">
            <SearchBar.Input style={{ width: 70 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
            <Select<string> style={{ width: 80, marginLeft: 8 }} value={month} onChange={setMonth} options={MONTH_OPTIONS} />
            {realUser && (
              <Select<string> style={{ width: 100, marginLeft: 8 }} value={cardRealUserType} onChange={setCardRealUserType}
                options={[{ value: '관리자', label: '관리자' }, { value: '실사용자', label: '실사용자' }]} />
            )}
          </SearchBar.Field>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0, boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column' }}>
        <PageTabs
          activeKey={activeKey}
          onChange={onTabChange}
          items={TABS.map(t => ({ key: t.key, label: t.label }))}
          style={{ flex: 'none' }}
          tabBarStyle={{ marginBottom: 0 }}
        />
        <div style={{ flex: 1, minHeight: 0, border: '1px solid #d9d9d9', borderTop: 0 }}>
          {TABS.map(t => (opened.includes(t.key) || t.key === activeKey) && (
            <div key={t.key} style={{ height: '100%', display: t.key === activeKey ? 'block' : 'none' }}>{page(t.key)}</div>
          ))}
        </div>
      </div>
      {/* [E5] classTreeFullName[문서분류].TriggerClick (L228) → openLookupDoc() L289-298: Dcr30_Move_DcrClass.open(callback) → 고른 분류를 칸에 넣는다 */}
      <div style={{ flex: 'none', height: 70, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', border: '1px solid #d9d9d9', background: '#fff' }}>
        <span style={{ fontWeight: 'bold' }}>문서분류</span>
        <LookupInput value={docText} placeholder={docPlaceholder} width={500} onOpen={() => setDocOpen(true)} />
        <span style={{ fontWeight: 'bold' }}>상신상태</span>
        <Input style={{ width: 150 }} readOnly value={appr.name} />
        <Button type="register" disabled={!appr.apprEnabled} onClick={insertLinkApproval}>상신</Button>
        <Button type="search" disabled={!appr.viewEnabled} onClick={apprView}>문서보기</Button>
      </div>
      <Dcr30_Move_DcrClass open={docOpen} onResult={r => { setDocOpen(false); setClassTree(r); }} onClose={() => setDocOpen(false)} />
      <RdViewer url={rd?.url ?? null} title="접대비 현황" onClose={() => setRd(null)} />
    </div>
  );
};
