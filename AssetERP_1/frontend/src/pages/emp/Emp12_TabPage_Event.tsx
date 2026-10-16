/**
 * 행사내역 탭 (C01-5) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp12_TabPage_Event.java
 * CellEditGrid(체크박스): 행사일자·행사명·행사참여담당내용·행사내용·비고
 */
import React, { useCallback, useEffect } from 'react';
import { Space } from 'antd';
import { empEventApi } from '@/api/emp';
import { EmpEvent } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<EmpEvent>();

const columnDefs = [
  gb.textCenter('eventDt', 100, '행사일자', { editor: 'date' }),
  gb.text('eventNm', 240, '행사명', { editor: 'text' }),
  gb.text('eventPart', 240, '행사참여담당내용', { editor: 'text' }),
  gb.text('eventDesc', 240, '행사내용', { editor: 'text' }),
  gb.text('note', 240, '비고', { editor: 'text' }),
];

export const Emp12_TabPage_Event: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;

  const search = useCallback(async () => {
    if (!personId) return [];
    return empEventApi.getEvents(personId);
  }, [personId]);

  const save = useCallback((changed: EmpEvent[]) => empEventApi.updateEvents(changed), []);

  const remove = useCallback((ids: number[]) => empEventApi.deleteEvents(ids), []);

  const newRow = useCallback((): Partial<EmpEvent> => ({ personId }), [personId]);

  const crud = useGridCrud<EmpEvent>({
    idField: 'eventId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'eventDt',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });

  const { retrieve } = crud;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) void retrieve(); else crud.clear(); }, [personId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px', boxSizing: 'border-box' }}>
      <Space>
        <Button type="search" onClick={retrieve}>조회</Button>
        <Button type="register" onClick={crud.addRow} disabled={!row}>등록</Button>
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<EmpEvent>
          crud={crud}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};
