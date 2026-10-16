/**
 * 교육사항 탭 (C01-6) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp19_TabPage_education.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * CellEditGrid(체크박스 단일): 교육일자·교육내용·수료여부
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message, Space, Typography } from 'antd';
import { empEducationApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Education, TransPerson } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';
import { Emp01_Lookup_PersonModel } from './Emp01_Lookup_PersonModel';

const gb = gbFor<Education>();

/** buildGrid() L119-130 */
const columnDefs = [
  gb.date('issueDate', 100, '교육일자', { editor: 'date' }),
  gb.text('content', 450, '교육내용', { editor: 'text' }),
  gb.boolean('educationYn', 80, '수료여부', { editable: true }),  // addBoolean = GXT CheckBoxCell(클릭으로 바뀜)
];

export const Emp19_TabPage_education: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const [personOpen, setPersonOpen] = useState(false);
  const [shareRow, setShareRow] = useState<Education>();

  // [E1] retrieveButton[조회].Select (L88) → retrieve() L143-154
  const search = useCallback(async () => {
    if (!personId) return [];
    return empEducationApi.getEducations(personId);
  }, [personId]);

  // [E4] updateButton[저장].Select (L106) → update() L156-169
  const save = useCallback((changed: Education[]) => empEducationApi.updateEducations(changed), []);

  // [E3] deleteButton[삭제].Select (L100) → deleteRow() L187-202 / [E6] messageBox.DialogHide [YES] → emp.Emp19_Education.delete
  const remove = useCallback((ids: number[]) => empEducationApi.deleteEducations(ids), []);

  // [E2] insertButton[등록].Select (L94) → insertRow() L171-184
  const newRow = useCallback((): Partial<Education> => ({ personId }), [personId]);

  const crud = useGridCrud<Education>({
    idField: 'educationId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'issueDate',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });

  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L62-85) — 사원이 바뀌면 다시 조회 (다른 탭과 같음)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) void retrieve(); else crud.clear(); }, [personId]);

  const insertRow = () => {
    if (!row) return message.warning('사원을 먼저 선택해주세요');
    crud.gridRef.current?.api.deselectAll();
    crud.addRow();
  };

  // [E5] multiInsertButton[일괄등록].Select (L112) → multiInsert() L204-242
  const multiInsert = () => {
    const educationRow = crud.gridRef.current?.api.getSelectedRows()[0];
    if (!row) return message.warning('사원을 먼저 선택해주세요');
    if (!educationRow) return message.warning('공유할 교육사항을 선택해주세요');
    if (crud.hasChanges()) return message.warning('일괄등록은 저장 후 가능합니다');
    setShareRow(educationRow);
    setPersonOpen(true);
  };

  // 사원찾기 callback: emp.Emp19_Education.multiUpdate → "등록완료되었습니다." (원본도 그리드를 다시 조회하지 않음)
  const onPersons = async (persons: TransPerson[]) => {
    if (!shareRow) return;
    try {
      await empEducationApi.copyEducation(shareRow, persons.map(p => p.personId));
      message.success('등록완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '일괄등록 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px', boxSizing: 'border-box' }}>
      <Space>
        <Typography.Text strong>교육사항</Typography.Text>
        <Button type="search" onClick={retrieve}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <span style={{ width: 16 }} />
        <Button type="register" onClick={multiInsert}>일괄등록</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Education>
          crud={crud}
          columnDefs={columnDefs}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      <Emp01_Lookup_PersonModel open={personOpen} onClose={() => setPersonOpen(false)} onSelect={onPersons} />
    </div>
  );
};
