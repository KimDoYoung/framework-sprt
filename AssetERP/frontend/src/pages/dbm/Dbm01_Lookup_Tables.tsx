/**
 * Table Finder 조회창 — Dbm01_Tab_TabComments의 "Table 찾기:" 트리거에서 연다.
 * AS-IS: myApp/client/vi/dbm/Dbm01_Lookup_Tables.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L44-108: 모달 800×500 "Table Finder...", 검색 줄(Name 40/250 · 조회) + 체크 그리드(Table Name 160 · Comments 250 · Table Type 90 · Tablespace Name 110)
 *   + 확인 · 취소. 열면 바로 조회.
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04). 조건이 1개라 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import type { CellDoubleClickedEvent } from 'ag-grid-community';
import { dbmApi } from '@/api/dbm';
import { errorMessage } from '@/api/client';
import { DbTable } from '@/types/dbm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<DbTable>();

/** AS-IS buildGrid() L110-120 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('tableName', 160, 'Table Name'),  // L114
  gb.text('tableComments', 250, 'Comments'),  // L115
  gb.text('tableType', 90, 'Table Type'),  // L116
  gb.text('tablespaceName', 110, 'Tablespace Name'),  // L117
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(result): 확인이면 고른 테이블 */
  onResult: (table: DbTable) => void;
  /** 취소: callback 없이 hide() */
  onClose: () => void;
}

export const Dbm01_Lookup_Tables: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<DbTable>>(null);
  const lastSelected = useRef<DbTable | undefined>(undefined);
  const [tableName, setTableName] = useState('');
  const [rows, setRows] = useState<DbTable[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L122-135: 서비스 dbm.Dbm01_TabComments.selectByTableName(tableName = "%" + 입력 + "%")
  const retrieve = useCallback(async (name: string) => {
    try {
      setRows(await dbmApi.searchTables(name));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L44-108: 원본은 열 때마다 새 창 → show() 뒤 retrieve()
  useEffect(() => {
    if (!open) return;
    setTableName('');
    setRows([]);
    lastSelected.current = undefined;
    retrieve('');
  }, [open, retrieve]);

  // confirm() L137-149: getSelectedItem()(마지막에 고른 행)이 없으면 메시지(창 유지), 있으면 callback + hide()
  const confirm = (selected?: DbTable) => {
    const selectedRows = gridRef.current?.api.getSelectedRows() ?? [];
    const model = selected ?? (selectedRows.includes(lastSelected.current!) ? lastSelected.current : selectedRows[selectedRows.length - 1]);
    if (!model) {
      message.warning('조회할 Table을 선택하여 주세요');
      return;
    }
    onResult(model);
  };

  // [E5] grid.CellDoubleClick (L99) → confirm()
  const onCellDoubleClicked = (e: CellDoubleClickedEvent<DbTable>) => {
    if (!e.data) return;
    e.api.deselectAll();
    e.node.setSelected(true);
    confirm(e.data);
  };

  return (
    <LookupModal
      open={open}
      title="Table Finder..."
      width={800}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] okButton[확인].Select (L82) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L90) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L68) → retrieve() */}
        <SearchBar onSearch={() => retrieve(tableName)}>
          <SearchBar.Field label="Name">
            {/* [E1] TableNameText[Name].KeyPress [Enter] (L56) → retrieve() */}
            <SearchBar.Input autoFocus style={{ width: 200 }} value={tableName} onChange={e => setTableName(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<DbTable> rowClick
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.tableId)}
            onRowSelected={e => { if (e.node.isSelected() && e.data) lastSelected.current = e.data; }}
            onCellDoubleClicked={onCellDoubleClicked}
          />
        </div>
      </div>
    </LookupModal>
  );
};
