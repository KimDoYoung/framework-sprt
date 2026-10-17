/**
 * [1081] 관리자 > 09. 기타 > Table Spec,(Model)Properties (C08)
 * AS-IS: myApp/client/vi/dbm/Dbm01_Tab_TabComments.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L41-86: north(50) = 툴바(Table 찾기: 70/350 트리거 필드 · 조회 · 저장), west(40%, 분할, 최대 1000) = 테이블 그리드(체크 단일),
 *   center = Dbm02_TabPage_ColComments. 열 때 조회하지 않는다(E0는 초기화만).
 * 저장(update L151-158) = 바뀐 테이블 주석 → comment on table …(sp_DDLRun). DB 프로시저가 asseterpdb에 없어 서버가 거절한다(작업기록)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장(n)(UX-03). 조건이 1개라 초기화(UX-02) 없음
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Input, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { dbmApi } from '@/api/dbm';
import { DbTable } from '@/types/dbm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Dbm01_Lookup_Tables } from './Dbm01_Lookup_Tables';
import { Dbm02_TabPage_ColComments, Dbm02_TabPage_ColCommentsHandle } from './Dbm02_TabPage_ColComments';

const gb = gbFor<DbTable>();

const NEW_ROW: Partial<DbTable> = {};

export const Dbm01_Tab_TabComments: React.FC = () => {
  const [tableText, setTableText] = useState('');  // lookupTableField (빈 칸 = "전체")
  const [lookupOpen, setLookupOpen] = useState(false);
  const tableTextRef = useRef('');
  tableTextRef.current = tableText;
  const colRef = useRef<Dbm02_TabPage_ColCommentsHandle>(null);

  // [E0] 화면 열림 (생성자 L41-86) → 초기화 (필드 "전체", 열 때 조회하지 않음)
  const crud = useGridCrud<DbTable>({
    idField: 'tableId',
    // retrieve() L143-149: 서비스 dbm.Dbm01_TabComments.selectByTableName(tableName = "%" + 입력 + "%")
    search: useCallback(() => dbmApi.searchTables(tableTextRef.current), []),
    // update() L151-158: 서비스 dbm.Dbm01_TabComments.update(변경 행) — 서버가 거절한다
    save: async rows => { await dbmApi.updateTableComments(rows); return rows; },
    // 행 추가·삭제가 없다 (insertRow·deleteRow L160-166 빈 메서드)
    remove: async () => 0,
    newRow: useCallback(() => NEW_ROW, []),
  });

  // buildGrid() L100-123 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.text('tableName', 160, 'Table Name'),  // L105
    gb.text('tableComments', 250, 'Comments', { editor: 'text' }),  // L118
    gb.text('tableType', 70, 'Type'),  // L119
    gb.text('tablespaceName', 110, 'Tablespace'),  // L120
  ], []);

  return (
    <>
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E2] searchBarBuilder[조회].Retrieve (L59) → retrieve()  /  [E3] searchBarBuilder[저장].Update (L60) → update() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
      }>
        <SearchBar.Field label="Table 찾기:">
          {/* [E1] lookupTableField[Table 찾기:].TriggerClick (L47) → openLookupTable() L88-98 */}
          <Input
            allowClear
            style={{ width: 280 }}
            placeholder="전체"
            value={tableText}
            onChange={e => setTableText(e.target.value)}
            onPressEnter={() => crud.retrieve()}
            suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setLookupOpen(true)} />}
          />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel defaultSize="40%" min={300} max={1000}>
            {/* [E4] grid.SelectionChanged [data != null] (L72) → 인라인 L72-82: colGrid.retrieve(tableName) */}
            <CellEditGrid<DbTable>
              crud={crud}
              columnDefs={columnDefs}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onSelectionChanged={e => {
                const row = e.api.getSelectedRows()[0];
                if (row) colRef.current?.retrieve(row.tableName);
              }}
            />
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ height: '100%', paddingLeft: 4, boxSizing: 'border-box' }}>
              <Dbm02_TabPage_ColComments ref={colRef} />
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
    <Dbm01_Lookup_Tables
      open={lookupOpen}
      onResult={table => { setTableText(table.tableName); setLookupOpen(false); }}
      onClose={() => setLookupOpen(false)}
    />
    </>
  );
};
