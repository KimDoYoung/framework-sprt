/**
 * [1116] 문서작성 > 03. 파일 및 양식관리 > 파일등록 (F11)
 * AS-IS: myApp/client/vi/fbx/Fbx01_Tab_Document.java (434줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L87-225: 위(높이 200, 분할) = 툴바(제목 350 · [조회][등록][저장][삭제]) + 파일보관함 셀 편집 그리드(체크박스 단일),
 *   가운데 = 왼쪽 400(툴바 [문서분류 120][찾기][+][-] + 문서분류 트리) · 오른쪽 파일 목록(Fbx01_TabPage_DocList)
 * 함께 쓰는 클래스: Fbx02_Popup_History(기록), Fbx01_TabPage_DocList(파일 목록), Sys10_Lookup_FileViewer(미리보기, 파일 공통)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 원본에 초기화가 없어 UX-02는 넣지 않는다
 * 스타일: TO (yunhee page-style 판별 — docs/page-style.md)
 */
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import dayjs from 'dayjs';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { fbxApi } from '@/api/fbx';
import { DcrClassTree } from '@/types/dcr';
import { FbxBox } from '@/types/fbx';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { toTree, DcrTree } from '@/pages/dcr/dcr01Tree';
import { DcrClassSearchList } from '@/pages/dcr/DcrClassSearchList';
import { TreeListControlButtons } from '@/components/button/TreeListControlButtons';
import { Fbx01_TabPage_DocList, Fbx01_TabPage_DocListHandle } from './Fbx01_TabPage_DocList';
import { Fbx02_Popup_History } from './Fbx02_Popup_History';

const gb = gbFor<FbxBox>();
const NOW = () => dayjs().format('YYYY-MM-DDTHH:mm:ss');

/**
 * 문서분류 트리 — 펼침 상태를 이 안에 둔다: 삼각형을 눌러도 화면 전체(보관함 그리드·파일 목록)는 다시 그리지 않는다.
 * 부모는 handle로 펼칠 키만 알려 준다. 가상 스크롤·애니메이션 끔·아이콘은 공용 DcrTree(UX-19)
 */
interface DocClassTreeHandle {
  setExpanded: (keys: React.Key[]) => void;
  toggle: (key: React.Key) => void;
}
interface DocClassTreeProps {
  treeData: DataNode[];
  selectedKey: number | null;
  hidden: boolean;
  onSelect: NonNullable<TreeProps['onSelect']>;
}
const DocClassTree = memo(forwardRef<DocClassTreeHandle, DocClassTreeProps>(({ treeData, selectedKey, hidden, onSelect }, ref) => {
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  useImperativeHandle(ref, () => ({
    setExpanded,
    toggle: key => setExpanded(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])),
  }), []);
  return (
    <div style={{ marginTop: 8, flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 4px', display: hidden ? 'none' : undefined }}>
      {treeData.length > 0 && (
        <DcrTree
          treeData={treeData}
          expandedKeys={expanded}
          onExpand={keys => setExpanded(keys)}
          selectedKeys={selectedKey == null ? [] : [selectedKey]}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}));

/** 오른쪽 파일 목록 — 부모가 다시 그려져도(트리 선택 등) 따라 그리지 않는다. ref는 바뀌지 않는다 */
const DocListPanel = memo(({ listRef }: { listRef: React.Ref<Fbx01_TabPage_DocListHandle> }) => (
  <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
    <Fbx01_TabPage_DocList ref={listRef} />
  </div>
));

export const Fbx01_Tab_Document: React.FC = () => {
  const user = useLoginUser();
  // searchText.setEmptyText("") L88 — 제목 빈칸
  const sp = useSearchParams(() => ({ searchText: '' }));
  const [historyBoxId, setHistoryBoxId] = useState<number | null>(null);
  // 문서분류 트리 (getMenuTree L260-296, getServiceResult L333-346, addChild L298-307)
  const [classRows, setClassRows] = useState<DcrClassTree[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [docSearch, setDocSearch] = useState('');
  // 보기 방식: 트리(보관함을 고를 때마다) / 리스트([찾기] 결과 — UX보강)
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const treeData = useMemo(() => toTree(classRows), [classRows]);
  const selectedBox = useRef<FbxBox | undefined>(undefined);
  const docList = useRef<Fbx01_TabPage_DocListHandle>(null);
  const tree = useRef<DocClassTreeHandle>(null);
  const selectFirst = useRef(false);
  const treeSeq = useRef(0);

  // buildGrid() L227-258 (체크박스 단일 선택, 셀 편집). 원본 2026-11-04: 상태 열(FbxBoxStatus 콤보) 뺌, 제목 500·비고 400·기록 70, 변경일시·변경자·부서 더함
  const columnDefs = useMemo(() => [
    gb.date('crtDate', 100, '등록일', { editor: 'date' }),
    gb.text('title', 500, '제목', { editor: 'text' }),
    gb.text('note', 400, '비고', { editor: 'text' }),
    gb.long('fileCount', 80, '파일갯수'),
    // HistoryCell("History") → Fbx02_Popup_History.open(boxId)
    iconCell<FbxBox>('history', 'actionCell', 70, '기록', row => setHistoryBoxId(row.boxId)),
    gb.dateTime('actDate', 150, '변경일시'),
    gb.textCenter('actEmpName', 100, '변경자'),
    gb.text('actOrgName', 100, '부서'),
  ], []);

  const crud = useGridCrud<FbxBox>({
    idField: 'boxId',
    // retrieve() L348-361: fbx.Fbx01_Box.selectByCompanyId(companyId, searchText) — 끝나면 첫 행을 고른다
    search: useCallback(() => fbxApi.searchBoxes(sp.current.current.searchText), [sp.current]),  // eslint-disable-line react-hooks/exhaustive-deps
    // update() L358-378: 바뀐 칸마다 변경 기록(제목 06·비고 07·등록일 08, 서버 FbxBoxService.insertHistory) 뒤 GridUpdate → fbx.Fbx01_Box.update
    save: useCallback((rows: FbxBox[]) => fbxApi.updateBoxes(rows.map(r => ({
      boxId: r.boxId, crtDate: r.crtDate, title: r.title, note: r.note || null, statusCd: r.statusCd,
    }))), []),
    remove: useCallback((ids: number[]) => fbxApi.deleteBoxes(ids), []),
    // insertRow() L368-379: 조직·생성자 = 로그인 사용자(서버가 넣음), 상태 01 "진행", 등록일 = 오늘
    newRow: useCallback(() => ({ statusCd: '01', statusName: '진행', crtDate: NOW(), crtEmpId: user.userId, fileCount: 0 }), [user.userId]),
    firstEditField: 'title',
    deleteConfirm: '선택한 보관함을 삭제하시겠습니까?',
  });

  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
  };

  // [E0] 화면 열림 (생성자 L82-85) → retrieve(), init()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // retrieveDocTree() L318-330: dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode "%") — 트리를 다시 채우고 부모 노드를 모두 펼친다(addChild)
  const retrieveDocTree = async () => {
    const my = ++treeSeq.current;
    try {
      const list = await dcrApi.searchClassTree('%');
      if (my !== treeSeq.current) return;
      setClassRows(list);
      setSelectedClass(null);
      setView('tree');
      const parents = new Set(list.map(r => r.parentTreeId));
      tree.current?.setExpanded(list.filter(r => parents.has(r.classTreeId)).map(r => r.classTreeId));
    } catch (err) {
      if (my === treeSeq.current) {
        setClassRows([]);
        message.error(errorMessage(err, '매뉴조회 오류'));
      }
    }
  };

  // retrieveDocList() L309-316: 고른 보관함·문서분류로 docList.retrieve(classTreeId, boxId) + setDcrTypeCode
  const retrieveDocList = useCallback((row: DcrClassTree) => {
    const box = selectedBox.current;
    if (!box) return;
    docList.current?.retrieve(row.classTreeId, box.boxId, row.typeCode);
  }, []);

  // [E9] tree.Selection (L160) → retrieveDocList(). Tree.onClick → super.onDoubleClick: 한 번 눌러도 노드가 열리고 닫힌다
  const onTreeSelect = useCallback((keys: React.Key[], info: { node: { key: React.Key } }) => {
    const id = keys.length ? Number(keys[0]) : Number(info.node.key);
    const row = classRows.find(r => r.classTreeId === id);
    if (!row) return;
    setSelectedClass(id);
    tree.current?.toggle(info.node.key);
    retrieveDocList(row);
  }, [classRows, retrieveDocList]);

  // [E10] docSearch.KeyPress [Enter] (L186) · [E11] searchButton[찾기].Select (L194) → search() L409-429:
  // 선택을 풀고 모두 닫은 뒤, 이름에 검색어가 든 분류의 부모를 펼쳐 고른다(여럿이면 마지막 것이 선택으로 남는다)
  const search = () => {
    // UX보강: 이름에 검색어가 든 분류를 리스트로 보인다(AS-IS는 트리를 펼쳐 고름)
    setSelectedClass(null);
    if (docSearch === '') return;
    setView('list');
  };

  // 자식이 있는 분류(부모로 쓰인 분류)를 모두 펼친다 — [E6] expandAll[+] (L122) → tree.expandAll()
  const expandAll = () => {
    const parents = new Set(classRows.map(r => r.parentTreeId));
    tree.current?.setExpanded(classRows.filter(r => parents.has(r.classTreeId)).map(r => r.classTreeId));
  };

  // 리스트에서 고른 분류 — 트리 선택(onTreeSelect)과 같게 문서 목록을 읽는다
  const onListSelect = (row: DcrClassTree | null) => {
    setSelectedClass(row ? row.classTreeId : null);
    if (row) retrieveDocList(row);
  };

  // [E5] deleteButton[삭제].Select → deleteChk() L426-441 (원본 2026-11-04): 등록된 파일이 있으면 "등록된 파일이 존재합니다"(서버도 검사) →
  //   deleteRow() L445-470: 생성자만 지울 수 있다 → 확인창 → msgBox.DialogHide [YES] → fbx.Fbx01_Box.delete
  const deleteRow = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length > 0 && (checked[0].fileCount ?? 0) > 0) {
      message.warning('등록된 파일이 존재합니다');
      return;
    }
    if (checked.length > 0 && checked[0].crtEmpId !== user.userId) {
      message.warning('삭제권한이 없습니다');
      return;
    }
    crud.deleteChecked();
  };


  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        {/* northLayoutData: 높이 200, 분할 */}
        <Splitter.Panel defaultSize={250} min={120} max={1000}>
          <div style={{ height: '100%', paddingBottom: 10, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              {/* [E1] searchText.KeyPress [Enter] (L89) · [E2] retrieveButton[조회].Select (L98) → retrieve() */}
              <SearchBar
                onSearch={retrieve}
                loading={crud.loading}
                extra={
                  <>
                    {/* [E3] insertButton[등록].Select (L104) → insertRow() */}
                    <Button type="register" onClick={crud.addRow}>등록</Button>
                    {/* [E4] updateButton[저장].Select (L110) → update(). 저장(n)은 UX-03 */}
                    <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                    <Button type="delete" disabled={!crud.hasChecked} onClick={deleteRow}>삭제</Button>
                  </>
                }
              >
                <SearchBar.Field label="제목">
                  <SearchBar.Input style={{ width: 350 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <CellEditGrid<FbxBox>
                  crud={crud}
                  columnDefs={columnDefs}
                  rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
                  onRowDataUpdated={e => {
                    // 조회 끝: 첫 행을 고른다 (grid.getSelectionModel().select(0, false)). 처음 그릴 때의 빈 데이터 갱신은 건너뛴다
                    if (!selectFirst.current || e.api.getDisplayedRowCount() === 0) return;
                    selectFirst.current = false;
                    e.api.getDisplayedRowAtIndex(0)?.setSelected(true);
                  }}
                  // [E8] grid.SelectionChanged [선택>0] (L151) → retrieveDocTree()
                  onSelectionChanged={e => {
                    const sel = e.api.getSelectedRows();
                    selectedBox.current = sel[0];
                    if (sel.length > 0) void retrieveDocTree();
                  }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', paddingTop: 10, boxSizing: 'border-box' }}>
            <Splitter style={{ height: '100%' }}>
              {/* westLayoutData: 가운데 hlc의 cp 400 */}
              <Splitter.Panel defaultSize={400} min={250} max={1000}>
                <div style={{ height: '100%', borderBottom: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                  <SearchBar onSearch={search} searchText="찾기"
                    // [E6] expandAll[+] (L122)·[E7] collapseAll[-] (L129) → 보기 전환과 한 묶음(TreeListControlButtons)
                    extra={<TreeListControlButtons value={view} onChange={setView} onExpandAll={expandAll} onCollapseAll={() => tree.current?.setExpanded([])} expandDisabled={treeData.length === 0} />}
                  >
                    <SearchBar.Field label="">
                      <SearchBar.Input placeholder='문서분류 검색...' style={{ width: 150 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} />
                    </SearchBar.Field>
                  </SearchBar>
                  {view === 'list' && (
                    <div style={{ marginTop: 8, flex: 1, minHeight: 0, overflow: 'hidden' }}>
                      <DcrClassSearchList rows={classRows} query={docSearch} onSelect={onListSelect} />
                    </div>
                  )}
                  {/* 리스트로 볼 때도 트리는 숨겨 둔 채 남긴다 — 펼침 상태 유지 */}
                  <DocClassTree ref={tree} treeData={treeData} selectedKey={selectedClass} hidden={view === 'list'} onSelect={onTreeSelect} />
                </div>
              </Splitter.Panel>
              <Splitter.Panel>
                <DocListPanel listRef={docList} />
              </Splitter.Panel>
            </Splitter>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Fbx02_Popup_History boxId={historyBoxId} onClose={() => setHistoryBoxId(null)} />
    </div>
  );
};
