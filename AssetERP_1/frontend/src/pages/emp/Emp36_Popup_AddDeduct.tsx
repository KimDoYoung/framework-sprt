/**
 * 추가인적공제 팝업 (C01-3) — Emp35_TabPage_DeductDate의 DeductInsert 폼 [추가인적공제 아이콘]에서 연다.
 * AS-IS: myApp/client/vi/emp/Emp36_Popup_AddDeduct.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Modal, Space } from 'antd';
import { empApi } from '@/api/emp';
import { AddDeduct } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AddDeduct>();

const buildGrid = () => [
  gb.textCenter('addDeductTypeName', 150, '구분'),   // addBoolean·addTextCenter L2
  gb.longCenter('addDeductCnt', 120, '인원수', { editor: 'number' }),  // addLongCenter + editor
];

interface Props {
  open: boolean;
  deductId: number | undefined;
  onClose: () => void;
}

export const Emp36_Popup_AddDeduct: React.FC<Props> = ({ open, deductId, onClose }) => {
  const columnDefs = useMemo(buildGrid, []);

  const search = useCallback(async () => {
    if (!deductId) return [];
    return empApi.getAddDeducts(deductId);
  }, [deductId]);

  const save = useCallback(async (changed: AddDeduct[]) => {
    await empApi.updateAddDeducts(deductId!, changed);
    return changed; // reloadAfterSave:true → search()로 재조회
  }, [deductId]);

  const remove = useCallback(async (_ids: number[]) => {}, []);
  const newRow = useCallback(() => ({} as Partial<AddDeduct>), []);

  const crud = useGridCrud<AddDeduct>({
    idField: 'addDeductId',
    search,
    save,
    remove,
    newRow,
    reloadAfterSave: true,
  });

  const { retrieve } = crud;

  // [E0] 생성자 → show(): 팝업 열릴 때 조회
  // [E1] retrieveButton[조회].Select (L71) → retrieve() L100-113
  useEffect(() => { if (open && deductId) void retrieve(); }, [open, deductId, retrieve]);

  // [E2] updateButton[저장].Select (L77) → update() L115-123
  // [E3] closeButton[닫기].Select (L83) → hide()
  return (
    <Modal
      title="추가인적공제"
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button type="search" onClick={retrieve}>조회</Button>
          <Button type="save" onClick={crud.saveRows}>저장</Button>
          <Button type="close" onClick={onClose}>닫기</Button>
        </Space>
        <div style={{ height: 200 }}>
          <CellEditGrid<AddDeduct>
            crud={crud}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: false }}
          />
        </div>
      </Space>
    </Modal>
  );
};
