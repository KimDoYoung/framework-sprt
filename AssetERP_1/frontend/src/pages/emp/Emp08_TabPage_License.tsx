/**
 * 자격사항 탭 (C01-4) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp08_TabPage_License.java — 함수 이름은 원본 메서드 이름 그대로
 * CellEditGrid(체크박스): 취득일자·자격증명·자격증번호·발급기관·발급등급·금융관련자격증·협회등록일·비고
 * Emp32_TabPage_RelateLicense는 C01-5에서 구현
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { empApi } from '@/api/emp';
import { License } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<License>();

const buildGrid = () => [
  gb.date('certifiedDt', 100, '취득일자', { editor: 'date' }),         // L95
  gb.text('certifiedNm', 240, '자격증명', { editor: 'text' }),         // L96
  gb.text('licenseNo', 240, '자격증번호', { editor: 'text' }),          // L97
  gb.text('issuingAgency', 240, '발급기관', { editor: 'text' }),        // L98
  gb.text('issuingGrade', 80, '발급등급', { editor: 'text' }),          // L99
  gb.boolean('financeRelateYn', 120, '금융관련자격증', { editable: true }),                   // L100
  gb.date('kofiaRegDate', 100, '협회등록일', { editor: 'date' }),       // L101
  gb.text('note', 240, '비고', { editor: 'text' }),                    // L102
];

export const Emp08_TabPage_License: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const columnDefs = useMemo(buildGrid, []);

  const search = useCallback(async () => {
    if (!personId) return [];
    return empApi.getLicenses(personId);
  }, [personId]);

  const save = useCallback((changed: License[]) => empApi.updateLicenses(changed), []);

  const remove = useCallback((ids: number[]) => empApi.deleteLicenses(ids), []);

  const newRow = useCallback((): Partial<License> => ({ personId }), [personId]);

  const crud = useGridCrud<License>({
    idField: 'licenseId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'certifiedDt',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });

  const { retrieve } = crud;

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
        <CellEditGrid<License>
          crud={crud}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};
