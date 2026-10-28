/**
 * 초기설정 휴가일수 창 — 휴가관리(Emp20_Tab_LeaveManager, S06)의 [초기설정 휴가일수]에서 연다 (AS-IS open(year)).
 * AS-IS: myApp/client/vi/emp/Emp26_Lookup_InitLeave.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L71-102: 모달 650×600 "초기설정 휴가일수", 툴바(기준연도 · 사원명 · [조회][등록][저장][삭제]), 체크 다중 셀 편집 그리드 5열, 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { empInitLeaveApi } from '@/api/emp';
import { InitLeave, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import dayjs from 'dayjs';

const gb = gbFor<InitLeave>();

/** buildGrid() L169-179 (setChecked(MULTI), 행번호 있음) */
const columnDefs = [
  gb.textCenter('year', 80, '사용년도', { editor: 'text' }),  // L172
  gb.textCenter('personNo', 100, '사번'),  // L173
  gb.textCenter('personName', 100, '사원명'),  // L174
  gb.textCenter('posName', 150, '직책'),  // L175
  gb.double('useDays', 100, '사용일수', { editor: 'number' }),  // L176
];

interface Props {
  open: boolean;
  /** open(year) L66-69 — 부른 화면의 기준연도 */
  year: string;
  onClose: () => void;
}

export const Emp26_Lookup_InitLeave: React.FC<Props> = ({ open, year: openYear, onClose }) => {
  const [year, setYear] = useState('');
  const [person, setPerson] = useState<{ id: number; name: string } | null>(null);
  const [personOpen, setPersonOpen] = useState(false);
  const [multiOpen, setMultiOpen] = useState(false);
  const yearRef = useRef(year);
  const personRef = useRef(person);
  yearRef.current = year;
  personRef.current = person;

  const crud = useGridCrud<InitLeave>({
    idField: 'initLeaveId',
    // retrieve() L181-194: 서비스 emp.Emp26_InitLeave.selectByYear(companyId, year, personId)
    search: useCallback(() => empInitLeaveApi.search(yearRef.current, personRef.current?.id), []),
    // [E5] updateButton[저장].Select (L149) → update() L196-212: GridUpdate → emp.Emp26_InitLeave.update
    save: useCallback((rows: InitLeave[]) => empInitLeaveApi.save(rows), []),
    // [E6] deleteButton[삭제].Select (L155) → deleteChk() L239-257 → deleteRow() L259-263: GridDeleteData → emp.Emp26_InitLeave.delete(체크된 행)
    remove: useCallback((ids: number[]) => empInitLeaveApi.remove(ids), []),
    newRow: useCallback(() => ({ year: yearRef.current, useDays: null }), []),
    firstEditField: 'useDays',
    // update() L203-206: 검사는 year(사용년도)가 비었는지 — 메시지 문구는 원본 그대로
    validate: useCallback((changed: InitLeave[]) => (changed.some(r => !r.year) ? '사용일수는 필수입력 항목입니다.' : undefined), []),
    // deleteChk() L239-257: "n건을 삭제하시겠습니까?"
    deleteConfirm: (count: number) => `${count}건을 삭제하시겠습니까?`,
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L71-102, open(year) L66-69) → 기준연도 = 부른 화면의 값, retrieve()
  useEffect(() => {
    if (!open) return;
    setYear(openYear);
    yearRef.current = openYear;
    setPerson(null);
    personRef.current = null;
    void retrieve();
  }, [open, openYear, retrieve]);

  // [E8] msgBox.DialogHide [YES] (L242) → deleteRow() — 삭제 확인은 훅의 deleteConfirm
  // [E4] insertButton[등록].Select (L143) → insertRow() L214-237: Emp00_Lookup_SelectMulti(오늘, 겸직 구분) → 고른 사원마다 행 추가(회사·사원·사번·이름·직책·기준연도)
  const insertRows = (list: TransInfo[]) => {
    if (list.length === 0) return;
    crud.addRows(list.map(t => ({ personId: t.personId, personNo: t.empNo, personName: t.korNm, posName: t.posNm, year: yearRef.current, useDays: null })));
  };

  return (
    <LookupModal
      open={open}
      title="초기설정 휴가일수"
      width={720}
      maskClosable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}>{/* [E7] cancelButton[닫기].Select (L161) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 480, gap: 8 }}>
        {/* [E1] leaveYText.KeyPress [Enter] (L107) / [E3] retrieveButton[조회].Select (L137) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          extra={<>
            <Button type="register" onClick={() => setMultiOpen(true)}>등록</Button>
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="기준연도">
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            {/* [E2] personName.TriggerClick (L117) → Emp00_Lookup_SelectSingle(오늘, [선택안함]) — 널이면 사원을 비운다 */}
            <LookupInput value={person?.name ?? ''} width={110} onOpen={() => setPersonOpen(true)} onClear={() => setPerson(null)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<InitLeave> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle
        open={personOpen}
        separateAddTitle
        noneLabel="선택안함"
        transDate={dayjs().format('YYYY-MM-DD')}
        onResult={t => { setPerson(t ? { id: t.personId, name: t.korNm ?? '' } : null); setPersonOpen(false); }}
        onClose={() => setPersonOpen(false)}
      />
      <Emp00_Lookup_SelectMulti
        open={multiOpen}
        transDate={dayjs().format('YYYY-MM-DD')}
        onResult={list => { setMultiOpen(false); insertRows(list); }}
        onClose={() => setMultiOpen(false)}
      />
    </LookupModal>
  );
};
