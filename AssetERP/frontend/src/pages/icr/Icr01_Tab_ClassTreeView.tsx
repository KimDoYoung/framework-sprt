/**
 * [1346] 준법감시 > 00. 법규정보 > 내규조회 (H03)
 * AS-IS: myApp/client/vi/icr/Icr01_Tab_ClassTreeView.java (284줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L59-96: center=세로(툴바 50 + 그리드 + 페이징 툴바 100) — 툴바(분류 300 "전체" · 내규검색 200 · 조문검색 200 · [조회] · 상세내용 포함) + 내규 그리드(단일 선택, 아이콘 열 3)
 * 연결: Icr01_Lookup_SelectParent(분류)·Icr01_Lookup_Content(상세내용 view)·Sch03_Lookup_IcsUser(주기)·Icr01_Lookup_IcrFile(서식파일 openPeriod)
 * 연결만 있고 이 화면에서 도달할 수 없는 것: Icr01_Lookup_Share(managerList() L237 — 호출처 없음)·Icr02_Lookup_Manager(Share 안에서만 연다)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 검색줄이 길어(분류 300 + 검색 200×2 + 체크) 줄바꿈 위험이라 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { icrApi } from '@/api/icr';
import { errorMessage } from '@/api/client';
import { IcrClassTreeNode, IcrClassTreeView } from '@/types/icr';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sch03_Lookup_IcsUser } from '@/components/lookup/Sch03_Lookup_IcsUser';
import { Icr01_Lookup_Content } from './Icr01_Lookup_Content';
import { Icr01_Lookup_IcrFile } from './Icr01_Lookup_IcrFile';
import { Icr01_Lookup_SelectParent } from './Icr01_Lookup_SelectParent';

const gb = gbFor<IcrClassTreeView>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) — Ics01_Grid_IcsType과 같은 모양 */
const textLimitArea = (field: keyof IcrClassTreeView & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

interface SearchParam {
  classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean;
}

export const Icr01_Tab_ClassTreeView: React.FC = () => {
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [lawSearch, setLawSearch] = useState('');
  const [statuteSearch, setStatuteSearch] = useState('');
  const [detailSearchYn, setDetailSearchYn] = useState(false);
  const [rows, setRows] = useState<IcrClassTreeView[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [contentRow, setContentRow] = useState<IcrClassTreeView | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [deadlineId, setDeadlineId] = useState<number | null>(null);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<SearchParam | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await icrApi.searchView({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E2] lawSearch.KeyPress [Enter] (L125)·[E3] statuteSearch.KeyPress [Enter] (L135)·[E4] retrieveButton[조회].Select (L146) → retrieve() L197-220
  // 조건(분류 id · %내규% · %조문% · 상세내용 포함, typeCode "IT"·mngGroupId null은 서버)을 만들어 1페이지부터 다시 읽는다. 읽은 뒤 첫 행 선택(onRowDataUpdated)
  const retrieve = () => {
    paramRef.current = { classTreeId, lawSearch, statuteSearch, detailSearchYn };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L59-96) → settings() L98-152(빈칸 글자·폭·체크 초기값은 아래 JSX), retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { void retrieveRef.current(); }, []);

  // [E1] classTreeName.TriggerClick [result == null] (L104) → 인라인 L104-122: Icr01_Lookup_SelectParent 결과가 null([전체])이면 분류를 비우고,
  // 아니면 선택한 분류의 전체 이름(classTreeFullName, selectById)과 id를 칸에 넣는다. 조회는 [조회]를 눌러야 한다
  const selectParent = async (node: IcrClassTreeNode | null) => {
    if (!node) {
      setClassTreeName('');
      setClassTreeId(null);
      return;
    }
    let name = node.classTreeName ?? '';
    try {
      name = (await icrApi.getDetail(node.classTreeId)).classTreeFullName ?? name;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    setClassTreeName(name);
    setClassTreeId(node.classTreeId);
  };

  // buildGrid() L154-195 (체크박스 단일)
  const columnDefs = useMemo(() => [
    gb.textCenter('classTreeCode', 60, '내규코드'),  // L174
    gb.textArea('classTreeName', 250, '내규명'),  // L175
    textLimitArea('content', 400, '상세내용'),  // L176 addTextLimitArea
    iconCell<IcrClassTreeView>('view', 'actionCellContent', 30, ' ', setContentRow),  // L177 contentView() L222-230: Icr01_Lookup_Content.view
    gb.textArea('submitTo', 150, '제출처'),  // L178
    gb.textArea('relatedLaw', 200, '관련조문'),  // L179
    gb.text('cycleName', 100, '주기'),  // L180
    iconCell<IcrClassTreeView>('view', 'actionCellDeadline', 30, ' ', row => setDeadlineId(row.classTreeId)),  // L181 deadlineList() L232-235: Sch03_Lookup_IcsUser.open
    gb.textCenter('fileCount', 60, '서식파일'),  // L182
    iconCell<IcrClassTreeView>('view', 'actionCellFile', 30, ' ', row => setFileId(row.classTreeId)),  // L183 fileAddList() L247-255: Icr01_Lookup_IcrFile.openPeriod
    gb.textArea('parentTreeFullName', 200, '분류'),  // L184
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={() => void retrieve()}
          searchText="조회"
          loading={loading}
          extra={
            // detailSearchCheckBox "상세내용 포함" (기본 해제)
            <Checkbox checked={detailSearchYn} onChange={e => setDetailSearchYn(e.target.checked)}>상세내용 포함</Checkbox>
          }
        >
          <SearchBar.Field label="분류">
            {/* classTreeName: setEditable(false)·빈칸 "전체"·폭 300 */}
            <LookupInput value={classTreeName} placeholder="전체" width={300} onOpen={() => setParentOpen(true)} onClear={() => void selectParent(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="내규검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="내규코드/내규명" value={lawSearch} onChange={e => setLawSearch(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="조문검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="관련조문" value={statuteSearch} onChange={e => setStatuteSearch(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcrClassTreeView>
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
      <Icr01_Lookup_SelectParent open={parentOpen} onResult={node => { void selectParent(node); }} onClose={() => setParentOpen(false)} />
      <Icr01_Lookup_Content row={contentRow} onClose={() => setContentRow(null)} />
      <Sch03_Lookup_IcsUser classTreeId={deadlineId} onClose={() => setDeadlineId(null)} />
      {/* callback → refresh(classTreeId) L257-275: 서식파일 건수 한 행을 다시 읽는다. openPeriod()는 올리기·삭제가 없어 건수가 바뀌지 않으므로 하지 않는다 */}
      <Icr01_Lookup_IcrFile classTreeId={fileId} onClosed={() => undefined} onClose={() => setFileId(null)} />
    </div>
  );
};
