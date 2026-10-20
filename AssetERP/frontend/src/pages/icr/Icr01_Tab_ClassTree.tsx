/**
 * [1347] 준법감시 > 01. 법규관리 > 내규관리 (H09)
 * AS-IS: myApp/client/vi/icr/Icr01_Tab_ClassTree.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L99-144: 왼쪽(455, 분할) = 툴바 2줄(내규분류 검색 · [찾기] / [펼치기][감추기][상위등록][하위등록]) + 내규분류 트리(분류명 250·분류코드 100·수정·이동),
 *   가운데 = 내규 그리드(Icr01_Grid_IcrType). 트리에서 분류를 고르면 그 분류와 모든 하위의 내규를 보여 준다
 * UX보강(10): 왼쪽 검색 줄 = SearchBar(UX-01·04). 조건이 하나라 초기화(UX-02)는 없다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Splitter } from 'antd';
import { icrApi } from '@/api/icr';
import { errorMessage } from '@/api/client';
import { IcrClassTreeNode } from '@/types/icr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Icr01_Edit_ClassTree, IcrClassEditTarget } from './Icr01_Edit_ClassTree';
import { Icr01_Grid_IcrType } from './Icr01_Grid_IcrType';
import { Icr01_Move_TreeGrid } from './Icr01_Move_TreeGrid';

const gb = gbFor<IcrClassTreeNode>();

export const Icr01_Tab_ClassTree: React.FC = () => {
  const tree = useTreeGrid<IcrClassTreeNode>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [icrSearch, setIcrSearch] = useState('');
  const [selected, setSelected] = useState<IcrClassTreeNode | null>(null);
  const [editTarget, setEditTarget] = useState<IcrClassEditTarget | null>(null);
  const [moveTarget, setMoveTarget] = useState<IcrClassTreeNode | null>(null);
  /** refreshData: 등록·수정·이동 뒤 다시 조회하면 펼치고 선택할 분류 */
  const refreshData = useRef<number | null>(null);
  const loaded = useRef(false);

  const selectNode = useCallback((id: number) => {
    setTimeout(() => {
      const node = tree.gridRef.current?.api?.getRowNode(String(id));
      node?.setSelected(true, true);
      if (node) tree.gridRef.current?.api?.ensureNodeVisible(node);
    });
  }, [tree.gridRef]);

  // retrieve() L272-279: 서비스 icr.Icr01_ClassTree.selectByCompanyId(companyId, typeCode IC) → getServiceResult() L190-209
  const retrieve = useCallback(async () => {
    try {
      tree.setRows(await icrApi.searchClassTree('IC'));
      loaded.current = true;
    } catch (err) {
      tree.setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.setRows]);

  // getServiceResult() L199-205: refreshData가 있으면 그 분류를 펼치고 선택한다 (보이도록 조상도 펼친다)
  useEffect(() => {
    if (!loaded.current) return;
    loaded.current = false;
    const id = refreshData.current;
    refreshData.current = null;
    if (id == null) return;
    tree.expandAncestors([id, ...tree.rows.filter(r => r.parentTreeId === id).map(r => r.classTreeId)]);
    selectNode(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.rows]);

  // [E0] 화면 열림 (생성자 L54-144) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E1] icrSearch.KeyPress [Enter] (L56) → search(), [E2] retrieveButton[찾기].Select (L64) → search()
  // search() L281-317: 선택을 풀고 모두 접은 뒤, 분류명에 검색어가 든 분류의 상위를 펼치고 가장 깊은 첫 분류를 선택해 보여 준다
  const search = () => {
    tree.gridRef.current?.api?.deselectAll();
    tree.collapseAll();
    if (!icrSearch) return;
    let chk: IcrClassTreeNode | null = null;
    const found: number[] = [];
    tree.rows.forEach(r => {
      if ((r.classTreeName ?? '').indexOf(icrSearch) > -1) {
        found.push(r.classTreeId);
        if (chk == null || (r.depth ?? 0) > (chk.depth ?? 0)) chk = r;
      }
    });
    if (found.length === 0) return;
    tree.expandAncestors(found);
    if (chk) selectNode((chk as IcrClassTreeNode).classTreeId);
  };

  // editItem() L255-265: Icr01_Edit_ClassTree.editData(treeGrid, 선택 분류, "edit", "내규분류 수정", callback → refreshData = result, retrieve())
  const editItem = (row: IcrClassTreeNode) => {
    tree.gridRef.current?.api?.getRowNode(String(row.classTreeId))?.setSelected(true, true);
    setEditTarget({ actionCode: 'edit', titleName: '내규분류 수정', classTreeModel: row });
  };

  // insertIcsClass(parentId, title, actionCode) L231-253: 새 id(DBUtil.setSeq)는 서버가 등록할 때 채번. 회사·상위·구분 IC·사용 true
  const insertIcsClass = (parentId: number, title: string) =>
    setEditTarget({ actionCode: 'insert', titleName: title, classTreeModel: { parentTreeId: parentId } });

  // [E6] insertChildButton[하위등록].Select (L88) → insertChildIcsClass() L221-229
  const insertChildIcsClass = () => {
    const parentModel = tree.gridRef.current?.api?.getSelectedRows()[0];
    if (!parentModel) {
      message.warning('먼저 상위분류를 선택해주세요');
      return;
    }
    insertIcsClass(parentModel.classTreeId, '하위분류 등록');
  };

  // buildTreeGrid() L146-169 — getCustomTreeGrid(1): 트리 컬럼 = 분류명, 행번호 숨김(setRowNumHidden)
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 250, '분류명'),  // L163
    gb.textCenter('classTreeCode', 100, '분류코드'),  // L164
    iconCell<IcrClassTreeNode>('edit', 'actionCellEdit', 50, '수정', row => editItem(row)),  // L165 editInfoCell(TreeEdit) → editItem()
    iconCell<IcrClassTreeNode>('move', 'actionCellMove', 50, '이동', row => {  // L166 moveCell(TreeChange) → moveItem()
      tree.gridRef.current?.api?.getRowNode(String(row.classTreeId))?.setSelected(true, true);
      setMoveTarget(row);
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol, tree.rows]);

  return (
    <>
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={475} min={300} max={900}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 0 20px 20px', boxSizing: 'border-box' }}>
          <SearchBar searchText="찾기" onSearch={search}>
            <SearchBar.Field label="내규분류">
              <SearchBar.Input style={{ width: 150 }} value={icrSearch} onChange={e => setIcrSearch(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <Space wrap>
            {/* [E3] expandAll[펼치기].Select (L70) → treeGrid.expandAll() */}
            <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
            {/* [E4] collapseAll[감추기].Select (L76) → treeGrid.collapseAll() */}
            <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
            {/* [E5] insertRootButton[상위등록].Select (L82) → insertIcsClass(0, "루트등록", "insert") */}
            <Button type="register" onClick={() => insertIcsClass(0, '루트등록')}>상위등록</Button>
            <Button type="register" onClick={insertChildIcsClass}>하위등록</Button>
            {/* [E7 생략] managerButton[통제그룹담당자 지정].Select (L94) → insertManager() L211-219: buttonBar에 넣지 않아 화면에 없다(Icr01_Lookup_Manager는 도달 불가) */}
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E8] treeGrid.SelectionChanged [선택>0] (L129) → retrievePage() L267-270: 내규 그리드를 고른 분류로 조회 */}
            <SingleGrid<IcrClassTreeNode>
              gridRef={tree.gridRef}
              {...tree.gridProps}
              columnDefs={columnDefs}
              rowNumber={false}
              sortable={false}
              onSelect={row => { if (row) setSelected(row); }}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ height: '100%', padding: '20px 20px 22px 8px', boxSizing: 'border-box' }}>
          <Icr01_Grid_IcrType classTreeId={selected?.classTreeId ?? null} />
        </div>
      </Splitter.Panel>
    </Splitter>
    {/* Modal·조회창은 Splitter의 자식이 아니라 밖에 둔다(패널로 세어져 레이아웃이 깨진다) */}
      <Icr01_Edit_ClassTree
        target={editTarget}
        onClose={() => setEditTarget(null)}
        // callback.execute(result): refreshData = result; retrieve()
        onSaved={model => { refreshData.current = model?.classTreeId ?? null; void retrieve(); }}
      />
      <Icr01_Move_TreeGrid
        classTreeModel={moveTarget}
        // moveTree() 뒤: 새 상위를 펼치고(옮긴 분류도 보이게) 다시 읽는다
        onMoved={moved => { refreshData.current = moved.classTreeId; void retrieve(); }}
        onClose={() => setMoveTarget(null)}
      />
    </>
  );
};
