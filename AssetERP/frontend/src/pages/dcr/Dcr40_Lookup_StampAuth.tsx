/**
 * 인감별 미사용 문서분류 설정 창 (G07) — Apr10_Tab_Stamp의 미사용 문서분류 칸 아이콘에서 연다.
 * AS-IS: myApp/client/vi/dcr/Dcr40_Lookup_StampAuth.java (286줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * Dcr40_Lookup_StampAuth() L64-109: 모달 520×750 "문서분류", 위 툴바(검색 300 + [조회]) + 트리 그리드(문서분류 410 · 미사용 80),
 * 그 아래 안내문, 아래 가운데 [저장][닫기]. Dcr01_Lookup_UseYn(E16)과 같은 틀
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { FileTextOutlined } from '@ant-design/icons';
import type { CellClickedEvent } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrStampAuthTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';
import { TreeListControlButtons } from '@/components/button/TreeListControlButtons';
import { classFullName } from './DcrClassSearchList';

const gb = gbFor<DcrStampAuthTree>();
interface StampAuthListRow { classTreeId: number; fullName: string; stampExceptYn: string }
const gbList = gbFor<StampAuthListRow>();

interface Props {
  /** open(stampModel, callback) L56-62 — 인감 ID가 있으면 열린다 */
  stampId: number | null;
  /** cancleButton[닫기] (E5, L133) → callback.execute(); hide() — 부른 쪽이 목록을 다시 읽는다 (창의 X 단추는 부르지 않는다) */
  onClosed: () => void;
  onClose: () => void;
}

export const Dcr40_Lookup_StampAuth: React.FC<Props> = ({ stampId, onClosed, onClose }) => {
  const tree = useTreeGrid<DcrStampAuthTree>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [searchText, setSearchText] = useState('');
  // 보기 방식: 트리(열 때) / 리스트([조회] 결과 — UX보강)
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const listRef = useRef<AgGridReact<StampAuthListRow>>(null);

  // buildTreeGrid() L171-176: getTreeGrid(1)
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 400, '문서분류', r => (r.typeCode === 'T' ? <FileTextOutlined /> : null)),  // L173
    gb.boolean('stampExceptYn', 70, '미사용'),  // L174 — 클릭은 getColumn()이 처리
  ], [tree.treeCol]);  // eslint-disable-line react-hooks/exhaustive-deps

  // 리스트 보기(UX보강): 이름에 검색어가 든 분류를 전체 경로로. 행은 트리와 같은 객체라 값이 같이 바뀐다
  const listColumnDefs = useMemo(() => [
    gbList.text('fullName', 400, '문서분류'),
    gbList.boolean('stampExceptYn', 70, '미사용'),
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps
  const listRows = useMemo<StampAuthListRow[]>(() => {
    const q = searchText.trim().toLowerCase();
    return tree.rows
      .filter(r => q === '' || r.classTreeName.toLowerCase().includes(q))
      .map(r => ({ classTreeId: r.classTreeId, fullName: classFullName(tree.rows, r.classTreeId), stampExceptYn: r.stampExceptYn }));
  }, [tree.rows, searchText, view]);  // eslint-disable-line react-hooks/exhaustive-deps

  // retrieve() L189-198: 서비스 dcr.Dcr01_ClassTree.selectByAllWithStampAuth(companyId, stampId, typeCode %) → getServiceResult() L201-215
  const retrieve = useCallback(async () => {
    if (stampId == null) return;
    try {
      tree.setRows(await dcrApi.searchStampAuthTree(stampId));
    } catch (err) {
      message.error(errorMessage(err, 'error'));
    }
  }, [stampId, tree]);

  // [E0] 화면 열림 (생성자 L64-109) → show() / open() L56-62: retrieve(), settings()
  useEffect(() => {
    if (stampId == null) return;
    setSearchText('');
    setView('tree');
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stampId]);

  // [E1] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L94) → getColumn() L142-169: 미사용 칸이면 그 행을 고르고 깊게 펼친 뒤 값을 뒤집고, 자손은 모두 같은 값(조상은 안 바꿈)
  const getColumn = (e: CellClickedEvent<DcrStampAuthTree>) => {
    if (!e.data || isTreeToggleClick(e.event)) return;
    if (e.colDef.field !== 'stampExceptYn') return;
    e.node.setSelected(true, true);
    tree.expandDeep(e.data.classTreeId);
    const next = !(e.data.stampExceptYn === 'true');
    [e.data.classTreeId, ...tree.descendants(e.data.classTreeId)].forEach(id => {
      e.api.getRowNode(String(id))?.setDataValue('stampExceptYn', String(next));
    });
  };

  // 리스트 보기에서 미사용 칸 클릭: getColumn()과 같게 그 행과 자손을 같은 값으로(조상은 안 바꿈)
  const toggleInList = (e: CellClickedEvent<StampAuthListRow>) => {
    if (!e.data || e.colDef.field !== 'stampExceptYn') return;
    const next = !(e.data.stampExceptYn === 'true');
    const ids = new Set([e.data.classTreeId, ...tree.descendants(e.data.classTreeId)]);
    tree.rows.forEach(r => { if (ids.has(r.classTreeId)) r.stampExceptYn = String(next); });
    listRows.forEach(r => { if (ids.has(r.classTreeId)) r.stampExceptYn = String(next); });
    e.api.refreshCells({ force: true });
  };

  // [E2] dcrSearch.KeyPress [Enter] (L113) · [E3] retrieveButton[조회].Select (L121) → search() L237-273
  // UX보강: 검색어가 있으면 이름에 검색어가 든 분류를 리스트로 보인다(AS-IS는 트리를 펼쳐 고름). 검색어가 없으면 트리
  const search = () => {
    tree.collapseAll();
    setView(searchText ? 'list' : 'tree');
  };

  // [E4] updateButton[저장].Select (L127) → update() L217-235: 트리의 모든 행 → dcr.Dcr40_StampAuth.updateList(stampId) → "설정이 저장되었습니다" → retrieve()
  const update = async () => {
    if (stampId == null) return;
    try {
      await dcrApi.saveStampAuths(stampId, tree.rows.map(r => ({ classTreeId: r.classTreeId, stampExceptYn: r.stampExceptYn })));
      message.success('설정이 저장되었습니다');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={stampId != null}
      title="문서분류"
      width={520}
      maskClosable={false}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 10 } }}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E5] cancleButton[닫기].Select (L133) → callback.execute(); hide() */}
            <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 620, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={search}
          extra={<TreeListControlButtons value={view} onChange={setView} onExpandAll={tree.expandAll} onCollapseAll={tree.collapseAll} expandDisabled={tree.rows.length === 0} />}
        >
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {view === 'list' ? (
            <SingleGrid<StampAuthListRow> key="list" gridRef={listRef} rowNumber={false} rowData={listRows} columnDefs={listColumnDefs}
              getRowId={p => String(p.data.classTreeId)} onCellClicked={toggleInList} />
          ) : (
            <SingleGrid<DcrStampAuthTree> key="tree" gridRef={tree.gridRef} {...tree.gridProps} rowNumber={false} columnDefs={columnDefs} onCellClicked={getColumn} />
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: 12 }}>미사용 적용 시, 하위 문서분류(가장 세부 항목)를 선택해야 적용됩니다.</div>
      </div>
    </LookupModal>
  );
};
