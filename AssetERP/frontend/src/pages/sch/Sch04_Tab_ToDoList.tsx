/**
 * [1043] 스케줄 > 01. 업무일정 > 업무일정 처리 (O04)
 * AS-IS: myApp/client/vi/sch/Sch04_Tab_ToDoList.java (629줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L103-167: center=세로 테두리 박스(툴바 + 그리드). 툴바 = (●)마감일 (  )처리일 · ◀ 기준일(100) ▶ · 분류(150) · 처리여부(120, ScheduleStatusCode) ·
 *   [완료건 제외] · [취소건 제외](기본 켬) · [조회] [저장] [담당자 일괄변경]. 그리드는 체크 다중(setChecked MULTI)이고 처리여부(콤보)·처리일(날짜)·담당자(조회창 트리거)·비고 네 열을 셀 편집한다.
 *   아이콘 열 1(상세보기). 공유구분 콤보·결재요청 열·원인문서 열은 원본에서 주석 처리돼 만들지 않는다(Apr01_Edit_ApprDoc·Dcr01_Lookup_Class는 쓰이지 않음)
 * 연결: Emp00_Lookup_SelectSingle(담당자) · Sch01_Lookup_InfoView(업무일정 보기) · Sch10_Lookup_Ipo(공모주)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n)(UX-03). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 조건이 많아 줄바꿈 위험이라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Checkbox, DatePicker, Radio, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { schApi } from '@/api/sch';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sch04Todo, Sch08ClassCombo, Sch10Ipo } from '@/types/sch';
import { Code } from '@/types/sys';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Sch01_Lookup_InfoView, InfoViewTarget } from '@/components/lookup/Sch01_Lookup_InfoView';
import { Sch10_Lookup_Ipo } from '@/components/lookup/Sch10_Lookup_Ipo';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Sch04Todo>();
const FORMAT = 'YYYY-MM-DD';
const ALL_CODE: [string, string] = ['%', '전체'];   // ComboBoxField("ScheduleStatusCode", "%", "전체", …)
/** 처리여부가 완료('1')·ICAM자동처리('2')·해당없음('5')이면 처리일이 있어야 한다 — update() L426-432 */
const DONE_CODES = ['1', '2', '5'];

export const Sch04_Tab_ToDoList: React.FC = () => {
  const user = useLoginUser();
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs());
  const [manageCheck, setManageCheck] = useState(false);   // closeRadio(마감일) 기본, manageRadio(처리일)
  const [classes, setClasses] = useState<Sch08ClassCombo[]>([]);
  const [classId, setClassId] = useState('');
  const [statusCode, setStatusCode] = useState('%');
  const [exceptYn, setExceptYn] = useState(false);
  const [cancelYn, setCancelYn] = useState(true);
  const [statusCodes, setStatusCodes] = useState<Code[]>([]);
  const [viewTarget, setViewTarget] = useState<InfoViewTarget | null>(null);
  const [ipo, setIpo] = useState<Sch10Ipo | null>(null);
  const [empOpen, setEmpOpen] = useState(false);
  /** 담당자 조회창을 연 곳: 'all' = [담당자 일괄변경](체크한 행들), 숫자 = 그 행의 담당자 칸(listId) */
  const [empTarget, setEmpTarget] = useState<'all' | number | null>(null);

  // 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ stdDate, manageCheck, classId, statusCode, exceptYn, cancelYn });
  latest.current = { stdDate, manageCheck, classId, statusCode, exceptYn, cancelYn };
  /** 조회 때의 담당자 — update() L416: 고치기 전 담당자가 로그인 사용자가 아니면 저장할 수 없다 */
  const originPerson = useRef(new Map<number, number | null | undefined>());

  // retrieve() L364-401: sch.Sch04_List.selectByManagerId (공유구분 '1' 나의 스케줄 고정, 검색어 '%')
  const search = useCallback(async (): Promise<Sch04Todo[]> => {
    const c = latest.current;
    const rows = await schApi.searchTodo({
      startDate: c.stdDate.format(FORMAT), manageCheck: c.manageCheck, exceptYn: c.exceptYn, cancelYn: c.cancelYn,
      statusCode: c.statusCode, classId: c.classId ? Number(c.classId) : null,
    });
    originPerson.current = new Map(rows.map(r => [r.listId, r.personId]));
    return rows;
  }, []);

  // update() L403-461: 처리여부가 완료·ICAM자동처리·해당없음인데 처리일이 없으면 오늘로, sch.Sch04_List.insertCheck 뒤 retrieve()
  const save = useCallback(async (changed: Sch04Todo[]) => {
    const today = dayjs().format(FORMAT);
    const rows = changed.map(r => (DONE_CODES.includes(r.statusCode ?? '') && !r.manageDate ? { ...r, manageDate: today } : r));
    await schApi.saveTodo(rows);
    return rows;
  }, []);

  const crud = useGridCrud<Sch04Todo>({
    idField: 'listId',
    search,
    save,
    remove: async () => undefined,   // 삭제 기능 없음
    newRow: () => ({} as Sch04Todo),
    reloadAfterSave: true,
    // update() L416-419: 담당자가 아니면 "담당자가 아닌경우 수정은 불가합니다."
    validate: changed => (changed.some(r => originPerson.current.get(r.listId) !== user.userId) ? '담당자가 아닌경우 수정은 불가합니다.' : undefined),
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L103-167) → settings(), setIconStyle(), setInitData(): 기준일 = 오늘, 분류 "전체", 처리여부 "전체", 마감일 기준, 완료건 제외 끔, 취소건 제외 켬.
  //   AS-IS는 열 때 조회하지 않는다(콤보 callback은 문구만 "전체"로 바꾼다) — [조회]를 눌러야 목록이 나온다
  useEffect(() => {
    schApi.searchClassCombo(true).then(setClasses).catch(() => setClasses([]));
    // buildGrid() L267-275: statusComboBox = ComboBoxField("ScheduleStatusCode")
    sysApi.searchCodes('ScheduleStatusCode').then(setStatusCodes).catch(() => setStatusCodes([]));
  }, []);

  // [E1] anchor01.MouseDown (L109) / [E2] anchor02.MouseDown (L121) → 기준일 -1일 / +1일 뒤 retrieve()
  const moveDate = (days: number) => {
    const d = latest.current.stdDate.add(days, 'day');
    latest.current.stdDate = d;
    setStdDate(d);
    void retrieve();
  };

  // lookupEmpInfo(담당자 칸) L285-300 / personUpdate() L463-481: 사원찾기 → 그 행(들)의 담당자(personId·personName)만 바꾼다. 저장은 [저장]
  const onEmpResult = (emp: TransInfo | null) => {
    const target = empTarget;
    setEmpOpen(false);
    setEmpTarget(null);
    if (!emp || target == null) return;
    const patch = { personId: emp.personId, personName: emp.korNm ?? '' };
    if (target === 'all') {
      (crud.gridRef.current?.api.getSelectedRows() ?? []).forEach(r => crud.updateRow(r.listId, patch));
    } else {
      crud.updateRow(target, patch);
    }
  };

  // [E8] personButton[담당자 일괄변경].Select (L253) → personUpdate() L463-481
  const personUpdate = () => {
    if ((crud.gridRef.current?.api.getSelectedRows() ?? []).length === 0) {
      message.warning('변경할 일정을 선택하세요');
      return;
    }
    setEmpTarget('all');
    setEmpOpen(true);
  };

  // view() L483-506: 업무일정('1')이면 Sch01_Lookup_InfoView.open(infoId, deadlineId), 공모주('5')면 sch.Sch10_Ipo.selectById(infoId) → Sch10_Lookup_Ipo
  const view = async (row: Sch04Todo) => {
    if (row.infoId == null) return;
    if (row.scheduleCode === '1') {
      if (row.deadlineId != null) setViewTarget({ infoId: row.infoId, deadlineId: row.deadlineId });
    } else if (row.scheduleCode === '5') {
      try {
        setIpo(await schApi.getIpo(row.infoId));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    }
  };

  // buildGrid() L265-357 (체크 다중, 처리여부·처리일·담당자·비고만 셀 편집)
  const columnDefs = useMemo(() => [
    gb.date('closeDate', 100, '마감일'),
    gb.text('className', 150, '분류'),
    gb.text('title', 500, '일정명'),
    gb.textCenter('cycleName', 100, '주기구분'),
    iconCell<Sch04Todo>('view', 'actionCell', 80, '상세보기', view),   // → view()
    gb.textCenter('statusName', 100, '처리여부', {   // 편집: ScheduleStatusCode 콤보. [E9] statusComboBox.Collapse (L270) → statusCode·statusName 둘 다 바꾼다
      editor: 'select',
      values: [...new Set(statusCodes.map(c => c.name))],
      valueSetter: p => {
        p.data.statusName = p.newValue;
        p.data.statusCode = statusCodes.find(c => c.name === p.newValue)?.code ?? p.data.statusCode;
        return true;
      },
    }),
    gb.date('manageDate', 100, '처리일', { editor: 'date' }),   // 편집: MyDateField
    gb.textCenter('personName', 100, '담당자', {   // 편집: LookupTriggerField — [E10] lookupEmpInfo.TriggerClick (L285) → Emp00_Lookup_SelectSingle
      cellStyle: { color: '#1677ff', textAlign: 'center' },
      cellRenderer: (p: { data?: Sch04Todo; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) { setEmpTarget(p.data.listId); setEmpOpen(true); } }} />
          {p.value}
        </>
      ),
    }),
    gb.textCenter('managerName', 100, '등록자'),
    gb.text('note', 350, '비고', { editor: 'text' }),
  ], [statusCodes]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] searchButton[조회].Select (L241) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          loading={crud.loading}
          extra={(
            <>
              {/* [E7] updateButton[저장].Select (L247) → update() — crud.saveRows (변경 0건이면 저장(0) 비활성: UX-03) */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E8] personButton[담당자 일괄변경].Select (L253) → personUpdate() */}
              <Button type="save" onClick={personUpdate}>담당자 일괄변경</Button>
            </>
          )}
        >
          {/* [E3] toggle.ValueChange (L180) → retrieve() */}
          <Radio.Group
            value={manageCheck ? 'manage' : 'close'}
            onChange={e => { const v = e.target.value === 'manage'; latest.current.manageCheck = v; setManageCheck(v); void retrieve(); }}
          >
            <Radio value="close">마감일</Radio>
            <Radio value="manage">처리일</Radio>
          </Radio.Group>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <a style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', userSelect: 'none' }} onMouseDown={() => moveDate(-1)}>◀</a>
            <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} format={FORMAT}
              onChange={d => { if (d) { latest.current.stdDate = d; setStdDate(d); } }} />
            <a style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', userSelect: 'none' }} onMouseDown={() => moveDate(1)}>▶</a>
          </span>
          <SearchBar.Field label="분류">
            {/* [E4] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L199) → retrieve() */}
            <Select
              style={{ width: 150 }}
              value={classId}
              onChange={v => { latest.current.classId = v; setClassId(v); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
              options={[{ value: '', label: '전체' }, ...classes.map(c => ({ value: c.code, label: c.name }))]}
            />
          </SearchBar.Field>
          <SearchBar.Field label="처리여부">
            {/* [E5] statusComboBox[ScheduleStatusCode].Collapse (L213) → retrieve() */}
            <SystemCodeComboBox
              kindCd="ScheduleStatusCode" altCode={ALL_CODE} allowClear={false} style={{ width: 120 }}
              value={statusCode} onChange={v => { latest.current.statusCode = v ?? '%'; setStatusCode(v ?? '%'); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <Checkbox checked={exceptYn} onChange={e => { latest.current.exceptYn = e.target.checked; setExceptYn(e.target.checked); }}>완료건 제외</Checkbox>
          <Checkbox checked={cancelYn} onChange={e => { latest.current.cancelYn = e.target.checked; setCancelYn(e.target.checked); }}>취소건 제외</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Sch04Todo> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={empOpen} transDate={dayjs().format(FORMAT)} noneLabel={null} onResult={onEmpResult} onClose={() => { setEmpOpen(false); setEmpTarget(null); }} />
      <Sch01_Lookup_InfoView target={viewTarget} onClose={() => setViewTarget(null)} />
      <Sch10_Lookup_Ipo ipo={ipo} onClose={() => setIpo(null)} />
    </div>
  );
};
