/**
 * [1013] 준법감시 > 01. 법규관리 > 법규관리 (H08)
 * AS-IS: myApp/client/vi/ics/Ics01_Tab_ClassTreeUser.java (484줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-121: center=세로(툴바 50 + 툴바2 40 + 그리드 + 페이징 툴바 50) — 1줄 = 분류 400 "전체" · 관리그룹 250 "전체" · [조회][저장] · [사용여부 일괄설정][관리그룹 일괄지정],
 *   2줄 = 법규검색 400 "법규코드/법규명" · 조문검색 250 "관련조문" · 상세내용 포함 · 일임(자문)관련 법규만 조회. 그리드(체크박스 다중, 일임(자문)·제외 체크 열은 편집, 아이콘 열 5).
 * 연결: Ics01_Lookup_SelectParent(분류)·Ics02_Lookup_Manager(관리그룹)·Ics01_Lookup_Content(상세내용 view)·Ics20_Lookup_RevisionHistory(개정이력)·Sch03_Lookup_IcsUser(주기)
 *   ·Ics01_Lookup_IcsFile(서식파일 openPeriod)·Ics01_Lookup_Share(관리그룹 설정)·Ics01_Lookup_Except(사용여부 설정). Ics01_Lookup_IcsFileAdmin은 IcsFile 안의 [불러오기]가
 *   openPeriod에서 감춰져 이 화면에서 도달할 수 없다.
 * 관리자용 짝은 Ics01_Tab_ClassTree(E01). 이 화면은 회사별 설정(ics03_company_info: 제외·자동·일임)과 관리그룹을 고친다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n)(UX-03). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 검색 조건이 길어 줄바꿈 위험이라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ClassTreeNode, IcsLawManage, IcsManager } from '@/types/ics';
import { Button } from '@/components/button';
import { CellEditGrid, PagingToolBar, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ics02_Lookup_Manager } from '@/components/lookup/Ics02_Lookup_Manager';
import { Sch03_Lookup_IcsUser } from '@/components/lookup/Sch03_Lookup_IcsUser';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ics01_Lookup_Content } from './Ics01_Lookup_Content';
import { Ics01_Lookup_Except } from './Ics01_Lookup_Except';
import { Ics01_Lookup_IcsFile } from './Ics01_Lookup_IcsFile';
import { Ics01_Lookup_SelectParent } from './Ics01_Lookup_SelectParent';
import { Ics01_Lookup_Share, ShareTarget } from './Ics01_Lookup_Share';
import { Ics20_Lookup_RevisionHistory } from './Ics20_Lookup_RevisionHistory';

const gb = gbFor<IcsLawManage>();
const LIMIT = 50;  // gridToolBar.setToolBar(50)
const isTrue = (v: unknown) => v === true || v === 'true';

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) — Ics01_Tab_ClassTreeUserView와 같은 모양 */
const textLimitArea = (field: keyof IcsLawManage & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

interface SearchParam {
  classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean; advisYn: boolean; mngGroupId: number | null;
}

export const Ics01_Tab_ClassTreeUser: React.FC = () => {
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [mngGroupId, setMngGroupId] = useState<number | null>(null);
  const [mngGroupName, setMngGroupName] = useState('');
  const [lawSearch, setLawSearch] = useState('');
  const [statuteSearch, setStatuteSearch] = useState('');
  const [detailSearchYn, setDetailSearchYn] = useState(false);
  const [advisYn, setAdvisYn] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [parentOpen, setParentOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [exceptOpen, setExceptOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<ShareTarget | null>(null);
  const [contentLaw, setContentLaw] = useState<IcsLawManage | null>(null);
  const [fileLaw, setFileLaw] = useState<IcsLawManage | null>(null);
  const [revisionId, setRevisionId] = useState<number | null>(null);
  const [deadlineId, setDeadlineId] = useState<number | null>(null);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<SearchParam | undefined>(undefined);
  const pageRef = useRef(1);

  const condition = (): SearchParam => ({ classTreeId, lawSearch, statuteSearch, detailSearchYn, advisYn, mngGroupId });

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const search = useCallback(async (): Promise<IcsLawManage[]> => {
    if (!paramRef.current) return [];
    const res = await icsApi.searchLawManage({ ...paramRef.current, offset: (pageRef.current - 1) * LIMIT, limit: LIMIT });
    setTotal(res.total);
    setPage(pageRef.current);
    return res.rows;
  }, []);

  // updateCheck() L295-337 → update(Ics03_CompanyInfoModel) L339-349: 고친 법규마다 회사 설정(제외·자동·일임)을 저장하고 retrieve() (1페이지부터)
  const save = useCallback(async (changed: IcsLawManage[]) => {
    await icsApi.saveCompanyInfo(changed.map(r => ({ classTreeId: r.classTreeId, exceptYn: isTrue(r.exceptYn), autoYn: isTrue(r.autoYn), advisYn: isTrue(r.advisYn) })));
    pageRef.current = 1;
    return changed;
  }, []);

  const crud = useGridCrud<IcsLawManage>({
    idField: 'classTreeId',
    search,
    save,
    remove: async () => undefined,  // 삭제 기능 없음
    newRow: () => ({}),
    reloadAfterSave: true,
  });
  const { retrieve: crudRetrieve } = crud;

  // [E3] lawSearch.KeyPress [Enter] (L174)·[E4] statuteSearch.KeyPress [Enter] (L185)·[E5] retrieveButton[조회].Select (L200) → retrieve() L351-376
  // 조건(분류 id · %법규% · %조문% · 상세내용 포함 · 일임 관련만 · 관리그룹, typeCode "IT"는 서버)을 만들어 1페이지부터 다시 읽는다. 읽은 뒤 첫 행 선택(onRowDataUpdated)
  const retrieve = () => {
    paramRef.current = condition();
    pageRef.current = 1;
    return crudRetrieve();
  };

  // [E0] 화면 열림 (생성자 L73-121) → settings() L123-224(빈칸 글자·폭·체크 초기값은 아래 JSX), retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { void retrieveRef.current(); }, []);

  const getPaging = (p: number) => {
    pageRef.current = p;
    return crudRetrieve();
  };

  // [E1] classTreeName.TriggerClick [result == null] (L129) → 인라인 L129-147: Ics01_Lookup_SelectParent 결과가 null([전체])이면 분류를 비우고,
  // 아니면 선택한 분류의 전체 이름(classTreeFullName)과 id를 칸에 넣는다. 조회는 [조회]를 눌러야 한다
  const selectParent = async (node: ClassTreeNode | null) => {
    if (!node) {
      setClassTreeName('');
      setClassTreeId(null);
      return;
    }
    let name = node.classTreeName ?? '';
    try {
      name = (await icsApi.getLawDetail(node.classTreeId)).classTreeFullName ?? name;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    setClassTreeName(name);
    setClassTreeId(node.classTreeId);
  };

  // [E2] mngGroupName.TriggerClick [result == null] (L152) → 인라인 L152-170: Ics02_Lookup_Manager.open(true, …) 결과가 null([전체])이면 관리그룹을 비우고, 아니면 id·이름을 넣는다
  const selectManager = (m: IcsManager | null) => {
    setMngGroupId(m?.managerId ?? null);
    setMngGroupName(m?.managerGroupName ?? '');
  };

  // [E7] exceptButton[사용여부 일괄설정].Select (L212) → lookupExcept() L463-471: Ics01_Lookup_Except.open(callback → retrieve())

  // lookupManagerGroup() L408-426·lookupManagerGroup(model) L393-406: Ics01_Lookup_Share 결과(바뀐 행들)를 그리드에 반영한다(store.update)
  const applyShare = (rows: IcsLawManage[] | null) => rows?.forEach(r => crud.replaceRow(r.classTreeId, r));

  // [E8] mngGroupButton[관리그룹 일괄지정].Select (L218) → lookupManagerGroup() L408-426: 고른 행이 없으면 "관리그룹을 지정할 법규를 선택하세요"
  const lookupManagerGroup = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('관리그룹을 지정할 법규를 선택하세요');
      return;
    }
    setShareTarget({ laws: selected });
  };

  // refresh() L443-461: ics.Ics01_ClassTree.refresh — 서식파일 창을 닫은 뒤 그 행을 다시 읽는다
  const refresh = async (id: number) => {
    try {
      crud.replaceRow(id, await icsApi.refreshLawManage(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L226-293 (체크박스 다중, 일임(자문)·제외만 편집)
  const columnDefs = useMemo(() => [
    gb.textCenter('classTreeCode', 70, '법규코드'),  // L273
    gb.textArea('classTreeName', 200, '법규명'),  // L274
    textLimitArea('content', 300, '상세내용'),  // L275 addTextLimitArea
    iconCell<IcsLawManage>('view', 'actionCellContent', 30, ' ', setContentLaw),  // L276 contentView() L378-386: Ics01_Lookup_Content.view
    gb.textArea('submitTo', 150, '제출처'),  // L277
    gb.textArea('relatedLaw', 200, '관련조문'),  // L278
    gb.textCenter('revisionCount', 60, '개정이력'),  // L279
    iconCell<IcsLawManage>('view', 'actionCellRevision', 30, ' ', row => setRevisionId(row.classTreeId)),  // L280 revisionList() L438-441: Ics20_Lookup_RevisionHistory.open
    gb.text('cycleName', 100, '주기'),  // L281
    iconCell<IcsLawManage>('view', 'actionCellDeadline', 30, ' ', row => setDeadlineId(row.classTreeId)),  // L282 deadlineList() L388-391: Sch03_Lookup_IcsUser.open
    gb.textCenter('fileCount', 60, '서식파일'),  // L283
    iconCell<IcsLawManage>('view', 'actionCellFile', 30, ' ', setFileLaw),  // L284 fileAddList() L428-436: Ics01_Lookup_IcsFile.openPeriod(callback → refresh)
    gb.textArea('parentTreeFullName', 200, '분류'),  // L285
    gb.boolean('advisYn', 50, '일임<br>(자문)', { editable: true }),  // L286 addBoolean (편집)
    gb.text('managerGroupName', 120, '관리그룹', { cellStyle: { color: '#456EA6' } }),  // L287
    iconCell<IcsLawManage>('edit', 'actionCellManager', 30, ' ', row => setShareTarget({ classTreeId: row.classTreeId })),  // L288 lookupManagerGroup(model): Ics01_Lookup_Share.open
    gb.boolean('exceptYn', 60, '제외', { editable: true }),  // L290 addBoolean (편집)
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={() => retrieve()}
          searchText="조회"
          loading={crud.loading}
          extra={(
            <>
              {/* [E6] updateButton[저장].Select (L206) → updateCheck() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E7] exceptButton[사용여부 일괄설정] */}
              <Button type="save" onClick={() => setExceptOpen(true)}>사용여부 일괄설정</Button>
              {/* [E8] mngGroupButton[관리그룹 일괄지정] */}
              <Button type="save" onClick={lookupManagerGroup}>관리그룹 일괄지정</Button>
            </>
          )}
        >
          <SearchBar.Field label="분류">
            {/* classTreeName: setEditable(false)·빈칸 "전체"·폭 400 */}
            <LookupInput value={classTreeName} placeholder="전체" width={400} onOpen={() => setParentOpen(true)} onClear={() => void selectParent(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="관리그룹">
            {/* mngGroupName: setEditable(false)·빈칸 "전체"·폭 250 */}
            <LookupInput value={mngGroupName} placeholder="전체" width={250} onOpen={() => setManagerOpen(true)} onClear={() => selectManager(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="법규검색">
            <SearchBar.Input style={{ width: 400 }} placeholder="법규코드/법규명" value={lawSearch} onChange={e => setLawSearch(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="조문검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="관련조문" value={statuteSearch} onChange={e => setStatuteSearch(e.target.value)} />
          </SearchBar.Field>
          {/* L194-195 detailSearchCheckBox "상세내용 포함" (기본 해제) */}
          <Checkbox checked={detailSearchYn} onChange={e => setDetailSearchYn(e.target.checked)}>상세내용 포함</Checkbox>
          {/* L197-198 advisCheckBox "일임(자문)관련 법규만 조회" (기본 해제) */}
          <Checkbox checked={advisYn} onChange={e => setAdvisYn(e.target.checked)}>일임(자문)관련 법규만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<IcsLawManage>
            crud={crud}
            columnDefs={columnDefs}
            // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={crud.loading} onChange={getPaging} />
      </div>
      <Ics01_Lookup_SelectParent open={parentOpen} onResult={node => { void selectParent(node); }} onClose={() => setParentOpen(false)} />
      <Ics02_Lookup_Manager open={managerOpen} allButton onResult={selectManager} onClose={() => setManagerOpen(false)} />
      <Ics01_Lookup_Content law={contentLaw} readOnly onClosed={() => undefined} onClose={() => setContentLaw(null)} />
      <Ics20_Lookup_RevisionHistory classTreeId={revisionId} onClose={() => setRevisionId(null)} />
      <Sch03_Lookup_IcsUser classTreeId={deadlineId} onClose={() => setDeadlineId(null)} />
      <Ics01_Lookup_IcsFile law={fileLaw} period onClosed={() => { if (fileLaw) void refresh(fileLaw.classTreeId); }} onClose={() => setFileLaw(null)} />
      <Ics01_Lookup_Share target={shareTarget} onResult={applyShare} onClose={() => setShareTarget(null)} />
      <Ics01_Lookup_Except open={exceptOpen} onClose={() => { setExceptOpen(false); void retrieve(); }} />
    </div>
  );
};
