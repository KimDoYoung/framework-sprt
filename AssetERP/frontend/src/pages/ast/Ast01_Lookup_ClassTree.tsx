/**
 * 비품구분 조회창 (W18) — Bmt10_Edit_Info의 [장비명] 칸이 연다 (고유자산 분류 트리에서 최하위 구분 하나를 고른다)
 * AS-IS: myApp/client/vi/ast/Ast01_Lookup_ClassTree.java (235줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L94-115: 모달 500×700 "비품구분", 위 툴바 50(자산구분 · 검색 250 · [찾기]) + 트리(흰 배경, 한 번 눌러 열고 닫음), 아래 가운데 [확인][닫기]
 * retrieve() L176-188: ast.Ast01_ClassTree.selectByCompanyId(typeCode "%", assetType "1") → 전체 트리
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstClassTree } from '@/types/ast';
import { Button } from '@/components/button';
import { SingleGrid } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useTreeGrid } from '@/hooks/useTreeGrid';

interface Props {
  open: boolean;
  /** [확인] = 고른 분류(최하위 IT). 닫는 것은 부르는 쪽 */
  onResult: (node: AstClassTree) => void;
  onClose: () => void;
}

export const Ast01_Lookup_ClassTree: React.FC<Props> = ({ open, onResult, onClose }) => {
  const tree = useTreeGrid<AstClassTree>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [docSearch, setDocSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // retrieve() L176-188: typeCode "%", assetType "1"(고유자산)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      tree.setRows(await astApi.searchClassTree({ typeCode: '%', assetType: '1' }));
    } catch (err) {
      tree.setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.setRows]);

  // [E0] 화면 열림 (생성자 L94-115) → show() / open() L53-57: buttonBarSetting(), retrieve()
  useEffect(() => {
    if (!open) return;
    setDocSearch('');
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] docSearch.KeyPress [Enter] (L61), [E2] searchButton[찾기].Select (L69) → search() L190-210:
  //   선택을 풀고 모두 접는다 → 검색어가 비면 끝 → 이름에 검색어(대소문자 구분)가 든 노드의 부모를 펼치고 고른다(단일 선택이라 마지막 노드가 남는다)
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!docSearch) return;
    const matches = tree.rows.filter(r => (r.classTreeName ?? '').indexOf(docSearch) > -1);
    if (matches.length === 0) return;
    tree.expandAncestors(matches.map(m => m.classTreeId));
    const last = matches[matches.length - 1];
    setTimeout(() => {
      const node = api?.getRowNode(String(last.classTreeId));
      node?.setSelected(true, true);
      if (node) api?.ensureNodeVisible(node);
    });
  };

  // [E3] updateButton[확인].Select (L80) → update() L117-125: typeCode가 "IT"(최하위)일 때만 callback 뒤 hide, 아니면 "최하위 구분을 선택해주세요"
  const update = () => {
    const sel = tree.gridRef.current?.api?.getSelectedRows()[0];
    if (!sel || sel.typeCode !== 'IT') { message.warning('최하위 구분을 선택해주세요'); return; }
    onResult(sel);
  };

  // getMenuTree() L127-163 — 트리 컬럼 하나(이름 = 분류명), 행번호 없음
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 440, '분류'),
  ], [tree.treeCol]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LookupModal open={open} title="비품구분" width={560} style={{ top: 20 }} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E4] cancleButton[닫기].Select (L86) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 560, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar searchText="찾기" onSearch={search} loading={loading}>
          <SearchBar.Field label="자산구분">
            <SearchBar.Input style={{ width: 250 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, background: '#fff' }}>
          <SingleGrid<AstClassTree>
            gridRef={tree.gridRef}
            {...tree.gridProps}
            columnDefs={columnDefs}
            rowNumber={false}
            sortable={false}
            onRowDoubleClicked={e => { if (e.data?.typeCode === 'IT') onResult(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
