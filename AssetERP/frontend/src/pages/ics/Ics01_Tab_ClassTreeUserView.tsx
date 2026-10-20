/**
 * [1336] 준법감시 > 00. 법규정보 > 법규조회 (H02)
 * AS-IS: myApp/client/vi/ics/Ics01_Tab_ClassTreeUserView.java (272줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-95: center=세로(툴바 50 + 그리드 + 페이징 툴바 100) — 툴바(분류 300 "전체" · 법규검색 200 · 조문검색 200 · [조회] · 상세내용 포함 · 일임(자문)관련 법규만 조회) + 법규 그리드(단일 선택, 아이콘 열 4)
 * 연결: Ics01_Lookup_SelectParent(분류)·Ics01_Lookup_Content(상세내용 view)·Ics20_Lookup_RevisionHistory(개정이력)·Sch03_Lookup_IcsUser(주기)·Ics01_Lookup_IcsFile(서식파일 openPeriod)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 검색줄이 길어(분류 300 + 검색 200×2 + 체크 2) 줄바꿈 위험이라 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ClassTreeNode, IcsLawView } from '@/types/ics';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sch03_Lookup_IcsUser } from '@/components/lookup/Sch03_Lookup_IcsUser';
import { Ics01_Lookup_Content } from './Ics01_Lookup_Content';
import { Ics01_Lookup_IcsFile } from './Ics01_Lookup_IcsFile';
import { Ics01_Lookup_SelectParent } from './Ics01_Lookup_SelectParent';
import { Ics20_Lookup_RevisionHistory } from './Ics20_Lookup_RevisionHistory';

const gb = gbFor<IcsLawView>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) — Ics01_Grid_IcsType과 같은 모양 */
const textLimitArea = (field: keyof IcsLawView & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

interface SearchParam {
  classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean; advisYn: boolean;
}

export const Ics01_Tab_ClassTreeUserView: React.FC = () => {
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [lawSearch, setLawSearch] = useState('');
  const [statuteSearch, setStatuteSearch] = useState('');
  const [detailSearchYn, setDetailSearchYn] = useState(false);
  const [advisYn, setAdvisYn] = useState(false);
  const [rows, setRows] = useState<IcsLawView[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [contentLaw, setContentLaw] = useState<IcsLawView | null>(null);
  const [fileLaw, setFileLaw] = useState<IcsLawView | null>(null);
  const [revisionId, setRevisionId] = useState<number | null>(null);
  const [deadlineId, setDeadlineId] = useState<number | null>(null);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<SearchParam | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await icsApi.searchLawView({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E2] lawSearch.KeyPress [Enter] (L124)·[E3] statuteSearch.KeyPress [Enter] (L134)·[E4] retrieveButton[조회].Select (L148) → retrieve() L210-234
  // 조건(분류 id · %법규% · %조문% · 상세내용 포함 · 일임 관련만, typeCode "IT"는 서버)을 만들어 1페이지부터 다시 읽는다. 읽은 뒤 첫 행 선택(onRowDataUpdated)
  const retrieve = () => {
    paramRef.current = { classTreeId, lawSearch, statuteSearch, detailSearchYn, advisYn };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L55-95) → settings() L97-154(빈칸 글자·폭·체크 초기값은 아래 JSX), retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { void retrieveRef.current(); }, []);

  // [E1] classTreeName.TriggerClick [result == null] (L103) → 인라인 L103-121: Ics01_Lookup_SelectParent 결과가 null([전체])이면 분류를 비우고,
  // 아니면 선택한 분류의 전체 이름(classTreeFullName, selectById)과 id를 칸에 넣는다. 조회는 [조회]를 눌러야 한다
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

  // buildGrid() L156-208 (체크박스 단일)
  const columnDefs = useMemo(() => [
    gb.textCenter('classTreeCode', 70, '법규코드'),  // L185
    gb.textArea('classTreeName', 220, '법규명'),  // L186
    textLimitArea('content', 380, '상세내용'),  // L187 addTextLimitArea
    iconCell<IcsLawView>('view', 'actionCellContent', 30, ' ', setContentLaw),  // L188 contentView() L236-244: Ics01_Lookup_Content.view
    gb.textArea('submitTo', 150, '제출처'),  // L189
    gb.textArea('relatedLaw', 200, '관련조문'),  // L190
    gb.textCenter('revisionCount', 80, '개정이력'),  // L191
    iconCell<IcsLawView>('view', 'actionCellRevision', 30, ' ', row => setRevisionId(row.classTreeId)),  // L192 revisionList() L251-254: Ics20_Lookup_RevisionHistory.open
    gb.text('cycleName', 100, '주기'),  // L193
    iconCell<IcsLawView>('view', 'actionCellDeadline', 30, ' ', row => setDeadlineId(row.classTreeId)),  // L194 deadlineList() L246-249: Sch03_Lookup_IcsUser.open
    gb.textCenter('fileCount', 60, '서식파일'),  // L195
    iconCell<IcsLawView>('view', 'actionCellFile', 30, ' ', setFileLaw),  // L196 fileAddList() L256-263: Ics01_Lookup_IcsFile.openPeriod
    gb.textArea('parentTreeFullName', 200, '분류'),  // L197
    gb.booleanYn2('advisYn', 60, '일임<br>(자문)'),  // L198 addBooleanYn2
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={() => void retrieve()}
          searchText="조회"
          loading={loading}
          extra={
            <>
              {/* L142-143 detailSearchCheckBox "상세내용 포함" (기본 해제) */}
              <Checkbox checked={detailSearchYn} onChange={e => setDetailSearchYn(e.target.checked)}>상세내용 포함</Checkbox>
              {/* L146-147 advisCheckBox "일임(자문)관련 법규만 조회" (기본 해제) */}
              <Checkbox checked={advisYn} onChange={e => setAdvisYn(e.target.checked)}>일임(자문)관련 법규만 조회</Checkbox>
            </>
          }
        >
          <SearchBar.Field label="분류">
            {/* classTreeName: setEditable(false)·빈칸 "전체"·폭 300 */}
            <LookupInput value={classTreeName} placeholder="전체" width={300} onOpen={() => setParentOpen(true)} onClear={() => void selectParent(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="법규검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="법규코드/법규명" value={lawSearch} onChange={e => setLawSearch(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="조문검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="관련조문" value={statuteSearch} onChange={e => setStatuteSearch(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsLawView>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.classTreeId)}
            loading={loading}
            rowSelection={SELECTION}
            // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      <Ics01_Lookup_SelectParent open={parentOpen} onResult={node => { void selectParent(node); }} onClose={() => setParentOpen(false)} />
      <Ics01_Lookup_Content law={contentLaw} readOnly onClosed={() => undefined} onClose={() => setContentLaw(null)} />
      <Ics20_Lookup_RevisionHistory classTreeId={revisionId} onClose={() => setRevisionId(null)} />
      <Sch03_Lookup_IcsUser classTreeId={deadlineId} onClose={() => setDeadlineId(null)} />
      <Ics01_Lookup_IcsFile law={fileLaw} period onClosed={() => undefined} onClose={() => setFileLaw(null)} />
    </div>
  );
};
