/**
 * 고과(평가)내역 탭 (C01-5) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp09_TabPage_Evaluation.java
 * CellEditGrid(체크박스): 평가일자·평가부서·평가담당자·평가등급·평가내용·비고
 * AS-IS lookupOrg(사원팝업 → 부서명/사원명 채움) → TOBE 직접 텍스트 입력으로 단순화
 */
import React, { useCallback, useEffect } from 'react';
import { Space } from 'antd';
import { empEvaluationApi } from '@/api/emp';
import { Evaluation } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<Evaluation>();

const columnDefs = [
  gb.textCenter('evaluationDt', 100, '평가일자', { editor: 'date' }),
  gb.text('evaluationOrg', 240, '평가부서', { editor: 'text' }),
  gb.text('evaluationEmp', 80, '평가담당자', { editor: 'text' }),
  gb.text('evaluationGrade', 80, '평가등급', { editor: 'text' }),
  gb.text('evaluationDesc', 240, '평가내용', { editor: 'text' }),
  gb.text('note', 240, '비고', { editor: 'text' }),
];

export const Emp09_TabPage_Evaluation: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;

  const search = useCallback(async () => {
    if (!personId) return [];
    return empEvaluationApi.getEvaluations(personId);
  }, [personId]);

  const save = useCallback((changed: Evaluation[]) => empEvaluationApi.updateEvaluations(changed), []);

  const remove = useCallback((ids: number[]) => empEvaluationApi.deleteEvaluations(ids), []);

  const newRow = useCallback((): Partial<Evaluation> => ({ personId }), [personId]);

  const crud = useGridCrud<Evaluation>({
    idField: 'evaluationId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'evaluationDt',
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
        <CellEditGrid<Evaluation>
          crud={crud}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};
