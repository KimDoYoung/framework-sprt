import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Modal, Space } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';
import { sysApi } from '../../../api/sys';
import { LoginSecure } from '../../../types/sys';
import { editableCol, useGridCrud } from '../../../hooks/useGridCrud';

/** 공인IP 등록/수정 (AS-IS Sys29_Lookup_PublicIpList) */
export const LoginSecureModal: React.FC<{ companyId?: number; onClose: () => void }> = ({ companyId, onClose }) => {
  const search = useCallback(async () => (companyId != null ? sysApi.searchLoginSecures(companyId) : []), [companyId]);
  // AS-IS insertRow: 시작일 = 오늘
  const newRow = useCallback((): Partial<LoginSecure> => ({ companyId, startDate: dayjs().format('YYYY-MM-DD'), closeDate: null, publicIp: '', note: null }), [companyId]);
  const crud = useGridCrud<LoginSecure>({
    idField: 'loginSecureId', search, save: sysApi.updateLoginSecures, remove: sysApi.deleteLoginSecures,
    newRow, firstEditField: 'publicIp', deleteConfirm: '선택한 공인IP를 삭제하시겠습니까?',
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId != null) crud.retrieve(); }, [companyId]);

  const columnDefs = useMemo<ColDef<LoginSecure>[]>(() => [
    editableCol<LoginSecure>({ field: 'startDate', headerName: '시작일', width: 120, cellDataType: 'dateString' }),
    editableCol<LoginSecure>({ field: 'closeDate', headerName: '종료일', width: 120, cellDataType: 'dateString' }),
    editableCol<LoginSecure>({ field: 'publicIp', headerName: '공인IP', width: 200 }),
    editableCol<LoginSecure>({ field: 'note', headerName: '비고', flex: 1 }),
  ], []);

  return (
    <Modal open={companyId != null} title="공인IP 등록/수정" width={700} onCancel={onClose} footer={<Button onClick={onClose}>닫기</Button>} destroyOnClose>
      <Space style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={crud.retrieve}>조회</Button>
        <Button onClick={crud.addRow}>등록</Button>
        <Button onClick={crud.saveRows}>저장</Button>
        <Button danger onClick={crud.deleteChecked}>삭제</Button>
      </Space>
      <div style={{ height: 420 }}>
        <AgGridReact<LoginSecure> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps} />
      </div>
    </Modal>
  );
};
