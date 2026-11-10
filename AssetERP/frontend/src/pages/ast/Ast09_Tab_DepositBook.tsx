/**
 * [1473] 고유자산 > 40. 예금관리 > 예금잔고대사 (W21) — 같은 클래스: 관리회계 > 20. 결산 > 예금잔고대사 #1159 (X11)
 * AS-IS: myApp/client/vi/ast/Ast09_Tab_DepositBook.java (556줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L94-146: BorderLayout 가운데(여백 20) = 툴바 50(보유일자 100 · 검색 200 "구분/계좌" · [조회][잔고입력(대사용)][예금잔고정리]) + 그리드(SingleGrid, 행번호, 맨 아래 합계 행),
 *   아래 70 테두리 칸(문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120)
 * 그리드 L228-259: 보유일자 100 · 구분 100 · 계좌 350 · 통화 70 · 통화기준 전일잔액 150 · 통화기준 잔액 150 · 원화 잔액 150 · 환산손익 120 · 실제잔고 150(빨강) · 차이금액 120(빨강) · 계정별원장 60(아이콘), getSumGrid("계",2,6,8)
 * 상신(링크코드 A39): 보유일자를 말일로 조회한 뒤에만 가능, 제목·본문은 서버가 만든다(`GET apr/apprs/link-seed`, args.stdDate·searchText). 계정별원장 아이콘은 메뉴 1150(`Act02_Tab_JournalSub`, X17)을 열고 TempData로 행을 넘긴다.
 * 스타일: SG (견본 — docs/page-style.md). 그리드 아래 폼 줄(문서분류·상신상태·[상신][문서보기])은 SG 규칙대로 테두리 없이 같은 안쪽 div에 flex none 70.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건 2개라 없음
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AstDepositDiff } from '@/types/ast';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { SearchBar } from '@/components/search';
import { TempData, openMenuByNo } from '@/utils/tempData';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Ast12_Lookup_RealDeposit } from './Ast12_Lookup_RealDeposit';

const gb = gbFor<AstDepositDiff>();
const LINK_CODE = 'A39';   // 예금잔고대사
const FORMAT = 'YYYY-MM-DD';

/** 상신 상태 (retrieveApprStep() L284-334) */
interface ApprState {
  code: string;
  name: string;
  apprId: number | null;
  apprEnabled: boolean;
  viewEnabled: boolean;
}
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };
/** 생성자 직후(조회 전) — 상신상태 빈 칸, [상신]·[문서보기] 켜짐(AS-IS 단추 기본값) */
const INITIAL_APPR: ApprState = { code: '', name: '', apprId: null, apprEnabled: true, viewEnabled: true };

export const Ast09_Tab_DepositBook: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstDepositDiff>>(null);
  // settings() L148-226: 보유일자 = 오늘, 검색 빈칸 "구분/계좌"
  const [holdDate, setHoldDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const cond = useRef({ holdDate, searchText });
  cond.current = { holdDate, searchText };

  const [rows, setRows] = useState<AstDepositDiff[]>([]);
  const [loading, setLoading] = useState(false);
  const [realOpen, setRealOpen] = useState(false);
  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(INITIAL_APPR);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; relateApprId: number; stdDate: string; searchText: string } | null>(null);

  // retrieveApprStep() L284-334: ast.Ast80_RelateAppr.selectByCompanyId(companyId, date = 첫 행의 보유일자, linkCode A39) — 한 건이 아니거나 상태가 없으면 미상신(상신 가능),
  //   상태 40(반려)이면 [상신]·[문서보기] 둘 다 가능, 그 밖의 상태는 [상신] 불가·[문서보기]만 가능
  const retrieveApprStep = useCallback(async (date: string) => {
    setAppr(a => ({ ...a, name: '' }));
    try {
      const r = await astApi.getRelateAppr(date, LINK_CODE);
      if (!r || r.statusCode == null) setAppr(NOT_SUBMITTED);
      else if (r.statusCode === '40') setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: true, viewEnabled: true });
      else setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: false, viewEnabled: true });
    } catch (err) {
      message.error(errorMessage(err, '상신 상태 조회 실패'));
    }
  }, []);

  // retrieve() L261-282: ast.Ast09_Book.selectByHoldDate(companyId, holdDate, astType "1", depositDiffYn true, searchText = %글자%) → 첫 행을 고르고 retrieveApprStep()
  const retrieve = useCallback(async () => {
    const { holdDate: d, searchText: t } = cond.current;
    setLoading(true);
    try {
      const list = await astApi.searchDepositDiffs(d.format(FORMAT), t);
      setRows(list);
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true, true), 0);
      // 원본은 첫 행이 없어도 retrieveApprStep()을 부르지만 BookList.get(0)에서 예외가 난다 — 행이 없으면 미상신으로 둔다
      if (list.length > 0) void retrieveApprStep(list[0].holdDate);
      else setAppr(NOT_SUBMITTED);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [retrieveApprStep]);

  // defaultName() L396-416: dcr.Dcr30_Link.selectByLinkCode(companyId, "A39") — 한 건이면 그 분류(칸의 안내 문구로), 아니면 "문서분류가 미지정 상태입니다. 관리자에게 문의해주세요"
  useEffect(() => {
    dcrApi.searchClassTreeByLinkCode(LINK_CODE)
      .then(list => {
        const model = list.length === 1 ? { classTreeId: list[0].classTreeId, classTreeFullName: list[0].classTreeFullName } : null;
        setDefaultDoc(model);
        setClassTree(model);
      })
      .catch(() => undefined);
  }, []);

  // [E0] 화면 열림 (생성자 L94-146) → settings(), retrieve(), defaultName()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E5] depositButton[예금잔고정리].Select (L183) → depositUpdate() L336-377: 확인(400) "잔고정리를 시작하시겠습니까? (정리기간 : 보유일자 ~ 오늘)"
  //   → [E9] msgBox.DialogHide [YES] (L342) → ast.Ast09_Book.createDepositBook(companyId, stdDate = 보유일자) → 성공이면 "예금잔고정리가 정상적으로 처리되었습니다." 뒤 retrieve(), 실패면 서버 메시지
  const depositUpdate = () => {
    Modal.confirm({
      title: '확인',
      content: <>잔고정리를 시작하시겠습니까? <br />(정리기간 : {holdDate.format(FORMAT)} ~ {dayjs().format(FORMAT)})</>,
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        setLoading(true);
        try {
          await astApi.cleanDepositBook(holdDate.format(FORMAT));
          message.info('예금잔고정리가 정상적으로 처리되었습니다.');
          await retrieve();
        } catch (err) {
          setLoading(false);
          Modal.info({ title: '알림', content: errorMessage(err, '예금잔고정리 실패'), okText: '확인' });
        }
      },
    });
  };

  // [E8] classTreeFullName[문서분류].TriggerClick (L220) → openLookupDoc() L385-394: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다
  const onDocResult = (r: Dcr30ClassResult) => {
    setDocOpen(false);
    setClassTree(r);
  };

  // [E6] apprButton[상신].Select (L189) → insertLinkApproval() L418-506:
  //   ① 보유일자가 그 달 말일이 아니면 "보유일자를 말일기준으로 조회 후 상신해주세요"(원본은 첫 행의 보유일자로 검사) ② 분류가 없으면 "문서분류를 선택해주세요."
  //   ③ 상태가 10·20·30·99이면 기존 문서를 열고(selectApprId → retrieveApproval) 아니면 ast.Ast80_RelateAppr.insert(date, "A39") 뒤 Apr01_Edit_ApprDoc.insertLinkApprovals(분류, "A39", 그리드 행들 · FxYn)
  //   → callback → updateApprId(apprId, relateApprId) L509-521 → retrieve()
  const insertLinkApproval = async () => {
    if (rows.length === 0) { message.warning('조회된 내역이 없습니다.'); return; }
    const first = dayjs(rows[0].holdDate);
    if (!first.isSame(first.endOf('month'), 'day')) {
      Modal.info({ title: '알림', content: '보유일자를 말일기준으로 조회 후 상신해주세요', okText: '확인' });
      return;
    }
    if (classTree?.classTreeId == null) {
      Modal.info({ title: '알림', content: '문서분류를 선택해주세요.', okText: '확인' });
      return;
    }
    if (['10', '20', '30', '99'].includes(appr.code) && appr.apprId != null) {
      setViewApprId(appr.apprId);
      return;
    }
    try {
      const relateApprId = await astApi.createRelateAppr(rows[0].holdDate, LINK_CODE);
      setLinkDoc({ classTreeId: classTree.classTreeId, relateApprId, stdDate: rows[0].holdDate, searchText });
    } catch (err) {
      message.error(errorMessage(err, '상신 준비 실패'));
    }
  };

  // updateApprId(apprId, relateApprId) L509-521: ast.Ast80_RelateAppr.updateApprId(relateApprId, apprId) → 목록을 다시 읽는다
  const updateApprId = async (apprId: number) => {
    if (!linkDoc) return;
    try {
      await astApi.updateRelateApprId(linkDoc.relateApprId, apprId);
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 기록하지 못했습니다'));
    }
    void retrieve();
  };

  // [E7] apprViewButton[문서보기].Select (L195) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → retrieveApprStep())
  const apprView = () => { if (appr.apprId != null) setViewApprId(appr.apprId); };

  // 계정별원장 아이콘 (buildGrid L228-259): MenuOpener.openTabCallback(MenuGrid.tabPanel, "1150") → Act02_Tab_JournalSub.retrieveCall(고른 행)
  const openJournalSub = (row: AstDepositDiff) => {
    if (!openMenuByNo('1150')) { message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.'); return; }
    TempData.publish('act.journalSub', row);
  };

  // buildGrid() L228-259
  const columnDefs = useMemo(() => [
    gb.date('holdDate', 100, '보유일자'),  // L243
    gb.textCenter('astSClassName', 100, '구분'),  // L244
    gb.text('keepCorpAccountName', 350, '계좌'),  // L245
    gb.textCenter('curCode', 70, '통화'),  // L246
    gb.double('preDayAmt', 150, '통화기준 전일잔액'),  // L247
    gb.double('forBookAmt', 150, '통화기준 잔액'),  // L248
    gb.long('bookAmt', 150, '원화 잔액'),  // L249
    gb.long('fxPl', 120, '환산손익'),  // L250
    gb.double('realAmt', 150, '실제잔고', { cellStyle: { color: '#DD5E5E' } }),  // L251 (글자색 DD5E5E)
    gb.double('diffAmt', 120, '차이금액', { cellStyle: { color: '#DD5E5E' } }),  // L252 (글자색 DD5E5E)
    iconCell<AstDepositDiff>('view', 'ledgerAction', 60, '계정별원장', openJournalSub),  // L253
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L171) → retrieve(), [E1] searchText.KeyPress [Enter] (L155) → retrieve(), [E2] holdDate.ValueChange (L164) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          loading={loading}
          extra={(
            <>
              {/* [E4] insertButton[잔고입력(대사용)].Select (L177) → lookupRealDeposit() L379-382: Ast12_Lookup_RealDeposit.open(보유일자) */}
              <Button type="register" onClick={() => setRealOpen(true)}>잔고입력(대사용)</Button>
              <Button type="view" onClick={depositUpdate}>예금잔고정리</Button>
            </>
          )}
        >
          <SearchBar.Field label="보유일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={holdDate} format={FORMAT}
              onChange={d => { if (d) { setHoldDate(d); cond.current = { ...cond.current, holdDate: d }; void retrieve(); } }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="구분/계좌" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstDepositDiff>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.bookId)}
            sumRow={{ labelField: 'astSClassName', label: '계', sum: ['forBookAmt', 'bookAmt', 'fxPl'] }}
          />
        </div>
        <div style={{ height: 70, flex: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 'bold' }}>문서분류</span>
          <LookupInput value={classTree?.classTreeFullName ?? ''} placeholder={defaultDoc?.classTreeFullName ?? '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요'} width={800} onOpen={() => setDocOpen(true)} />
          <span style={{ fontWeight: 'bold' }}>상신상태</span>
          <Input style={{ width: 160 }} readOnly value={appr.name} />
          <Button type="register" disabled={!appr.apprEnabled} onClick={insertLinkApproval}>상신</Button>
          <Button type="search" disabled={!appr.viewEnabled} onClick={apprView}>문서보기</Button>
        </div>
      </div>
      <Ast12_Lookup_RealDeposit open={realOpen} stdDate={holdDate.format(FORMAT)} onClose={() => { setRealOpen(false); void retrieve(); }} />
      <Dcr30_Move_DcrClass open={docOpen} authCheck defaultClassTreeId={defaultDoc?.classTreeId ?? null} onResult={onDocResult} onClose={() => setDocOpen(false)} />
      {/* insertLinkApproval() / apprView(): Apr01_Edit_ApprDoc — 결재창을 닫으면 retrieve() */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? { classTreeId: linkDoc.classTreeId, linkCode: LINK_CODE, refId: null, args: { stdDate: linkDoc.stdDate, searchText: linkDoc.searchText } } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </div>
  );
};
