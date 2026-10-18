/**
 * 과세표준 구간별 기본세율 상세 (E22-3) — Pay26_TabPage_TaxCalcTable 오른쪽 85%
 * AS-IS: myApp/client/vi/pay/Pay26_TabPage_TaxCalc.java (139줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로
 * 레이아웃 L45-86: 툴바(관리자 회사만 [등록][저장][삭제]) + 셀 편집 그리드(체크박스 없음 — 행을 눌러 고름)
 * 부모(Pay26_TabPage_TaxCalcTable)가 적용일을 고르면 retrieve(고른 적용일)
 */
import { useCallback, useEffect, useMemo } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { PayTaxCalc } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PayDetailProps } from './usePayDateList';

const gb = gbFor<PayTaxCalc>();

/** 체크박스가 없다(setChecked 없음) — 행을 눌러 고른다. 렌더마다 새 객체면 선택이 풀리므로 상수 */
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/** AS-IS buildGrid() L88-100: 머리글 묶음 "과세표준(원)"(초과·이하) + 기본세액·초과금액 적용세율(%)·비고 */
const buildGrid = () => [
  gb.group('과세표준(원)', [  // L91
    gb.long('fromAmt', 150, '초과', { editor: 'number' }),  // L93
    gb.long('toAmt', 150, '이하', { editor: 'number' }),  // L94
  ]),
  gb.long('basicTax', 150, '기본세액', { editor: 'number' }),  // L95
  gb.double('rate', 200, '초과금액 적용세율(%)', { editor: 'number' }),  // L96
  gb.text('note', 500, '비고', { editor: 'text' }),  // L97
];

// [E0] 화면 열림 (생성자 L45-86) → 초기화
export const Pay26_TabPage_TaxCalc: React.FC<PayDetailProps> = ({ date, tick }) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // L51 LoginUser.getCompanyId() == 0일 때만 등록·저장·삭제
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<PayTaxCalc>({
    idField: 'taxCalcTableId',
    // retrieve(taxCalcModel) L102-108: 고른 적용일 → pay.Pay26_TaxCalcTable.selectByDate
    search: useCallback(() => (date ? payApi.searchTaxCalcs(date.startDate) : Promise.resolve([])), [date]),
    save: payApi.saveTaxCalcs,
    remove: payApi.deleteTaxCalcs,
    // insertRow() L115-120: 고른 적용일을 넣은 빈 행
    newRow: useCallback(() => ({ startDate: date?.startDate }), [date]),
    firstEditField: 'fromAmt',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // deleteRow() L122-137
  });

  // retrievePage() (부모 L185-189): 적용일을 고르거나 조회할 때마다(tick) 읽는다
  useEffect(() => {
    if (date) crud.retrieve();
    else crud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.startDate, tick]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isAdminCompany && <Space wrap style={{ flex: 'none' }}>
        {/* [E1] insertButton[등록].Select (L67) → insertRow() L115-120 */}
        <Button type="register" onClick={() => (date ? crud.addRow() : message.warning('기준 적용일을 선택해주세요'))}>등록</Button>
        {/* [E2] updateButton[저장].Select (L73) → update() L110-113. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E3] deleteButton[삭제].Select (L79) → deleteRow() L122-137 → [E4] messageBox.DialogHide [YES] (L125) → pay.Pay26_TaxCalcTable.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </Space>}
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayTaxCalc> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_ROW_SELECTION} />
      </div>
    </div>
  );
};
