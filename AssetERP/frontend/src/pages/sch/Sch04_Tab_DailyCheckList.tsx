/**
 * [1308] 스케줄 > 02. 업무일정 체크 > 데일리 체크리스트(상신) (O05)
 * AS-IS: myApp/client/vi/sch/Sch04_Tab_DailyCheckList.java (605줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L83-140: center=세로 테두리 박스(툴바 + 그리드). 툴바 = 기준일자 ◀ 날짜(100) ▶ · 분류(150) · 검색어(300) · [조회] [상신].
 *   그리드는 단일 선택이고 처리완료·해당없음 두 체크 열(묶음 헤더 "체크")을 누르면 곧바로 저장한다. 아이콘 열 3(상세보기·비고 수정·결재 문서 보기).
 *   [문서분류지정](dcrLinkButton)은 툴바에 붙어 있지 않아(E7 도달 불가) 만들지 않는다
 * 연결: Sch04_Edit_Note(비고 창, AreaMessage) · Sch01_Lookup_InfoView(업무일정 보기) · Sch10_Lookup_Ipo(공모주)
 * 1단계(F·I·M과 같은 방침): 전자결재 편집창 Apr01_Edit_ApprDoc(다른 도메인)을 여는 [상신]·결재 문서 보기는 검사까지 하고 안내만 띄운다 — 다음 단계(전자결재 편집창)에서 연결.
 *   Dcr30_Lookup_Link(문서분류 지정)·Dcr30_Link.selectByLinkCode(retrieveDoc)·Sch04_List.updateApprId는 그 단계에서 함께 한다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 많아 줄바꿈 위험이라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch04DailyCheck, Sch08ClassCombo, Sch10Ipo } from '@/types/sch';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { Sch01_Lookup_InfoView, InfoViewTarget } from '@/components/lookup/Sch01_Lookup_InfoView';
import { Sch10_Lookup_Ipo } from '@/components/lookup/Sch10_Lookup_Ipo';
import type { CellValueChangedEvent, GridApi } from 'ag-grid-community';

const gb = gbFor<Sch04DailyCheck>();
const FORMAT = 'YYYY-MM-DD';
/** 상신중(10)·결재중(20)·완료(30)이면 고칠 수 없다 — settings() L205-215 */
const isApprBusy = (r: Sch04DailyCheck) => ['10', '20', '30'].includes(r.apprStatusCode ?? '');
const BUSY_MSG = '상신중인 업무는 수정이 불가능합니다.';

export const Sch04_Tab_DailyCheckList: React.FC = () => {
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs());
  const [classes, setClasses] = useState<Sch08ClassCombo[]>([]);
  const [classId, setClassId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Sch04DailyCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<InfoViewTarget | null>(null);
  const [ipo, setIpo] = useState<Sch10Ipo | null>(null);
  const [noteRow, setNoteRow] = useState<Sch04DailyCheck | null>(null);
  const apiRef = useRef<GridApi<Sch04DailyCheck> | null>(null);

  // 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ stdDate, classId, searchText });
  latest.current = { stdDate, classId, searchText };

  // retrieve() L335-373: sch.Sch04_List.selectByManagerId (처리일 기준·취소건 제외·나의 스케줄·데일리 일정만)
  const retrieve = useCallback(async (override?: { classId?: string; searchText?: string }): Promise<Sch04DailyCheck[]> => {
    const c = { ...latest.current, ...override };
    setLoading(true);
    try {
      const list = await schApi.searchDailyCheck({
        startDate: c.stdDate.format(FORMAT), classId: c.classId ? Number(c.classId) : null, searchText: c.searchText,
      });
      setRows(list);
      return list;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L83-140) → retrieveDoc(), settings(), setIconStyle(), retrieve()
  //   [E0 생략] retrieveDoc(): 문서분류 A31을 읽어 두는 것은 상신(전자결재 편집창)에서만 쓰인다 — 다음 단계
  useEffect(() => {
    schApi.searchClassCombo(true).then(setClasses).catch(() => setClasses([]));
    void retrieve();
  }, [retrieve]);

  // [E1] anchor01.MouseDown (L90) / [E2] anchor02.MouseDown (L102) → 기준일 -1일 / +1일 뒤 retrieve()
  const moveDate = (days: number) => {
    const d = latest.current.stdDate.add(days, 'day');
    latest.current.stdDate = d;
    setStdDate(d);
    void retrieve();
  };

  // [E8] grid.getStore().StoreRecordChange (L201) → 서비스 sch.Sch04_List.statusUpdateCheck: 처리완료/해당없음 체크를 곧바로 저장한다.
  //   AS-IS 모델 setYes/setNot은 값과 상관없이 statusCode를 '1'/'5'로 바꾸므로 체크를 풀어도 그대로 남는다(처리일은 오늘).
  //   상신중(10·20·30)이면 "상신중인 업무는 수정이 불가능합니다." 하고 되돌린다
  const checkValue = (code: '1' | '5') => ({
    valueGetter: (p: { data?: Sch04DailyCheck }) => p.data?.statusCode === code,
    valueSetter: (p: { data: Sch04DailyCheck }) => {
      if (isApprBusy(p.data)) {
        message.warning(BUSY_MSG);
        return false;
      }
      p.data.statusCode = code;
      p.data.manageDate = dayjs().format(FORMAT);
      return true;
    },
  });

  const onCellValueChanged = async (e: CellValueChangedEvent<Sch04DailyCheck>) => {
    const row = e.data;
    e.api.refreshCells({ rowNodes: e.node ? [e.node] : undefined, force: true });
    if (!row) return;
    try {
      row.listId = await schApi.updateDailyCheckStatus(row);
      e.api.refreshCells({ rowNodes: e.node ? [e.node] : undefined, force: true });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      void retrieve();
    }
  };

  // view() L375-425: 업무일정('1')이면 Sch01_Lookup_InfoView.open(infoId, deadlineId), 공모주('5')면 sch.Sch10_Ipo.selectById(infoId) → Sch10_Lookup_Ipo
  const view = async (row: Sch04DailyCheck) => {
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

  // edit() L427-467: 먼저 sch.Sch04_List.statusUpdateCheck(현재 값 그대로)로 처리 행을 만들어 listId를 받고, Sch04_Edit_Note(비고 창)를 연다.
  //   창에서 [저장]하면 비고만 바꾼다(AS-IS sch.Sch04_List.modelUpdate). 상신중이면 [저장]을 감춘다(Sch04_Edit_Note.edit L44-46)
  const edit = async (row: Sch04DailyCheck) => {
    try {
      row.listId = await schApi.updateDailyCheckStatus(row);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    setNoteRow(row);
  };

  // Sch04_Edit_Note.update() L92-106: [저장] → 비고 저장 → 그리드 행의 비고만 바꾼다
  const saveNote = async (text: string | null) => {
    const row = noteRow;
    if (!row) return;
    try {
      const saved = await schApi.updateIcsListResult(row.listId, 'U', text ?? '');
      row.note = saved.note;
      apiRef.current?.refreshCells({ force: true });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // 마지막 아이콘 열(L322-329): sch.Sch04_List 결재 문서 보기 — 상신 문서가 없으면 "관련 상신문서가 존재하지 않습니다"
  const viewAppr = (row: Sch04DailyCheck) => {
    if (!row.apprId || !row.apprStatusCode) {
      message.warning('관련 상신문서가 존재하지 않습니다');
      return;
    }
    // [E생략] 전자결재 편집창 Apr01_Edit_ApprDoc.retrieveApproval은 다른 도메인 — 다음 단계
    message.info('전자결재 문서보기는 아직 연결되지 않았습니다 (다음 단계)');
  };

  // [E7 생략] dcrLinkButton[문서분류지정].Select (L188) → retrieveDoc() — 컬럼·툴바에 붙어 있지 않아 도달 불가(색인 표시), 만들지 않는다
  // [E6] apprButton[상신].Select (L181) → retrieveCheck() L469-500: 분류 "전체"·검색어 비움으로 다시 조회한 뒤 insertLinkApprovals() L503-549
  const retrieveCheck = async () => {
    latest.current.classId = '';
    latest.current.searchText = '';
    setClassId('');
    setSearchText('');
    const list = await retrieve({ classId: '', searchText: '' });
    for (const r of list) {
      if (r.statusCode !== '1' && r.statusCode !== '5') {
        message.warning('체크가 안된 항목이 있습니다.');
        return;
      }
      if (r.apprStatusCode === '10' || r.apprStatusCode === '20') {
        message.warning('결재 중인 문서이거나, 상신올린 문서가 포함되어있습니다.');
        return;
      }
    }
    Modal.confirm({
      title: '상신',
      content: '문서상신이 완료된 경우 재상신합니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 500,
      // [E9] msgBox.DialogHide [YES] (L521) → Apr01_Edit_ApprDoc.insertLinkApprovals → updateApprId()
      //   [E9 생략] 전자결재 편집창 Apr01_Edit_ApprDoc·sch.Sch04_List.updateApprId는 다음 단계
      onOk: () => { message.info('전자결재 상신 화면은 아직 연결되지 않았습니다 (다음 단계)'); },
    });
  };

  // buildGrid() L274-333 (단일 선택, 처리완료·해당없음 두 열만 편집)
  const columnDefs = useMemo(() => [
    gb.text('className', 120, '분류'),
    gb.text('title', 500, '체크항목'),
    iconCell<Sch04DailyCheck>('view', 'actionCell', 80, '상세보기', view),   // → view()
    gb.group('체크', [
      gb.boolean('yes', 100, '처리완료', { editable: true, ...checkValue('1') }),
      gb.boolean('not', 100, '해당없음', { editable: true, ...checkValue('5') }),
    ]),
    gb.text('note', 400, '체크내용'),
    iconCell<Sch04DailyCheck>('edit', 'editCell', 60, '', edit),   // → edit()
    gb.textStatus('apprStatusName', 80, '결재상태'),
    iconCell<Sch04DailyCheck>('view', 'apprViewCell', 60, '', viewAppr),
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L174) → retrieve() / [E4] searchText[].KeyPress [Enter] (L165) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          loading={loading}
          extra={<Button type="register" onClick={retrieveCheck}>상신</Button>}
        >
          <SearchBar.Field label="기준일자">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <a style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', userSelect: 'none' }} onMouseDown={() => moveDate(-1)}>◀</a>
              <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} format={FORMAT}
                onChange={d => { if (d) { latest.current.stdDate = d; setStdDate(d); } }} />
              <a style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', userSelect: 'none' }} onMouseDown={() => moveDate(1)}>▶</a>
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="분류">
            {/* [E3] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L156) → retrieve() */}
            <Select
              style={{ width: 150 }}
              value={classId}
              onChange={v => { latest.current.classId = v; setClassId(v); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
              options={[{ value: '', label: '전체' }, ...classes.map(c => ({ value: c.code, label: c.name }))]}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색어">
            <SearchBar.Input
              style={{ width: 300 }} placeholder="구분/제목/주기구분/비고"
              value={searchText} onChange={e => { latest.current.searchText = e.target.value; setSearchText(e.target.value); }}
            />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Sch04DailyCheck>
            rowData={rows}
            columnDefs={columnDefs}
            onGridReady={e => { apiRef.current = e.api; }}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </div>
      {/* Sch04_Edit_Note: [E0] 화면 열림 (생성자 L54-75) → settings(), show() / [E1] updateButton[저장].Select (L78) → update() / [E2] closeButton[닫기].Select (L84) → hide() — AreaMessage의 [저장][닫기] */}
      <AreaMessage open={noteRow != null} title="비고" value={noteRow?.note} readOnly={noteRow != null && isApprBusy(noteRow)}
        width={710} height={390} onResult={saveNote} onClose={() => setNoteRow(null)} />
      <Sch01_Lookup_InfoView target={viewTarget} onClose={() => setViewTarget(null)} />
      <Sch10_Lookup_Ipo ipo={ipo} onClose={() => setIpo(null)} />
    </div>
  );
};
