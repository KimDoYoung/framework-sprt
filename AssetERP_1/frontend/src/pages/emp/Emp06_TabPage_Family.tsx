/**
 * 가족사항 탭 (C01-4) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp06_TabPage_Family.java — 함수 이름은 원본 메서드 이름 그대로
 * CellEditGrid(체크박스): 가족성명·관계·생년월일·학교·직업·학교소재지·거주지·동거여부·장애등급·비고
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { empApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { Family } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<Family>();

// [E5] locationComboBox[EmpLocationCode].Collapse → locateCd 동기화 (valueSetter)
const buildGrid = (locationCodes: Code[]) => [
  gb.text('familyNm', 100, '가족성명', { editor: 'text' }),          // L80
  gb.text('relationCd', 100, '가족관계', { editor: 'text' }),         // L81
  gb.date('birthday', 100, '생년월일', { editor: 'date' }),            // L82
  gb.text('familySchool', 240, '출신학교', { editor: 'text' }),        // L83
  gb.text('familyJob', 120, '직업', { editor: 'text' }),               // L84
  gb.text('schoolLocation', 240, '학교소재지', { editor: 'text' }),    // L85
  gb.text('familyLocation', 120, '가족거주지', { editor: 'text' }),    // L86
  gb.text('locateNm', 80, '동거여부', {                                  // L87
    editor: 'select',
    values: locationCodes.map(c => c.name),
    valueSetter: p => {
      p.data.locateNm = p.newValue;
      p.data.locateCd = locationCodes.find(c => c.name === p.newValue)?.code ?? p.data.locateCd;
      return true;
    },
  }),
  gb.text('disabilityGrade', 80, '장애등급', { editor: 'text' }),      // L88
  gb.text('note', 220, '비고', { editor: 'text' }),                    // L89
];

export const Emp06_TabPage_Family: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const [locationCodes, setLocationCodes] = React.useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(locationCodes), [locationCodes]);

  const search = useCallback(async () => {
    if (!personId) return [];
    return empApi.getFamilies(personId);
  }, [personId]);

  const save = useCallback((changed: Family[]) => empApi.updateFamilies(changed), []);

  const remove = useCallback((ids: number[]) => empApi.deleteFamilies(ids), []);

  const newRow = useCallback((): Partial<Family> => ({ personId }), [personId]);

  const crud = useGridCrud<Family>({
    idField: 'familyId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'familyNm',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });

  const { retrieve } = crud;

  // [E0] 생성자 초기화: 코드 로드
  useEffect(() => {
    sysApi.searchCodes('EmpLocationCode').then(setLocationCodes).catch(() => {});
  }, []);

  // [E1] searchBarBuilder[조회].Retrieve → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) void retrieve(); else crud.clear(); }, [personId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px' }}>
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
        <CellEditGrid<Family>
          crud={crud}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};
