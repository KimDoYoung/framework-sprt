/**
 * 프로젝트 탭 (C01-5) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp13_TabPage_Project.java
 * CellEditGrid(체크박스): 시작년월·종료년월·프로젝트명·비고
 */
import React, { useCallback, useEffect } from 'react';
import { Space } from 'antd';
import { empProjectApi } from '@/api/emp';
import { Project } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<Project>();

const columnDefs = [
  gb.textCenter('frYm', 80, '시작년월', { editor: 'text' }),
  gb.textCenter('toYm', 80, '종료년월', { editor: 'text' }),
  gb.text('projectNm', 340, '프로젝트명', { editor: 'text' }),
  gb.text('note', 580, '비고', { editor: 'text' }),
];

export const Emp13_TabPage_Project: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;

  const search = useCallback(async () => {
    if (!personId) return [];
    return empProjectApi.getProjects(personId);
  }, [personId]);

  const save = useCallback((changed: Project[]) => empProjectApi.updateProjects(changed), []);

  const remove = useCallback((ids: number[]) => empProjectApi.deleteProjects(ids), []);

  const newRow = useCallback((): Partial<Project> => ({ personId }), [personId]);

  const crud = useGridCrud<Project>({
    idField: 'projectId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'frYm',
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
        <Button type="save" onClick={crud.saveRows}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Project>
          crud={crud}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};
