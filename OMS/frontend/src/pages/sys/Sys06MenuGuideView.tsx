import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { MenuGuide, TopMenu } from '../../types/sys';
import { editableCol, useGridCrud } from '../../hooks/useGridCrud';

const noop = async () => 0;
const noRow = () => ({});

/** 화면안내등록 (AS-IS client/vi/sys/Sys06_Tab_MenuGuide). 3차 메뉴의 화면안내(sys06_note)만 고친다. 버튼은 조회·저장뿐 */
export const Sys06MenuGuideView: React.FC = () => {
  const [topMenus, setTopMenus] = useState<TopMenu[]>([]);
  const [menuId, setMenuId] = useState(0); // 0 = 전체
  const [searchText, setSearchText] = useState('');

  const search = useCallback(() => sysApi.searchMenuGuides(menuId || undefined, searchText), [menuId, searchText]);

  const crud = useGridCrud<MenuGuide>({
    idField: 'menuId',
    search,
    save: sysApi.updateMenuGuides,
    remove: noop,
    newRow: noRow,
  });

  useEffect(() => {
    sysApi.searchTopMenus().then(setTopMenus).catch(err => message.error(errorMessage(err, '메뉴명 조회 실패')));
  }, []);

  // 탭 진입·메뉴명 선택 시 조회 (AS-IS: 콤보를 닫으면 조회)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, [menuId]);

  const columnDefs = useMemo<ColDef<MenuGuide>[]>(() => [
    { field: 'menuFullNm', headerName: '메뉴', width: 300 },
    { field: 'menuNm', headerName: '화면명', width: 250 },
    editableCol<MenuGuide>({
      field: 'note', headerName: '화면안내', flex: 1, minWidth: 400,
      cellEditor: 'agLargeTextCellEditor', cellEditorPopup: true, cellEditorParams: { maxLength: 4000, rows: 8, cols: 80 },
    }),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>메뉴명</Typography.Text>
        <Select<number> style={{ width: 150 }} value={menuId} onChange={setMenuId}
          options={[{ value: 0, label: '전체' }, ...topMenus.map(m => ({ value: m.menuId, label: m.menuNm }))]} />
        <Typography.Text strong>검색</Typography.Text>
        <Input style={{ width: 300 }} placeholder="메뉴/화면명" value={searchText} allowClear
          onChange={e => setSearchText(e.target.value)} onPressEnter={crud.retrieve} />
        <Button type="primary" onClick={crud.retrieve}>조회</Button>
        <Button onClick={crud.saveRows}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<MenuGuide> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps} />
      </div>
    </div>
  );
};
