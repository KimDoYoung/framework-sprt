/**
 * 하위계정정보 조회창 (X18) — Act04_Tab_GenLedger 그리드의 셀 더블클릭에서 연다
 * AS-IS: myApp/client/vi/act/Act04_Lookup_GenLedger.java (170줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-77·open(accountCode, stdDate) L48-52: 모달 680×600 "하위계정정보", 툴바([조회][펼치기][감추기]) + 계정 트리(계정코드 120 · 계정과목 390 · 당일잔고액 150), 아래 가운데 [닫기]. 열 때 retrieve()
 * UX보강(10): 조회창 UX-05·06
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { GenLedger } from '@/types/act';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

/** 트리 행 — 서버 행 + 부모 행 ID(0 = 맨 위) */
type Node = GenLedger & { parentId: number };
const gb = gbFor<Node>();
const TREE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  /** 값이 있으면 열림 — open(accountCode, stdDate) */
  target: { accountCode: string; stdDate: string } | null;
  onClose: () => void;
}

export const Act04_Lookup_GenLedger: React.FC<Props> = ({ target, onClose }) => {
  const tree = useTreeGrid<Node>({ idField: 'genLedgerId', parentField: 'parentId', depthField: 'level' });
  const columnDefs = useMemo(() => [
    gb.textCenter('accountCode', 120, '계정코드'),  // L109
    tree.treeCol('accountName2', 390, '계정과목'),  // L110 — getTreeGrid(2): 트리 열은 계정과목
    gb.long('todayBalAmt', 150, '당일잔고액'),  // L111
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol]);

  // retrieve() L116-127: act.Act04_GenLedger.selectByAccountCode(companyId, accountCode, stdDate) — 서버 전위 순서(level)로 부모를 찾아 트리를 만들고,
  //   getServiceResult() L140-160: 맨 위 계정들만 펼친다(setExpanded(item, true))
  const retrieve = useCallback(async () => {
    if (!target) return;
    try {
      const list = await actApi.searchGenLedgersByAccount(target.stdDate, target.accountCode);
      // parentId = 앞쪽에서 가장 가까운 level-1 행 (없으면 0 = 맨 위)
      const stack: number[] = [];
      const rows = list.map(r => {
        const depth = r.level ?? 0;
        stack.length = depth;
        const parent = depth > 0 ? stack[depth - 1] ?? 0 : 0;
        stack[depth] = r.genLedgerId;
        return { ...r, level: depth, parentId: parent } as Node;
      });
      tree.setRows(rows);
      rows.filter(r => r.parentId === 0).forEach(r => tree.toggle(r.genLedgerId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [target]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E0] open(accountCode, stdDate) L48-52 → retrieve()
  useEffect(() => {
    tree.setRows([]);
    if (target) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <LookupModal open={target != null} title="하위계정정보" width={680} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E4] closeButton[닫기].Select (L98) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 500, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L80) → retrieve() / [E2] expandAll[펼치기].Select (L86) → treeGrid.expandAll() / [E3] collapseAll[감추기].Select (L92) → treeGrid.collapseAll() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          <Button type="view" onClick={tree.expandAll}>펼치기</Button>
          <Button type="view" onClick={tree.collapseAll}>감추기</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Node>
            gridRef={tree.gridRef}
            {...tree.gridProps}
            columnDefs={columnDefs}
            rowNumber={false}
            rowSelection={TREE_SELECTION}
          />
        </div>
      </div>
    </LookupModal>
  );
};
