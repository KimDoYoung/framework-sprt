/**
 * [1087] 고유자산 > 10. 고유자산 등록 > 고유자산 기본등록 ① (W01)
 * AS-IS: myApp/client/vi/ast/Ast01_Tab_ClassTreeIntrinsic.java (391줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L57-149): west(폭 420) = 위 툴바(검색·찾기·+·-) + 자산구분 트리 + 아래 툴바(상위등록·하위등록·가져오기), center = Ast01_Grid_AstType
 * 운용자산 쪽 Ast01_Tab_ClassTreeManagement(R08)와 달리 assetType '1'(고유자산), 비고 열 없음, [가져오기]가 있다.
 * 스타일: TG (견본 — docs/page-style.md)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Splitter, Typography } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstClassTree } from '@/types/ast';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, iconCell } from '@/components/grid';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Ast01_Grid_AstType, Ast01GridAstTypeHandle } from './Ast01_Grid_AstType';
import { Ast01_Edit_ClassTree } from './Ast01_Edit_ClassTree';
import { Ast01_Move_ClassTree } from './Ast01_Move_ClassTree';

/** AS-IS 자산구분 (1:고유자산/2:운용자산) */
const ASSET_TYPE = '1';

/** 펼침이 그리드에 반영된 뒤 실행 */
const later = (fn: () => void) => setTimeout(fn, 150);

export const Ast01_Tab_ClassTreeIntrinsic: React.FC = () => {
  const user = useLoginUser();
  const isManager = user.userId < 0;   // LoginUser.getIsManager() (L121) — 서버 pullData도 같은 기준

  const tree = useTreeGrid<AstClassTree>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [astSearch, setAstSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AstClassTree | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<'insert' | 'update'>('insert');
  const [editParentId, setEditParentId] = useState<number | null>(null);
  const [editData, setEditData] = useState<AstClassTree | null>(null);
  const [moveClassTreeId, setMoveClassTreeId] = useState<number | null>(null);
  const [companyOpen, setCompanyOpen] = useState(false);

  const gridDocTypeRef = useRef<Ast01GridAstTypeHandle>(null);

  // retrieve() L271-290: ast.Ast01_ClassTree.selectByCompanyId (typeCode IC, assetType 1)
  const retrieve = useCallback(async () => {
    setLoading(true);
    setSelectedNode(null);
    gridDocTypeRef.current?.clear();
    try {
      const data = await astApi.searchClassTree({ typeCode: 'IC', assetType: ASSET_TYPE });
      tree.setRows(data);
      if (data.some((d) => d.parentTreeId > 0)) {
        setTimeout(() => tree.expandAncestors(data.map((d) => d.classTreeId)));
      }
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [tree.setRows, tree.expandAncestors]);

  // [E0] 화면 열림 (생성자 L57-149) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E1] astSearch.KeyPress [Enter] (L59) → search()
  // [E2] retrieveButton[찾기].Select (L67) → search()
  //   search() L292-352: 선택 해제·전부 접기 → 검색어가 있으면(대소문자 구분) 포함하는 노드의 조상을 펼치고,
  //   가장 깊은(같으면 처음) 노드를 선택·스크롤
  const search = () => {
    tree.gridRef.current?.api?.deselectAll();
    tree.collapseAll();
    if (!astSearch) return;
    const found = tree.rows.filter((r) => r.classTreeName?.indexOf(astSearch) > -1);
    if (found.length === 0) return;
    tree.expandAncestors(found.map((r) => r.classTreeId));
    const chk = found.reduce((a, b) => ((b.depth ?? 0) > (a.depth ?? 0) ? b : a));
    later(() => {
      const api = tree.gridRef.current?.api;
      const node = api?.getRowNode(String(chk.classTreeId));
      if (!node) return;
      node.setSelected(true, true);
      api?.ensureNodeVisible(node, 'middle');
    });
  };

  // insertAstClass(parentId, title, actionCode) L221-255: 새 모델(companyId, parentTreeId, IC, assetType 1, useYn true) + createCode → Ast01_Edit_ClassTree
  const insertAstClass = (parentId: number) => {
    setEditMode('insert');
    setEditParentId(parentId);
    setEditData(null);
    setEditOpen(true);
  };

  // [E5] insertRootButton[상위등록].Select (L85) → insertAstClass()  (parentId 0)
  // [E6] insertChildButton[하위등록].Select (L91) → insertChildAstClass() L211-219
  const insertChildAstClass = () => {
    if (!selectedNode) {
      message.warning('먼저 상위분류를 선택해주세요');
      return;
    }
    insertAstClass(selectedNode.classTreeId);
  };

  // [E7] dataPullButton[가져오기].Select (L97) → pullData() L356-386
  //   Sys01_Lookup_Company.open → 고른 회사를 targetCompanyId로 ast.Ast01_ClassTree.pullData → retrieve() + "작업 종료"
  const pullData = async (company: Company | null) => {
    setCompanyOpen(false);
    if (!company) return;
    try {
      await astApi.pullClassTreeData(company.companyId);
      await retrieve();
      message.info('작업 종료');
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E8] treeGrid.SelectionChanged [선택>0] (L134) → retrievePage() L266-269 → gridDocType.retrieve(선택 모델)
  const handleSelect = (row: AstClassTree | undefined) => {
    setSelectedNode(row ?? null);
    if (row) {
      gridDocTypeRef.current?.retrieve(row);
    } else {
      gridDocTypeRef.current?.clear();
    }
  };

  // buildTreeGrid() L160-185: getTreeGrid — 자산구분(300), 상세(50), 이동(50). 비고 열은 주석 처리돼 없다
  const columnDefs: ColDef<AstClassTree>[] = useMemo(
    () => [
      { ...tree.treeCol('classTreeName', 300, '자산구분'), pinned: 'left' as const },  // 가로 스크롤해도 자산구분 고정(TG)
      iconCell<AstClassTree>('edit', 'detailCol', 50, '상세', (row) => {
        setEditMode('update');
        setEditData(row);
        setEditParentId(row.parentTreeId);
        setEditOpen(true);
      }),
      iconCell<AstClassTree>('move', 'moveCol', 50, '이동', (row) => setMoveClassTreeId(row.classTreeId)),
    ],
    [tree.treeCol]
  );

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={420} min={300}>
          {/* border-box: 테두리가 높이 100%에 더해져 패널보다 커지면 스크롤바가 2개 생긴다 */}
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ minHeight: 50, display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 16, rowGap: 8, padding: 8, flex: 'none', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                <Typography.Text strong style={{ flex: 'none' }}>검색</Typography.Text>
                {/* [E1] astSearch.KeyPress [Enter] */}
                <Input style={{ width: 150, flex: 'none' }} allowClear value={astSearch} onChange={(e) => setAstSearch(e.target.value)} onPressEnter={search} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                {/* [E2] retrieveButton[찾기].Select */}
                <Button type="search" onClick={search}>찾기</Button>
                {/* [E3] expandAll[+].Select (L73) → 인라인 L73-78 treeGrid.expandAll() */}
                <Button type="expand" onClick={tree.expandAll}>+</Button>
                {/* [E4] collapseAll[-].Select (L79) → 인라인 L79-84 treeGrid.collapseAll() */}
                <Button type="collapse" onClick={tree.collapseAll}>-</Button>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<AstClassTree>
                gridRef={tree.gridRef}
                {...tree.gridProps}
                rowNumber={false}
                columnDefs={columnDefs}
                loading={loading}
                onSelect={handleSelect}
              />
            </div>
            <div style={{ minHeight: 50, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: 8, flex: 'none', boxSizing: 'border-box', borderTop: '1px solid #d9d9d9' }}>
              {/* [E5] insertRootButton[상위등록].Select (L85) */}
              <Button type="register" onClick={() => insertAstClass(0)}>상위등록</Button>
              {/* [E6] insertChildButton[하위등록].Select (L91) */}
              <Button type="register" onClick={insertChildAstClass}>하위등록</Button>
              {/* [E7] dataPullButton[가져오기].Select (L97) — LoginUser.getIsManager()일 때만 (L117-119) */}
              {isManager && <Button type="download" onClick={() => setCompanyOpen(true)}>가져오기</Button>}
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderLeft: 'none' }}>
            <Ast01_Grid_AstType ref={gridDocTypeRef} assetType={ASSET_TYPE} onRefreshParent={retrieve} />
          </div>
        </Splitter.Panel>
      </Splitter>

      <Ast01_Edit_ClassTree
        open={editOpen}
        mode={editMode}
        parentId={editParentId}
        data={editData}
        assetType={ASSET_TYPE}
        onClose={() => setEditOpen(false)}
        onSuccess={retrieve}
      />

      <Ast01_Move_ClassTree
        open={moveClassTreeId != null}
        classTreeId={moveClassTreeId}
        assetType={ASSET_TYPE}
        onClose={() => setMoveClassTreeId(null)}
        onSuccess={retrieve}
      />

      <Sys01_Lookup_Company open={companyOpen} onResult={pullData} onClose={() => setCompanyOpen(false)} />
    </div>
  );
};

export default Ast01_Tab_ClassTreeIntrinsic;
