/**
 * 문서분류 사용여부 설정 창 (E16) — Dcr01_Tab_ClassTree의 [사용여부설정]에서 연다 (관리자 회사가 아니고 ERP 상품이 S1이 아닌 회사)
 * AS-IS: myApp/client/vi/dcr/Dcr01_Lookup_UseYn.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * Dcr01_Lookup_UseYn() L62-100: 모달 520×750 "문서분류", 위 툴바(검색 300 + [조회]) + 트리 그리드(문서분류 345 · 등록문서건수 75 · 사용여부 80), 아래 가운데 [저장][닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { CellClickedEvent } from 'ag-grid-community';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTreeAll } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';
import { findByName } from './dcr01Tree';

const gb = gbFor<DcrClassTreeAll>();

interface Props {
  /** open(callback) L55 — 값이 true면 열린다 */
  open: boolean;
  /** cancleButton[닫기] (E5, L124) → callback.execute(); hide() — 부른 쪽이 트리를 다시 읽는다 (창의 X 단추는 부르지 않는다) */
  onClosed: () => void;
  onClose: () => void;
}

export const Dcr01_Lookup_UseYn: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const tree = useTreeGrid<DcrClassTreeAll>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [searchText, setSearchText] = useState('');
  const changed = useRef(new Set<number>());  // 사용여부를 바꾼 행 (addChange)
  const [changedCount, setChangedCount] = useState(0);

  // buildTreeGrid() L160-166: getTreeGrid(1)
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 345, '문서분류'),  // L162
    gb.long('apprCount', 75, '등록문서건수'),  // L163
    gb.boolean('useYn', 80, '사용여부'),  // L164 — 클릭은 getColumn()이 처리
  ], [tree.treeCol]);

  // retrieve() L179-186: 서비스 dcr.Dcr01_ClassTree.selectByAll(companyId, typeCode %) → getServiceResult() L189-203
  const retrieve = useCallback(async () => {
    try {
      const list = await dcrApi.searchClassTreeAll('%');
      changed.current.clear();
      setChangedCount(0);
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, 'error'));
    }
  }, [tree]);

  // [E0] 화면 열림 (생성자 L62-100) → open() L55-60: 제목 "문서분류", retrieve(), setting()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L84) → getColumn() L133-158: 등록문서건수·사용여부 칸을 누르면 그 행을 고르고 깊게 펼친다.
  //   사용여부 칸이면 값을 뒤집고(true면 조상도 true), 자손은 모두 같은 값
  const getColumn = (e: CellClickedEvent<DcrClassTreeAll>) => {
    if (!e.data || isTreeToggleClick(e.event)) return;
    if (e.colDef.field !== 'apprCount' && e.colDef.field !== 'useYn') return;
    e.node.setSelected(true, true);
    tree.expandDeep(e.data.classTreeId);
    if (e.colDef.field !== 'useYn') return;
    tree.cascadeToggle(e.api, e.data, 'useYn').forEach(t => changed.current.add(t));
    setChangedCount(changed.current.size);
  };

  // [E2] dcrSearch.KeyPress [Enter] (L104) · [E3] retrieveButton[조회].Select (L112) → search() L216-252
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!searchText) return;
    const { matches, focus } = findByName(tree.rows, searchText);
    if (matches.length === 0) return;
    tree.expandAncestors(matches.map(m => m.classTreeId));
    setTimeout(() => {
      matches.forEach(m => api?.getRowNode(String(m.classTreeId))?.setSelected(true, true));
      const node = focus ? api?.getRowNode(String(focus.classTreeId)) : undefined;
      if (node) api?.ensureNodeVisible(node, 'middle');
    }, 150);
  };

  // [E4] updateButton[저장].Select (L118) → update() L205-214: 바뀐 행 → dcr.Dcr01_ClassTree.update → "설정이 저장되었습니다" → retrieve(). 바뀐 행이 없으면 서버를 부르지 않는다
  const update = async () => {
    const rows = tree.rows.filter(r => changed.current.has(r.classTreeId));
    if (rows.length === 0) return;
    try {
      await dcrApi.updateUseYn(rows.map(r => ({ classTreeId: r.classTreeId, useYn: r.useYn })));
      message.success('설정이 저장되었습니다');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="문서분류"
      width={520}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" count={changedCount} onClick={update}>저장</Button>
            {/* [E5] cancleButton[닫기].Select (L124) → callback.execute(); hide() */}
            <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 620, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={search}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<DcrClassTreeAll> gridRef={tree.gridRef} {...tree.gridProps} rowNumber={false} columnDefs={columnDefs} onCellClicked={getColumn} />
        </div>
      </div>
    </LookupModal>
  );
};
