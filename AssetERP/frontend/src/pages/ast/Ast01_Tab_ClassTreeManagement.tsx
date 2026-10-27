/**
 * 펀드자산 종목기본 (R08) — 펀드관리 > 80. 펀드자산 > 펀드자산 종목기본 #1117
 * AS-IS: myApp/client/vi/ast/Ast01_Tab_ClassTreeManagement.java (306줄)
 * 페이지 스타일: SGT (트리 그리드 + 상세 그리드 좌우 분할)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstClassTree } from '@/types/ast';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import {
  Ast01_Grid_AstTypeManagement,
  Ast01GridAstTypeManagementHandle,
} from './Ast01_Grid_AstTypeManagement';
import { Ast01_Edit_ClassTree } from './Ast01_Edit_ClassTree';
import { Ast01_Move_ClassTree } from './Ast01_Move_ClassTree';
import { Ast01_Lookup_MoveClassTree } from './Ast01_Lookup_MoveClassTree';

const gb = gbFor<AstClassTree>();

export const Ast01_Tab_ClassTreeManagement: React.FC = () => {
  const [astSearch, setAstSearch] = useState('');
  const [rows, setRows] = useState<AstClassTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AstClassTree | null>(null);

  // 모달 상태
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'insert' | 'update'>('insert');
  const [editParentId, setEditParentId] = useState<number | null>(null);
  const [editData, setEditData] = useState<AstClassTree | null>(null);

  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [moveClassTreeId, setMoveClassTreeId] = useState<number | null>(null);

  const [lookupMoveOpen, setLookupMoveOpen] = useState(false);

  const gridDocTypeRef = useRef<Ast01GridAstTypeManagementHandle>(null);

  // useTreeGrid 설정
  const tree = useTreeGrid<AstClassTree>({
    idField: 'classTreeId',
    parentField: 'parentTreeId',
    depthField: 'depth',
  });

  // [E0] 화면 열림 (생성자 L51-132) → retrieve()
  const retrieve = useCallback(async () => {
    setLoading(true);
    setSelectedNode(null);
    gridDocTypeRef.current?.clear();
    try {
      const data = await astApi.searchClassTree({ typeCode: 'IC' });
      setRows(data);
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    retrieve();
  }, [retrieve]);

  // [E1] astSearch.KeyPress [Enter] (L53) → search()
  // [E2] retrieveButton[찾기].Select (L61) → search()
  const search = () => {
    if (!astSearch.trim()) return;
    const found = rows.find((r) => r.classTreeName.includes(astSearch.trim()));
    if (found) {
      tree.expandAll();
    }
  };

  // [E3] expandAll[펼치기].Select (L67) → 인라인 L67-72
  const handleExpandAll = () => {
    tree.expandAll();
  };

  // [E4] collapseAll[감추기].Select (L73) → 인라인 L73-78
  const handleCollapseAll = () => {
    tree.collapseAll();
  };

  // [E5] insertRootButton[상위등록].Select (L79) → insertAstClass(0, "상위등록", "insert")
  const insertAstClass = () => {
    setEditMode('insert');
    setEditParentId(0);
    setEditData(null);
    setEditModalOpen(true);
  };

  // [E6] insertChildButton[하위등록].Select (L85) → insertChildAstClass()
  const insertChildAstClass = () => {
    if (!selectedNode) {
      message.warning('먼저 상위분류를 선택해주세요');
      return;
    }
    setEditMode('insert');
    setEditParentId(selectedNode.classTreeId);
    setEditData(null);
    setEditModalOpen(true);
  };

  // [E7] treeGrid.SelectionChanged [선택>0] (L115) → retrievePage()
  const handleSelect = (row: AstClassTree | undefined) => {
    setSelectedNode(row ?? null);
    if (row) {
      gridDocTypeRef.current?.retrieve(row);
    } else {
      gridDocTypeRef.current?.clear();
    }
  };

  // 트리 컬럼 정의
  const columnDefs: ColDef<AstClassTree>[] = useMemo(
    () => [
      gb.text('classTreeName', 350, '자산구분'),
      gb.textArea('note', 200, '비고'),
      iconCell<AstClassTree>('move', 'moveCol', 50, '이동', (row) => {
        setMoveClassTreeId(row.classTreeId);
        setMoveModalOpen(true);
      }),
      iconCell<AstClassTree>('edit', 'detailCol', 50, '상세', (row) => {
        setEditMode('update');
        setEditData(row);
        setEditParentId(row.parentTreeId);
        setEditModalOpen(true);
      }),
    ],
    []
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: 8,
      }}
    >
      {/* North SearchBar */}
      <SearchBar
        onSearch={search}
        searchText="찾기"
        extra={
          <>
            {/* [E3] expandAll[펼치기].Select */}
            <Button type="expand" onClick={handleExpandAll}>
              펼치기
            </Button>
            {/* [E4] collapseAll[감추기].Select */}
            <Button type="collapse" onClick={handleCollapseAll}>
              감추기
            </Button>
            {/* [E5] insertRootButton[상위등록].Select */}
            <Button type="register" onClick={insertAstClass}>
              상위등록
            </Button>
            {/* [E6] insertChildButton[하위등록].Select */}
            <Button type="register" onClick={insertChildAstClass}>
              하위등록
            </Button>
          </>
        }
      >
        <SearchBar.Field label="검색">
          {/* [E1] astSearch.KeyPress [Enter] */}
          {/* [E2] retrieveButton[찾기].Select */}
          <SearchBar.Input
            value={astSearch}
            onChange={(e) => setAstSearch(e.target.value)}
            placeholder="검색어 입력"
            style={{ width: 150 }}
          />
        </SearchBar.Field>
      </SearchBar>

      {/* West + Center Splitter */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%' }}>
          {/* West Widget: 760px */}
          <Splitter.Panel defaultSize={760} min={400} max={900}>
            <div style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
              <SingleGrid<AstClassTree>
                columnDefs={columnDefs}
                loading={loading}
                onSelect={handleSelect}
                {...tree.gridProps}
              />
            </div>
          </Splitter.Panel>

          {/* Center Widget: gridDocType */}
          <Splitter.Panel>
            <div style={{ width: '100%', height: '100%', paddingLeft: 8, boxSizing: 'border-box' }}>
              <Ast01_Grid_AstTypeManagement ref={gridDocTypeRef} onRefreshParent={retrieve} />
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>

      {/* 모달들 */}
      <Ast01_Edit_ClassTree
        open={editModalOpen}
        mode={editMode}
        parentId={editParentId}
        data={editData}
        onClose={() => setEditModalOpen(false)}
        onSuccess={retrieve}
      />

      <Ast01_Move_ClassTree
        open={moveModalOpen}
        classTreeId={moveClassTreeId}
        onClose={() => setMoveModalOpen(false)}
        onSuccess={retrieve}
      />

      <Ast01_Lookup_MoveClassTree
        open={lookupMoveOpen}
        onClose={() => setLookupMoveOpen(false)}
      />
    </div>
  );
};

export default Ast01_Tab_ClassTreeManagement;
