/**
 * [1489] 기초자료 > 30. 자산&경영 > 근로시간기준관리 (E23)
 * AS-IS: myApp/client/vi/pay/Pay34_Tab_WorkTimeConfig.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L64-73: 툴바(조회 · 등록 · 저장 · 삭제) + 체크박스 단일 셀 편집 그리드(야간근로·가산 배수 헤더 묶음). 여백 20, 최대 폭 1000
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 원본에 검색 조건·초기화 버튼이 없어 onReset(UX-02)은 넣지 않는다
 * 회사 0(공통) 행만 조회한다(retrieve() L133). 저장·삭제는 서버가 관리자 회사만 허용한다.
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { payApi } from '@/api/pay';
import { PayWorkTime } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<PayWorkTime>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;  // L108 setChecked(SINGLE)

/** AS-IS buildGrid() L102-127 — 헤더 묶음 야간근로(L110, 글자색 456EA6)는 시작/종료 2열, 가산 배수(L111)는 배수 4열 */
const buildGrid = () => [
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L114
  gb.longCenter('dayWorkHours', 120, '일일<br>법정근로시간<br>(A)', { editor: 'number' }),  // L115
  gb.longCenter('weekMaxAddHours', 120, '주 최대<br>추가근로시간', { editor: 'number' }),  // L116
  { ...gb.group('야간근로', [
    gb.textCenter('ntStartTime', 120, '시작시간(시)', { editor: 'text' }),  // L118 빈칸 글자 "00:00"
    gb.textCenter('ntEndTime', 120, '종료시간(시)', { editor: 'text' }),  // L119 빈칸 글자 "00:00"
  ]), headerStyle: { color: '#456EA6', fontWeight: 'bold' } },  // L110
  gb.group('가산 배수', [  // L111
    gb.doubleCenter('otMultRate', 120, '연장', { editor: 'number' }),  // L121
    gb.doubleCenter('ntMultRate', 120, '야간', { editor: 'number' }),  // L122
    gb.doubleCenter('holiStdMultRate', 120, '휴일<br>(A)이내', { editor: 'number' }),  // L123
    gb.doubleCenter('holiOverMultRate', 120, '휴일<br>(A)초과', { editor: 'number' }),  // L124
  ]),
];

export const Pay34_Tab_WorkTimeConfig: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<PayWorkTime>({
    idField: 'workTimeConfigId',
    // retrieve() L130-141: companyId 0 고정 → pay.Pay34_WorkTimeConfig.selectByCompanyId
    search: payApi.searchWorkTimes,
    save: payApi.saveWorkTimes,
    remove: payApi.deleteWorkTimes,
    // insertRow() L150-155: 회사 ID(서버가 로그인 회사로 넣는다)
    newRow: useCallback(() => ({}), []),
    firstEditField: 'startDate',
    deleteConfirm: '해당 내용을 삭제하시겠습니까?',  // deleteChk() L157-175
  });

  // [E0] 화면 열림 (생성자 L51-73): 열 때 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1000 }}>
      {/* [E1] retrieveButton[조회].Select (L76) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
        {/* [E2] insertButton[등록].Select (L82) → insertRow() L150-155 */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L88) → update() L144-147. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E4] deleteButton[삭제].Select (L94) → deleteChk() → [E5] msgBox.DialogHide [YES] (L160) → deleteRow() → pay.Pay34_WorkTimeConfig.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </>} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayWorkTime> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
      </div>
    </div>
  );
};
