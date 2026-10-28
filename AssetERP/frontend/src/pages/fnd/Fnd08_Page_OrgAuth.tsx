/**
 * 펀드별 조직 권한 트리 (P02) — Fnd08_Tab_OrgAuthTempFund 오른쪽(center). 펀드 권한설정 Fnd08_Tab_OrgAuth(P06)도 이 페이지를 쓴다.
 * AS-IS: myApp/client/vi/fnd/Fnd08_Page_OrgAuth.java (147줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L32-55: 가운데 트리 그리드(조직명 300·조직코드 60·권한 40·비고 300) + 아래 가운데 [저장](페이지 버튼줄)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { OrgFundAuth } from '@/types/org';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';

const gb = gbFor<OrgFundAuth>();

interface Props {
  /** retrieve(fundCodeId) L142-145 — 위(또는 왼쪽) 목록에서 고른 펀드 */
  fundCodeId: number | null;
}

export const Fnd08_Page_OrgAuth: React.FC<Props> = ({ fundCodeId }) => {
  const tree = useTreeGrid<OrgFundAuth>({ idField: 'codeId', parentField: 'parentCodeId', depthField: 'depth' });
  const changed = useRef(new Set<number>());
  const [changedCount, setChangedCount] = useState(0);  // 저장(n) (UX-03)
  const seq = useRef(0);

  // buildTreeGrid() L84-91 (트리 컬럼 1번 = 조직명)
  const columnDefs = useMemo(() => [
    tree.treeCol('korName', 300, '조직명'),  // L86
    gb.text('orgCode', 60, '조직코드'),  // L87
    gb.boolean('authYn', 40, '권한'),  // L88 authYnCheck — 클릭은 getColumn()이 처리
    gb.text('note', 300, '비고'),  // L89
  ], [tree.treeCol]);

  // retrieve() L93-99 → getServiceResult() L114-128: 서비스 org.Org01_Code.selectByFundCodeId(로그인 회사, fundCodeId) → 트리 구성 → expandAll
  const retrieve = async () => {
    const my = ++seq.current;
    if (fundCodeId == null) {
      tree.setRows([]);
      return;
    }
    try {
      const list = await orgCodeApi.searchFundAuthTree(fundCodeId);
      if (my !== seq.current) return;
      changed.current.clear();
      setChangedCount(0);
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L32-55) — 위 목록에서 펀드를 고를 때마다 retrieve(fundCodeId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, [fundCodeId]);
  // getServiceResult L114-128: 조회가 끝나면 모두 펼친다(treeGrid.expandAll())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tree.rows.length > 0) tree.expandAll(); }, [tree.rows]);

  // [E2] treeGrid.CellMouseDown [rowIndex >= 0] (L45) → getColumn() L57-82: 행을 깊게 펼치고, 권한 칸(3번째 열)이면 값을 뒤집고 조상(true일 때)·자손에 같은 값
  const getColumn = (e: CellClickedEvent<OrgFundAuth>) => {
    if (!e.data || isTreeToggleClick(e.event)) return; // 펼침 단추 클릭은 접기·펼치기만
    tree.expandDeep(e.data.codeId);
    if (e.colDef.field !== 'authYn') return;
    tree.cascadeToggle(e.api, e.data, 'authYn').forEach(t => changed.current.add(t));
    setChangedCount(changed.current.size);
  };

  // [E1] updateButton[저장].Select (L36) → update() L130-140: org.Org01_Code.updateFundAuth(fundCodeId) → 끝나면 다시 조회한다
  const update = async () => {
    if (fundCodeId == null) return;
    const rows = tree.rows.filter(r => changed.current.has(r.codeId));
    // TreeGridUpdate: 바뀐 행이 없으면 서버를 부르지 않는다(메시지 없음)
    if (rows.length === 0) return;
    try {
      const n = await orgCodeApi.updateFundAuth(fundCodeId, rows);
      message.success(`${n}건 저장되었습니다.`);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<OrgFundAuth>
          gridRef={tree.gridRef}
          {...tree.gridProps}
          columnDefs={columnDefs}
          sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onCellClicked={getColumn}
        />
      </div>
      <div style={{ height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.03)'}}>
        <Button type="save" count={changedCount} disabled={fundCodeId == null} onClick={update}>저장</Button>
      </div>
    </div>
  );
};
