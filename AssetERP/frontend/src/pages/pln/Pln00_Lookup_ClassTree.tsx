/**
 * 문서구분 선택 패널 (EE89) — 왼쪽 30% 문서분류 트리 + 가운데 문서구분(T) 체크 다중 그리드 (AS-IS Pln00_Lookup_ClassTree + Pln00_Grid_ClassTree)
 * AS-IS: myApp/client/vi/pln/Pln00_Lookup_ClassTree.java (171줄, BorderLayoutContainer) + Pln00_Grid_ClassTree.java (81줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L43-85: 툴바 50 "문서분류" + [조회], 트리(한 번 눌러도 펼침), 선택하면 retrievePage() L163-166 → 하위 분류가 없는 분류일 때만 문서구분 목록(dcr.Dcr01_ClassTree.selectByClassTreeId)
 * 그리드 buildGrid() L41-56 (체크 다중): 구분코드 80 · 문서구분명 220 · 상품분류 100. getSelectList() = 고른 행들
 * 트리·목록은 문서구분 조회창(Dcr00_Lookup_FundPlan, P03)의 [문서분류] 탭과 같은 API를 쓴다
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree, DcrFundPlanLookup } from '@/types/dcr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { toTree, dcrTreeIcon, DcrTree } from '../dcr/dcr01Tree';

const gb = gbFor<DcrFundPlanLookup>();

export interface Pln00ClassTreeHandle {
  /** getSelectList() L86-89 */
  getSelectList: () => DcrFundPlanLookup[];
}

export const Pln00_Lookup_ClassTree = forwardRef<Pln00ClassTreeHandle, { active: boolean }>(({ active }, ref) => {
  const [classRows, setClassRows] = useState<DcrClassTree[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [rows, setRows] = useState<DcrFundPlanLookup[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<DcrFundPlanLookup>>(null);
  const treeData = useMemo(() => toTree(classRows), [classRows]);

  useImperativeHandle(ref, () => ({ getSelectList: () => gridRef.current?.api?.getSelectedRows() ?? [] }));

  // [E1] retrieveButton[조회].Select (L48) → retrieve() L152-161: dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode C)
  const retrieve = async () => {
    try {
      setClassRows(await dcrApi.searchClassTree('C'));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 열림 (생성자 L43-85) → retrieve()
  useEffect(() => {
    if (!active) return;
    setSelectedClass(null);
    setRows([]);
    void retrieve();
  }, [active]);

  // [E2] tree.Selection (L71) → retrievePage() → Pln00_Grid_ClassTree.retrieve(classTreeModel) L63-78: 그리드를 비우고, 하위 분류가 없을 때만 조회
  const retrievePage = async (id: number) => {
    setRows([]);
    if (classRows.some(r => r.parentTreeId === id)) return;  // 하위 분류가 더 있다.
    setLoading(true);
    try {
      setRows(await dcrApi.searchFundPlanByParent(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // buildGrid() L41-56
  const columns = useMemo(() => [
    gb.text('classTreeCode', 80, '구분코드'),  // L47
    gb.text('classTreeName', 220, '문서구분명'),  // L48
    gb.text('itemTypeName', 100, '상품분류'),  // L49
  ], []);

  return (
    <div style={{ display: 'flex', height: '100%', gap: 4 }}>
      <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <b style={{ fontSize: 12 }}>문서분류</b>
          <Button type="search" onClick={() => void retrieve()}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', border: '1px solid #d9d9d9' }}>
          <DcrTree
            showIcon
            icon={dcrTreeIcon}
            treeData={treeData}
            selectedKeys={selectedClass == null ? [] : [selectedClass]}
            onSelect={(keys, info) => {
              const id = keys.length ? Number(keys[0]) : Number(info.node.key);
              setSelectedClass(id);
              void retrievePage(id);
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <MultiGrid<DcrFundPlanLookup> gridRef={gridRef} rowData={rows} columnDefs={columns} loading={loading} rowClick
          getRowId={p => String(p.data.classTreeId)} />
      </div>
    </div>
  );
});
Pln00_Lookup_ClassTree.displayName = 'Pln00_Lookup_ClassTree';
