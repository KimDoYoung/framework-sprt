/**
 * 근로소득 공제표 상세 (E22-2) — Pay24_TabPage_DeductTable 오른쪽 85%
 * AS-IS: myApp/client/vi/pay/Pay24_TabPage_Deduct.java (206줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로
 * 레이아웃 L55-106: 툴바("공제한도" 숫자칸 · 관리자 회사만 [등록][저장][삭제]; 관리자가 아니면 공제한도칸은 읽기 전용) + 셀 편집 그리드(체크박스 없음 — 행을 눌러 고름)
 * 부모(Pay24_TabPage_DeductTable)가 적용일을 고르면 retrieve(고른 적용일)
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { InputNumber, message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayDeductTable } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PayDetailProps } from './usePayDateList';

const gb = gbFor<PayDeductTable>();

/** 체크박스가 없다(setChecked 없음) — 행을 눌러 고른다. 렌더마다 새 객체면 선택이 풀리므로 상수 */
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/** AS-IS buildGrid() L108-120: 머리글 묶음 "총급여액(원)"(초과·이하) + 기본공제금액·공제율·비고 */
const buildGrid = () => [
  gb.group('총급여액(원)', [  // L111
    gb.long('fromAmt', 100, '초과', { editor: 'number' }),  // L113
    gb.long('toAmt', 100, '이하', { editor: 'number' }),  // L114
  ]),
  gb.long('deductAmt', 140, '기본공제금액', { editor: 'number' }),  // L115
  gb.double('deductRate', 140, '공제율(%)', { editor: 'number' }),  // L116
  gb.text('note', 500, '비고', { editor: 'text' }),  // L117
];

// [E0] 화면 열림 (생성자 L55-106) → 초기화
export const Pay24_TabPage_Deduct: React.FC<PayDetailProps> = ({ date, tick }) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // L66 LoginUser.getCompanyId() == 0일 때만 공제한도 편집·등록·저장·삭제
  const [limitAmt, setLimitAmt] = useState<number | null>(0);
  const [limitDirty, setLimitDirty] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<PayDeductTable>({
    idField: 'deductTableId',
    // retrieve(deductTableModel) L121-153: 고른 적용일의 공제표(dataCode "2") → pay.Pay24_DeductTable.selectByDataCode
    search: useCallback(() => (date ? payApi.searchDeductTables(date.startDate) : Promise.resolve([])), [date]),
    save: payApi.saveDeductTables,
    remove: payApi.deleteDeductTables,
    // insertRow() L177-184: 고른 적용일을 넣은 빈 행(dataCode "2"는 서버가 넣는다)
    newRow: useCallback(() => ({ startDate: date?.startDate }), [date]),
    firstEditField: 'fromAmt',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // deleteRow() L186-204
  });

  // retrieve() L137-153: 공제한도 조회 — pay.Pay24_DeductTable.selectByDataCode(dataCode "1"), 없으면 0
  const retrieveLimit = useCallback(async () => {
    if (!date) {
      setLimitAmt(0);
      setLimitDirty(false);
      return;
    }
    try {
      setLimitAmt(await payApi.searchDeductLimit(date.startDate));
      setLimitDirty(false);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [date]);

  // retrievePage() (부모 L184-190): 적용일을 고르거나 조회할 때마다(tick) 공제표와 공제한도를 읽는다
  useEffect(() => {
    if (date) crud.retrieve();
    else crud.clear();
    retrieveLimit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.startDate, tick]);

  // [E2] updateButton[저장].Select (L93) → update() L154-175: 그리드 저장(pay.Pay24_DeductTable.update) 뒤 공제한도 저장(updateLimitAmt) → 다시 조회
  const update = async () => {
    if (!date) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    try {
      await crud.saveRows();
      await payApi.saveDeductLimit(date.startDate, limitAmt);
      await retrieveLimit();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap style={{ flex: 'none' }}>
        <span style={{ fontWeight: 'bold' }}>공제한도</span>
        <InputNumber<number>
          style={{ width: 150 }}
          value={limitAmt}
          controls={false}
          readOnly={!isAdminCompany}
          formatter={v => (v == null ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
          parser={v => Number((v ?? '').replace(/,/g, ''))}
          onChange={v => { setLimitAmt(v); setLimitDirty(true); }}
        />
        {isAdminCompany && <>
          {/* [E1] insertButton[등록].Select (L87) → insertRow() L177-184 */}
          <Button type="register" onClick={() => (date ? crud.addRow() : message.warning('기준 적용일을 선택해주세요'))}>등록</Button>
          {/* 저장(n)은 UX-03 — 공제한도만 바뀐 경우도 저장할 수 있게 센다 */}
          <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + (limitDirty ? 1 : 0) }} onClick={update}>저장</Button>
          {/* [E3] deleteButton[삭제].Select (L99) → deleteRow() L186-204 → [E4] messageBox.DialogHide [YES] (L188) → pay.Pay24_DeductTable.delete */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </>}
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayDeductTable> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_ROW_SELECTION} />
      </div>
    </div>
  );
};
