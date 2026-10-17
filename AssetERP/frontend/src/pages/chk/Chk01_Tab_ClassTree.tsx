/**
 * [1244] 기초자료 > 00. 내부통제 > 일일점검내역 분류(관리자) (E06)
 * AS-IS: myApp/client/vi/chk/Chk01_Tab_ClassTree.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L42-62: 여백 20, 위 = 툴바(높이 50) [조회][상위분류 등록][하위분류 등록], 아래 = 트리 그리드(클래스명 500 · 수정 50 · 사용 50 · 순서 100 · 비고 300 · 매뉴링크 300), 테두리
 * 그리드: getTreeGrid(1) — 행번호 없음, 트리 컬럼 = 클래스명, 정렬 없음
 * UX보강(10): 검색 조건이 없는 툴바라 SearchBar는 쓰지 않는다(조회 버튼 하나 — UX-01은 `Button` 부품이 처리)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkClassTree } from '@/types/chk';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Chk01_Edit_ClassTree, ChkClassTreeEdit } from './Chk01_Edit_ClassTree';

const gb = gbFor<ChkClassTree>();

/** 펼침·행 갱신(필터)이 그리드에 반영된 뒤 실행 */
const later = (fn: () => void) => setTimeout(fn, 150);

export const Chk01_Tab_ClassTree: React.FC = () => {
  const tree = useTreeGrid<ChkClassTree>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [editing, setEditing] = useState<ChkClassTreeEdit | null>(null);
  const pendingSelect = useRef<{ id?: number } | null>(null);   // updatedModel: 다시 조회한 뒤 펼치고 고를 분류

  /** 행 선택 + 보이게 (treeGrid.getSelectionModel().select) */
  const selectRow = useCallback((id: number) => {
    const api = tree.gridRef.current?.api;
    const node = api?.getRowNode(String(id));
    node?.setSelected(true, true);
    if (node) api?.ensureNodeVisible(node, 'middle');
  }, [tree.gridRef]);

  // retrieve() L121-127: 서비스 chk.Chk01_ClassTree.selectByAll → getServiceResult L181-206
  //   (트리를 비우고 다시 구성 → 맨 위 분류만 펼침 → updatedModel이 있으면 펼치고 선택)
  const retrieve = useCallback(async (select?: number) => {
    try {
      const list = await chkApi.searchClassTree();
      pendingSelect.current = { id: select };
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, 'error'));
    }
  }, [tree]);

  // 다시 조회가 그리드에 반영된 뒤: 맨 위 분류를 펼치고(setExpanded(item, true)), updatedModel을 펼쳐 고른다
  useEffect(() => {
    const p = pendingSelect.current;
    if (!p) return;
    pendingSelect.current = null;
    tree.rows.filter(r => r.parentTreeId === 0 && tree.hasChildren(r.classTreeId)).forEach(r => tree.toggle(r.classTreeId));
    if (p.id != null) {
      const id = p.id;
      tree.expandAncestors([id]);
      if (tree.hasChildren(id)) tree.toggle(id);
      later(() => selectRow(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.rows]);

  // [E0] 화면 열림 (생성자 L42-62) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // insertClassTree(parentId) L141-161: 새 분류(상위 = parentId, 사용 true) → Chk01_Edit_ClassTree.insert. 원본이 열기 전에 받던 getSeq는 저장 때 서버가 채번
  const insertClassTree = (parentTreeId: number) => setEditing({ parentTreeId, useYn: 'true' });

  // [E3] addChildButton[하위분류 등록].Select (L80) → insertChildClassTree() L163-178
  const insertChildClassTree = () => {
    const parentModel = tree.gridRef.current?.api.getSelectedRows()[0];
    if (!parentModel) return message.warning('선택된 분류가 없습니다');
    if (parentModel.parentTreeId !== 0) return message.warning('해당 분류에는 하위 분류를 등록할 수 없습니다');
    if (tree.hasChildren(parentModel.classTreeId) && !tree.expanded.has(parentModel.classTreeId)) tree.toggle(parentModel.classTreeId);
    insertClassTree(parentModel.classTreeId);
  };

  // editClassTree() L110-119: 선택한 분류로 Chk01_Edit_ClassTree.edit (콜백: updatedModel = 결과 → retrieve)
  const editClassTree = (row: ChkClassTree) => {
    selectRow(row.classTreeId);
    const { depth: _depth, ...rest } = row;
    setEditing(rest);
  };

  /** 수정 칸: ImageCell("TreeEdit") */
  const actionCell = (p: CustomCellRendererProps<ChkClassTree>) =>
    p.data ? (
      <span style={{ cursor: 'pointer', color: '#1677ff' }} onClick={e => { e.stopPropagation(); editClassTree(p.data!); }}><EditOutlined /></span>
    ) : null;

  // buildTreeGrid() L89-108: getTreeGrid(1)
  const columnDefs = useMemo<ColDef<ChkClassTree>[]>(() => [
    tree.treeCol('classTreeName', 500, '클래스명'),  // L101
    { colId: 'actionCell', headerName: '수정', width: 50, cellStyle: { textAlign: 'center' }, cellRenderer: actionCell },  // L102
    gb.boolean('useYn', 50, '사용', { editable: true }),  // L103 addBoolean — 체크박스(클릭하면 값이 바뀌지만 이 화면에는 저장이 없다 — 원본도 같다)
    gb.long('seq', 100, '순서'),  // L104
    gb.text('note', 300, '비고'),  // L105
    gb.text('linkName', 300, '매뉴링크'),  // L106
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px', flex: 'none' }}>
          {/* [E1] retrieveButton[조회].Select (L67) → retrieve() */}
          <Button type="search" onClick={() => retrieve()}>조회</Button>
          {/* [E2] addParentButton[상위분류 등록].Select (L73) → insertClassTree(0) — 맨 위 분류는 parentId가 0 */}
          <Button type="register" onClick={() => insertClassTree(0)}>상위분류 등록</Button>
          <Button type="register" onClick={insertChildClassTree}>하위분류 등록</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<ChkClassTree> gridRef={tree.gridRef} {...tree.gridProps} rowNumber={false} columnDefs={columnDefs} />
        </div>
      </div>
      <Chk01_Edit_ClassTree model={editing} onClose={() => setEditing(null)} onDone={id => { void retrieve(id); }} />
    </div>
  );
};
