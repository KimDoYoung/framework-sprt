/**
 * [1014] 문서작성 > 01. 문서작성 > 법규별 문서작성 (F03, 1단계)
 * AS-IS: myApp/client/vi/ics/Ics01_Tab_ApprList.java (211줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L47-124: west(455, 분할선, 여백 20/0/20/20) = 테두리 박스(툴바 49: 법규분류 · 찾기 입력 150 · [찾기] / 트리 그리드 흰 배경),
 *   center(여백 20/20/22/0) = 테두리 박스(Ics01_Grid_ApprList)
 * 1단계(F01·F02와 같은 사유): 전자결재 편집창 Apr01_Edit_ApprDoc·문서분류 조회창 Dcr01_Lookup_Class는 다음 단계 (Ics01_Grid_ApprList 머리 참고)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Splitter } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsWriteTreeNode } from '@/types/ics';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Ics01_Grid_ApprList } from './Ics01_Grid_ApprList';

const gb = gbFor<IcsWriteTreeNode>();

export const Ics01_Tab_ApprList: React.FC = () => {
  const tree = useTreeGrid<IcsWriteTreeNode>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [icsSearch, setIcsSearch] = useState('');
  const [selected, setSelected] = useState<IcsWriteTreeNode | null>(null);

  // public retrieve() L176-184: 서비스 ics.Ics01_ClassTree.selectByCompanyId(companyId, typeCode %) → getServiceResult() L150-169
  const retrieve = useCallback(async () => {
    try {
      tree.setRows(await icsApi.searchWriteTree());
    } catch (err) {
      tree.setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.setRows]);

  // [E0] 화면 열림 (생성자 L47-124) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E1] icsSearch.KeyPress [Enter] (L49) → search(), [E2] retrieveButton[찾기].Select (L57) → search()
  // private search() L186-206: 모두 펼친다 → 검색어가 비면 끝 → 선택을 풀고 분류명에 검색어(대소문자 무시)가 든 분류를 모두 선택한다
  //   (단일 선택이라 마지막 것이 남는다. 부모를 펼치지만 이미 모두 펼쳐져 있다)
  const search = () => {
    tree.expandAll();
    if (!icsSearch) return;
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    const text = icsSearch.toLowerCase();
    const matches = tree.rows.filter(r => (r.classTreeName ?? '').toLowerCase().indexOf(text) > -1);
    if (matches.length === 0) return;
    const last = matches[matches.length - 1];
    setTimeout(() => {
      const node = api?.getRowNode(String(last.classTreeId));
      node?.setSelected(true, true);
      if (node) api?.ensureNodeVisible(node);
    });
  };

  // buildTreeGrid() L126-134 — 트리 컬럼 = 분류명, 행번호 숨김
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 345, '분류명'),  // L130
    gb.text('classTreeCode', 100, '분류코드'),  // L131
  ], [tree.treeCol]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={455} min={300} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <SearchBar searchText="찾기" onSearch={search}>
              <SearchBar.Field label="법규분류">
                <SearchBar.Input style={{ width: 150 }} value={icsSearch} onChange={e => setIcsSearch(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0, background: '#fff' }}>
              {/* [E3] treeGrid.SelectionChanged [선택>0] (L93) → retrievePage() L171-174: gridApprList.retrieve(선택 분류) */}
              <SingleGrid<IcsWriteTreeNode>
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
          <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <Ics01_Grid_ApprList node={selected} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
