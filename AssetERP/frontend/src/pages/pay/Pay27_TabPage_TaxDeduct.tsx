/**
 * 근로소득 세액공제 상세 (E22-3) — Pay27_TabPage_TaxDeductTable 오른쪽 85%
 * AS-IS: myApp/client/vi/pay/Pay27_TabPage_TaxDeduct.java (262줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로
 * 레이아웃 L54-140: 위(center) "세액공제" 툴바(관리자 회사만 [등록][저장][삭제]) + 셀 편집 그리드 / 아래(south 50%, 분할) "세액공제 한도" 툴바(같은 세 버튼) + 셀 편집 그리드.
 * 두 그리드 모두 체크박스가 없다(행을 눌러 고름). 부모(Pay27_TabPage_TaxDeductTable)가 적용일을 고르면 retrieve·limitRetrieve(고른 적용일)
 */
import { useCallback, useEffect, useMemo } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { PayTaxDeduct, PayTaxDeductLimit } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PayDetailProps } from './usePayDateList';

const gb = gbFor<PayTaxDeduct>();
const limitGb = gbFor<PayTaxDeductLimit>();

/** 체크박스가 없다(setChecked 없음) — 행을 눌러 고른다. 렌더마다 새 객체면 선택이 풀리므로 상수 */
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/** AS-IS buildGrid() L142-155: 머리글 묶음 "산출세액"(초과·이하) + 기본공제·적용율(%)·비고 */
const buildGrid = () => [
  gb.group('산출세액', [  // L146
    gb.long('fromAmt', 130, '초과', { editor: 'number' }),  // L148
    gb.long('toAmt', 130, '이하', { editor: 'number' }),  // L149
  ]),
  gb.long('deductAmt', 130, '기본공제', { editor: 'number' }),  // L150
  gb.double('rate', 130, '적용율(%)', { editor: 'number' }),  // L151
  gb.text('note', 500, '비고', { editor: 'text' }),  // L152
];

/** AS-IS buildLimitGrid() L157-170: 머리글 묶음 "총급여액"(초과·이하) + 최소한도·최대한도·적용율(%)·비고 */
const buildLimitGrid = () => [
  limitGb.group('총급여액', [  // L160
    limitGb.long('fromAmt', 130, '초과', { editor: 'number' }),  // L162
    limitGb.long('toAmt', 130, '이하', { editor: 'number' }),  // L163
  ]),
  limitGb.long('minLimit', 130, '최소한도', { editor: 'number' }),  // L164
  limitGb.long('maxLimit', 130, '최대한도', { editor: 'number' }),  // L165
  limitGb.double('rate', 130, '적용율(%)', { editor: 'number' }),  // L166
  limitGb.text('note', 500, '비고', { editor: 'text' }),  // L167
];

// [E0] 화면 열림 (생성자 L54-140) → 초기화
export const Pay27_TabPage_TaxDeduct: React.FC<PayDetailProps> = ({ date, tick }) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // L58·L96 LoginUser.getCompanyId() == 0일 때만 등록·저장·삭제
  const columnDefs = useMemo(buildGrid, []);
  const limitColumnDefs = useMemo(buildLimitGrid, []);

  const crud = useGridCrud<PayTaxDeduct>({
    idField: 'taxDeductTableId',
    // retrieve(taxDeductModel) L173-186: 고른 적용일 → pay.Pay27_TaxDeductTable.selectByDate
    search: useCallback(() => (date ? payApi.searchTaxDeducts(date.startDate) : Promise.resolve([])), [date]),
    save: payApi.saveTaxDeducts,
    remove: payApi.deleteTaxDeducts,
    // insert() L193-198: 고른 적용일을 넣은 빈 행
    newRow: useCallback(() => ({ startDate: date?.startDate }), [date]),
    firstEditField: 'fromAmt',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // delete() L200-215
  });

  const limitCrud = useGridCrud<PayTaxDeductLimit>({
    idField: 'taxDeductLimitId',
    // limitRetrieve() L218-231: 고른 적용일 → pay.Pay28_TaxDeductLimit.selectByDate
    search: useCallback(() => (date ? payApi.searchTaxDeductLimits(date.startDate) : Promise.resolve([])), [date]),
    save: payApi.saveTaxDeductLimits,
    remove: payApi.deleteTaxDeductLimits,
    // limitInsert() L238-243: 고른 적용일을 넣은 빈 행
    newRow: useCallback(() => ({ startDate: date?.startDate }), [date]),
    firstEditField: 'fromAmt',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // limitDelete() L245-260
  });

  // retrievePage() (부모 L184-189): 적용일을 고르거나 조회할 때마다(tick) 세액공제와 한도를 읽는다
  useEffect(() => {
    if (date) {
      crud.retrieve();
      limitCrud.retrieve();
    } else {
      crud.clear();
      limitCrud.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.startDate, tick]);

  const needDate = (run: () => void) => () => (date ? run() : message.warning('기준 적용일을 선택해주세요'));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap style={{ flex: 'none' }}>
          <span style={{ fontSize: 14, fontWeight: 'bold' }}>세액공제</span>
          {isAdminCompany && <>
            {/* [E1] insertButton[등록].Select (L75) → insert() L193-198 */}
            <Button type="register" onClick={needDate(() => crud.addRow())}>등록</Button>
            {/* [E2] updateButton[저장].Select (L81) → update() L188-191. 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E3] deleteButton[삭제].Select (L87) → delete() L200-215 → [E7] messageBox.DialogHide [YES] (L203) → pay.Pay27_TaxDeductTable.delete */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          </>}
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayTaxDeduct> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_ROW_SELECTION} />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap style={{ flex: 'none' }}>
          <span style={{ fontSize: 14, fontWeight: 'bold' }}>세액공제 한도</span>
          {isAdminCompany && <>
            {/* [E4] limitInsertButton[등록].Select (L115) → limitInsert() L238-243 */}
            <Button type="register" onClick={needDate(() => limitCrud.addRow())}>등록</Button>
            {/* [E5] limitUpdateButton[저장].Select (L121) → limitUpdate() L233-236. 저장(n)은 UX-03 */}
            <Button type="save" count={limitCrud.changes} onClick={limitCrud.saveRows}>저장</Button>
            {/* [E6] limitDeleteButton[삭제].Select (L127) → limitDelete() L245-260 → [E8] messageBox.DialogHide [YES] (L248) → pay.Pay28_TaxDeductLimit.delete */}
            <Button type="delete" onClick={limitCrud.deleteChecked}>삭제</Button>
          </>}
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayTaxDeductLimit> crud={limitCrud} columnDefs={limitColumnDefs} rowSelection={SINGLE_ROW_SELECTION} />
        </div>
      </div>
    </div>
  );
};
