/**
 * [1110] 기초자료 > 20. 문서(전자결재) > 문서분류 (E16) — 같은 클래스가 관리자 > 03. 문서관리 > 문서분류 [1001] 메뉴에도 걸려 있다
 * AS-IS: myApp/client/vi/dcr/Dcr01_Tab_ClassTree.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L72-197: 왼쪽 28%(위 툴바 둘 — [검색 칸 150 "분류명"][조회]([문서분류복사] 관리자 회사 / [사용여부설정] 그 밖에서 ERP 상품이 S1이 아닐 때), [펼치기][감추기][업무등록][하위등록] + 트리 그리드),
 *   오른쪽 72%(Dcr01_Grid_DocType). 트리 그리드: getCustomTreeGrid(1) — 행번호 없음, 분류명 270 · 분류코드 80 · 수정 50 · 이동 50
 * UX보강(10): 검색 영역 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Splitter } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Dcr01_Edit_ClassTree, DcrClassTreeEdit } from './Dcr01_Edit_ClassTree';
import { Dcr01_Grid_DocType } from './Dcr01_Grid_DocType';
import { Dcr01_Lookup_DcrCopyAdmin } from './Dcr01_Lookup_DcrCopyAdmin';
import { Dcr01_Lookup_UseYn } from './Dcr01_Lookup_UseYn';
import { Dcr01_Move_TreeGrid } from './Dcr01_Move_TreeGrid';
import { findByName } from './dcr01Tree';

const gb = gbFor<DcrClassTree>();

/** 펼침·행 갱신(필터)이 그리드에 반영된 뒤 실행 */
const later = (fn: () => void) => setTimeout(fn, 150);

export const Dcr01_Tab_ClassTree: React.FC = () => {
  const user = useLoginUser();
  const tree = useTreeGrid<DcrClassTree>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [searchText, setSearchText] = useState('');
  const [productCode, setProductCode] = useState<string | null>(null);
  const [selected, setSelected] = useState<DcrClassTree | undefined>(undefined);   // retrievePage()가 오른쪽 그리드에 넘기는 문서분류
  const [editing, setEditing] = useState<{ model: DcrClassTreeEdit; title: string } | null>(null);
  const [moving, setMoving] = useState<DcrClassTree | null>(null);
  const [useYnOpen, setUseYnOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  /** refreshData: 다시 조회한 뒤 펼치고(select면 고르기까지) 할 분류 */
  const pendingSelect = useRef<{ id?: number; select: boolean } | null>(null);

  /** 행 선택 + 보이게 (treeGrid.getSelectionModel().select) */
  const selectRow = useCallback((id: number) => {
    const api = tree.gridRef.current?.api;
    const node = api?.getRowNode(String(id));
    node?.setSelected(true, true);
    if (node) api?.ensureNodeVisible(node, 'middle');
  }, [tree.gridRef]);

  // retrieve() L337-346 → getServiceResult() L244-263: 서비스 dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode C) → 트리를 비우고 다시 구성.
  //   refreshData가 있으면 펼치고(setExpanded) 고른다
  const retrieve = useCallback(async (id?: number, select = true) => {
    try {
      const list = await dcrApi.searchClassTree('C');
      pendingSelect.current = { id, select };
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, 'error'));
    }
  }, [tree]);

  useEffect(() => {
    const p = pendingSelect.current;
    if (!p) return;
    pendingSelect.current = null;
    if (p.id != null) {
      const id = p.id;
      tree.expandAncestors([id]);
      if (tree.hasChildren(id)) tree.toggle(id);
      if (p.select) later(() => selectRow(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.rows]);

  // [E0] 화면 열림 (생성자 L72-197) → retrieve(). 사용여부설정 버튼은 ERP 상품이 S1이 아닌 회사만 보인다
  useEffect(() => {
    void retrieve();
    dcrApi.getProductCode().then(setProductCode).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] searchText.KeyPress [Enter] (L82) · [E2] retrieveButton[조회].Select (L91) → search() L348-384: 모두 닫고 선택을 풀고, 이름에 검색어가 든 분류의 부모를 펼쳐 고른다
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!searchText) return;
    const { matches, focus } = findByName(tree.rows, searchText);
    if (matches.length === 0) return;
    tree.expandAncestors(matches.map(m => m.classTreeId));
    later(() => {
      selectRow(matches[matches.length - 1].classTreeId);   // 단일 선택이라 마지막으로 고른 것이 남는다
      const node = focus ? api?.getRowNode(String(focus.classTreeId)) : undefined;
      if (node) api?.ensureNodeVisible(node, 'middle');
    });
  };

  // insertDcrClass(parentId, title, actionCode) L285-313: 새 분류(회사 = 로그인 회사, 상위 = parentId, 유형 C, 사용 true, 관리자 회사면 adminYn true) → Dcr01_Edit_ClassTree. id는 저장 때 서버가 채번
  const insertDcrClass = (parentTreeId: number, title: string) =>
    setEditing({ model: { parentTreeId, adminYn: user.companyId === 0 ? 'true' : 'false' }, title });

  // [E6] insertChildButton[하위등록].Select (L119) → insertChildDcrClass() L265-273
  const insertChildDcrClass = () => {
    const parentModel = tree.gridRef.current?.api.getSelectedRows()[0];
    if (!parentModel) return message.warning('먼저 상위분류를 선택해주세요');
    insertDcrClass(parentModel.classTreeId, '하위분류 등록');
  };

  // editItem() L315-325: 선택한 분류로 Dcr01_Edit_ClassTree.editData(…, "edit", "문서분류 수정") (콜백: refreshData = 결과 → retrieve)
  const editItem = (row: DcrClassTree) => {
    selectRow(row.classTreeId);
    const { depth: _depth, ...rest } = row;
    setEditing({ model: rest, title: '문서분류 수정' });
  };

  // moveItem() L225-228: 선택한 분류로 Dcr01_Move_TreeGrid.open(treeGrid, 선택 행)
  const moveItem = (row: DcrClassTree) => {
    selectRow(row.classTreeId);
    setMoving(row);
  };

  // [E9] treeGrid.SelectionChanged [선택>0] (L180) → retrievePage() L332-335: 고른 분류로 gridDocType.retrieve(classTreeModel)
  const retrievePage = (row: DcrClassTree | undefined) => { if (row) setSelected(row); };

  // buildTreeGrid() L199-223: getCustomTreeGrid(1)
  const columnDefs = useMemo<ColDef<DcrClassTree>[]>(() => [
    tree.treeCol('classTreeName', 270, '분류명'),  // L215
    gb.text('classTreeCode', 80, '분류코드'),  // L216
    iconCell<DcrClassTree>('edit', 'actionEdit', 50, '수정', editItem),  // L217 ImageCell("TreeEdit")
    iconCell<DcrClassTree>('move', 'actionMove', 50, '이동', moveItem),  // L218 ImageCell("TreeChange")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="28%" min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
            <div style={{ flex: 'none', padding: '8px 8px 0' }}>
              {/* 조회 [E2]·[E1], 문서분류복사 [E8] adminUpdateButton (L132) → adminLookup() L327-330, 사용여부설정 [E7] useYnCheckButton (L126) → useYnCheck() L275-283 */}
              <SearchBar onSearch={search} extra={
                user.companyId === 0
                  ? <Button type="change" onClick={() => setCopyOpen(true)}>문서분류복사</Button>
                  : productCode !== 'S1' && <Button type="view" onClick={() => setUseYnOpen(true)}>사용여부설정</Button>
              }>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 150 }} placeholder="분류명" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <Space style={{ marginTop: 8, marginBottom: 8 }}>
                {/* [E3] expandAll[펼치기].Select (L98) → treeGrid.expandAll(), [E4] collapseAll[감추기].Select (L105) → treeGrid.collapseAll() */}
                <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
                <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
                {/* [E5] insertRootButton[업무등록].Select (L112) → insertDcrClass(0, "루트등록", "insert") */}
                <Button type="register" onClick={() => insertDcrClass(0, '루트등록')}>업무등록</Button>
                <Button type="register" onClick={insertChildDcrClass}>하위등록</Button>
              </Space>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<DcrClassTree> gridRef={tree.gridRef} {...tree.gridProps} rowNumber={false} columnDefs={columnDefs} onSelect={retrievePage} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', paddingLeft: 8, boxSizing: 'border-box' }}>
            <Dcr01_Grid_DocType classTree={selected} />
          </div>
        </Splitter.Panel>
      </Splitter>
      {editing && (
        <Dcr01_Edit_ClassTree model={editing.model} title={editing.title} onClose={() => setEditing(null)}
          onDone={id => { void retrieve(id); }} />
      )}
      <Dcr01_Move_TreeGrid model={moving} onClose={() => setMoving(null)} onMoved={id => { void retrieve(id, false); }} />
      <Dcr01_Lookup_UseYn open={useYnOpen} onClosed={() => { void retrieve(); }} onClose={() => setUseYnOpen(false)} />
      <Dcr01_Lookup_DcrCopyAdmin open={copyOpen} onClose={() => setCopyOpen(false)} />
    </div>
  );
};
