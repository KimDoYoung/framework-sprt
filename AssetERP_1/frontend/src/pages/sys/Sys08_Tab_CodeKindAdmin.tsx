/**
 * [1078] 관리자 > 03. 코드관리 > 시스템 공통코드 관리  (A13)
 * AS-IS: myApp/client/vi/sys/Sys08_Tab_CodeKindAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L50-130): west = 툴바(높이 50) + 코드구분 그리드 (폭 820, 최대 1000, 분할, 여백 20/-2/22/20),
 *   center = Sys09_Grid_Code(isAdmin = true, 여백 20/20/20/0, 분할)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Space, Splitter, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { CodeKind } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys09_Grid_Code } from './Sys09_Grid_Code';
import { Sys13_Lookup_CodeGroup } from './Sys13_Lookup_CodeGroup';

const gb = gbFor<CodeKind>();

export const Sys08_Tab_CodeKindAdmin: React.FC = () => {
  const [codeKindName, setCodeKindName] = useState('');
  const [selected, setSelected] = useState<CodeKind | null>(null);
  const [groupKind, setGroupKind] = useState<CodeKind | null>(null);

  // editGroup() L152-157: 그 행으로 Sys13_Lookup_CodeGroup.open(selectModel)
  const editGroup = (row: CodeKind) => setGroupKind(row);

  /** 그룹 칸: ImageCell("Edit") */
  const actionCell = (p: CustomCellRendererProps<CodeKind>) =>
    p.data ? (
      <span style={{ cursor: 'pointer', color: '#1677ff' }} onClick={e => { e.stopPropagation(); p.node.setSelected(true); editGroup(p.data!); }}>
        <EditOutlined />
      </span>
    ) : null;

  /** AS-IS buildGrid() L132-150 */
  const columnDefs = useMemo(() => [
    gb.text('kindCd', 120, '코드구분', { editor: 'text' }),  // L143
    gb.text('kindNm', 150, '코드구분명', { editor: 'text' }),  // L144
    gb.boolean('sysYn', 60, '시스템', { editable: true }),  // L145 (sysYnFlag ↔ sysYn 'true'/'false')
    gb.textArea('note', 340, '상세설명', { editor: 'text' }),  // L146
    { colId: 'actionCell', headerName: '그룹', width: 60, headerClass: 'gb-hdr', cellStyle: { textAlign: 'center' }, cellRenderer: actionCell },  // L147
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const crud = useGridCrud<CodeKind>({
    idField: 'codeKindId',
    // retrieve() L159-164: kindName = 입력값, sysYn = '%'(전체조회)
    search: useCallback(() => sysApi.searchCodeKinds(codeKindName, '%'), [codeKindName]),
    save: sysApi.updateCodeKinds,
    remove: sysApi.deleteCodeKinds,
    // insertRow() L171-177: sysYn = "false"
    newRow: useCallback(() => ({ sysYn: 'false' }), []),
    firstEditField: 'kindCd',
    // deleteRow() L179-200
    deleteConfirm: '선택한 코드를 삭제하시겠습니까?',
  });

  const retrieve = crud.retrieve;
  const update = crud.saveRows;
  const insertRow = crud.addRow;
  const deleteRow = crud.deleteChecked; // [E7] msgBox.DialogHide [YES] (L185) → sys.Sys08_CodeKind.delete (useGridCrud 안)

  // [E0] 화면 열림 (생성자 L50-130) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={820} min={300} max={1000}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
              <Space>
                <Typography.Text strong>코드구분명</Typography.Text>
                {/* [E1] codeKindName.KeyPress [Enter] (L63) → retrieve() */}
                <Input style={{ width: 150 }} value={codeKindName} allowClear
                  onChange={e => setCodeKindName(e.target.value)} onPressEnter={retrieve} />
                {/* [E2] retrieveButton[조회].Select (L71) → retrieve() */}
                <Button type="search" onClick={retrieve}>조회</Button>
                {/* [E4] updateButton[저장].Select (L83) → update() */}
                <Button type="save" onClick={update}>저장</Button>
                {/* [E3] insertButton[등록].Select (L77) → insertRow() */}
                <Button type="register" onClick={insertRow}>등록</Button>
                {/* [E5] deleteButton[삭제].Select (L89) → deleteRow() */}
                <Button type="delete" onClick={deleteRow}>삭제</Button>
              </Space>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E6] grid.SelectionChanged (L121) → gridCode.retrieveCode(선택한 코드구분). 체크박스 없음 = 단일 선택 */}
              <CellEditGrid<CodeKind> crud={crud} columnDefs={columnDefs} sortable={false}
                rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
                onSelectionChanged={e => { const row = e.api.getSelectedRows()[0]; if (row) setSelected(row); }} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9' }}>
            <Sys09_Grid_Code isAdmin codeKind={selected} />
          </div>
        </Splitter.Panel>
      </Splitter>

      {groupKind && <Sys13_Lookup_CodeGroup open codeKind={groupKind} onClose={() => setGroupKind(null)} />}
    </div>
  );
};
