import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { sysApi } from '../../../api/sys';
import { errorMessage } from '../../../api/client';
import { CompanyMenuYn } from '../../../types/sys';

/**
 * 선택한 메뉴를 쓰는 고객사 (AS-IS Sys01_Grid_CompanyMenu): 사용여부 체크 → 저장 시 sys03 INSERT/DELETE.
 * AS-IS의 '적용상품' 콤보는 조회 SQL이 쓰지 않아 뺐다.
 */
export const CompanyByMenuPanel: React.FC<{ menuId?: number; menuNm?: string }> = ({ menuId, menuNm }) => {
  const gridRef = useRef<AgGridReact<CompanyMenuYn>>(null);
  const [rows, setRows] = useState<CompanyMenuYn[]>([]);
  const dirty = useRef(new Set<number>());

  useEffect(() => {
    dirty.current.clear();
    if (menuId == null) {
      setRows([]);
      return;
    }
    sysApi.searchCompaniesByMenu(menuId).then(setRows).catch(err => message.error(errorMessage(err, '고객사 조회 실패')));
  }, [menuId]);

  /** 전체선택 / 전체취소 */
  const setAll = (value: boolean) => {
    rows.forEach(r => { if (r.menuYn !== value) { r.menuYn = value; dirty.current.add(r.companyId); } });
    gridRef.current?.api?.refreshCells({ columns: ['menuYn'] });
  };

  const save = async () => {
    if (menuId == null) return;
    gridRef.current?.api?.stopEditing();
    const changed = rows.filter(r => dirty.current.has(r.companyId));
    if (changed.length === 0) {
      message.info('저장할 내용이 없습니다.');
      return;
    }
    try {
      setRows(await sysApi.updateCompaniesByMenu(menuId, changed));
      dirty.current.clear();
      message.success(`${changed.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const columnDefs = useMemo<ColDef<CompanyMenuYn>[]>(() => [
    { field: 'companyNm', headerName: '고객명', flex: 1, minWidth: 160 },
    { field: 'menuYn', headerName: '사용여부', width: 90, editable: true, cellDataType: 'boolean' },
    { field: 'icamCompanyCd', headerName: 'ICAM코드', width: 90, cellStyle: { textAlign: 'center' } },
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        <Typography.Text strong>{menuNm ? `${menuNm} 사용 고객사` : '사용 고객사'}</Typography.Text>
        <Button onClick={() => setAll(true)} disabled={menuId == null}>전체선택</Button>
        <Button danger onClick={() => setAll(false)} disabled={menuId == null}>전체취소</Button>
        <Button type="primary" onClick={save} disabled={menuId == null}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<CompanyMenuYn>
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.companyId)}
          onCellValueChanged={(e: CellValueChangedEvent<CompanyMenuYn>) => e.data && dirty.current.add(e.data.companyId)}
        />
      </div>
    </div>
  );
};
