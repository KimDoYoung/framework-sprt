import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Modal, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { Calendar } from '../../types/sys';
import { editableCol, useGridCrud } from '../../hooks/useGridCrud';
import { isSysAdmin, useLoginUser } from '../../hooks/useLoginUser';
import { CodeSelect } from '../../components/common/CodeSelect';
import { CustomerCalendarModal } from './sys12/CustomerCalendarModal';

const noop = async () => 0;
const noRow = () => ({});

/**
 * 일자관리 (AS-IS client/vi/sys/Sys12_Tab_Calendar). 로그인 회사의 영업일·휴일사유·비고를 고치고, 연도 일자를 생성한다.
 * 휴일관리(Sys14_Lookup_Holiday)는 AS-IS에도 서버(Sys14_Holiday)가 없어 변환하지 않는다. 고객사반영은 KFS 관리자만.
 */
export const Sys12CalendarView: React.FC = () => {
  const user = useLoginUser();
  const sysAdmin = isSysAdmin(user);
  const [year, setYear] = useState(String(dayjs().year()));
  const [month, setMonth] = useState<string>();
  const [customerSource, setCustomerSource] = useState<Calendar>();

  const search = useCallback(() => sysApi.searchCalendars(year, month), [year, month]);
  const crud = useGridCrud<Calendar>({ idField: 'calendarId', search, save: sysApi.updateCalendars, remove: noop, newRow: noRow });

  // 탭 진입·월 선택 시 조회 (AS-IS: 월 콤보를 닫으면 조회)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, [month]);

  /** AS-IS insertAuto: 확인 후 그 연도 일자를 지우고 다시 만든다 */
  const generate = () => {
    Modal.confirm({
      title: '확인', content: '기존 데이터를 삭제 후 생성합니다. 진행하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          const n = await sysApi.generateCalendars(year);
          message.success(`생성이 완료되었습니다. (${n}일)`);
          crud.retrieve();
        } catch (err) {
          message.error(errorMessage(err, '생성 실패'));
        }
      },
    });
  };

  const openCustomers = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length !== 1) {
      message.warning('반영할 일자를 선택해주세요');
      return;
    }
    setCustomerSource(selected[0]);
  };

  const columnDefs = useMemo<ColDef<Calendar>[]>(() => [
    { field: 'day', headerName: '일자', width: 110, cellDataType: 'dateString' },
    { field: 'weekday', headerName: '요일', width: 90 },
    editableCol<Calendar>({ field: 'workingYn', headerName: '영업일', width: 80, cellDataType: 'boolean' }),
    editableCol<Calendar>({ field: 'offReason', headerName: '휴일사유', width: 400 }),
    editableCol<Calendar>({ field: 'note', headerName: '비고', flex: 1, minWidth: 300 }),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>년도</Typography.Text>
        <Input style={{ width: 80 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} onPressEnter={crud.retrieve} />
        <Typography.Text strong>월</Typography.Text>
        <CodeSelect kindCd="MonthsCode" style={{ width: 100 }} placeholder="전체" allowClear value={month} onChange={v => setMonth(v ?? undefined)} />
        <Button type="primary" onClick={crud.retrieve}>조회</Button>
        <Button onClick={crud.saveRows}>저장</Button>
        <Button onClick={generate}>생성</Button>
        {sysAdmin && <Button onClick={openCustomers}>고객사반영</Button>}
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<Calendar> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps} />
      </div>
      <CustomerCalendarModal source={customerSource} onClose={() => setCustomerSource(undefined)} />
    </div>
  );
};
