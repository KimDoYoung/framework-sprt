/**
 * 매뉴를 쓰는 고객사 그리드 (A09) — Sys06_Tab_Menu 오른쪽(east).
 * AS-IS: myApp/client/vi/sys/Sys01_Grid_CompanyMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L40-59: 툴바(적용상품 콤보·전체선택·전체취소·저장, 높이 50) + 그리드
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CompanyMenuYn } from '@/types/sys';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<CompanyMenuYn>();

/** 같은 회사·메뉴 연결이 둘이면 원본처럼 두 줄 → 행 ID = 회사 + 연결 */
const rowId = (r: CompanyMenuYn) => `${r.companyId}-${r.companyMenuId ?? ''}`;

/** AS-IS buildGrid() L103-114 */
const buildGrid = () => [
  gb.text('companyNm', 200, '고객명'),  // L105
  gb.boolean('menuYn', 60, '등록', { editable: true }),  // L106 addBoolean = CheckBoxCell(클릭으로 바뀜)
  gb.textCenter('erpProductCd', 50, '상품'),  // L107
  gb.booleanYn2('assetYn', 50, '운용'),  // L109
  gb.booleanYn2('advisYn', 50, '자문'),  // L110
  gb.textCenter('icamCompanyCd', 80, 'ICAM코드'),  // L112
];

interface Props {
  /** retrieve(menuId) — 왼쪽 트리에서 고른 매뉴 */
  menuId?: number;
}

export const Sys01_Grid_CompanyMenu: React.FC<Props> = ({ menuId }) => {
  const gridRef = useRef<AgGridReact<CompanyMenuYn>>(null);
  const [rows, setRows] = useState<CompanyMenuYn[]>([]);
  // L62-64 erpProductComboBox: ComboBoxField("ErpProductCode", "%", "전체"), 처음 "전체"
  const [erpProductCd, setErpProductCd] = useState('%');
  /** 조회·저장 때의 menuYn — 다르면 바뀐 행(GXT getModifiedRecords) */
  const orig = useRef(new Map<string, string>());
  const columnDefs = useMemo(buildGrid, []);

  const baseline = (list: CompanyMenuYn[]) => { orig.current = new Map(list.map(r => [rowId(r), r.menuYn])); };

  // retrieve(menuId) L116-122: 서비스 sys.Sys01_Company.selectByCode(menuId, erpProductCode)
  const retrieve = useCallback(async (code = erpProductCd) => {
    if (!menuId) return;
    try {
      const list = await sysApi.searchCompanyMenuYn(menuId, code);
      baseline(list);
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [menuId, erpProductCd]);

  // [E0] 화면 열림 (생성자 L40-59) → settings() — 조회는 왼쪽 트리 선택(Sys06_Tab_Menu E7)이 menuId를 넘길 때
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, [menuId]);

  /** E2·E3: 모든 행 menuYn = 값 (addChange — 같은 값이면 변경 아님) */
  const setAll = (value: boolean) => gridRef.current?.api.forEachNode(n => n.data && n.setDataValue('menuYn', String(value)));

  // update() L124-128: GridUpdate(menuId) → sys.Sys01_Company.updateByMenuYn — 바뀐 행만, 0건이면 조용히(05 §8)
  const update = async () => {
    if (!menuId) return;
    const changed: CompanyMenuYn[] = [];
    gridRef.current?.api.forEachNode(n => {
      if (n.data && orig.current.get(rowId(n.data)) !== n.data.menuYn) changed.push(n.data);
    });
    if (changed.length === 0) return;
    try {
      const saved = await sysApi.updateCompanyMenuYn(menuId, changed);
      // GridUpdate: 결과 행(selectByMenuId — 상품 조건 없음)으로 store 갱신 — 같은 회사가 있으면 바꾸고, 없으면 끝에 추가
      const next = [...rows];
      saved.forEach(s => {
        const i = next.findIndex(r => r.companyId === s.companyId);
        if (i >= 0) next[i] = s; else next.push(s);
      });
      baseline(next);
      setRows(next);
      message.success(`${changed.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0', boxSizing: 'border-box' }}>
      <Space wrap>
        <Typography.Text strong>적용상품</Typography.Text>
        {/* [E1] erpProductComboBox[ErpProductCode].Collapse (L65) → retrieve(menuId) */}
        <CodeSelect kindCd="ErpProductCode" altCode={['%', '전체']} style={{ width: 90 }} value={erpProductCd}
          onChange={v => { const code = v ?? '%'; setErpProductCd(code); retrieve(code); }} />
        {/* [E2] selectAllButton[전체선택].Select (L71) → 모든 행 menuYn = true */}
        <Button type="addRow" onClick={() => setAll(true)}>전체선택</Button>
        {/* [E3] deSelectAllButton[전체취소].Select (L79) → 모든 행 menuYn = false */}
        <Button type="cancel" onClick={() => setAll(false)}>전체취소</Button>
        {/* [E4] updateButton[저장].Select (L87) → update() */}
        <Button type="save" onClick={update}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* [E5 생략] grid.CellMouseDown [cellIndex >= 4] (L93) → return 만 있다(동작 없음) */}
        <SingleGrid<CompanyMenuYn>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => rowId(p.data)}
        />
      </div>
    </div>
  );
};
