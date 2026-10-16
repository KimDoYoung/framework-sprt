/**
 * [1080] 관리자 > 09. 기타 > 일자관리 / [1113] 기초자료 > 90. 기타 > 일자관리 (A18)
 * AS-IS: myApp/client/vi/sys/Sys12_Tab_Calendar.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-85: 툴바(년도 · 월 · 조회·저장·생성·휴일관리, 관리자 회사만 고객사반영) + 그리드(행번호, 체크박스 단일, 영업일 체크 + 휴일사유·비고 편집). 여백 20, 최대 폭 1000
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { message, Modal } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Calendar } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys14_Lookup_Holiday } from './Sys14_Lookup_Holiday';
import { Sys12_Lookup_Customer } from './Sys12_Lookup_Customer';

const gb = gbFor<Calendar>();
const ALL = '%';  // monthComboBox: "전체" 또는 "%"

/** AS-IS buildGrid() L162-172 */
const buildGrid = () => [
  gb.date('day', 100, '일자'),  // L166
  gb.text('weekday', 100, '요일'),  // L167
  gb.boolean('workingYn', 70, '영업일', { editable: true }),  // L168 workingYnFlag(addBoolean) = workingYn 'true'
  gb.text('offReason', 500, '휴일사유', { editor: 'text' }),  // L169
  gb.text('note', 500, '비고', { editor: 'text' }),  // L170
];

const NEW_ROW: Partial<Calendar> = {};

export const Sys12_Tab_Calendar: React.FC = () => {
  const user = useLoginUser();
  const columnDefs = useMemo(buildGrid, []);
  // settings() L87-160: 년도 = 올해(LoginUser.getYear()), 월 = 전체
  const sp = useSearchParams(() => ({ year: String(dayjs().year()), month: ALL }));
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [customerRow, setCustomerRow] = useState<Calendar | null>(null);

  const crud = useGridCrud<Calendar>({
    idField: 'calendarId',
    // retrieve() L205-218: companyId(서버) · year · month → sys.Sys12_Calendar.selectByYear
    search: useCallback(() => sysApi.searchCalendars(sp.current.current.year, sp.current.current.month), [sp.current]),
    // update() L221-224: GridUpdate → sys.Sys12_Calendar.update
    save: sysApi.updateCalendars,
    // 행 추가·삭제 버튼이 없다(insertRow L227-229·deleteRow L232-234는 비어 있음)
    remove: async () => 0,
    newRow: useCallback(() => NEW_ROW, []),
  });

  // [E0] 화면 열림 (생성자 L55-85) → settings(), retrieve()
  useEffect(() => {
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E5] insertButton[생성].Select [YES] (L119) → 확인 → [E6] msgBox.DialogHide [YES] (L124) → insertAuto() L174-197
  const insertAuto = () => {
    Modal.confirm({
      title: '확인',
      content: '기존 데이터를 삭제 후 생성합니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: async () => {
        try {
          await sysApi.generateCalendars(sp.current.current.year);
          message.success('생성이 완료되었습니다.');
          await crud.retrieve();
        } catch (err) {
          message.error(errorMessage(err, '생성 실패'));
        }
      },
    });
  };

  // [E8] customerButton[고객사반영].Select (L148) → 선택이 1건이 아니면 "반영할 일자를 선택해주세요", 아니면 Sys12_Lookup_Customer.open(고른 행)
  const lookupCustomer = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length !== 1) {
      message.warning('반영할 일자를 선택해주세요');
      return;
    }
    setCustomerRow(selected[0]);
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1000 }}>
      {/* [E3] retrieveButton[조회].Select (L107) → retrieve(), [E1] yearField.KeyPress [Enter] (L90) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} onReset={sp.reset} loading={crud.loading} extra={<>
        {/* [E4] updateButton[저장].Select (L113) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="generate" onClick={insertAuto}>생성</Button>
        {/* [E7] holidayButton[휴일관리].Select (L142) → lookupHoliday() L199-202 */}
        <Button type="register" onClick={() => setHolidayOpen(true)}>휴일관리</Button>
        {user.companyId === 0 && <Button type="save" onClick={lookupCustomer}>고객사반영</Button>}
      </>}>
        <SearchBar.Field label="년도">
          <SearchBar.Input style={{ width: 80 }} value={sp.values.year} onChange={e => sp.set('year', e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="월">
          {/* [E2] monthComboBox[MonthsCode].Collapse (L100) → retrieve() — 고르면 바로 조회 */}
          <SystemCodeComboBox kindCd="MonthsCode" altCode={[ALL, '전체']} style={{ width: 100 }} value={sp.values.month}
            onChange={c => { const v = c ?? ALL; sp.set('month', v); sp.current.current = { ...sp.current.current, month: v }; crud.retrieve(); }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Calendar> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: true }} />
      </div>
      <Sys14_Lookup_Holiday open={holidayOpen} onClose={() => setHolidayOpen(false)} />
      <Sys12_Lookup_Customer open={!!customerRow} calendar={customerRow} onClose={() => setCustomerRow(null)} />
    </div>
  );
};
