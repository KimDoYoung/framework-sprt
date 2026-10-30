/**
 * 종목 선택 조회창 (W05) — Ast06_Tab_TrIPO의 종목 트리거와 Ast06_Lookup_TrIPO의 종목 칸이 연다
 * AS-IS: myApp/client/vi/ast/Ast01_Lookup_Info.java (408줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L133-155: 모달 650×700, 위 = 툴바 50(◉고유자산 ◉운용자산 · 검색 200 · [찾기]) + 트리(흰 배경, 한 번 눌러 열고 닫음), 아래 가운데 [확인][전체][닫기]
 * gridInsert(assetType, trCode, abroType) = "종목선택", [전체] 숨김 / select(assetType, itemLClass, abroType) = "종목선택", [전체] 보임 / open(assetType) = "항목추가", [전체] 보임
 * 검색(Enter)은 [찾기]와 달리 트리를 다시 읽지 않고 이름에 검색어가 든 노드를 고른다(search() L322-377)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Radio, Space } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrCodeTreeNode } from '@/types/ast';
import { Button } from '@/components/button';
import { SingleGrid } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useTreeGrid } from '@/hooks/useTreeGrid';

interface Props {
  open: boolean;
  /** "1" 고유자산 / "2" 운용자산(기본) */
  assetType?: string | null;
  /** 거래유형 — 그 거래유형의 종목분류 그룹으로 거른다(gridInsert) */
  trCode?: string | null;
  /** 대분류 종목분류(20 증권) — AS-IS select(assetType, itemLClass, abroType) */
  itemLClass?: string | null;
  /** 국내외 구분 "1" 국내 / "2" 국외 */
  abroType?: string | null;
  /** [전체] 단추 — select()·open()은 보이고(true), gridInsert()는 숨긴다(false, 기본) */
  withAll?: boolean;
  /** 제목: open() = "항목추가", 그 밖 "종목선택"(기본) */
  title?: string;
  /** [확인] = 고른 종목, [전체] = null. 닫는 것은 부르는 쪽 */
  onResult: (node: AstTrCodeTreeNode | null) => void;
  onClose: () => void;
}

export const Ast01_Lookup_Info: React.FC<Props> = ({ open, assetType, trCode, itemLClass, abroType, withAll = false, title = '종목선택', onResult, onClose }) => {
  const tree = useTreeGrid<AstTrCodeTreeNode>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [asset, setAsset] = useState('2');
  const [docSearch, setDocSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // retrieve() L298-320: ast.Ast01_ClassTree.selectByTrCode(…, assetType 비면 "2")
  const retrieve = useCallback(async (type: string) => {
    setLoading(true);
    try {
      tree.setRows(await astApi.searchClassTreeByTrCode(trCode ?? null, itemLClass ?? null, abroType ?? null, type));
    } catch (err) {
      tree.setRows([]);
      message.error(errorMessage(err, '매뉴조회 오류'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.setRows, trCode, itemLClass, abroType]);

  // [E0] 화면 열림 (생성자 L133-155) → setting() L157-229, retrieve()
  useEffect(() => {
    if (!open) return;
    const init = assetType === '1' ? '1' : '2';
    setAsset(init);
    setDocSearch('');
    void retrieve(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] toggleAssetType.ValueChange (L171) → assetType 바꾸고 retrieve()
  const changeAsset = (type: string) => {
    setAsset(type);
    void retrieve(type);
  };

  // [E3] docSearch.KeyPress [Enter] (L191) → search() L322-377: 선택을 풀고 모두 접는다 → 검색어가 비면 끝 → 이름에 검색어(대소문자 무시)가 든 노드의 부모를 펼치고 고른다
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!docSearch) return;
    const text = docSearch.toLowerCase();
    const matches = tree.rows.filter(r => (r.classTreeName ?? '').toLowerCase().indexOf(text) > -1);
    if (matches.length === 0) return;
    tree.expandAncestors(matches.map(m => m.classTreeId));
    const first = matches[0];
    setTimeout(() => {
      const node = api?.getRowNode(String(first.classTreeId));
      node?.setSelected(true, true);
      if (node) api?.ensureNodeVisible(node);
    });
  };

  // [E4] confirmButton[확인].Select (L211) → confirm() L231-244
  const confirm = () => {
    const sel = tree.gridRef.current?.api?.getSelectedRows()[0];
    if (!sel) { message.warning('종목을 선택해주세요'); return; }
    if (sel.typeCode === 'IC') { message.warning('최하위 종목을 선택해주세요'); return; }
    onResult(sel);
  };

  // getMenuTree() L251-286 — 트리 컬럼 하나(이름 = 분류명), 행번호 없음
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 560, '분류'),
  ], [tree.treeCol]);

  return (
    <LookupModal open={open} title={title} width={650} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E5] selectAllButton[전체].Select (L217) → confirmAll() L246-249: callback(null) — gridInsert에서는 숨김 */}
            {withAll && <Button type="select" onClick={() => onResult(null)}>전체</Button>}
            {/* [E6] cancleButton[닫기].Select (L223) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[찾기].Select (L184) → retrieve() — 트리를 다시 읽는다 */}
        <SearchBar searchText="찾기" onSearch={() => retrieve(asset)} loading={loading}>
          <Radio.Group value={asset} onChange={e => changeAsset(e.target.value)}>
            <Radio value="1">고유자산</Radio>
            <Radio value="2">운용자산</Radio>
          </Radio.Group>
          <SearchBar.Field label="검색">
            {/* Enter는 찾기 버튼(트리 새로 읽기)이 아니라 search()라서 SearchBar.Input 대신 Input을 쓴다 */}
            <Input allowClear autoFocus style={{ width: 200 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} onPressEnter={search} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, background: '#fff' }}>
          <SingleGrid<AstTrCodeTreeNode>
            gridRef={tree.gridRef}
            {...tree.gridProps}
            columnDefs={columnDefs}
            rowNumber={false}
            sortable={false}
            onRowDoubleClicked={e => { if (e.data?.typeCode !== 'IC') confirm(); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
