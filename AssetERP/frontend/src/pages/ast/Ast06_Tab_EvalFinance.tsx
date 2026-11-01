/**
 * [1167] 고유자산 > 20. 고유자산 거래처리 > 금융상품 평가처리 (W09)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_EvalFinance.java (585줄) + Ast06_TabPage_MarketEval.java (121줄) + Ast06_TabPage_InterestEval.java (118줄)
 *   + Ast25_Lookup_Price.java (209줄) + Ast06_Grid_Journal.java (143줄) + Sys15_Lookup_Corp·Ast01_Lookup_CorpAccount·Ast01_Lookup_Info — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L84-106: BorderLayout 위 = 툴바 88(여백 20,20,0,20: 1줄 평가년월 100(회사 평가주기가 'W'면 평가일자) · 보관처 200 "전체" · 보관계좌 250 "전체" · [조회][평가처리][평가취소][시세입력]
 *   / 2줄 종목 370 "전체" · 검색 251 "계좌/종목유형/종목/적요" · [출력/다운로드] · 안내문) + 가운데 TabPanel(시가평가·이자평가, 각각 평가 그리드 60% + 분개 그리드 40%)
 * 스타일: STP (견본 — docs/page-style.md, AS-IS 판별은 GG: 그리드가 탭 클래스 안에 있어 판별기가 GG로 본다). 툴바가 두 줄이라 SearchPanel(R03), 탭은 PageTabs
 * UX보강(10): 툴바 = SearchPanel(UX-01), 조회창 UX-05·06
 * 평가 기준일(getCloseDate L531-541): 평가주기 'W'면 평가일자, 아니면 평가년월의 말일
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstEval, AstEvalItem, AstTrCodeTreeNode } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { SearchPanel } from '@/components/search';
import { PageTabs } from '@/components/tabs/PageTabs';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import { Ast25_Lookup_Price } from './Ast25_Lookup_Price';
import { Ast06_TabPage_MarketEval, Ast06_EvalTabHandle } from './Ast06_TabPage_MarketEval';
import { Ast06_TabPage_InterestEval } from './Ast06_TabPage_InterestEval';

const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';

export const Ast06_Tab_EvalFinance: React.FC = () => {
  const marketRef = useRef<Ast06_EvalTabHandle>(null);
  const interestRef = useRef<Ast06_EvalTabHandle>(null);
  /** 회사 평가주기 — 'W'면 평가일자 칸, 아니면 평가년월 칸. null이면 아직 모름 */
  const [cycle, setCycle] = useState<string | null | undefined>(undefined);
  // setting() L108-370: 평가년월 = 이번 달(yyyy.MM), 평가일자 = 지난달 말일(setEvalDate L543-562), 보관처·보관계좌·종목 = 전체
  const [yyyyMM, setYyyyMM] = useState(() => dayjs().format('YYYY.MM'));
  const [evalDate, setEvalDate] = useState<Dayjs>(() => dayjs().startOf('month').subtract(1, 'day'));
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpName, setCorpName] = useState(ALL_LABEL);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [accountName, setAccountName] = useState(ALL_LABEL);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_LABEL);
  const [searchText, setSearchText] = useState('');
  const [activeKey, setActiveKey] = useState<'market' | 'interest'>('market');
  const [corpOpen, setCorpOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [priceDate, setPriceDate] = useState<string | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** getCloseDate() L531-541 — 평가 기준일. 평가년월이 올바르지 않으면 null */
  const getCloseDate = useCallback((): Dayjs | null => {
    if (cycle === 'W') return evalDate;
    const m = dayjs(yyyyMM.replace(/-/g, '.') + '.01', 'YYYY.MM.DD', true);
    return m.isValid() ? m.endOf('month') : null;
  }, [cycle, evalDate, yyyyMM]);

  const activeTab = () => (activeKey === 'market' ? marketRef.current : interestRef.current);

  // retrieve() L372-383: 현재 탭에 assetType "1"·closeDate·보관처·보관계좌·종목·검색어를 넘긴다
  const retrieve = useCallback(async () => {
    const close = getCloseDate();
    if (!close) { message.warning('평가년월을 확인하세요. (YYYY.MM)'); return; }
    await activeTab()?.retrieve({ closeDate: close.format(FORMAT), corpId, accountId, classTreeId, searchText });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCloseDate, corpId, accountId, classTreeId, searchText, activeKey]);

  // [E0] 화면 열림 (생성자 L84-106) → setting(). 회사 평가주기를 알아야 평가 기준일이 정해진다
  useEffect(() => {
    void (async () => {
      try {
        setCycle(await astApi.getEvalCycle());
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        setCycle(null);
      }
    })();
  }, []);

  // [E6] tabPanel.Selection (L247) → retrieve() — 탭이 처음 만들어질 때와 탭을 바꿀 때
  useEffect(() => {
    if (cycle === undefined) return;
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, activeKey]);

  // [E2] corpName.TriggerClick [result != null] (L131) → Sys15_Lookup_Corp.open(): 고르면 이름·ID, 취소(전체)면 "전체"·null
  const onCorpResult = (corp: Corp | null) => {
    setCorpOpen(false);
    setCorpName(corp ? corp.corpName ?? '' : ALL_LABEL);
    setCorpId(corp ? corp.corpId : null);
  };

  // [E3] corpAccountName.TriggerClick [result != null] (L154) → Ast01_Lookup_CorpAccount.open(getCloseDate(), …)
  const onAccountResult = (acc: { classTreeId: number; corpAccountName: string | null } | null) => {
    setAccountOpen(false);
    setAccountName(acc ? acc.corpAccountName ?? '' : ALL_LABEL);
    setAccountId(acc ? acc.classTreeId : null);
  };

  // [E4] classTreeName.TriggerClick [result != null] (L177) → Ast01_Lookup_Info.select("1", "20", null, …)
  const onInfoResult = (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    setClassTreeName(node ? node.classTreeFullName ?? node.classTreeName : ALL_LABEL);
    setClassTreeId(node ? node.classTreeId : null);
  };

  const toItem = (r: AstEval): AstEvalItem => ({
    trId: r.trId, astClassTreeId: r.astClassTreeId, date: r.date, trCode: r.trCode, evalType: r.evalType, amt: r.amt, forAmt: r.forAmt,
    curCode: r.curCode, note: r.note, trFinanceId: r.trFinanceId, accountId: r.accountId, qty: r.qty, trUnit: r.trUnit,
    bookAmt: r.financeBookAmt, forBookAmt: r.forBookAmt,
  });

  // [E8] updateButton[평가처리].Select [YES] (L260) → getGrid(), update() — 선택 없으면 "선택된 내역이 없습니다." → 확인(440) "N건의 평가처리를 진행하시겠습니까?" → [E9] msgBox.DialogHide [YES] (L272) → update() L385-448
  const updateEval = () => {
    const sel = activeTab()?.getSelected() ?? [];
    if (sel.length === 0) { message.warning('선택된 내역이 없습니다.'); return; }
    Modal.confirm({
      title: '확인', content: `${sel.length}건의 평가처리를 진행하시겠습니까?`, width: 440, okText: '예', cancelText: '아니오',
      onOk: async () => {
        // 첫 선택 행의 평가일이 미래일이면 중단
        if (dayjs(sel[0].date).isAfter(dayjs())) { message.warning('평가일이 미래일입니다.'); return; }
        for (const r of sel) {
          if (r.evalYnName === '평가') { message.warning('선택한 내역 중 평가완료된 내역이 존재합니다.'); return; }
          // 전평가일 또는 최초취득일이 전결산일보다 과거인 경우, 전결산일 평가처리 필요
          if (r.preEvalDate != null && r.preCloseDate != null && dayjs(r.preEvalDate).isBefore(dayjs(r.preCloseDate))) {
            Modal.warning({
              title: '확인', width: 450,
              content: <span>전결산일({r.preCloseDate})의 평가 처리가 누락되었습니다<br />전결산일의 평가 처리 후 진행하세요</span>,
            });
            return;
          }
        }
        // 회계마감 검사(act.Act04_GenLedger.checkClose, 첫 선택 행의 일자)와 평가처리(ast.Ast06_Tr.updateEval "P")는 서버가 한 트랜잭션으로 한다
        activeTab()?.mask(true);   // grid.mask("처리중 입니다")
        try {
          const done = await astApi.processEvals(sel.map(toItem));
          message.success('처리가 완료되었습니다.');
          activeTab()?.updateRows(done);
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        } finally {
          activeTab()?.mask(false);
        }
      },
    });
  };

  // [E10] deleteButton[평가취소].Select [YES] (L289) → getGrid(), delete() — [E11] msgBox.DialogHide [YES] (L301) → delete() L450-490
  const deleteEval = () => {
    const sel = activeTab()?.getSelected() ?? [];
    if (sel.length === 0) { message.warning('선택된 내역이 없습니다.'); return; }
    Modal.confirm({
      title: '확인', content: `${sel.length}건의 평가를 취소하시겠습니까?`, width: 440, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (sel.some(r => r.evalYnName !== '평가')) { message.warning('선택한 내역중 미평가 내역이 존재합니다.'); return; }
        activeTab()?.mask(true);   // grid.mask("취소중 입니다")
        try {
          await astApi.cancelEvals(sel.map(toItem));
          message.success('취소가 완료되었습니다.');
          activeTab()?.mask(false);
          await retrieve();
        } catch (err) {
          activeTab()?.mask(false);
          message.error(errorMessage(err, '취소 실패'));
        }
      },
    });
  };

  // [E12] priceButton[시세입력].Select (L318) → lookupEvalPrice() L509-529: sys.Sys12_Calendar.selectBizDate2(companyId 0, stdDate getCloseDate(), type "-0", chkYn true) → Ast25_Lookup_Price.open(그 영업일)
  const lookupEvalPrice = async () => {
    const close = getCloseDate();
    if (!close) { message.warning('평가년월을 확인하세요. (YYYY.MM)'); return; }
    try {
      setPriceDate(await astApi.getEvalPriceDate(close.format(FORMAT)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E13] downLoadButton[출력/다운로드].Select (L324) → getGrid(), getCloseDate(): sys.Sys99_Print.insertRdEvalFinance(…, evalType 첫 행이 "2"면 "2" 아니면 "1")
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Ast06_Rd_EvalFinance · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId)
  const download = async () => {
    const close = getCloseDate();
    if (!close) { message.warning('평가년월을 확인하세요. (YYYY.MM)'); return; }
    const firstRow = activeTab()?.getFirst();
    if (!firstRow) { message.warning('조회된 내역이 없습니다.'); return; }
    setBusy(true);
    try {
      const groupId = await astApi.rdEval({
        closeDate: close.format(FORMAT), corpId, accountId, classTreeId, searchText, evalType: firstRow.evalType === '2' ? '2' : '1',
      });
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Ast06_Rd_EvalFinance', options: '/rhtmlimportopt [2]', rv: { rdGroupId: String(groupId) } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setBusy(false);
    }
  };

  const weekly = cycle === 'W';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E7] retrieveButton[조회].Select (L254) → retrieve(), [E1] yyyyMM.KeyPress [Enter] (L116) / [E5] searchText.KeyPress [Enter] (L199) → retrieve() */}
      <SearchPanel onSearch={retrieve} loading={busy} fieldsWidth={820}>
        <SearchPanel.Row>
          {weekly ? (
            <SearchPanel.Field label="평가일자">
              <DatePicker style={{ width: 120 }} allowClear={false} value={evalDate} format={FORMAT} onChange={d => d && setEvalDate(d)} />
            </SearchPanel.Field>
          ) : (
            <SearchPanel.Field label="평가년월">
              <Input style={{ width: 100 }} placeholder="YYYY.MM" value={yyyyMM} onChange={e => setYyyyMM(e.target.value)} onPressEnter={() => void retrieve()} />
            </SearchPanel.Field>
          )}
          <SearchPanel.Field label="보관처">
            <LookupInput value={corpName} width={200} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
          </SearchPanel.Field>
          <SearchPanel.Field label="보관계좌">
            <LookupInput value={accountName} width={250} placeholder={ALL_LABEL} onOpen={() => setAccountOpen(true)} onClear={() => onAccountResult(null)} />
          </SearchPanel.Field>
        </SearchPanel.Row>
        <SearchPanel.Row>
          <SearchPanel.Field label="종목">
            <LookupInput value={classTreeName} width={370} placeholder={ALL_LABEL} onOpen={() => setInfoOpen(true)} onClear={() => onInfoResult(null)} />
          </SearchPanel.Field>
          <SearchPanel.Field label="검색">
            <SearchPanel.Input style={{ width: 251 }} placeholder="계좌/종목유형/종목/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchPanel.Field>
        </SearchPanel.Row>
        <SearchPanel.Actions>
          <Button type="save" onClick={updateEval}>평가처리</Button>
          <Button type="cancel" onClick={deleteEval}>평가취소</Button>
          <Button type="register" onClick={() => void lookupEvalPrice()}>시세입력</Button>
        </SearchPanel.Actions>
        <SearchPanel.Actions>
          <Button type="download" onClick={download}>출력/다운로드</Button>
          <span style={{ color: '#4472C4', fontSize: 13, marginLeft: 8 }}>※ 매도제한일이 있는 경우 보유기간은 매도제한일부터 계산됩니다.</span>
        </SearchPanel.Actions>
      </SearchPanel>
      {/* 탭 머리 + 내용(STP 견본: 내용 영역에만 얇은 테두리). 두 탭 모두 마운트해 두고 고른 쪽만 보인다 — 핸들(ref)이 항상 있어야 한다 */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PageTabs
          activeKey={activeKey}
          onChange={k => setActiveKey(k as 'market' | 'interest')}
          items={[{ key: 'market', label: '시가평가' }, { key: 'interest', label: '이자평가' }]}
          style={{ flex: 'none' }}
          tabBarStyle={{ marginBottom: 0 }}
        />
        <div style={{ flex: 1, minHeight: 0, boxSizing: 'border-box', border: '1px solid #d9d9d9', borderTop: 0, padding: 10 }}>
          <div style={{ height: '100%', display: activeKey === 'market' ? 'block' : 'none' }}><Ast06_TabPage_MarketEval ref={marketRef} /></div>
          <div style={{ height: '100%', display: activeKey === 'interest' ? 'block' : 'none' }}><Ast06_TabPage_InterestEval ref={interestRef} /></div>
        </div>
      </div>
      <Sys15_Lookup_Corp open={corpOpen} onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_CorpAccount open={accountOpen} stdDate={getCloseDate() ?? dayjs()} onResult={onAccountResult} onClose={() => setAccountOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" itemLClass="20" withAll onResult={onInfoResult} onClose={() => setInfoOpen(false)} />
      <Ast25_Lookup_Price stdDate={priceDate} onClose={() => setPriceDate(null)} />
      <RdViewer url={rdUrl} title="평가처리" onClose={() => setRdUrl(null)} />
    </div>
  );
};
