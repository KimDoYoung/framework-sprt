/**
 * [1181] 고유자산 > 30. 고유자산 현황 > 감가상각대장 (W17)
 * AS-IS: myApp/client/vi/ast/Ast13_Tab_DepnBook.java (528줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L87-132: BorderLayout 가운데(여백 20, 테두리) = 툴바 50(보유일자 100 · 구분 100 콤보 · 검색 200 · □폐기자산 포함 · [조회][출력/다운로드] · "※ 자산명 더블클릭시 불공제세액 관리 팝업창이 열립니다")
 *   + 그리드(행번호·단일 선택·12열, 계정구분 열은 회사 1·28000만 보인다) + 아래 70 칸(문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120)
 * 전자결재 편집창 Apr01_Edit_ApprDoc은 W16과 같은 방식: [상신](링크코드 A29, 제목 `감가상각대장_기준일`·본문은 서버가 만든다 `GET apr/apprs/link-seed`), [문서보기].
 * 함께: Ast16_Lookup_NonDeductTax(자산명 더블클릭, W11 부품). 행 더블클릭 → lookupNonDeductTax() L500-511
 * 스타일: SG (견본 — docs/page-style.md). 그리드 아래 폼 줄은 테두리 없이 같은 안쪽 div에 flex none 높이 70
 * UX보강(10): 툴바 = SearchBar(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { dcrApi } from '@/api/dcr';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstCodeName, AstDepnBook } from '@/types/ast';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Ast16_Lookup_NonDeductTax, NonDeductTaxTarget } from './Ast16_Lookup_NonDeductTax';

const gb = gbFor<AstDepnBook>();
const FORMAT = 'YYYY-MM-DD';
/** AS-IS 링크코드 A29 = 감가상각대장 */
const LINK_CODE = 'A29';
/** astTypeCombo의 "전체" (CommonComboBoxField("…", null, "%", "전체")) */
const ALL_TYPE = '%';

/** 상신 상태 (retrieveApprStep() L452-500) */
interface ApprState { code: string; name: string; apprId: number | null; apprEnabled: boolean; viewEnabled: boolean }
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };
/** 생성자 직후(조회 전) — 상신상태 빈 칸 */
const INITIAL_APPR: ApprState = { code: '', name: '', apprId: null, apprEnabled: true, viewEnabled: false };

export const Ast13_Tab_DepnBook: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstDepnBook>>(null);
  // settings() L149-300: 보유일자 100 = 오늘, 구분 100 = 전체, 검색 200 "구분/품명/적요/구입처", □폐기자산 포함 = false
  const [holdDate, setHoldDate] = useState<Dayjs>(() => dayjs());
  const holdDateRef = useRef(holdDate);
  holdDateRef.current = holdDate;
  const [types, setTypes] = useState<AstCodeName[]>([]);
  const [itemLClass, setItemLClass] = useState(ALL_TYPE);
  const [searchText, setSearchText] = useState('');
  const searchTextRef = useRef('');
  searchTextRef.current = searchText;
  const [retire, setRetire] = useState(false);
  const [rows, setRows] = useState<AstDepnBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);

  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(INITIAL_APPR);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; relateApprId: number; stdDate: string } | null>(null);
  const [taxTarget, setTaxTarget] = useState<NonDeductTaxTarget | null>(null);
  const user = useLoginUser();

  // retrieveApprStep() L452-500: ast.Ast80_RelateAppr.selectByCompanyId(companyId, date = 보유일자, linkCode A29) — 한 건이 아니거나 상태가 없으면 미상신(상신 가능),
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

  // retrieve() L318-338: ast.Ast13_BookDepn.selectByDepnDate2(companyId, depnDate, itemLClassCode, retireYn, searchText) → 첫 행 선택 → retrieveApprStep()
  const retrieve = useCallback(async (opts?: { date?: Dayjs; type?: string; retire?: boolean }) => {
    const d = opts?.date ?? holdDateRef.current;
    setLoading(true);
    try {
      const list = await astApi.searchDepnBooks(d.format(FORMAT), opts?.type ?? itemLClassRef.current, opts?.retire ?? retireRef.current, searchTextRef.current);
      setRows(list);
      setAfterLoad(n => n + 1);
      void retrieveApprStep(d);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [retrieveApprStep]);
  const itemLClassRef = useRef(itemLClass);
  itemLClassRef.current = itemLClass;
  const retireRef = useRef(retire);
  retireRef.current = retire;

  // 목록이 바뀐 뒤 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(String(rows[0].bookDepnId))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // setDcrClassName() L413-433: dcr.Dcr30_Link.selectByLinkCode(companyId, "A29") — 한 건이면 그 분류(칸의 안내 문구로), 아니면 기본 문구
  const setDcrClassName = async () => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      const model = list.length === 1 ? { classTreeId: list[0].classTreeId, classTreeFullName: list[0].classTreeFullName } : null;
      setDefaultDoc(model);
      setClassTree(model);
    } catch {
      /* AS-IS는 오류를 읽지 않는다 */
    }
  };

  // [E0] 화면 열림 (생성자 L94-147) → settings(), setDcrClassName()
  // [E1] astTypeCombo.callbackOnCreate (L154) → 콤보가 만들어지면 retrieve()
  useEffect(() => {
    void setDcrClassName();
    astApi.searchDepnItemTypes().then(setTypes).catch(() => {});
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E5] downLoadButton[출력/다운로드].Select (L186) → sys.Sys99_Print.insertRdDepnBook(companyId, personId, "Ast13_Tab_DepnBook", depnDate, itemLClassCode, retireYn, searchText "%…%")
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Ast13_Rd_DepnBook · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·stdDate)
  const downLoad = async () => {
    const stdDate = holdDate.format(FORMAT);
    try {
      const groupId = await astApi.rdDepnBook(stdDate, itemLClass, retire, searchText);
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Ast13_Rd_DepnBook', options: '/rhtmlimportopt [2]', rv: { rdGroupId: String(groupId), stdDate } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E9] grid.RowDoubleClick (L268) → lookupNonDeductTax() L500-511: Ast16_Lookup_NonDeductTax.open(purTrId, "[ 자산 전체이름 ] (취득일 yyyy-MM-dd)", callback → retrieve())
  const lookupNonDeductTax = (r: AstDepnBook) => {
    if (r.purTrId == null) return;
    setTaxTarget({ purTrId: r.purTrId, title: `[ ${r.itemFullName ?? ''} ] (취득일 ${r.purDate ?? ''})` });
  };

  // [E6] classTreeFullName[문서분류].TriggerClick (L230) → openLookupDoc() L436-445: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다
  const onDocResult = (r: Dcr30ClassResult) => { setDocOpen(false); setClassTree(r); };

  // [E7] apprButton[상신].Select (L236) → getDepnDate2() L447-467: ast.Ast13_BookDepn.getDepnDate2(companyId, depnDate) — 없으면 "상신할 비품대장의 내용이 없습니다"
  //   → insertLinkApprovals() L469-525: 분류가 없으면 관리자가 지정한 문서분류(Dcr30_Link.selectByLinkCode "A29")로 / 있으면 ast.Ast80_RelateAppr.insert(companyId, date = 보유일자, "A29")
  //   → Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A29", 목록, isAdmin, callback → updateApprId(apprId, relateApprId) L528-540 → retrieve())
  const insertLinkApproval = async () => {
    const std = holdDateRef.current.format(FORMAT);
    try {
      const groups = await astApi.searchDepnBookGroups(std);
      if (groups.length === 0) { Modal.info({ title: '알림', content: '상신할 비품대장의 내용이 없습니다', okText: '확인' }); return; }
      if (classTree?.classTreeId == null) { Modal.info({ title: '알림', content: '문서분류를 선택해주세요.', okText: '확인' }); return; }
      const relateApprId = await astApi.createRelateAppr(std, LINK_CODE);
      setLinkDoc({ classTreeId: classTree.classTreeId, relateApprId, stdDate: std });
    } catch (err) {
      message.error(errorMessage(err, '상신 준비 실패'));
    }
  };

  // updateApprId(apprId, relateApprId) L528-540: ast.Ast80_RelateAppr.updateApprId(relateApprId, apprId) → retrieve()
  const updateApprId = async (apprId: number) => {
    if (!linkDoc) return;
    try {
      await astApi.updateRelateApprId(linkDoc.relateApprId, apprId);
      void retrieve({ date: dayjs(linkDoc.stdDate) });
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 기록하지 못했습니다'));
    }
  };

  // [E8] apprViewButton[문서보기].Select (L242) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → retrieveApprStep())
  const apprView = () => { setViewApprId(appr.apprId); };

  // 계정구분 열은 회사 1·28000만 보인다 (settings L159-165: setHidden(1, …)) — 검색 안내 문구도 그에 따른다
  const showAccountType = user.companyId === 1 || user.companyId === 28000;
  // buildGrid() — analysis grid Ast13_Tab_DepnBook
  const columnDefs = useMemo(() => [
    gb.textCenter('accountTypeName', 120, '계정구분', { hide: !showAccountType }),
    gb.text('itemType', 200, '구분'),
    gb.textArea('itemName', 300, '자산명'),
    gb.textArea('note', 300, '적요'),
    gb.date('purDate', 90, '취득일자'),               // UX-08 (원본 100)
    gb.long('purAmt', 100, '취득금액'),
    gb.long('nonDeductTax', 100, '불공제세액<br>(추가분)'),
    gb.long('monthDepnCost', 100, '당월<br>감가상각비'),
    gb.long('depnCost', 100, '당기<br>감가상각비'),
    gb.long('acmDepnCost', 100, '감가상각누계액'),
    gb.long('remDepnCost', 100, '잔여상각액'),
    gb.date('retireDate', 90, '폐기일자'),            // UX-08 (원본 100)
  ], [showAccountType]);

  const docPlaceholder = defaultDoc?.classTreeFullName ?? '미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.';
  const typeOptions = useMemo(() => [{ value: ALL_TYPE, label: '전체' }, ...types.map(t => ({ value: t.code, label: t.name }))], [types]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L179) → retrieve(), [E3] searchText.KeyPress [Enter] (L167) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading} extra={<><Button type="download" onClick={downLoad}>출력/다운로드</Button><span style={{ fontSize: 12, color: '#456EA6', fontWeight: 'bold', marginLeft: 8 }}>※ 자산명 더블클릭시 불공제세액 관리 팝업창이 열립니다</span></>}>
          <SearchBar.Field label="보유일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={holdDate} format={FORMAT} onChange={d => d && setHoldDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            {/* [E2] astTypeCombo[sys.Sys00_Common.selectDepnItemType].Collapse (L152) → retrieve() */}
            <Select style={{ width: 130 }} value={itemLClass} options={typeOptions}
              onChange={v => { setItemLClass(v); void retrieve({ type: v }); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder={showAccountType ? '계정구분/구분/자산명/적요' : '구분/자산명'} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={retire} onChange={e => setRetire(e.target.checked)}>폐기자산 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E9] grid.RowDoubleClick (L268) → lookupNonDeductTax() */}
          <SingleGrid<AstDepnBook> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.bookDepnId)}
            sumRow={{ labelField: 'itemType', label: '계', sum: ['purAmt', 'nonDeductTax', 'monthDepnCost', 'depnCost', 'acmDepnCost', 'remDepnCost'] }}
            onRowDoubleClicked={e => { if (e.data) lookupNonDeductTax(e.data); }}
            />
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
      <Ast16_Lookup_NonDeductTax target={taxTarget} onSaved={() => void retrieve()} onClose={() => setTaxTarget(null)} />
      <Dcr30_Move_DcrClass open={docOpen} authCheck defaultClassTreeId={defaultDoc?.classTreeId ?? null} onResult={onDocResult} onClose={() => setDocOpen(false)} />
      <RdViewer url={rdUrl} title="감가상각대장" onClose={() => setRdUrl(null)} />
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
