/**
 * 학력정보 탭 (C01-4) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp05_TabPage_Academic.java — 함수 이름은 원본 메서드 이름 그대로
 * CellEditGrid(체크박스): 입학년월·졸업년월·학교및과정·학력등급·금융관련학력·학점·수료여부·소재지·비고
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { empApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { Academic } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<Academic>();

// [E5] bachelorDegreeComboBox[EmpBachelorDegree], [E6] graduateDegreeComboBox[EmpGraduateDegree] → 코드 동기화
const buildGrid = (bachelorCodes: Code[], graduateCodes: Code[]) => [
  gb.textCenter('frYm', 80, '입학년월', { editor: 'text' }),           // L96
  gb.textCenter('toYm', 80, '졸업년월', { editor: 'text' }),            // L97
  gb.text('schoolName', 240, '학교 및 과정', { editor: 'text' }),      // L98
  gb.text('bachelorDegreeNm', 80, '학력등급', {                          // L99
    editor: 'select',
    values: bachelorCodes.map(c => c.name),
    valueSetter: p => {
      p.data.bachelorDegreeNm = p.newValue;
      p.data.bachelorDegree = bachelorCodes.find(c => c.name === p.newValue)?.code ?? p.data.bachelorDegree;
      return true;
    },
  }),
  gb.boolean('financeRelateYn', 110, '금융관련학력', { editable: true }),                    // L100
  gb.text('degreeCredit', 80, '학점', { editor: 'text' }),             // L101
  gb.text('graduateDegreeNm', 80, '수료여부', {                          // L102
    editor: 'select',
    values: graduateCodes.map(c => c.name),
    valueSetter: p => {
      p.data.graduateDegreeNm = p.newValue;
      p.data.graduateDegree = graduateCodes.find(c => c.name === p.newValue)?.code ?? p.data.graduateDegree;
      return true;
    },
  }),
  gb.text('schoolLocation', 140, '소재지', { editor: 'text' }),        // L103
  gb.text('note', 360, '비고', { editor: 'text' }),                    // L104
];

export const Emp05_TabPage_Academic: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const [bachelorCodes, setBachelorCodes] = React.useState<Code[]>([]);
  const [graduateCodes, setGraduateCodes] = React.useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(bachelorCodes, graduateCodes), [bachelorCodes, graduateCodes]);

  const search = useCallback(async () => {
    if (!personId) return [];
    return empApi.getAcademics(personId);
  }, [personId]);

  const save = useCallback((changed: Academic[]) => empApi.updateAcademics(changed), []);

  const remove = useCallback((ids: number[]) => empApi.deleteAcademics(ids), []);

  const newRow = useCallback((): Partial<Academic> => ({ personId }), [personId]);

  const crud = useGridCrud<Academic>({
    idField: 'academicId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'frYm',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });

  const { retrieve } = crud;

  // [E0] 생성자 초기화: 코드 로드
  useEffect(() => {
    sysApi.searchCodes('EmpBachelorDegree').then(setBachelorCodes).catch(() => {});
    sysApi.searchCodes('EmpGraduateDegree').then(setGraduateCodes).catch(() => {});
  }, []);

  // [E1] searchBarBuilder[조회].Retrieve → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) void retrieve(); else crud.clear(); }, [personId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px', boxSizing: 'border-box' }}>
      <Space>
        {/* [E1] */}
        <Button type="search" onClick={retrieve}>조회</Button>
        {/* [E2] searchBarBuilder[등록].Insert → insertRow() */}
        <Button type="register" onClick={crud.addRow} disabled={!row}>등록</Button>
        {/* [E3] searchBarBuilder[삭제].Delete → deleteRow() */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        {/* [E4] searchBarBuilder[저장].Update → update() */}
        <Button type="save" onClick={crud.saveRows}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Academic>
          crud={crud}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};
