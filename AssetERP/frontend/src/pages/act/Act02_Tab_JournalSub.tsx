/**
 * [1150] 관리회계 > 21. 회계장부 > 계정별원장 (X17)
 * AS-IS: myApp/client/vi/act/Act02_Tab_JournalSub.java (686줄) + Act01_Lookup_AccountTree (pages/act, 새로 만듦) + Act80_Lookup_RelateAppr (pages/act)
 *   + Ast01_Lookup_CorpAccount (pages/ast) + Ast05_Lookup_TrCode·Sys15_Lookup_Corp (components/lookup) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L95-149: 가운데(여백 20, 테두리) = 툴바 두 줄(조회기간 100~100 · 거래처 · 거래유형 200 · 관리계좌 250 · [조회][엑셀다운로드] /
 *   계정코드 461 "선택해주세요" · 검색 530 "계정과목/거래유형/적요/거래처" · [전체출력/다운로드]) + 원장 그리드(행번호 + 11열 + [연관문서], 합계 행 "계"). 열 때는 조회하지 않는다
 * 받는 화면: Ast09_Tab_DepositBookPeriod의 [계정별원장] 아이콘이 TempData 'act.journalSub'로 고른 행을 보낸다 — retrieveCall() L566-625
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 툴바가 두 줄이라 SearchPanel(R03). 원본의 바깥 테두리(vlc.setBorders)는 SG 규칙대로 두지 않는다
 * UX보강(10): 툴바 = SearchPanel(UX-01)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstBookPeriod, AstCorpAccount, TrCode } from '@/types/ast';
import { AccountCodeTree, JournalSub } from '@/types/act';
import { Corp } from '@/types/sys';
import { TempData } from '@/utils/tempData';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchPanel } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Ast05_Lookup_TrCode } from '@/components/lookup/Ast05_Lookup_TrCode';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Ast01_Lookup_CorpAccount } from '@/pages/ast/Ast01_Lookup_CorpAccount';
import { Act01_Lookup_AccountTree } from './Act01_Lookup_AccountTree';
import { Act80_Lookup_RelateAppr, ActRelateApprTarget } from './Act80_Lookup_RelateAppr';

const gb = gbFor<JournalSub>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
const WINDOW_CLASS_NAME = 'Act02_Tab_JournalSub';
const SUM_ROW = { labelField: 'journalNoStr', label: '계', sum: ['drAmt', 'crAmt'] };

export const Act02_Tab_JournalSub: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<JournalSub>>(null);
  // [E0] 화면 열림 (생성자 L95-149) → settings() L151-411: 조회기간 = 오늘 ~ 오늘, 계정코드 "선택해주세요", 거래처·거래유형·관리계좌 "전체"
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [corp, setCorp] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [tr, setTr] = useState<{ code: string | null; name: string }>({ code: null, name: '' });
  const [deposit, setDeposit] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [account, setAccount] = useState<{ code: string | null; name: string; text: string }>({ code: null, name: '', text: '' });
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<JournalSub[]>([]);
  const [loading, setLoading] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [trOpen, setTrOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const [relateTarget, setRelateTarget] = useState<ActRelateApprTarget | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  /** retrieve()·lookupRd()가 읽는 조건 */
  const condRef = useRef({ startDate, closeDate, corp, tr, deposit, account, searchText });
  condRef.current = { startDate, closeDate, corp, tr, deposit, account, searchText };

  const selectFirst = (list: JournalSub[]) => {
    if (list[0]) setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].journalDtlId))?.setSelected(true), 0);
  };

  // retrieve() L521-564: 계정코드가 없으면 "계정코드를 선택해주세요" → act.Act03_JournalDtl.selectByAccountCode(companyId, startDate, closeDate, 계정코드, 거래유형("%"), 거래처ID("%"), 관리계좌ID("%"), "%검색어%") → 첫 행 선택
  const retrieve = async () => {
    const c = condRef.current;
    if (c.account.code == null) { message.info('계정코드를 선택해주세요'); return; }
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await actApi.searchJournalSubs({
        startDate: c.startDate.format(FORMAT), closeDate: c.closeDate.format(FORMAT), accountCode: c.account.code,
        trCode: c.tr.code, corpId: c.corp.id, depositId: c.deposit.id, searchText: c.searchText,
      });
      setRows(list);
      selectFirst(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // retrieveCall(bookModel) L566-625: 예금원장(기간) 화면에서 넘어온 행 — 조회기간 = 그 달 1일 ~ 보유일자, 관리계좌 = 그 행의 계좌.
  //   act.Act13_RealAccountMap.selectByAstClassTreeId(classTreeId = keepAccountId)로 실계정을 찾으면 계정코드 칸을 채우고(거래유형·거래처는 "%"로, 검색어는 지금 칸의 글자로) 조회한다. 실계정이 없으면 아무 것도 안 한다
  useEffect(() => TempData.subscribe<AstBookPeriod>('act.journalSub', async book => {
    const start = dayjs(book.holdDate).startOf('month');
    const close = dayjs(book.holdDate);
    setStartDate(start);
    setCloseDate(close);
    setDeposit({ id: book.keepAccountId, name: book.keepCorpAccountName ?? '' });
    if (book.keepAccountId == null) return;
    setLoading(true);
    try {
      const real = await actApi.getJournalRealAccount(book.keepAccountId);
      if (!real || !real.accountCode) return;
      setAccount({ code: real.accountCode, name: real.accountName ?? '', text: real.realAccountName ?? '' });
      const list = await actApi.searchJournalSubs({
        startDate: start.format(FORMAT), closeDate: close.format(FORMAT), accountCode: real.accountCode,
        trCode: null, corpId: null, depositId: book.keepAccountId, searchText: condRef.current.searchText,
      });
      setRows(list);
      selectFirst(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }), []);

  // [E1] accountCodeField.TriggerClick (L162) / [E2] ValueChange (L168) → lookupAccountCode() L643-659: Act01_Lookup_AccountTree.open: 고르면 "계정코드 계정과목", 아무것도 안 고르면 비운다
  const onAccountResult = (a: AccountCodeTree | null) => {
    setAccount(a ? { code: a.accountCode, name: a.accountName, text: `${a.accountCode} ${a.accountName}` } : { code: null, name: '', text: '' });
    setAccountOpen(false);
  };
  // [E3] trLookupField.TriggerClick (L198) / [E4] ValueChange (L204) → lookupTrCode() L627-641: Ast05_Lookup_TrCode.open("view","1",null,…): 고르면 거래유형, [전체]면 비운다
  const onTrResult = (t: TrCode | null) => {
    setTr(t ? { code: t.trCode ?? null, name: t.trName ?? '' } : { code: null, name: '' });
    setTrOpen(false);
  };
  // [E5] corpLookupField.TriggerClick (L237) / [E6] ValueChange (L243) → lookupCorp() L661-675: Sys15_Lookup_Corp.openSearch(…, true)
  const onCorpResult = (c: Corp | null) => {
    setCorp(c ? { id: c.corpId, name: c.corpName ?? '' } : { id: null, name: '' });
    setCorpOpen(false);
  };
  // [E7] depositName.TriggerClick [result != null] (L284) → Ast01_Lookup_CorpAccount.open(조회기간 시작일): 고르면 계좌 ID·이름, [전체]면 ID를 비우고 "전체"
  const onDepositResult = (a: AstCorpAccount | null) => {
    setDeposit(a ? { id: a.classTreeId, name: a.corpAccountName ?? '' } : { id: null, name: '' });
    setDepositOpen(false);
  };

  // [E11] rdDownLoadButton[전체출력/다운로드].Select (L344): 계정코드가 없으면 "계정코드를 선택해주세요" → sys.Sys99_Print.insertRdJournalSub →
  //   RDViewer(mrd Act02_Rd_JournalSub, rv rdGroupId·companyId·personId·startDate·closeDate·accountNm "계정코드칸 글자")
  const lookupRd = async () => {
    const c = condRef.current;
    if (c.account.code == null) { message.info('계정코드를 선택해주세요'); return; }
    setLoading(true);
    try {
      const groupId = await actApi.insertJournalSubRd({
        windowClassName: WINDOW_CLASS_NAME, startDate: c.startDate.format(FORMAT), closeDate: c.closeDate.format(FORMAT), accountCode: c.account.code,
        trCode: c.tr.code, corpId: c.corp.id, depositId: c.deposit.id, searchText: c.searchText,
      });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Act02_Rd_JournalSub', options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId), startDate: c.startDate.format(FORMAT), closeDate: c.closeDate.format(FORMAT), accountNm: c.account.text },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E12] msgBox.DialogHide [YES] → downloadOneExcel() L447-457(그 계정) / [NO "전체 엑셀다운로드"] → downloadExcel() L459-469(accountCode=none)
  const download = async (accountCode: string | null) => {
    const c = condRef.current;
    setExcelOpen(false);
    try {
      await actApi.downloadJournalSubExcel(c.startDate.format(FORMAT), c.closeDate.format(FORMAT), accountCode);
    } catch (err) {
      message.error(errorMessage(err, '엑셀 다운로드 실패'));
    }
  };
  // [E10] downloadButton[엑셀다운로드].Select (L321): act.Act02_Journal.getAccountCode(startDate, closeDate) → 없으면 "해당 기간에 조회된 데이터가 없습니다", 있으면 downloadCheck()
  const excel = async () => {
    const c = condRef.current;
    try {
      const list = await actApi.searchJournalAccountCodes(c.startDate.format(FORMAT), c.closeDate.format(FORMAT));
      if (list.length === 0) { message.info('해당 기간에 조회된 데이터가 없습니다'); return; }
      if (c.account.code != null) setExcelOpen(true);   // downloadCheck() L413-445: 계정이 있으면 확인창
      else await download(null);                          // 없으면 곧바로 전체
    } catch (err) {
      message.error(errorMessage(err, '엑셀 다운로드 실패'));
    }
  };

  // buildGrid() L471-519: 분개일자 100 · 분개번호 85 · 계정과목 200 · 거래유형 200 · 적요 300 · 거래처 200 · 차변금액 150 · 대변금액 150 · 잔액 150 · 관리계좌 150 · 전표적요 200 · 연관문서 60, 합계 행 "계"(차변·대변)
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '분개일자'),  // L501
    gb.textCenter('journalNoStr', 85, '분개번호'),  // L502
    gb.textArea('accountName', 200, '계정과목'),  // L503
    gb.textArea('trName', 200, '거래유형'),  // L504
    gb.textArea('note', 300, '적요'),  // L505
    gb.textArea('corpName', 200, '거래처'),  // L506
    gb.long('drAmt', 150, '차변금액'),  // L507
    gb.long('crAmt', 150, '대변금액'),  // L508
    gb.long('balAmt', 150, '잔액'),  // L509
    gb.text('drAstName', 150, '관리계좌'),  // L510
    gb.text('drNote', 200, '전표적요'),  // L511
    // L512 addCell(ImageCell "View") → Act80_Lookup_RelateAppr.open(제목, "journalId", journalId): 제목 = 일자 + " 거래처" + " 적요". 전월이월 줄(journalId 0)은 연관문서가 없다
    iconCell<JournalSub>('view', 'viewAction', 60, '연관문서', row => {
      if (!row.journalId) return;
      setRelateTarget({
        title: `${row.date}${row.corpName ? ' ' + row.corpName : ''}${row.note ? ' ' + row.note : ''}`,
        code: 'journalId', relateId: row.journalId,
      });
    }),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E9] retrieveButton[조회].Select (L315) / [E8] searchText.KeyPress [Enter] (L306) → retrieve() */}
        <SearchPanel onSearch={retrieve} loading={loading} fieldsWidth={1200}>
          <SearchPanel.Row>
            <SearchPanel.Field label="조회기간">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                ~
                <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
              </span>
            </SearchPanel.Field>
            <SearchPanel.Field label="거래처">
              <LookupInput value={corp.name} width={200} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
            </SearchPanel.Field>
            <SearchPanel.Field label="거래유형">
              <LookupInput value={tr.name} width={200} placeholder={ALL_LABEL} onOpen={() => setTrOpen(true)} onClear={() => onTrResult(null)} />
            </SearchPanel.Field>
            <SearchPanel.Field label="관리계좌">
              <LookupInput value={deposit.name} width={250} placeholder={ALL_LABEL} onOpen={() => setDepositOpen(true)} onClear={() => onDepositResult(null)} />
            </SearchPanel.Field>
          </SearchPanel.Row>
          <SearchPanel.Row>
            <SearchPanel.Field label="계정코드">
              <LookupInput value={account.text} width={461} placeholder="선택해주세요" onOpen={() => setAccountOpen(true)} onClear={() => onAccountResult(null)} />
            </SearchPanel.Field>
            <SearchPanel.Field label="검색">
              <SearchPanel.Input style={{ width: 530 }} placeholder="계정과목/거래유형/적요/거래처" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchPanel.Field>
          </SearchPanel.Row>
          <SearchPanel.Actions>
            <Button type="download" onClick={excel}>엑셀다운로드</Button>
          </SearchPanel.Actions>
          <SearchPanel.Actions>
            <Button type="download" onClick={lookupRd}>전체출력/다운로드</Button>
          </SearchPanel.Actions>
        </SearchPanel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<JournalSub>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.journalDtlId)}
            sumRow={SUM_ROW}
            loading={loading}
          />
        </div>
      </div>
      <Act01_Lookup_AccountTree open={accountOpen} onResult={onAccountResult} onClose={() => setAccountOpen(false)} />
      <Sys15_Lookup_Corp open={corpOpen} empYn onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast05_Lookup_TrCode open={trOpen} mode="view" assetType="1" financeYn={null} onResult={onTrResult} onClose={() => setTrOpen(false)} />
      <Ast01_Lookup_CorpAccount open={depositOpen} stdDate={startDate} onResult={onDepositResult} onClose={() => setDepositOpen(false)} />
      <Act80_Lookup_RelateAppr target={relateTarget} onClose={() => setRelateTarget(null)} />
      <RdViewer url={rdUrl} title="계정별원장" onClose={() => setRdUrl(null)} />
      {/* downloadCheck() L413-445: HtmlMessageBox(400) "[계정과목] 계정의 엑셀을 생성합니다. 진행하시겠습니까?" [확인(YES)][닫기(CLOSE)][전체 엑셀다운로드(NO)] */}
      <Modal open={excelOpen} title="확인" width={400} maskClosable={false} onCancel={() => setExcelOpen(false)}
        footer={<div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button type="save" onClick={() => download(account.code)}>확인</Button>
          <Button type="close" onClick={() => setExcelOpen(false)}>닫기</Button>
          <Button type="download" onClick={() => download(null)}>전체 엑셀다운로드</Button>
        </div>}>
        [{account.name}] 계정의 엑셀을 생성합니다. 진행하시겠습니까?
      </Modal>
    </div>
  );
};
