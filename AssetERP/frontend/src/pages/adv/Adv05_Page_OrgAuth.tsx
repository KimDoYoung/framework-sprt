/**
 * 일임계좌별 조직 권한 트리 (Q02) — Adv05_Tab_OrgAuth 오른쪽(center)
 * AS-IS: myApp/client/vi/adv/Adv05_Page_OrgAuth.java (151줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L33-45: 트리 그리드(조직명 300·조직코드 60·권한 40·비고 300) + 아래 가운데 [저장](버튼줄 60)
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
  /** retrieve(accountId) L147-150 — 왼쪽 목록에서 고른 일임계좌 */
  accountId: number | null;
}

export const Adv05_Page_OrgAuth: React.FC<Props> = ({ accountId }) => {
  const tree = useTreeGrid<OrgFundAuth>({ idField: 'codeId', parentField: 'parentCodeId', depthField: 'depth' });
  const changed = useRef(new Set<number>());
  const [changedCount, setChangedCount] = useState(0);  // 저장(n) (UX-03)
  const seq = useRef(0);

  // buildTreeGrid() L90-96 (트리 컬럼 1번 = 조직명)
  const columnDefs = useMemo(() => [
    tree.treeCol('korName', 300, '조직명'),  // L92
    gb.text('orgCode', 60, '조직코드'),  // L93
    gb.boolean('authYn', 40, '권한'),  // L94 authYnAccount — 클릭은 getColumn()이 처리
    gb.text('note', 300, '비고'),  // L95
  ], [tree.treeCol]);

  // retrieve() L99-105: 서비스 org.Org01_Code.selectByAccountId(로그인 회사, accountId) → 트리 구성 → 모두 펼친다
  const retrieve = async () => {
    const my = ++seq.current;
    if (accountId == null) {
      tree.setRows([]);
      return;
    }
    try {
      const list = await orgCodeApi.searchAccountAuthTree(accountId);
      if (my !== seq.current) return;
      changed.current.clear();
      setChangedCount(0);
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L33-45) — 왼쪽 목록에서 일임계좌를 고를 때마다 retrieve(accountId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, [accountId]);
  // 조회가 끝나면 모두 펼친다(treeGrid.expandAll())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tree.rows.length > 0) tree.expandAll(); }, [tree.rows]);

  // [E2] treeGrid.CellMouseDown [rowIndex >= 0] (L54) → getColumn() L66-88: 행을 깊게 펼치고, 권한 칸(3번째 열)이면 값을 뒤집고 조상(true일 때)·자손에 같은 값
  const getColumn = (e: CellClickedEvent<OrgFundAuth>) => {
    if (!e.data || isTreeToggleClick(e.event)) return; // 펼침 단추 클릭은 접기·펼치기만
    tree.expandDeep(e.data.codeId);
    if (e.colDef.field !== 'authYn') return;
    tree.cascadeToggle(e.api, e.data, 'authYn').forEach(t => changed.current.add(t));
    setChangedCount(changed.current.size);
  };

  // [E1] updateButton[저장].Select (L48) → update() L135-145: org.Org01_Code.updateAccountAuth(accountId) → 끝나면 다시 조회한다
  const update = async () => {
    if (accountId == null) return;
    const rows = tree.rows.filter(r => changed.current.has(r.codeId));
    // TreeGridUpdate: 바뀐 행이 없으면 서버를 부르지 않는다(메시지 없음)
    if (rows.length === 0) return;
    try {
      const n = await orgCodeApi.updateAccountAuth(accountId, rows);
      message.success(`${n}건 저장되었습니다.`);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box', marginLeft: 3 }}>
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
      <div style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button type="save" count={changedCount} disabled={accountId == null} onClick={update}>저장</Button>
      </div>
    </div>
  );
};
