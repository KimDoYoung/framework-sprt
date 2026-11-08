/**
 * 특정직위 및 알림설정 창 — 사원정보 관리 #1029 일반발령 탭 [특정직위 및 알림설정](Emp03_TabPage_Trans L68)과
 * 개인설정 "특정직위 지정"(MySetting L123, 관리자만)이 연다. 메뉴 없는 창(13-누락대장 4-2).
 * AS-IS: myApp/client/vi/emp/Emp03_Lookup_Grade.java (254줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, IDMS-IC)
 * open(callback) L59-85: 모달 890×600 "특정직위 및 알림설정", 툴바(기준일 100 · [조회]) + 셀 편집 그리드, 아래 [저장][닫기]. 열 때 조회.
 * 저장 뒤 callback(일반발령 탭은 발령 목록 다시 조회, 개인설정은 없음) → 창은 열린 채 다시 조회.
 * UX보강(10): 검색 줄 = SearchBar(UX-01), [저장(n)] UX-03. 폭 = 열 합계 890 + 130(11a 모달 폭)
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { TransGrade } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<TransGrade>();
const FORMAT = 'YYYY-MM-DD';
const NONE = '(선택안함)';

interface Props {
  open: boolean;
  /** open(callback)의 callback — 저장이 끝나면 부른다 */
  onSaved?: () => void;
  onClose: () => void;
}

export const Emp03_Lookup_Grade: React.FC<Props> = ({ open, onSaved, onClose }) => {
  // settings() L130-134: 기준일 = 오늘
  const [baseDate, setBaseDate] = useState<Dayjs>(() => dayjs());
  const baseRef = useRef(baseDate);
  baseRef.current = baseDate;
  const [grades, setGrades] = useState<Code[]>([]);
  /** 조회한 그대로의 특정직위 (update()의 "DB에 있는 List" — 중복 검사용) */
  const loadedGrade = useRef(new Map<number, string | null | undefined>());

  useEffect(() => { sysApi.searchCodes('EmpGradeCode').then(setGrades).catch(() => {}); }, []);

  // retrieve() L155-167: emp.Emp03_Trans.selectByGrade(companyId, baseDate)
  const search = useCallback(async () => {
    const list = await empApi.searchTransGrades(baseRef.current.format(FORMAT));
    loadedGrade.current = new Map(list.map(r => [r.transId, r.gradeCode]));
    return list;
  }, []);

  // update() L169-245: emp.Emp03_Trans.update(바뀐 행) → emp.Emp25_MypageNotice.updateList(바뀐 행의 법규·상신문서 알림) → callback, retrieve()
  const save = useCallback(async (changed: TransGrade[]) => {
    await empApi.updateTransGrades(changed);
    return changed;
  }, []);

  // update() L193-226: 바뀐 행의 특정직위가 있으면 그것, 없으면(선택안함 포함) 조회한 값으로 110·120·121을 세어 2명 이상이면 막는다 (원본 그대로)
  const validate = useCallback((changed: TransGrade[], all: TransGrade[]) => {
    const changedIds = new Set(changed.map(r => r.transId));
    const count: Record<string, number> = { '110': 0, '120': 0, '121': 0 };
    all.forEach(r => {
      const code = changedIds.has(r.transId) && r.gradeCode != null ? r.gradeCode : loadedGrade.current.get(r.transId);
      if (code != null && code in count) count[code]++;
    });
    return count['110'] > 1 || count['120'] > 1 || count['121'] > 1 ? '특정직위는 1명만 지정가능합니다' : undefined;
  }, []);

  const crud = useGridCrud<TransGrade>({
    idField: 'transId', search, save, remove: async () => {}, newRow: () => ({}),
    validate, reloadAfterSave: true, onChanged: onSaved,
  });
  const { retrieve } = crud;

  // [E0] open() L59-85 → show(), retrieve() — 열 때마다 새 창이라 기준일을 오늘로 되돌리고 조회한다
  useEffect(() => {
    if (!open) return;
    const d = dayjs();
    setBaseDate(d);
    baseRef.current = d;
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L87-128: CellEditGrid(체크 없음, 행번호)
  // [E1 생략] personName.TriggerClick (L91) → Emp00_Lookup_SelectSingle: 편집기(personName)를 어느 열에도 붙이지 않아 원본에서 열 수 없다
  const columnDefs = useMemo(() => [
    gb.text('orgFullName', 200, '부서명'),          // L119
    gb.textCenter('titleName', 110, '직책'),        // L120
    gb.textCenter('empNo', 70, '사원번호'),         // L121
    gb.textCenter('empKorName', 100, '사원명'),     // L122
    // [E2] gradeName[EmpGradeCode].Collapse (L109) → 고른 코드·이름을 gradeCode·gradeName 변경으로 기록 (ComboBoxField "(선택안함)" = 코드 없음)
    gb.textCenter('gradeName', 150, '특정직위', {   // L123
      editor: 'select',
      values: [NONE, ...grades.map(c => c.name)],
      valueSetter: p => {
        const c = grades.find(g => g.name === p.newValue);
        p.data.gradeCode = c ? c.code : null;
        p.data.gradeName = c ? c.name : null;
        return true;
      },
    }),
    gb.boolean('icsYn', 100, '법규 알림', { editable: true }),        // L124
    gb.boolean('apprYn', 100, '상신문서 알림', { editable: true }),   // L125
  ], [grades]);

  return (
    <LookupModal open={open} title="특정직위 및 알림설정" width={1020} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] updateButton[저장].Select (L141) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L147) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 470, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L135) → retrieve() */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TransGrade> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
