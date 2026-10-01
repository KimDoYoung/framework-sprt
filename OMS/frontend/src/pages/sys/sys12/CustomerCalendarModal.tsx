import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Modal, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../../api/sys';
import { errorMessage } from '../../../api/client';
import { Calendar } from '../../../types/sys';
import { editableCol, useGridCrud } from '../../../hooks/useGridCrud';

interface Props {
  /** 반영할 일자 (관리자 회사의 행). 없으면 닫힘 */
  source?: Calendar;
  onClose: () => void;
}

const noop = async () => 0;
const noRow = () => ({});

/** 고객사반영 (AS-IS Sys12_Lookup_Customer): 그 날의 고객사 일자를 고치거나, 관리자 일자의 영업일·휴일사유로 바꾼다 */
export const CustomerCalendarModal: React.FC<Props> = ({ source, onClose }) => {
  const search = useCallback(async () => (source ? sysApi.searchCustomerCalendars(source.day) : []), [source]);
  const crud = useGridCrud<Calendar>({ idField: 'calendarId', search, save: sysApi.updateCustomerCalendars, remove: noop, newRow: noRow });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (source) crud.retrieve(); }, [source]);

  /** AS-IS copyButton: 체크한 고객사의 영업일·휴일사유를 관리자 일자 값으로 */
  const copyFromAdmin = () => {
    const checked = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (!source || checked.length === 0) {
      message.warning('반영할 고객사를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '확인', content: '선택한 고객사의 일자정보를 변경하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await sysApi.updateCustomerCalendars(checked.map(r => ({ ...r, workingYn: source.workingYn, offReason: source.offReason })));
          message.success('정상적으로 반영되었습니다');
          crud.retrieve();
        } catch (err) {
          message.error(errorMessage(err, '반영 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo<ColDef<Calendar>[]>(() => [
    { field: 'companyNm', headerName: '고객사', width: 200 },
    { field: 'day', headerName: '일자', width: 110, cellDataType: 'dateString' },
    { field: 'weekday', headerName: '요일', width: 90 },
    editableCol<Calendar>({ field: 'workingYn', headerName: '영업일', width: 80, cellDataType: 'boolean' }),
    editableCol<Calendar>({ field: 'offReason', headerName: '휴일사유', flex: 1, minWidth: 200 }),
  ], []);

  return (
    <Modal open={source != null} title="고객사반영" width={860} footer={null} onCancel={onClose} destroyOnClose>
      <Space wrap style={{ marginBottom: 8 }}>
        {source && (
          <Typography.Text>
            관리자 {source.day} {source.weekday}: {source.workingYn ? '영업일' : '휴일'}{source.offReason ? ` (${source.offReason})` : ''}
          </Typography.Text>
        )}
        <Button type="primary" onClick={crud.retrieve}>조회</Button>
        <Button onClick={crud.saveRows}>저장</Button>
        <Button onClick={copyFromAdmin}>Admin(관리자)정보로 고객사 변경</Button>
      </Space>
      <div style={{ height: 420 }}>
        <AgGridReact<Calendar> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps} />
      </div>
    </Modal>
  );
};
