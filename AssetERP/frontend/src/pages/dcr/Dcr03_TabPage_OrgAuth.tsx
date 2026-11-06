/**
 * 조직별 문서분류 맵핑 오른쪽 — 문서분류 트리 그리드(조회·작성 체크) + [전체선택][전체해제][저장] (EE07)
 * AS-IS: myApp/client/vi/dcr/Dcr03_TabPage_OrgAuth.java (300줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-79: 가운데 트리 그리드(문서분류 300·조회 60·작성 60·조회순서 80·상세설명 400) + 아래 가운데 흰 줄(60) = (회사관리자만 [전체선택][전체해제]) [저장] + 안내 문구(Dcr03_LinkNote)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import { dcrOrgAuthApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrOrgAuthClass } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Dcr03_LinkNote } from './Dcr03_LinkNote';

const gb = gbFor<DcrOrgAuthClass>();

interface Props {
  /** retrieve(param) L276-279 — 왼쪽 트리에서 고른 조직. 없으면 treeClear() L287 */
  orgCodeId: number | null;
}

export const Dcr03_TabPage_OrgAuth: React.FC<Props> = ({ orgCodeId }) => {
  const user = useLoginUser();
  // LoginUser.getIsManager() L66 — 회사관리자(userId < 0)
  const isManager = user.userId < 0;
  const tree = useTreeGrid<DcrOrgAuthClass>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const changed = useRef(new Set<number>());
  const [changedCount, setChangedCount] = useState(0);  // 저장(n) (UX-03)
  const seq = useRef(0);

  // buildTreeGrid() L193-202 (트리 컬럼 1번 = 문서분류)
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 300, '문서분류'),  // L196
    gb.boolean('retrieveYn', 60, '조회'),  // L197 retrieveYnCheck — 클릭은 getColumn()이 처리
    gb.boolean('updateYn', 60, '작성'),  // L198 updateYnCheck
    gb.text('seq', 80, '조회순서'),  // L199
    gb.text('note', 400, '상세설명'),  // L200
  ], [tree.treeCol]);  // eslint-disable-line react-hooks/exhaustive-deps

  // retrieve() L204-211 → getServiceResult() L226-240: 서비스 dcr.Dcr03_OrgAuth.selectByOrgCodeId(로그인 회사, orgCodeId) → 트리 구성 (펼치지 않는다)
  const retrieve = async () => {
    const my = ++seq.current;
    changed.current.clear();
    setChangedCount(0);
    if (orgCodeId == null) {
      tree.setRows([]);  // treeClear() L287-289
      return;
    }
    try {
      const list = await dcrOrgAuthApi.searchClassTreesByOrg(orgCodeId);
      if (my !== seq.current) return;
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L55-79) → settings() L81-144 — 왼쪽 트리에서 조직을 고를 때마다 retrieve(param)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, [orgCodeId]);

  // [E5] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L134) → getColumn() L146-191: 행을 깊게 펼치고, 조회(2번째)·작성(3번째) 칸이면 값을 뒤집고 조상(true일 때)·자손에 같은 값
  const getColumn = (e: CellClickedEvent<DcrOrgAuthClass>) => {
    if (!e.data || isTreeToggleClick(e.event)) return; // 펼침 단추 클릭은 접기·펼치기만
    const field = e.colDef.field;
    if (field !== 'retrieveYn' && field !== 'updateYn') return;
    tree.expandDeep(e.data.classTreeId);
    tree.cascadeToggle(e.api, e.data, field).forEach(t => changed.current.add(t));
    setChangedCount(changed.current.size);
  };

  // [E2] selectAllButton[전체선택].Select (L116)·[E3] selectAllFalseButton[전체해제].Select (L122) → selectAll(yn) L265-273: 모두 펼치고 모든 행의 조회·작성을 같은 값으로
  const selectAll = (yn: boolean) => {
    tree.expandAll();
    tree.gridRef.current?.api?.forEachNode(node => {
      if (!node.data) return;
      node.setDataValue('retrieveYn', String(yn));
      node.setDataValue('updateYn', String(yn));
      changed.current.add(node.data.classTreeId);
    });
    setChangedCount(changed.current.size);
  };

  // [E4] updateButton[저장].Select (L128) → update() L242-263: dcr.Dcr03_OrgAuth.update(orgCodeId, companyId) — 받은 대로 돌려받아 그리드에 그대로 둔다(다시 조회하지 않는다)
  const update = async () => {
    if (orgCodeId == null) return;
    const rows = tree.rows.filter(r => changed.current.has(r.classTreeId));
    // TreeGridUpdate: 바뀐 행이 없으면 서버를 부르지 않는다(메시지 없음)
    if (rows.length === 0) return;
    try {
      const n = await dcrOrgAuthApi.updateByOrg(orgCodeId, rows);
      message.success(`${n}건 저장되었습니다.`);
      changed.current.clear();
      setChangedCount(0);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<DcrOrgAuthClass>
          gridRef={tree.gridRef}
          {...tree.gridProps}
          columnDefs={columnDefs}
          sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onCellClicked={getColumn}
        />
      </div>
      <div style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        {isManager && <Button type="addRow" disabled={orgCodeId == null} onClick={() => selectAll(true)}>전체선택</Button>}
        {isManager && <Button type="removeRow" disabled={orgCodeId == null} onClick={() => selectAll(false)}>전체해제</Button>}
        <Button type="save" count={changedCount} disabled={orgCodeId == null} onClick={update}>저장</Button>
        {/* [E1] hiperLink.Click (L98) → Dcr30_Lookup_Link.open() — 안내 문구를 누르면 문서분류지정 창이 열린다 (Dcr03_LinkNote) */}
        <Dcr03_LinkNote />
      </div>
    </div>
  );
};
