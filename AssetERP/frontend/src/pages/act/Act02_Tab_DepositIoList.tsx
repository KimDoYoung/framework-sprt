/**
 * 일일자금관리 (U01) — 자금관리 > 10. 자금관리 > 일일자금관리 #1164 (같은 클래스: 고유자산 > 40. 예금관리 > 일일자금관리 #1470)
 * AS-IS: myApp/client/vi/act/Act02_Tab_DepositIoList.java (573줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L92-138: BorderLayout 위(여백 20,20,0,20) = 툴바 50(기준일 100 · [조회] · [출력/다운로드] · [예금잔고정리]),
 *   가운데(여백 -2,20,20,20) = 위 가로 3칸(0.3 · 0.35 · 0.35: 왼쪽 = 예금원장 그리드 + 아래 200 통화별 합계 그리드, 가운데 = 입금 그리드, 오른쪽 = 출금 그리드)
 *   + 아래 70 테두리 칸(문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120)
 * 1단계(Biz01_Tab_Card와 같은 사유): [상신]이 여는 전자결재 편집창 Apr01_Edit_ApprDoc(다른 도메인 apr)은 다음 단계 — [상신]은 문서분류 점검까지 하고 편집창 자리에 안내만 띄운다.
 *   AS-IS는 편집창을 열기 전에 ast.Ast80_RelateAppr.insert(기존 연관문서를 지우고 새로 넣음)·sys.Sys99_Print.insertRdDepositIoList를 먼저 부르는데,
 *   편집창이 없으면 지운 연관문서(반려 40 문서 연결)를 되살릴 수 없으므로 그 두 호출은 편집창과 함께 다음 단계에서 한다(API는 만들어 두었다).
 *   [문서보기]도 apr.Apr01_Appr.selectById 뒤 Apr01_Edit_ApprDoc.retrieveApproval(…, callback → retrieveApprStep)이라 안내만 한다.
 *   RD 출력은 `rdApi`로 주소를 받아 `RdViewer`에 띄운다(docs/RD-대책.md).
 * 스타일: 원본 레이아웃(03 원칙 12). yunhee page-style은 GG로 판별하지만 원본은 위아래 분할이 아니라 가로 3칸 + 아래 문서 칸이라 GG 견본을 그대로 쓰지 않았다(결과확인 13).
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { dcrApi } from '@/api/dcr';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstBook, AstBookSum } from '@/types/ast';
import { JournalDtl } from '@/types/act';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { RdViewer } from '@/components/lookup/RdViewer';

const gbBook = gbFor<AstBook>();
const gbSum = gbFor<AstBookSum>();
const gbJournal = gbFor<JournalDtl>();

/** AS-IS 링크코드 A17 = 일일자금관리 */
const LINK_CODE = 'A17';
const FORMAT = 'YYYY-MM-DD';

/** 상신 상태 (retrieveApprStep() L515-564) */
interface ApprState {
  code: string;
  name: string;
  apprId: number | null;
  apprEnabled: boolean;
  viewEnabled: boolean;
}
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };
/** 생성자 직후(조회 전) — [상신]·[문서보기] 모두 disable, 상신상태 빈 칸 */
const INITIAL_APPR: ApprState = { code: '', name: '', apprId: null, apprEnabled: false, viewEnabled: false };

export const Act02_Tab_DepositIoList: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstBook>>(null);
  // settings() L162-177: 기준일 100 = 오늘 -1일
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const stdDateRef = useRef(stdDate);
  stdDateRef.current = stdDate;

  const [rows, setRows] = useState<AstBook[]>([]);
  const [sumRows, setSumRows] = useState<AstBookSum[]>([]);
  const [inRows, setInRows] = useState<JournalDtl[]>([]);
  const [outRows, setOutRows] = useState<JournalDtl[]>([]);
  const [loading, setLoading] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);

  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(INITIAL_APPR);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  // retrieveApprStep() L515-564: 서비스 ast.Ast80_RelateAppr.selectByCompanyId(companyId, date = 기준일, linkCode A17) — 한 건이 아니거나 상태가 없으면 미상신(상신 가능),
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

  // retrieveInOut() L353-383: 고른 행의 holdDate·astClassTreeId로 act.Act03_JournalDtl.selectByAstId — 입금(drCrType D)·출금(C)
  const retrieveInOut = useCallback(async (book: AstBook) => {
    try {
      const [ins, outs] = await Promise.all([
        actApi.searchJournalDtlsByAst(book.holdDate, book.astClassTreeId, 'D'),
        actApi.searchJournalDtlsByAst(book.holdDate, book.astClassTreeId, 'C'),
      ]);
      setInRows(ins);
      setOutRows(outs);
    } catch (err) {
      message.error(errorMessage(err, '입출금 조회 실패'));
    }
  }, []);

  // retrieve() L325-351: ast.Ast09_Book.selectByHoldDate(companyId, holdDate, astType 1, searchText %) → 첫 행이 있으면 첫 행 선택 + retrieveInOut() + retrieveApprStep(),
  //   ast.Ast09_Book.selectDepositCurGroupSum(companyId, holdDate, searchText %) → 합계 그리드
  const retrieve = useCallback(async (date?: Dayjs) => {
    const d = date ?? stdDateRef.current;
    const holdDate = d.format(FORMAT);
    setLoading(true);
    try {
      const [list, sums] = await Promise.all([astApi.searchDeposits(holdDate), astApi.searchDepositCurSums(holdDate)]);
      setRows(list);
      setSumRows(sums);
      setAfterLoad(n => n + 1);
      if (list.length > 0) {
        void retrieveInOut(list[0]);
        void retrieveApprStep(d);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [retrieveInOut, retrieveApprStep]);

  // 목록이 바뀐 뒤 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(String(rows[0].bookId))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // defaultName() L140-160: 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, "A17") — 한 건이면 그 분류(칸의 안내 문구로), 아니면 "문서분류가 미지정 상태입니다"
  useEffect(() => {
    dcrApi.searchClassTreeByLinkCode(LINK_CODE)
      .then(list => {
        const model = list.length === 1 ? { classTreeId: list[0].classTreeId, classTreeFullName: list[0].classTreeFullName } : null;
        setDefaultDoc(model);
        setClassTree(model);
      })
      .catch(() => undefined);
  }, []);

  // [E0] 화면 열림 (생성자 L92-138) → settings(), defaultName(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] rdButton[출력/다운로드].Select (L185) → 서비스 sys.Sys99_Print.insertRdDepositIoList(companyId, personId, "Act02_Tab_DepositIoList", holdDate = 기준일, 목록 = 예금원장 그리드 전체 행)
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Act02_Rd_DepositIoList · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId)
  const downLoad = async () => {
    try {
      const groupId = await actApi.rdPrintDepositIo(rows);
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Act02_Rd_DepositIoList',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E4] depositButton[예금잔고정리].Select (L218) → depositUpdate() L472-513: 확인(400폭) "잔고정리를 시작하시겠습니까? (정리기간 : 기준일 ~ 오늘)"
  //   → [E9] msgBox.DialogHide [YES] (L478) → ast.Ast09_Book.createDepositBook(companyId, stdDate) → 성공이면 "예금잔고정리가 정상적으로 처리되었습니다." 뒤 retrieve(), 실패면 서버 메시지
  const depositUpdate = () => {
    Modal.confirm({
      title: '확인',
      content: <>잔고정리를 시작하시겠습니까? <br />(정리기간 : {stdDate.format(FORMAT)} ~ {dayjs().format(FORMAT)})</>,
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        setLoading(true);
        try {
          await astApi.cleanDepositBook(stdDate.format(FORMAT));
          message.info('예금잔고정리가 정상적으로 처리되었습니다.');
          await retrieve();
        } catch (err) {
          setLoading(false);
          Modal.info({ title: '알림', content: errorMessage(err, '예금잔고정리 실패'), okText: '확인' });
        }
      },
    });
  };

  // [E5] classTreeFullName[문서분류].TriggerClick (L228) → openLookupDoc() L394-403: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다
  const onDocResult = (r: Dcr30ClassResult) => {
    setDocOpen(false);
    setClassTree(r);
  };

  // [E6] apprButton[상신].Select (L234) → insertLinkApproval() L405-454: 분류가 없으면 "문서분류를 지정해주세요" → (다음 단계) Ast80_RelateAppr.insert → Sys99_Print.insertRdDepositIoList
  //   → Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "A17", printModel, isAdmin, callback → updateApprId(apprId, relateApprId) L457-470 → retrieveApprStep())
  const insertLinkApproval = () => {
    if (classTree?.classTreeId == null) {
      Modal.info({ title: '알림', content: '문서분류를 지정해주세요', okText: '확인' });
      return;
    }
    message.info('전자결재 작성 창은 다음 단계에서 연결됩니다');
  };

  // [E7] apprViewButton[문서보기].Select (L240) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → retrieveApprStep()) — 전자결재 편집창은 다음 단계
  const apprView = () => {
    message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
  };

  // buildGrid() L274-284
  const columnDefs = useMemo(() => [
    gbBook.text('astClassTreeName', 200, '계좌'),                               // L278
    gbBook.textCenter('curCode', 55, '통화'),                                   // L279
    gbBook.double('preDayAmt', 120, '기초잔액<br>(전일잔액)'),                  // L280 addDoubleHtml
    gbBook.double('holdQty', 120, '마감잔액<br>(당일잔액)'),                    // L281 addDoubleHtml
  ], []);

  // buildSumGrid() L286-295
  const sumColumnDefs = useMemo(() => [
    gbSum.textCenter('curCode', 255, '통화별 합계'),                            // L290
    gbSum.double('preDayAmt', 120, '기초잔액'),                                 // L291
    gbSum.double('holdQty', 120, '마감잔액'),                                   // L292
  ], []);

  // buildInGrid() L297-309: 묶음 헤더 "입 금"(열 1~4) + getSumGrid(" ",1,4,4) 합계 행(금액 열)
  const inColumnDefs = useMemo(() => [
    gbJournal.group('입 금', [
      gbJournal.textArea('trName', 100, '거래유형'),                            // L303
      gbJournal.textArea('corpName', 150, '거래처'),                            // L304
      gbJournal.textArea('note', 200, '적요'),                                  // L305
      gbJournal.double('drForAmt', 120, '금액'),                                // L306
    ]),
  ], []);

  // buildOutGrid() L311-323: 묶음 헤더 "출 금"(열 1~4) + getSumGrid(" ",1,4,4)
  const outColumnDefs = useMemo(() => [
    gbJournal.group('출 금', [
      gbJournal.textArea('trName', 100, '거래유형'),                            // L317
      gbJournal.textArea('corpName', 150, '거래처'),                            // L318
      gbJournal.textArea('note', 200, '적요'),                                  // L319
      gbJournal.double('crForAmt', 120, '금액'),                                // L320
    ]),
  ], []);

  const docPlaceholder = defaultDoc?.classTreeFullName ?? '문서분류가 미지정 상태입니다';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E2] retrieveButton[조회].Select (L179) → retrieve(), [E1] stdDate.ValueChange (L168) → retrieve() */}
      <SearchBar onSearch={() => retrieve()} loading={loading} extra={<>
        <Button type="download" onClick={downLoad}>출력/다운로드</Button>
        <Button type="view" onClick={depositUpdate}>예금잔고정리</Button>
      </>}>
        <SearchBar.Field label="기준일">
          <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} format={FORMAT}
            onChange={d => { if (d) { setStdDate(d); void retrieve(d); } }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: '30 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E8] grid.RowClick (L265) → retrieveInOut() */}
            <SingleGrid<AstBook>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.bookId)}
              onRowClicked={e => { if (e.data) void retrieveInOut(e.data); }}
            />
          </div>
          <div style={{ height: 200, flex: 'none', marginTop: -2 }}>
            <SingleGrid<AstBookSum> rowData={sumRows} columnDefs={sumColumnDefs} getRowId={p => String(p.data.bookId)} />
          </div>
        </div>
        <div style={{ flex: '35 1 0', minWidth: 0, marginLeft: -1 }}>
          <SingleGrid<JournalDtl>
            rowData={inRows}
            columnDefs={inColumnDefs}
            sumRow={{ labelField: 'trName', label: ' ', sum: ['drForAmt'] }}
          />
        </div>
        <div style={{ flex: '35 1 0', minWidth: 0, marginLeft: -1 }}>
          <SingleGrid<JournalDtl>
            rowData={outRows}
            columnDefs={outColumnDefs}
            sumRow={{ labelField: 'trName', label: ' ', sum: ['crForAmt'] }}
          />
        </div>
      </div>
      <div style={{ height: 70, flex: 'none', boxSizing: 'border-box', border: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}>
        <span style={{ fontWeight: 'bold' }}>문서분류</span>
        <LookupInput value={classTree?.classTreeFullName ?? ''} placeholder={docPlaceholder} width={800} onOpen={() => setDocOpen(true)} />
        <span style={{ fontWeight: 'bold' }}>상신상태</span>
        <Input style={{ width: 160 }} readOnly value={appr.name} />
        <Button type="register" disabled={!appr.apprEnabled} onClick={insertLinkApproval}>상신</Button>
        <Button type="search" disabled={!appr.viewEnabled} onClick={apprView}>문서보기</Button>
      </div>
      <Dcr30_Move_DcrClass open={docOpen} authCheck defaultClassTreeId={defaultDoc?.classTreeId ?? null} onResult={onDocResult} onClose={() => setDocOpen(false)} />
      <RdViewer url={rdUrl} title="일일자금관리" onClose={() => setRdUrl(null)} />
    </div>
  );
};
