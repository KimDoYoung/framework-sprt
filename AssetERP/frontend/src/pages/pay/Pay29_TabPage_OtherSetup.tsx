/**
 * 급여공제 기타설정 상세 (E22-3) — Pay29_TabPage_OtherSetupDate 오른쪽 85%
 * AS-IS: myApp/client/vi/pay/Pay29_TabPage_OtherSetup.java (142줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로
 * 레이아웃 L44-84: 툴바(관리자 회사만 [등록][저장][삭제]) + 셀 편집 그리드(체크박스 없음 — 행을 눌러 고름)
 * 부모(Pay29_TabPage_OtherSetupDate)가 적용일을 고르면 retrieve(고른 적용일)
 */
import { useCallback, useEffect, useMemo } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { PayOtherSetup } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PayDetailProps } from './usePayDateList';

const gb = gbFor<PayOtherSetup>();

/** 체크박스가 없다(setChecked 없음) — 행을 눌러 고른다. 렌더마다 새 객체면 선택이 풀리므로 상수 */
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/** AS-IS buildGrid() L86-103: 머리글 묶음 3개(최대분할회차·건강보험 상ㆍ하한액·국민연금 상ㆍ하한액) + 표준세액공제·비고 */
const buildGrid = () => [
  gb.group('최대분할회차', [  // L89
    gb.long('hiMaxDiv', 150, '건강보험', { editor: 'number' }),  // L93
    gb.long('eiMaxDiv', 150, '고용보험', { editor: 'number' }),  // L94
  ]),
  gb.group('건강보험 상ㆍ하한액', [  // L90
    gb.long('hiMaxAmt', 150, '상한액', { editor: 'number' }),  // L95
    gb.long('hiMinAmt', 150, '하한액', { editor: 'number' }),  // L96
  ]),
  gb.group('국민연금 상ㆍ하한액', [  // L91
    gb.long('npMaxAmt', 150, '상한액', { editor: 'number' }),  // L97
    gb.long('npMinAmt', 150, '하한액', { editor: 'number' }),  // L98
  ]),
  gb.long('stdTaxDeduct', 150, '표준세액공제', { editor: 'number' }),  // L99
  gb.text('note', 500, '비고', { editor: 'text' }),  // L100
];

// [E0] 화면 열림 (생성자 L44-84) → 초기화
export const Pay29_TabPage_OtherSetup: React.FC<PayDetailProps> = ({ date, tick }) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // L50 LoginUser.getCompanyId() == 0일 때만 등록·저장·삭제
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<PayOtherSetup>({
    idField: 'otherSetupId',
    // retrieve(otherSetupModel) L105-111: 고른 적용일 → pay.Pay29_OtherSetup.selectByDate
    search: useCallback(() => (date ? payApi.searchOtherSetups(date.startDate) : Promise.resolve([])), [date]),
    save: payApi.saveOtherSetups,
    remove: payApi.deleteOtherSetups,
    // insertRow() L118-123: 고른 적용일을 넣은 빈 행
    newRow: useCallback(() => ({ startDate: date?.startDate }), [date]),
    firstEditField: 'hiMaxDiv',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // deleteRow() L125-140
  });

  // retrievePage() (부모 L203-207): 적용일을 고르거나 조회할 때마다(tick) 읽는다
  useEffect(() => {
    if (date) crud.retrieve();
    else crud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.startDate, tick]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isAdminCompany && <Space wrap style={{ flex: 'none' }}>
        {/* [E1] insertButton[등록].Select (L66) → insertRow() L118-123 */}
        <Button type="register" onClick={() => (date ? crud.addRow() : message.warning('기준 적용일을 선택해주세요'))}>등록</Button>
        {/* [E2] updateButton[저장].Select (L72) → update() L113-116. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E3] deleteButton[삭제].Select (L78) → deleteRow() L125-140 → [E4] messageBox.DialogHide [YES] (L128) → pay.Pay29_OtherSetup.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </Space>}
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayOtherSetup> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_ROW_SELECTION} />
      </div>
    </div>
  );
};
