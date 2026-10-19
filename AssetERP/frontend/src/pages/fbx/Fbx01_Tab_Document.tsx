/**
 * [1116] 문서작성 > 03. 파일 및 양식관리 > 파일등록 (F11)
 * AS-IS: myApp/client/vi/fbx/Fbx01_Tab_Document.java (434줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L87-225: 위(높이 200, 분할) = 툴바(제목 350 · [조회][등록][저장][삭제]) + 파일보관함 셀 편집 그리드(체크박스 단일),
 *   가운데 = 왼쪽 400(툴바 [문서분류 120][찾기][+][-] + 문서분류 트리) · 오른쪽 파일 목록(Fbx01_TabPage_DocList)
 * 함께 쓰는 클래스: Fbx02_Popup_History(기록), Fbx01_TabPage_DocList(파일 목록), Sys10_Lookup_FileViewer(미리보기, 파일 공통)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 원본에 초기화가 없어 UX-02는 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, Tree, message } from 'antd';
import { FileTextOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { fbxApi } from '@/api/fbx';
import { sysApi } from '@/api/sys';
import { DcrClassTree } from '@/types/dcr';
import { FbxBox } from '@/types/fbx';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { ancestorKeys, toTree } from '@/pages/dcr/dcr01Tree';
import { Fbx01_TabPage_DocList, Fbx01_TabPage_DocListHandle } from './Fbx01_TabPage_DocList';
import { Fbx02_Popup_History } from './Fbx02_Popup_History';

const gb = gbFor<FbxBox>();
const NOW = () => dayjs().format('YYYY-MM-DDTHH:mm:ss');

export const Fbx01_Tab_Document: React.FC = () => {
  const user = useLoginUser();
  // searchText.setEmptyText("") L88 — 제목 빈칸
  const sp = useSearchParams(() => ({ searchText: '' }));
  const [statusCodes, setStatusCodes] = useState<Code[]>([]);
  const [historyBoxId, setHistoryBoxId] = useState<number | null>(null);
  // 문서분류 트리 (getMenuTree L260-296, getServiceResult L333-346, addChild L298-307)
  const [classRows, setClassRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const treeData = useMemo(() => toTree(classRows), [classRows]);
  const selectedBox = useRef<FbxBox | undefined>(undefined);
  const docList = useRef<Fbx01_TabPage_DocListHandle>(null);
  const selectFirst = useRef(false);
  const treeSeq = useRef(0);

  // buildGrid() L227-258 (체크박스 단일 선택, 셀 편집)
  const columnDefs = useMemo(() => [
    gb.date('crtDate', 100, '등록일', { editor: 'date' }),  // L250
    gb.textCenter('statusName', 80, '상태', {  // L251 — [E12] statusComboBox[FbxBoxStatus].Collapse (L233-239): 고른 코드를 그 행의 statusCode에 반영
      editor: 'select',
      values: statusCodes.map(c => c.name),
      valueSetter: p => {
        p.data.statusName = p.newValue;
        p.data.statusCd = statusCodes.find(c => c.name === p.newValue)?.code ?? p.data.statusCd;
        return true;
      },
    }),
    gb.text('title', 550, '제목', { editor: 'text' }),  // L252
    gb.text('note', 450, '비고', { editor: 'text' }),  // L253
    gb.long('fileCount', 80, '파일갯수'),  // L254
    // L241-248 HistoryCell("History") → Fbx02_Popup_History.open(boxId)
    iconCell<FbxBox>('history', 'actionCell', 80, '기록', row => setHistoryBoxId(row.boxId)),  // L255
  ], [statusCodes]);

  const crud = useGridCrud<FbxBox>({
    idField: 'boxId',
    // retrieve() L348-361: fbx.Fbx01_Box.selectByCompanyId(companyId, searchText) — 끝나면 첫 행을 고른다
    search: useCallback(() => fbxApi.searchBoxes(sp.current.current.searchText), [sp.current]),
    // update() L363-366: GridUpdate → fbx.Fbx01_Box.update
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
    sysApi.searchCodes('FbxBoxStatus').then(setStatusCodes).catch(() => undefined);
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
      const parents = new Set(list.map(r => r.parentTreeId));
      setExpanded(list.filter(r => parents.has(r.classTreeId)).map(r => r.classTreeId));
    } catch (err) {
      if (my === treeSeq.current) {
        setClassRows([]);
        message.error(errorMessage(err, '매뉴조회 오류'));
      }
    }
  };

  // retrieveDocList() L309-316: 고른 보관함·문서분류로 docList.retrieve(classTreeId, boxId) + setDcrTypeCode
  const retrieveDocList = (row: DcrClassTree) => {
    const box = selectedBox.current;
    if (!box) return;
    docList.current?.retrieve(row.classTreeId, box.boxId, row.typeCode);
  };

  // [E9] tree.Selection (L160) → retrieveDocList(). Tree.onClick → super.onDoubleClick: 한 번 눌러도 노드가 열리고 닫힌다
  const onTreeSelect = (keys: React.Key[], info: { node: { key: React.Key } }) => {
    const id = keys.length ? Number(keys[0]) : Number(info.node.key);
    const row = classRows.find(r => r.classTreeId === id);
    if (!row) return;
    setSelectedClass(id);
    setExpanded(prev => (prev.includes(info.node.key) ? prev.filter(k => k !== info.node.key) : [...prev, info.node.key]));
    retrieveDocList(row);
  };

  // [E10] docSearch.KeyPress [Enter] (L186) · [E11] searchButton[찾기].Select (L194) → search() L409-429:
  // 선택을 풀고 모두 닫은 뒤, 이름에 검색어가 든 분류의 부모를 펼쳐 고른다(여럿이면 마지막 것이 선택으로 남는다)
  const search = () => {
    setSelectedClass(null);
    setExpanded([]);
    const text = docSearch.toLowerCase();
    if (text === '') return;
    const found = classRows.filter(r => r.classTreeName.toLowerCase().indexOf(text) > -1);
    if (found.length === 0) return;
    const keys = new Set<React.Key>();
    found.forEach(r => ancestorKeys(classRows, r.classTreeId).forEach(k => keys.add(k)));
    setExpanded([...keys]);
    const last = found[found.length - 1];
    setSelectedClass(last.classTreeId);
    retrieveDocList(last);
  };

  // [E5] deleteButton[삭제].Select (L116) → deleteRow() L381-406: 생성자만 지울 수 있다 → 확인창 → [E13] msgBox.DialogHide [YES] (L388) → fbx.Fbx01_Box.delete
  const deleteRow = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length > 0 && checked[0].crtEmpId !== user.userId) {
      message.warning('삭제권한이 없습니다');
      return;
    }
    crud.deleteChecked();
  };

  const icon = (p: { expanded?: boolean; isLeaf?: boolean }) =>
    p.isLeaf ? <FileTextOutlined /> : p.expanded ? <FolderOpenOutlined /> : <FolderOutlined />;

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        {/* northLayoutData: 높이 200, 분할 */}
        <Splitter.Panel defaultSize={200} min={120} max={1000}>
          <div style={{ height: '100%', paddingBottom: 10, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
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
                    <Button type="delete" onClick={deleteRow}>삭제</Button>
                  </>
                }
              >
                <SearchBar.Field label="제목">
                  <SearchBar.Input style={{ width: 350 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
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
                <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                  <SearchBar onSearch={search} searchText="찾기"
                    extra={
                      <>
                        {/* [E6] expandAll[+].Select (L122) → tree.expandAll() */}
                        <Button type="plus" onClick={() => {
                          const parents = new Set(classRows.map(r => r.parentTreeId));
                          setExpanded(classRows.filter(r => parents.has(r.classTreeId)).map(r => r.classTreeId));
                        }} />
                        {/* [E7] collapseAll[-].Select (L129) → tree.collapseAll() */}
                        <Button type="minus" onClick={() => setExpanded([])} />
                      </>
                    }
                  >
                    <SearchBar.Field label="문서분류">
                      <SearchBar.Input style={{ width: 120 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} />
                    </SearchBar.Field>
                  </SearchBar>
                  <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 4px' }}>
                    {treeData.length > 0 && (
                      <Tree
                        showIcon
                        icon={icon}
                        treeData={treeData}
                        expandedKeys={expanded}
                        onExpand={keys => setExpanded(keys)}
                        selectedKeys={selectedClass == null ? [] : [selectedClass]}
                        onSelect={onTreeSelect}
                      />
                    )}
                  </div>
                </div>
              </Splitter.Panel>
              <Splitter.Panel>
                <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
                  <Fbx01_TabPage_DocList ref={docList} />
                </div>
              </Splitter.Panel>
            </Splitter>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Fbx02_Popup_History boxId={historyBoxId} onClose={() => setHistoryBoxId(null)} />
    </div>
  );
};
