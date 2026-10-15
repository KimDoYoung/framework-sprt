/**
 * 경력사항 탭 (C01-4) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp07_TabPage_Career.java — 함수 이름은 원본 메서드 이름 그대로
 * CellEditGrid(체크박스): 시작년월·종료년월·회사명·업종·근무부서·최종직위·고용형태·역활·금융관련경력·주요경력·대외겸직·비고
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { empApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { Career } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<Career>();

// [E5] careerTypeComboBox[EmpCareerTypeCode].Collapse → careerTyCd 동기화 (valueSetter)
const buildGrid = (careerTypeCodes: Code[]) => [
  gb.textCenter('frYm', 80, '시작년월', { editor: 'text' }),          // L87
  gb.textCenter('toYm', 80, '종료년월', { editor: 'text' }),           // L88
  gb.text('companyNm', 220, '회사명', { editor: 'text' }),             // L89
  gb.text('industry', 150, '업종', { editor: 'text' }),                // L90
  gb.text('finalOrg', 100, '근무부서', { editor: 'text' }),            // L91
  gb.text('finalTitle', 100, '최종직위', { editor: 'text' }),          // L92
  gb.text('careerTyNm', 100, '고용형태', {                               // L93
    editor: 'select',
    values: careerTypeCodes.map(c => c.name),
    valueSetter: p => {
      p.data.careerTyNm = p.newValue;
      p.data.careerTyCd = careerTypeCodes.find(c => c.name === p.newValue)?.code ?? p.data.careerTyCd;
      return true;
    },
  }),
  gb.text('finalRole', 240, '역활(권한)', { editor: 'text' }),         // L94
  gb.boolean('financeRelateYn', 110, '금융관련경력', { editable: true }),                    // L95
  gb.boolean('mainCareerYn', 100, '주요경력', { editable: true }),                           // L96
  gb.boolean('extrAddTitleYn', 100, '대외겸직', { editable: true }),                         // L97
  gb.text('note', 200, '비고', { editor: 'text' }),                    // L98
];

export const Emp07_TabPage_Career: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const [careerTypeCodes, setCareerTypeCodes] = React.useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(careerTypeCodes), [careerTypeCodes]);

  const search = useCallback(async () => {
    if (!personId) return [];
    return empApi.getCareers(personId);
  }, [personId]);

  const save = useCallback((changed: Career[]) => empApi.updateCareers(changed), []);

  const remove = useCallback((ids: number[]) => empApi.deleteCareers(ids), []);

  const newRow = useCallback((): Partial<Career> => ({ personId }), [personId]);

  const crud = useGridCrud<Career>({
    idField: 'careerId',
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
    sysApi.searchCodes('EmpCareerTypeCode').then(setCareerTypeCodes).catch(() => {});
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
        <CellEditGrid<Career>
          crud={crud}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};
