/**
 * 문서분류별 조직 맵핑 오른쪽 — 조직 트리 그리드(조회·작성 체크) + [저장] (EE06)
 * AS-IS: myApp/client/vi/dcr/Dcr03_TabPage_DcrAuth.java (227줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L47-66: 가운데 트리 그리드(조직명 300·조직코드 100·조회 60·작성 60·비고 400) + 아래 가운데 흰 줄(60) = [저장] + 안내 문구(Dcr03_LinkNote)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import { dcrOrgAuthApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrOrgAuthOrg } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';
import { Dcr03_LinkNote } from './Dcr03_LinkNote';

const gb = gbFor<DcrOrgAuthOrg>();

interface Props {
  /** retrieve(Dcr01_ClassTreeModel) L219-222 — 왼쪽 트리에서 고른 문서분류 */
  classTreeId: number | null;
}

export const Dcr03_TabPage_DcrAuth: React.FC<Props> = ({ classTreeId }) => {
  const tree = useTreeGrid<DcrOrgAuthOrg>({ idField: 'codeId', parentField: 'parentCodeId', depthField: 'depth' });
  const changed = useRef(new Set<number>());
  const [changedCount, setChangedCount] = useState(0);  // 저장(n) (UX-03)
  const seq = useRef(0);

  // buildTreeGrid() L160-169 (트리 컬럼 1번 = 조직명)
  const columnDefs = useMemo(() => [
    tree.treeCol('korName', 300, '조직명'),  // L162
    gb.textCenter('orgCode', 100, '조직코드'),  // L163
    gb.boolean('retrieveYn', 60, '조회'),  // L164 retrieveYnCheck — 클릭은 getColumn()이 처리
    gb.boolean('updateYn', 60, '작성'),  // L165 updateYnCheck
    gb.text('note', 400, '비고'),  // L166
  ], [tree.treeCol]);

  // retrieve() L171-178 → getServiceResult() L193-206: 서비스 org.Org01_Code.selectByDcrCodeId(로그인 회사, dcrCodeId) → 트리 구성 → expandAll
  const retrieve = async () => {
    const my = ++seq.current;
    if (classTreeId == null) {
      tree.setRows([]);
      return;
    }
    try {
      const list = await dcrOrgAuthApi.searchOrgsByClassTree(classTreeId);
      if (my !== seq.current) return;
      changed.current.clear();
      setChangedCount(0);
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L47-66) → settings() L68-115 — 왼쪽 트리에서 문서분류를 고를 때마다 retrieve(classTreeModel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, [classTreeId]);
  // getServiceResult() L193-206: 조회가 끝나면 모두 펼친다(treeGrid.expandAll())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tree.rows.length > 0) tree.expandAll(); }, [tree.rows]);

  // [E3] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L105) → getColumn() L117-158: 행을 깊게 펼치고, 조회(3번째)·작성(4번째) 칸이면 값을 뒤집고 조상(true일 때)·자손에 같은 값
  const getColumn = (e: CellClickedEvent<DcrOrgAuthOrg>) => {
    if (!e.data || isTreeToggleClick(e.event)) return; // 펼침 단추 클릭은 접기·펼치기만
    const field = e.colDef.field;
    if (field !== 'retrieveYn' && field !== 'updateYn') return;
    tree.expandDeep(e.data.codeId);
    tree.cascadeToggle(e.api, e.data, field).forEach(t => changed.current.add(t));
    setChangedCount(changed.current.size);
  };

  // [E2] updateButton[저장].Select (L98) → update() L208-217: org.Org01_Code.updateDcrAuth(dcrCodeId) → 끝나면 다시 조회한다
  const update = async () => {
    if (classTreeId == null) return;
    const rows = tree.rows.filter(r => changed.current.has(r.codeId));
    // TreeGridUpdate: 바뀐 행이 없으면 서버를 부르지 않는다(메시지 없음)
    if (rows.length === 0) return;
    try {
      const n = await dcrOrgAuthApi.updateByClassTree(classTreeId, rows);
      message.success(`${n}건 저장되었습니다.`);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<DcrOrgAuthOrg>
          gridRef={tree.gridRef}
          {...tree.gridProps}
          columnDefs={columnDefs}
          sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onCellClicked={getColumn}
        />
      </div>
      <div style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <Button type="save" count={changedCount} disabled={classTreeId == null} onClick={update}>저장</Button>
        {/* [E1] hiperLink.Click (L86) → Dcr30_Lookup_Link.open() — 안내 문구를 누르면 문서분류지정 창이 열린다 (Dcr03_LinkNote) */}
        <Dcr03_LinkNote />
      </div>
    </div>
  );
};
