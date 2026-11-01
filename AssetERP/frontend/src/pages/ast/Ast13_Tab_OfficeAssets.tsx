/**
 * [1397] 고유자산 > 30. 고유자산 현황 > 비품관리대장 (W16)
 * AS-IS: myApp/client/vi/ast/Ast13_Tab_OfficeAssets.java (605줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L94-147: BorderLayout 가운데(여백 20, 테두리) = 툴바 53(보유일자 100 · 구분 100 콤보 · 검색 200 "구분/품명/적요/구입처" · □폐기자산 포함 · [조회][출력/다운로드])
 *   + 둘째 줄 36([비품등록][소모품 폐기/취소] · "* 적요를 더블클릭시 수정할 수 있습니다.") + 그리드(행번호·단일 선택·8열·맨 아래 합계 "계") + 아래 70 칸(문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120)
 * 전자결재 편집창 Apr01_Edit_ApprDoc은 W12(Ast09_Tab_FinanceBook)와 같은 방식: [상신](링크코드 A65, 제목 `비품대장_기준일`·본문은 서버가 만든다 `GET apr/apprs/link-seed` — 본문 표는 `ast/book-depns/groups`와 같은 구분별 합계), [문서보기].
 *   Ast80_RelateAppr.insert를 편집창 전에 부르는 것도 AS-IS 그대로. RD 출력은 `rdApi`로 주소를 받아 `RdViewer`. 함께: Ast13_Lookup_ExpenseOfficeAssets([비품등록]), Ast06_Lookup_ModifyNote(적요 더블클릭)
 * 스타일: SG (견본 — docs/page-style.md). 그리드 아래 폼 줄(문서분류·상신상태·[상신][문서보기])은 테두리 없이 같은 안쪽 div에 flex none 높이 70
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
import { AstCodeName, AstOfficeAsset } from '@/types/ast';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Ast06_Lookup_ModifyNote, ModifyNoteTarget } from './Ast06_Lookup_ModifyNote';
import { Ast13_Lookup_ExpenseOfficeAssets } from './Ast13_Lookup_ExpenseOfficeAssets';

const gb = gbFor<AstOfficeAsset>();
const FORMAT = 'YYYY-MM-DD';
/** AS-IS 링크코드 A65 = 비품관리대장 */
const LINK_CODE = 'A65';
/** 소모품_비품 소분류 — 이것만 폐기/취소할 수 있다 (preDelete L350) */
const CONSUMABLE_S_CLASS = '952002';
/** astTypeCombo의 "전체" (CommonComboBoxField("…", null, "%", "전체")) */
const ALL_TYPE = '%';

/** 상신 상태 (retrieveApprStep() L542-591) */
interface ApprState { code: string; name: string; apprId: number | null; apprEnabled: boolean; viewEnabled: boolean }
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };
/** 생성자 직후(조회 전) — 상신상태 빈 칸 */
const INITIAL_APPR: ApprState = { code: '', name: '', apprId: null, apprEnabled: true, viewEnabled: false };

export const Ast13_Tab_OfficeAssets: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstOfficeAsset>>(null);
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
  const [rows, setRows] = useState<AstOfficeAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);

  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(INITIAL_APPR);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; relateApprId: number; stdDate: string } | null>(null);
  const [expenseLookup, setExpenseLookup] = useState(false);
  const [noteTarget, setNoteTarget] = useState<ModifyNoteTarget | null>(null);

  // retrieveApprStep() L542-591: ast.Ast80_RelateAppr.selectByCompanyId(companyId, date = 보유일자, linkCode A65) — 한 건이 아니거나 상태가 없으면 미상신(상신 가능),
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

  // retrieve() L318-338: ast.Ast13_BookDepn.selectOfficeAssets(companyId, depnDate, itemLClassCode, retireYn, searchText) → 첫 행 선택 → retrieveApprStep()
  const retrieve = useCallback(async (opts?: { date?: Dayjs; type?: string; retire?: boolean }) => {
    const d = opts?.date ?? holdDateRef.current;
    setLoading(true);
    try {
      const list = await astApi.searchOfficeAssets(d.format(FORMAT), opts?.type ?? itemLClassRef.current, opts?.retire ?? retireRef.current, searchTextRef.current);
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

  // setDcrClassName() L413-433: dcr.Dcr30_Link.selectByLinkCode(companyId, "A65") — 한 건이면 그 분류(칸의 안내 문구로), 아니면 기본 문구
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
    astApi.searchOfficeAssetTypes().then(setTypes).catch(() => {});
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E11] downLoadButton[출력/다운로드].Select (L258) → sys.Sys99_Print.insertRdOfficeAssets(companyId, personId, "Ast13_Tab_OfficeAssets", depnDate, itemLClassCode, retireYn, searchText "%…%")
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Ast13_Rd_OfficeAssets · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·stdDate)
  const downLoad = async () => {
    const stdDate = holdDate.format(FORMAT);
    try {
      const groupId = await astApi.rdOfficeAssets(stdDate, itemLClass, retire, searchText);
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Ast13_Rd_OfficeAssets', options: '/rhtmlimportopt [2]', rv: { rdGroupId: String(groupId), stdDate } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E9] insertButton[비품등록].Select (L245) → insert() L340-348: Ast13_Lookup_ExpenseOfficeAssets.open(callback → retrieve())
  // [E10] deleteButton[소모품 폐기/취소].Select (L251) → preDelete() L350-387
  //   소모품(952002)이 아니면 "유형/무형 자산은 고유자산거래처리 화면에서 거래를 등록하여 처리하세요", 폐기일이 없으면 보유일자로 저장 / 있으면 삭제 확인
  const preDelete = () => {
    const model = gridRef.current?.api.getSelectedRows()[0];
    if (!model) {
      message.warning('내역을 선택하세요');
      return;
    }
    if (model.itemSClassCode !== CONSUMABLE_S_CLASS) {
      message.warning('유형/무형 자산은 고유자산거래처리 화면에서 거래를 등록하여 처리하세요');
      return;
    }
    const retireDate = model.retireDate == null ? holdDate.format(FORMAT) : null;
    const msg = model.retireDate == null ? `폐기일을 "${holdDate.format(FORMAT)}" 로 저장하시겠습니까?` : '폐기일을 삭제하시겠습니까?';
    Modal.confirm({
      title: '확인',
      content: msg,
      okText: '예',
      cancelText: '아니오',
      width: 370,
      onOk: async () => {   // [E12] msgBox.DialogHide [YES] (L371) → updateRetireDate() L389-411: ast.Ast13_BookDepn.updateRetireDate(bookDepnId, retireDate) → "처리가 완료되었습니다" → 행의 폐기일을 바꾼다
        try {
          await astApi.updateOfficeRetireDate(model.bookDepnId, retireDate);
          message.success('처리가 완료되었습니다');
          setRows(prev => prev.map(r => (r.bookDepnId === model.bookDepnId ? { ...r, retireDate } : r)));
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // [E5] classTreeFullName[문서분류].TriggerClick (L202) → openLookupDoc() L436-445: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다
  const onDocResult = (r: Dcr30ClassResult) => { setDocOpen(false); setClassTree(r); };

  // [E6] apprButton[상신].Select (L208) → getDepnDate2() L447-467: ast.Ast13_BookDepn.selectOfficeAssetsGroup(companyId, depnDate) — 없으면 "상신할 비품대장의 내용이 없습니다"
  //   → insertLinkApprovals() L469-525: 분류가 없으면 관리자가 지정한 문서분류(Dcr30_Link.selectByLinkCode "A65")로 / 있으면 ast.Ast80_RelateAppr.insert(companyId, date = 보유일자, "A65")
  //   → Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A65", 목록, isAdmin, callback → updateApprId(apprId, relateApprId) L528-540 → retrieve())
  const insertLinkApproval = async () => {
    const std = holdDateRef.current.format(FORMAT);
    try {
      const groups = await astApi.searchOfficeAssetGroups(std);
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

  // [E7] apprViewButton[문서보기].Select (L214) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → retrieveApprStep())
  const apprView = () => { setViewApprId(appr.apprId); };

  // buildGrid() L302-316
  const columnDefs = useMemo(() => [
    gb.text('itemType', 200, '구분'),            // L306
    gb.date('purDate', 90, '취득일자'),          // L307 (UX-08, 원본 100)
    gb.text('itemName', 300, '품명'),            // L308
    gb.text('note', 250, '적요'),                // L309
    gb.long('purAmt', 120, '취득금액'),          // L310
    gb.text('corpName', 150, '구입처'),          // L311
    gb.textCenter('corpTel', 120, '구입처연락처'), // L312
    gb.date('retireDate', 90, '폐기일자'),       // L313 (UX-08, 원본 100)
  ], []);

  const docPlaceholder = defaultDoc?.classTreeFullName ?? '미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.';
  const typeOptions = useMemo(() => [{ value: ALL_TYPE, label: '전체' }, ...types.map(t => ({ value: t.code, label: t.name }))], [types]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E8] retrieveButton[조회].Select (L239) → retrieve(), [E3] searchText.KeyPress [Enter] (L171) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading} extra={<Button type="download" onClick={downLoad}>출력/다운로드</Button>}>
          <SearchBar.Field label="보유일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={holdDate} format={FORMAT} onChange={d => d && setHoldDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            {/* [E2] astTypeCombo[sys.Sys00_Common.selectOfficeAssets].Collapse (L162) → retrieve() */}
            <Select style={{ width: 130 }} value={itemLClass} options={typeOptions}
              onChange={v => { setItemLClass(v); void retrieve({ type: v }); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="구분/품명/적요/구입처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={retire} onChange={e => setRetire(e.target.checked)}>폐기자산 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button type="register" onClick={() => setExpenseLookup(true)}>비품등록</Button>
          <Button type="delete" onClick={preDelete}>소모품 폐기/취소</Button>
          <span style={{ fontSize: 12, color: '#456EA6', fontWeight: 'bold', marginLeft: 8 }}>* 적요를 더블클릭시 수정할 수 있습니다.</span>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E4] grid.CellDoubleClick [event.getCellIndex() == 4] (L183) → Ast06_Lookup_ModifyNote.open(purTrId, note, callback → 행의 적요를 바꾼다) */}
          <SingleGrid<AstOfficeAsset> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.bookDepnId)}
            onCellDoubleClicked={e => { if (e.colDef.field === 'note' && e.data?.purTrId != null) setNoteTarget({ trId: e.data.purTrId, note: e.data.note }); }}
            sumRow={{ labelField: 'purDate', label: '계', sum: ['purAmt'] }} />
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
      <Ast13_Lookup_ExpenseOfficeAssets open={expenseLookup} onChanged={() => void retrieve()} onClose={() => setExpenseLookup(false)} />
      <Ast06_Lookup_ModifyNote target={noteTarget}
        onSaved={(trId, note) => setRows(prev => prev.map(r => (r.purTrId === trId ? { ...r, note } : r)))}
        onClose={() => setNoteTarget(null)} />
      <Dcr30_Move_DcrClass open={docOpen} authCheck defaultClassTreeId={defaultDoc?.classTreeId ?? null} onResult={onDocResult} onClose={() => setDocOpen(false)} />
      <RdViewer url={rdUrl} title="비품관리대장" onClose={() => setRdUrl(null)} />
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
