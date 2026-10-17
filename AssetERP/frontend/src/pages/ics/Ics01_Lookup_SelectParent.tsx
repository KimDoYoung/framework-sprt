/**
 * 법규 분류 선택 창 (E03) — Ics01_Lookup_SelectMulti의 "분류" 칸에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_SelectParent.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L53-121: 모달 600×700 "법규 분류", 위 툴바(검색칸 250 · [찾기]) + 트리 그리드(분류명 500 · 법규코드 80, 행번호 없음), 아래 가운데 [확인][전체][닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ClassTreeNode } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useTreeGrid } from '@/hooks/useTreeGrid';

const gb = gbFor<ClassTreeNode>();

interface Props {
  /** new Ics01_Lookup_SelectParent(callback) L53 — 값이 true면 열린다 */
  open: boolean;
  /** callback.execute(model): [확인]은 고른 분류, [전체]는 null */
  onResult: (node: ClassTreeNode | null) => void;
  onClose: () => void;
}

export const Ics01_Lookup_SelectParent: React.FC<Props> = ({ open, onResult, onClose }) => {
  const tree = useTreeGrid<ClassTreeNode>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // retrieve() L131-142: 서비스 ics.Ics01_ClassTree.selectByCompanyId(companyId, typeCode IC) → getServiceResult() L213-233
  const retrieve = useCallback(async () => {
    setLoading(true);  // treeGrid.mask("Loading")
    try {
      tree.setRows(await icsApi.searchClassTree('IC'));
    } catch (err) {
      message.error(errorMessage(err, '오류'));
    } finally {
      setLoading(false);  // treeGrid.unmask()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.setRows]);

  // [E0] 화면 열림 (생성자 L53-121) → show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearch('');
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] search.KeyPress [Enter] (L62) → search(), [E2] searchButton[찾기].Select (L70) → search()
  // search() L154-190: 선택을 풀고 모두 접은 뒤, 분류명에 검색어가 든 분류의 상위를 펼치고 가장 깊은 첫 분류를 선택해 보여 준다
  const doSearch = () => {
    tree.gridRef.current?.api?.deselectAll();
    tree.collapseAll();
    if (!search) return;
    let chk: ClassTreeNode | null = null;
    const found: number[] = [];
    tree.rows.forEach(r => {
      if ((r.classTreeName ?? '').indexOf(search) > -1) {
        found.push(r.classTreeId);
        if (chk == null || (r.depth ?? 0) > (chk.depth ?? 0)) chk = r;
      }
    });
    if (found.length === 0) return;
    tree.expandAncestors(found);
    if (chk) {
      const id = (chk as ClassTreeNode).classTreeId;
      setTimeout(() => {
        const node = tree.gridRef.current?.api?.getRowNode(String(id));
        node?.setSelected(true, true);
        if (node) tree.gridRef.current?.api?.ensureNodeVisible(node);
      });
    }
  };

  // [E3] selectButton[확인].Select (L76) → update() L192-211: 고른 분류가 없으면 "법규분류를 선택해주세요"
  // 원본은 selectById로 다시 읽어 callback에 주지만, 받는 쪽(SelectMulti)은 id·이름만 써서 목록의 행을 그대로 준다
  const update = () => {
    const selectModel = tree.gridRef.current?.api?.getSelectedRows()[0];
    if (!selectModel) {
      message.warning('법규분류를 선택해주세요');
      return;
    }
    onResult(selectModel);
    onClose();
  };

  // buildTreeGrid() L123-129 — getCustomTreeGrid(1): 트리 컬럼 = 분류명, 행번호 숨김
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 500, '분류명'),  // L126
    gb.textCenter('classTreeCode', 80, '법규코드'),  // L127
  ], [tree.treeCol]);

  return (
    <Modal
      open={open}
      title="법규 분류"
      width={640}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E4] noneButton[전체].Select (L82) → callback.execute(null); hide() */}
            <Button onClick={() => { onResult(null); onClose(); }}>전체</Button>
            {/* [E5] cancleButton[닫기].Select (L89) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 540 }}>
        <SearchBar searchText="찾기" onSearch={doSearch}>
          <SearchBar.Input style={{ width: 250 }} value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<ClassTreeNode>
            gridRef={tree.gridRef}
            {...tree.gridProps}
            columnDefs={columnDefs}
            rowNumber={false}
            sortable={false}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};
