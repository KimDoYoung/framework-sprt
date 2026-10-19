/**
 * [1077] 관리자 > 메뉴 관리  (A09)
 * AS-IS: myApp/client/vi/sys/Sys06_Tab_Menu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L58-96): center = 툴바(높이 50) + 매뉴 트리 그리드, east = Sys01_Grid_CompanyMenu(폭 600, 최대 1000, 분할), 여백 20
 * UX보강(10) B12-1: 검색어 칸 x(UX-04)만. 원본 툴바에 조회 버튼이 없어(Enter 검색·새로고침) SearchBar는 쓰지 않는다(조회·초기화 버튼이 생기므로)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Splitter, Typography } from 'antd';
import { EditOutlined, SwapOutlined } from '@ant-design/icons';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MenuNode, MenuSaveReq } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Sys01_Grid_CompanyMenu } from './Sys01_Grid_CompanyMenu';
import { Sys06_Edit_Menu } from './Sys06_Edit_Menu';
import { Sys06_Lookup_CopyMulti } from './Sys06_Lookup_CopyMulti';
import { Sys06_Select_Menu } from './Sys06_Select_Menu';

const gb = gbFor<MenuNode>();

/** 펼침·행 갱신(필터)이 그리드에 반영된 뒤 실행 */
const later = (fn: () => void) => setTimeout(fn, 150);

/** 다시 조회한 뒤 할 일 (AS-IS updatedModel / 이동 대상 펼치기) */
interface Pending {
  selectId?: number;
  expandIds?: number[];
}

export const Sys06_Tab_Menu: React.FC = () => {
  const tree = useTreeGrid<MenuNode>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
  const [searchText, setSearchText] = useState('');
  const [menuId, setMenuId] = useState<number>();
  const [editing, setEditing] = useState<MenuSaveReq | null>(null);
  const [moving, setMoving] = useState<MenuNode | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const pending = useRef<Pending | null>(null);

  /** 행 선택 + 보이게 (treeGrid.getSelectionModel().select / focusRow) */
  const selectRow = useCallback((id: number, focusId = id) => {
    const api = tree.gridRef.current?.api;
    const node = api?.getRowNode(String(id));
    node?.setSelected(true, true);
    const focus = api?.getRowNode(String(focusId));
    if (focus) {
      api?.ensureColumnVisible('menuNm');
      api?.ensureNodeVisible(focus, 'middle');
    }
  }, [tree.gridRef]);

  // retrieve() L247-254: saveExpandedState() → 서비스 sys.Sys06_Menu.selectByAll → getServiceResult L308-346
  //   (트리 다시 구성 → restoreExpandedState() → updatedModel이 있으면 펼치고 선택·스크롤). 펼침은 그대로 두고 행만 바꾼다
  const retrieve = useCallback(async (after?: Pending) => {
    try {
      const list = await sysApi.getMenuTree();
      pending.current = after ?? null;
      tree.setRowsState(list);
    } catch (err) {
      message.error(errorMessage(err, 'error'));
    }
  }, [tree]);

  // 다시 조회가 그리드에 반영된 뒤(useTreeGrid 필터 갱신 다음) updatedModel 처리
  useEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    if (p.expandIds?.length) {
      tree.expandAncestors(p.expandIds);
      p.expandIds.forEach(id => { if (tree.hasChildren(id) && !tree.expanded.has(id)) tree.toggle(id); });
    }
    if (p.selectId != null) {
      const id = p.selectId;
      tree.expandAncestors([id]);
      if (tree.hasChildren(id) && !tree.expanded.has(id)) tree.toggle(id);
      later(() => selectRow(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.rows]);

  // [E0] 화면 열림 (생성자 L58-96) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E1] searchText.KeyPress [Enter] (L100) → search() L157-196
  //   선택 해제·전부 접기 → (매뉴명+클래스명+화면번호) 소문자에 검색어가 있으면 조상을 펼치고 선택(단일 선택이라 마지막 매치가 남는다),
  //   가장 깊은(같으면 처음) 매치로 스크롤. 원본의 level 비교는 level이 SQL에 없어 null 언박싱 예외 — 의도대로 옮김(작업방법 E1)
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    const findText = searchText.toLowerCase();
    if (!findText) return;
    const found = tree.rows.filter(m => `${m.menuNm}${m.classNm ?? 'null'}${m.menuNo ?? 'null'}`.toLowerCase().includes(findText));
    if (found.length === 0) return;
    tree.expandAncestors(found.map(m => m.menuId));
    const chk = found.reduce((a, b) => (b.depth > a.depth ? b : a));
    later(() => selectRow(found[found.length - 1].menuId, chk.menuId));
  };

  // editMenu() L236-245: 선택한 매뉴로 Sys06_Edit_Menu (콜백: updatedModel = 결과 → retrieve)
  const editMenu = (row: MenuNode) => {
    selectRow(row.menuId);
    const { depth: _depth, ...rest } = row;
    setEditing(rest);
  };

  // moveMenu() L231-234: Sys06_Select_Menu.open(treeGrid, 선택한 매뉴)
  const moveMenu = (row: MenuNode) => {
    selectRow(row.menuId);
    setMoving(row);
  };

  // insertMenu(parentId) L267-287: 새 모델(parentId, note "insert menu") → Sys06_Edit_Menu. 원본이 열기 전에 받던 getSeq는 저장 때 서버가 채번
  const insertMenu = (parentId: number) => setEditing({
    parentId, menuNm: '', note: 'insert menu', useYn: 'false', addTitleUseYn: 'false', mobiUseYn: 'false',
  });

  // insertChildMenu() L289-305
  const insertChildMenu = () => {
    const parentModel = tree.gridRef.current?.api.getSelectedRows()[0];
    if (!parentModel) return message.warning('선택된 상위 매뉴가 없습니다');
    // objectID가 있으면 하위매뉴를 등록할 수 없다
    if (parentModel.classNm != null) return message.warning('오브젝트에는 하위 매뉴를 등록할 수 없습니다');
    if (tree.hasChildren(parentModel.menuId) && !tree.expanded.has(parentModel.menuId)) tree.toggle(parentModel.menuId);
    insertMenu(parentModel.menuId);
  };

  /** 수정·이동 칸: ImageCell("TreeEdit" / "TreeChange") */
  const actionCell = (icon: React.ReactNode, onClick: (row: MenuNode) => void) => (p: CustomCellRendererProps<MenuNode>) =>
    p.data ? (
      <span style={{ cursor: 'pointer', color: '#1677ff' }} onClick={e => { e.stopPropagation(); onClick(p.data!); }}>{icon}</span>
    ) : null;

  // buildTreeGrid() L198-229: getTreeGrid(1) — 행번호 없음, 트리 컬럼 = 매뉴명, 정렬 없음
  const columnDefs = useMemo<ColDef<MenuNode>[]>(() => [
    tree.treeCol('menuNm', 400, '매뉴명'),  // L215
    { colId: 'edit', headerName: '수정', width: 45, cellStyle: { textAlign: 'center' }, cellRenderer: actionCell(<EditOutlined />, editMenu) },  // L216
    { colId: 'move', headerName: '이동', width: 45, cellStyle: { textAlign: 'center' }, cellRenderer: actionCell(<SwapOutlined />, moveMenu) },  // L217
    gb.booleanYn2('useYn', 45, '사용'),  // L218
    gb.booleanYn2('addTitleUseYn', 45, '겸직<br>사용'),  // L219
    gb.booleanYn2('mobiUseYn', 50, '모바일'),  // L220
    gb.textCenter('seq', 50, '순서'),  // L221
    gb.textCenter('menuNo', 60, '화면번호'),  // L222
    gb.text('classNm', 200, '클래스명', { editor: 'text' }),  // L223 편집은 화면 값만(원본에 저장 경로 없음)
    gb.text('note', 300, '화면안내'),  // L224
    gb.text('menualUrl', 300, '비고'),  // L225
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel min={300}>
          {/* border-box: 테두리(2px)가 높이 100%에 더해져 패널보다 커지면 스크롤바가 2개 생긴다 */}
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
              <Typography.Text strong style={{ flex: 'none' }}>매뉴구성</Typography.Text>
              <Input style={{ width: 200, flex: 'none' }} allowClear value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={search} />
              {/* [E2] retrieveButton[새로고침].Select (L108) → retrieve() */}
              <Button type="reset" onClick={() => retrieve()}>새로고침</Button>
              {/* [E3] createRoot[루트매뉴 등록].Select (L114) → insertMenu(0) — root menu는 parentId가 0 */}
              <Button type="register" onClick={() => insertMenu(0)}>루트매뉴 등록</Button>
              {/* [E4] addSubMenu[하위매뉴 등록].Select (L121) → insertChildMenu() */}
              <Button type="register" onClick={insertChildMenu}>하위매뉴 등록</Button>
              {/* [E5] collapseAll[감추기].Select (L127) → treeGrid.collapseAll() */}
              <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
              {/* [E6] copyButton[일괄복사].Select (L133) → Sys06_Lookup_CopyMulti.open(callback: retrieve()) */}
              <Button type="change" onClick={() => setCopyOpen(true)}>일괄복사</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E7] treeGrid.SelectionChanged [data != null] (L146) → companyMenu.retrieve(menuId) */}
              <SingleGrid<MenuNode>
                gridRef={tree.gridRef}
                {...tree.gridProps}
                rowNumber={false}
                columnDefs={columnDefs}
                onSelect={r => r && setMenuId(r.menuId)}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={600} max={1000} min={200}>
          <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <Sys01_Grid_CompanyMenu menuId={menuId} />
          </div>
        </Splitter.Panel>
      </Splitter>

      <Sys06_Edit_Menu menu={editing} onClose={() => setEditing(null)} onDone={id => retrieve({ selectId: id })} />
      <Sys06_Select_Menu menu={moving} onClose={() => setMoving(null)} onMoved={m => retrieve({ expandIds: [m.parentId] })} />
      <Sys06_Lookup_CopyMulti open={copyOpen} onClose={() => { setCopyOpen(false); retrieve(); }} />
    </div>
  );
};
