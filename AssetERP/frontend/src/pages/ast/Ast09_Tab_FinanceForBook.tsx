/**
 * [1366] 고유자산 > 30. 고유자산 현황 > 금융상품 보유내역(외화) (W13)
 * AS-IS: myApp/client/vi/ast/Ast09_Tab_FinanceForBook.java (441줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC). W12 Ast09_Tab_FinanceBook의 외화판
 * 생성자 L76-114: BorderLayout 가운데(여백 20, 테두리) = 툴바 50(보유일자 100 · 검색 250 "보관처/계좌/종목유형/종목명" · [조회][출력/다운로드]) + 그리드(행번호·단일 선택·16열·맨 아래 합계 "계")
 *   + 아래 70 칸(문서분류 800 · 상신상태 · [상신] · [문서보기])
 * W12와 다른 점: ① 조회(retrieve L275)만 abroType "2"(통화가 KRW가 아닌 것)를 준다 — 출력(L142)·상신 합계(L311)는 abroType 없이 W12와 같은 전체 목록이다(원본 이상한점 #132)
 *   ② 그리드: 통화·외화 취득/장부금액(파란 헤더)·원화 금액, 타인경과이자·확약기간·매도제한 열 없음, 합계 열 10·11·12·13·14·16 ③ 링크코드 A03(본문은 A30과 같다)
 *   ④ 출력은 windowClassName "Ast09_Tab_FinanceBook"·mrd Ast09_Rd_FinanceBook 그대로(원본 복사 흔적) — W12 화면과 임시 자료 행을 같이 쓴다
 * 전자결재 편집창 Apr01_Edit_ApprDoc은 W12와 같은 방식으로 연결: [상신](링크코드 A03, 제목·본문은 서버가 만든다 `GET apr/apprs/link-seed`), [문서보기]. RD 출력은 `rdApi`로 주소를 받아 `RdViewer`.
 * 스타일: SG (견본 — docs/page-style.md). 그리드 아래 폼 줄(문서분류·상신상태·[상신][문서보기])은 테두리 없이 같은 안쪽 div에 flex none 높이 70
 * UX보강(10): 툴바 = SearchBar(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { dcrApi } from '@/api/dcr';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstFinanceBook } from '@/types/ast';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<AstFinanceBook>();
const FORMAT = 'YYYY-MM-DD';
/** setHtmlGridStyle 파랑 — 외화 금액 열 머리글(원본 "456EA6") */
const BLUE = { color: '#456EA6', fontWeight: 'bold' };
/** AS-IS 링크코드 A03 = 금융상품 보유내역(외화) */
const LINK_CODE = 'A03';

/** 상신 상태 (retrieveApprStep() L383-432) */
interface ApprState { code: string; name: string; apprId: number | null; apprEnabled: boolean; viewEnabled: boolean }
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };
/** 생성자 직후(조회 전) — 상신상태 빈 칸 */
const INITIAL_APPR: ApprState = { code: '', name: '', apprId: null, apprEnabled: true, viewEnabled: false };

export const Ast09_Tab_FinanceForBook: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstFinanceBook>>(null);
  // settings() L116-130: 보유일자 100 = 오늘, 검색 250 "보관처/계좌/종목유형/종목명"
  const [holdDate, setHoldDate] = useState<Dayjs>(() => dayjs());
  const holdDateRef = useRef(holdDate);
  holdDateRef.current = holdDate;
  const [searchText, setSearchText] = useState('');
  const searchTextRef = useRef('');
  searchTextRef.current = searchText;
  const [rows, setRows] = useState<AstFinanceBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);

  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(INITIAL_APPR);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; relateApprId: number; stdDate: string } | null>(null);

  // retrieveApprStep() L383-432: ast.Ast80_RelateAppr.selectByCompanyId(companyId, date = 보유일자, linkCode A03) — 한 건이 아니거나 상태가 없으면 미상신(상신 가능),
  //   상태 40(반려)이면 [상신]·[문서보기] 둘 다 가능, 그 밖의 상태는 [상신] 불가·[문서보기]만 가능
  const retrieveApprStep = useCallback(async (date: Dayjs) => {
    setAppr(a => ({ ...a, name: '' }));
    try {
      const r = await astApi.getRelateAppr(date.format(FORMAT), LINK_CODE);
      if (!r || r.statusCode == null) setAppr(NOT_SUBMITTED);
      else if (r.statusCode === '40') setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: true, viewEnabled: true });
      else setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: false, viewEnabled: true });
    } catch (err) {
      message.error(errorMessage(err, '상신 상태 조회 실패'));
    }
  }, []);

  // retrieve() L275-297: ast.Ast09_Book.selectByHoldDate(companyId, holdDate, astType "2", abroType "2", searchText "%…%") → 첫 행 선택 → defaultName(), retrieveApprStep()
  const retrieve = useCallback(async (date?: Dayjs) => {
    const d = date ?? holdDateRef.current;
    setLoading(true);
    try {
      const list = await astApi.searchFinanceBooks(d.format(FORMAT), searchTextRef.current, '2');
      setRows(list);
      setAfterLoad(n => n + 1);
      void defaultName();
      void retrieveApprStep(d);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [retrieveApprStep]);

  // 목록이 바뀐 뒤 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(String(rows[0].bookId))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // defaultName() L215-235: dcr.Dcr30_Link.selectByLinkCode(companyId, "A03") — 한 건이면 그 분류(칸의 안내 문구로), 아니면 "문서분류가 미지정 상태입니다. 관리자에게 문의해주세요"
  const defaultName = async () => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      const model = list.length === 1 ? { classTreeId: list[0].classTreeId, classTreeFullName: list[0].classTreeFullName } : null;
      setDefaultDoc(model);
      setClassTree(model);
    } catch {
      /* AS-IS는 오류를 읽지 않는다 */
    }
  };

  // [E0] 화면 열림 (생성자 L76-114) → settings(), defaultName(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] downLoadButton[출력/다운로드].Select (L138, abroType 없음) → sys.Sys99_Print.insertRdFinanceBook(companyId, personId, "Ast09_Tab_FinanceBook", holdDate, astType "2", searchText "%…%")
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Ast09_Rd_FinanceBook · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId)
  const downLoad = async () => {
    try {
      const groupId = await astApi.rdFinanceBook(holdDate.format(FORMAT), searchText);
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Ast09_Rd_FinanceBook', options: '/rhtmlimportopt [2]', rv: { rdGroupId: String(groupId) } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E4] classTreeFullName[문서분류].TriggerClick (L176) → openLookupDoc(): Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다
  const onDocResult = (r: Dcr30ClassResult) => { setDocOpen(false); setClassTree(r); };

  // [E5] apprButton[상신].Select (L182) → getHoldDate() L310-329: ast.Ast09_Book.getHoldDate(companyId, holdDate, astType "2") — 없으면 "상신할 금융상품 보유내역 내용이 없습니다"
  //   → insertLinkApprovals() L331-365: 분류가 없으면 "문서분류를 선택해주세요." → ast.Ast80_RelateAppr.insert(companyId, date = 보유일자, "A03")
  //   → Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A03", 목록, isAdmin, callback → updateApprId(apprId, relateApprId) L368-381 → retrieveApprStep())
  const insertLinkApproval = async () => {
    const std = holdDateRef.current.format(FORMAT);
    try {
      const groups = await astApi.searchFinanceGroups(std);
      if (groups.length === 0) { Modal.info({ title: '알림', content: '상신할 금융상품 보유내역 내용이 없습니다', okText: '확인' }); return; }
      if (classTree?.classTreeId == null) { Modal.info({ title: '알림', content: '문서분류를 선택해주세요.', okText: '확인' }); return; }
      const relateApprId = await astApi.createRelateAppr(std, LINK_CODE);
      setLinkDoc({ classTreeId: classTree.classTreeId, relateApprId, stdDate: std });
    } catch (err) {
      message.error(errorMessage(err, '상신 준비 실패'));
    }
  };

  // updateApprId(apprId, relateApprId) L368-381: ast.Ast80_RelateAppr.updateApprId(relateApprId, apprId) → retrieveApprStep()
  const updateApprId = async (apprId: number) => {
    if (!linkDoc) return;
    try {
      await astApi.updateRelateApprId(linkDoc.relateApprId, apprId);
      void retrieveApprStep(dayjs(linkDoc.stdDate));
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 기록하지 못했습니다'));
    }
  };

  // [E6] apprViewButton[문서보기].Select (L188) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → retrieveApprStep())
  const apprView = () => { setViewApprId(appr.apprId); };

  // buildGrid() L237-273 (타인경과이자·확약기간·매도제한 열은 원본에서 주석 처리)
  const columnDefs = useMemo(() => [
    gb.date('holdDate', 90, '보유일자'),                       // L242
    gb.text('keepCorpAccountName', 200, '보관처/계좌'),        // L243
    gb.text('astClassName', 150, '종목유형'),                  // L244
    gb.text('astClassTreeName', 250, '종목명'),                // L245
    gb.text('accountTypeName', 100, '회계구분'),               // L246
    gb.textCenter('curCode', 40, '통화'),                      // L247
    gb.double('holdQty', 100, '보유수량'),                     // L248
    gb.double('forPurAmt', 120, '외화<br>취득금액', { headerStyle: BLUE }),  // L249
    gb.double('forBookAmt', 120, '외화<br>장부금액', { headerStyle: BLUE }), // L250
    gb.long('purAmt', 120, '원화<br>취득금액'),                // L251
    gb.long('bookAmt', 120, '원화<br>장부금액'),               // L252
    gb.long('evalAmt', 120, '원화<br>평가금액'),               // L254
    gb.long('evalPl', 120, '원화<br>평가손익'),                // L255
    gb.long('oci', 120, '원화<br>기타포괄손익'),               // L256
    gb.date('firstPurDate', 90, '최초취득일자'),               // L257
    gb.long('firstPurAmt', 120, '원화<br>최초취득금액'),       // L258
  ], []);

  const docPlaceholder = defaultDoc?.classTreeFullName ?? '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L132) → retrieve(), [E1] searchText.KeyPress [Enter] (L123) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading} extra={<Button type="download" onClick={downLoad}>출력/다운로드</Button>}>
          <SearchBar.Field label="보유일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={holdDate} format={FORMAT} onChange={d => d && setHoldDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="보관처/계좌/종목유형/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstFinanceBook> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.bookId)}
            sumRow={{ labelField: 'keepCorpAccountName', label: '계', sum: ['purAmt', 'bookAmt', 'evalAmt', 'evalPl', 'oci', 'firstPurAmt'] }} />
        </div>
        <div style={{ height: 70, flex: 'none', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 'bold' }}>문서분류</span>
          <LookupInput value={classTree?.classTreeFullName ?? ''} placeholder={docPlaceholder} width={800} onOpen={() => setDocOpen(true)} />
          <span style={{ fontWeight: 'bold' }}>상신상태</span>
          <Input style={{ width: 160 }} readOnly value={appr.name} />
          <Button type="register" disabled={!appr.apprEnabled} onClick={insertLinkApproval}>상신</Button>
          <Button type="search" disabled={!appr.viewEnabled} onClick={apprView}>문서보기</Button>
        </div>
      </div>
      <Dcr30_Move_DcrClass open={docOpen} authCheck defaultClassTreeId={defaultDoc?.classTreeId ?? null} onResult={onDocResult} onClose={() => setDocOpen(false)} />
      <RdViewer url={rdUrl} title="금융상품 보유내역(외화)" onClose={() => setRdUrl(null)} />
      {/* insertLinkApprovals() / apprView(): Apr01_Edit_ApprDoc — 결재창을 닫으면 retrieveApprStep() */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? { classTreeId: linkDoc.classTreeId, linkCode: LINK_CODE, refId: null, args: { stdDate: linkDoc.stdDate } } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieveApprStep(holdDateRef.current)}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </div>
  );
};
