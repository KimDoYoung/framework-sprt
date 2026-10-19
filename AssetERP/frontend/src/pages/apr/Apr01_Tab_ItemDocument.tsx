/**
 * [1137] 문서작성 > 02. 문서검색 > (X)종목별 문서검색 (F07, 1단계) — 메뉴 사용 false((X) 표시)이지만 사용자 지시로 변환
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_ItemDocument.java (275줄) + Apr01_Grid_ItemDocList.java (167줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L60-143: west(450, 분할선, 여백 20/0/20/20) = 테두리 박스(툴바 50: ◉고유자산 ◉펀드자산 · 검색 [120] [찾기] / 트리 흰 배경),
 *   center(여백 20/20/20/0) = Apr01_Grid_ItemDocList
 * 1단계(F01~F06과 같은 사유): 상세보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인(apr)이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Radio, Splitter } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstItemTreeNode } from '@/types/ast';
import { SingleGrid } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Apr01_Grid_ItemDocList } from './Apr01_Grid_ItemDocList';

export const Apr01_Tab_ItemDocument: React.FC = () => {
  const tree = useTreeGrid<AstItemTreeNode>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  // 생성자 L60-143: 자산구분 기본 "펀드자산"(assetType 2, 운용자산)
  const [assetType, setAssetType] = useState('2');
  const [docSearch, setDocSearch] = useState('');
  const [selected, setSelected] = useState<AstItemTreeNode | null>(null);

  // public retrieve() L210-226: 서비스 ast.Ast01_ClassTree.selectByCompanyId(typeCode %, assetType) → getServiceResult() L251-266
  const retrieve = useCallback(async (type: string) => {
    try {
      tree.setRows(await astApi.searchItemTree(type));
    } catch (err) {
      tree.setRows([]);
      message.error(errorMessage(err, '매뉴조회 오류'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.setRows]);

  // [E0] 화면 열림 (생성자 L60-143) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(assetType); }, []);

  // [E1] toggleAssetType.ValueChange (L71) → assetType 바꾸고 retrieve()
  const changeAssetType = (type: string) => {
    setAssetType(type);
    void retrieve(type);
  };

  // [E3] docSearch.KeyPress [Enter] (L91) → search() L228-248: 선택을 풀고 모두 접는다 → 검색어가 비면 끝 →
  //   분류명에 검색어(대소문자 무시)가 든 노드를 모두 선택하고 부모를 펼친다(단일 선택이라 마지막이 남는다. 부모가 접힌 조상 아래면 보이도록 조상까지 펼친다)
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!docSearch) return;
    const text = docSearch.toLowerCase();
    const matches = tree.rows.filter(r => (r.classTreeName ?? '').toLowerCase().indexOf(text) > -1);
    if (matches.length === 0) return;
    tree.expandAncestors(matches.map(m => m.classTreeId));
    const last = matches[matches.length - 1];
    setTimeout(() => {
      const node = api?.getRowNode(String(last.classTreeId));
      node?.setSelected(true, true);
      if (node) api?.ensureNodeVisible(node);
    });
  };

  // getMenuTree() L145-180 — 트리 컬럼 하나(이름 = 분류명), 행번호 없음
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 420, '분류'),
  ], [tree.treeCol]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={450} min={300} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            {/* [E2] retrieveButton[찾기].Select (L84) → retrieve() — 트리를 다시 읽는다 */}
            <SearchBar searchText="찾기" onSearch={() => void retrieve(assetType)}>
              <Radio.Group value={assetType} onChange={e => changeAssetType(e.target.value)}>
                <Radio value="1">고유자산</Radio>
                <Radio value="2">펀드자산</Radio>
              </Radio.Group>
              <SearchBar.Field label="검색">
                {/* Enter는 찾기 버튼(트리 새로 읽기)이 아니라 search()라서 SearchBar.Input 대신 Input을 쓴다 */}
                <Input allowClear style={{ width: 120 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} onPressEnter={search} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0, background: '#fff' }}>
              {/* [E4] tree.Selection (L112) → retrieveTabpage() L182-198: docList.setAstClassTreeId + retrieve() — 노드 종류(분류·종목) 가리지 않고 */}
              <SingleGrid<AstItemTreeNode>
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
          <div style={{ height: '100%', boxSizing: 'border-box' }}>
            <Apr01_Grid_ItemDocList node={selected} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
