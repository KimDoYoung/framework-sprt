/**
 * 인적공제금액 상세 (E22-2) — Pay25_TabPage_PersonDeduct 오른쪽 85%
 * AS-IS: myApp/client/vi/pay/Pay25_TabPage_Deduct.java (147줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로
 * 레이아웃 L45-86: 툴바(관리자 회사만 [등록][저장][삭제]) + 셀 편집 그리드(체크박스 없음 — 행을 눌러 고름)
 * 부모(Pay25_TabPage_PersonDeduct)가 적용일을 고르면 retrieve(고른 적용일)
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { PayPersonDeduct } from '@/types/pay';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PayDetailProps } from './usePayDateList';

const gb = gbFor<PayPersonDeduct>();

/** 체크박스가 없다(setChecked 없음) — 행을 눌러 고른다. 렌더마다 새 객체면 선택이 풀리므로 상수 */
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/**
 * AS-IS buildGrid() L88-110.
 * [E4] personDeductComboBox[PersonDeductCode].Collapse (L92) → 고른 이름에 맞춰 코드(personDeductCode)도 바꾼다
 */
const buildGrid = (codes: Code[]) => [
  gb.text('personDeductName', 200, '구분', {  // L103
    editor: 'select',
    values: codes.map(c => c.name),
    valueSetter: p => {
      p.data.personDeductName = p.newValue;
      p.data.personDeductCode = codes.find(c => c.name === p.newValue)?.code ?? p.data.personDeductCode;
      return true;
    },
  }),
  gb.long('deductAmt', 100, '공제금액', { editor: 'number' }),  // L104
  gb.text('note', 800, '비고', { editor: 'text' }),  // L105
];

// [E0] 화면 열림 (생성자 L45-86) → 초기화
export const Pay25_TabPage_Deduct: React.FC<PayDetailProps> = ({ date, tick }) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // L54 LoginUser.getCompanyId() == 0일 때만 등록·저장·삭제
  const [codes, setCodes] = useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(codes), [codes]);

  const crud = useGridCrud<PayPersonDeduct>({
    idField: 'personDeductId',
    // retrieve(deductTableModel) L112-117: 고른 적용일 → pay.Pay25_PersonDeduct.selectByDate
    search: useCallback(() => (date ? payApi.searchPersonDeducts(date.startDate) : Promise.resolve([])), [date]),
    save: payApi.savePersonDeducts,
    remove: payApi.deletePersonDeducts,
    // insertRow() L123-129: 고른 적용일을 넣은 빈 행
    newRow: useCallback(() => ({ startDate: date?.startDate }), [date]),
    firstEditField: 'personDeductName',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // deleteRow() L131-146
  });

  useEffect(() => {
    sysApi.searchCodes('PersonDeductCode').then(setCodes).catch(() => {});
  }, []);

  // retrievePage() (부모 L185-191): 적용일을 고르거나 조회할 때마다(tick) 읽는다
  useEffect(() => {
    if (date) crud.retrieve();
    else crud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.startDate, tick]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isAdminCompany && <Space wrap style={{ flex: 'none' }}>
        {/* [E1] insertButton[등록].Select (L67) → insertRow() L123-129 */}
        <Button type="register" onClick={() => (date ? crud.addRow() : message.warning('기준 적용일을 선택해주세요'))}>등록</Button>
        {/* [E2] updateButton[저장].Select (L73) → update() L118-121. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E3] deleteButton[삭제].Select (L79) → deleteRow() L131-146 → [E5] messageBox.DialogHide [YES] (L133) → pay.Pay25_PersonDeduct.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </Space>}
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayPersonDeduct> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_ROW_SELECTION} />
      </div>
    </div>
  );
};
