import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Splitter, Typography } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { CodeKind } from '../../types/sys';
import { editableCol, useGridCrud } from '../../hooks/useGridCrud';
import { isSysAdmin, useLoginUser } from '../../hooks/useLoginUser';
import { CodeGrid } from '../../components/sys/CodeGrid';
import { CodeGroupModal } from './sys08/CodeGroupModal';

/**
 * 시스템 공통코드 관리 (AS-IS client/vi/sys/Sys08_Tab_CodeKindAdmin): 전체 코드종류 편집 + 코드 + 코드그룹.
 * 코드종류 저장은 KFS 관리자만. 오른쪽 코드는 시스템 코드종류면 회사 0(KFS 관리자만 편집), 아니면 로그인 회사(읽기 전용) — AS-IS 그대로.
 */
export const Sys08CodeKindAdminView: React.FC = () => {
  const user = useLoginUser();
  const sysAdmin = isSysAdmin(user);
  const [kindNm, setKindNm] = useState('');
  const [kind, setKind] = useState<CodeKind>();
  const [groupKind, setGroupKind] = useState<CodeKind>();

  const search = useCallback(() => sysApi.searchCodeKinds(kindNm, '%'), [kindNm]);
  const newRow = useCallback((): Partial<CodeKind> => ({ kindCd: '', kindNm: '', sysYn: false, note: null }), []);
  const crud = useGridCrud<CodeKind>({
    idField: 'codeKindId', search, save: sysApi.updateCodeKinds, remove: sysApi.deleteCodeKinds,
    newRow, firstEditField: 'kindCd', deleteConfirm: '선택한 코드를 삭제하시겠습니까?',
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, []);

  const GroupCell = useCallback((p: ICellRendererParams<CodeKind>) => (
    p.data && p.data.codeKindId > 0
      ? <AppstoreOutlined style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => setGroupKind(p.data)} />
      : null
  ), []);

  const columnDefs = useMemo<ColDef<CodeKind>[]>(() => [
    editableCol<CodeKind>({ field: 'kindCd', headerName: '코드구분', width: 140, editable: sysAdmin }),
    editableCol<CodeKind>({ field: 'kindNm', headerName: '코드구분명', width: 160, editable: sysAdmin }),
    { field: 'sysYn', headerName: '시스템', width: 80, editable: sysAdmin, cellDataType: 'boolean' },
    { field: 'note', headerName: '상세설명', flex: 1, minWidth: 200, editable: sysAdmin },
    { headerName: '그룹', width: 70, cellRenderer: GroupCell, cellStyle: { textAlign: 'center' } },
  ], [sysAdmin, GroupCell]);

  // 저장된 코드종류만 오른쪽에 (임시 행 제외)
  const savedKind = kind && kind.codeKindId > 0 ? kind : undefined;

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="50%" min="25%" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>코드구분명</Typography.Text>
          <Input style={{ width: 150 }} value={kindNm} allowClear onChange={e => setKindNm(e.target.value)} onPressEnter={crud.retrieve} />
          <Button type="primary" onClick={crud.retrieve}>조회</Button>
          <Button onClick={crud.saveRows} disabled={!sysAdmin}>저장</Button>
          <Button onClick={crud.addRow} disabled={!sysAdmin}>등록</Button>
          <Button danger onClick={crud.deleteChecked} disabled={!sysAdmin}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<CodeKind> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps}
            onRowClicked={e => setKind(e.data)} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12 }}>
        <CodeGrid
          codeKind={savedKind}
          companyId={savedKind?.sysYn ? 0 : user.companyId}
          editable={savedKind?.sysYn ? sysAdmin : false}
        />
      </Splitter.Panel>
      <CodeGroupModal codeKind={groupKind} onClose={() => setGroupKind(undefined)} />
    </Splitter>
  );
};
