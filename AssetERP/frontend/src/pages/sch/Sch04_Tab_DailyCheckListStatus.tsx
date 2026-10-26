/**
 * [1356] 스케줄 > 02. 업무일정 체크 > 업무일정 체크내역 (O06)
 * AS-IS: myApp/client/vi/sch/Sch04_Tab_DailyCheckListStatus.java (293줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L60-92: center=세로 테두리 박스(툴바 + 그리드). 툴바 = 처리일 시작(100) ~ 종료(100) · 분류(150) · 상태(100) · 검색어(319, "체크항목/체크내용") · [조회].
 *   그리드는 단일 선택 읽기 전용, 아이콘 열 2(상세보기·결재 문서 보기)
 * 연결: Sch01_Lookup_InfoView(업무일정 보기) · Sch10_Lookup_Ipo(공모주)
 * 1단계(O05와 같은 방침): 결재 문서 보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc(다른 도메인)은 상신 문서 유무 검사까지 하고 안내만 띄운다 — 다음 단계
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 많아 줄바꿈 위험이라 넣지 않는다
 */
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { DatePicker, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch04CheckStatus, Sch08ClassCombo, Sch10Ipo } from '@/types/sch';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Sch01_Lookup_InfoView, InfoViewTarget } from '@/components/lookup/Sch01_Lookup_InfoView';
import { Sch10_Lookup_Ipo } from '@/components/lookup/Sch10_Lookup_Ipo';

const gb = gbFor<Sch04CheckStatus>();
const FORMAT = 'YYYY-MM-DD';
const ALL_CODE: [string, string] = ['%', '전체'];   // ComboBoxField("ScheduleStatusCode", "%", "전체", …)

export const Sch04_Tab_DailyCheckListStatus: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));   // settings() L95: 이번 달 1일
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [classes, setClasses] = useState<Sch08ClassCombo[]>([]);
  const [classId, setClassId] = useState('');
  const [statusCode, setStatusCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Sch04CheckStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<InfoViewTarget | null>(null);
  const [ipo, setIpo] = useState<Sch10Ipo | null>(null);

  // 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ startDate, endDate, classId, statusCode, searchText });
  latest.current = { startDate, endDate, classId, statusCode, searchText };

  // retrieve() L181-205: sch.Sch04_List.selectCheckListStatus
  const retrieve = useCallback(async () => {
    const c = latest.current;
    setLoading(true);
    try {
      setRows(await schApi.searchCheckStatus({
        startDate: c.startDate.format(FORMAT), endDate: c.endDate.format(FORMAT), statusCode: c.statusCode,
        classId: c.classId ? Number(c.classId) : null, searchText: c.searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L60-92) → settings(): 처리일 이번 달 1일 ~ 오늘, 분류·상태 "전체". AS-IS는 열 때 조회하지 않는다 — [조회]를 눌러야 목록이 나온다
  // [E1] scheduleClassComboBox.callbackOnCreate (L103) / [E3] statusComboBox.callbackOnCreate (L117) → 문구를 "전체"로 — 콤보의 기본값 '전체'로 대응
  useEffect(() => {
    schApi.searchClassCombo(true).then(setClasses).catch(() => setClasses([]));
  }, []);

  // view() L240-288: 업무일정('1')이면 Sch01_Lookup_InfoView.open(infoId, deadlineId), 공모주('5')면 sch.Sch10_Ipo.selectById → Sch10_Lookup_Ipo, 그 밖은 "상세보기를 지원하지 않습니다."
  const view = async (row: Sch04CheckStatus) => {
    if (row.scheduleCode === '1') {
      if (row.infoId != null && row.deadlineId != null) setViewTarget({ infoId: row.infoId, deadlineId: row.deadlineId });
    } else if (row.scheduleCode === '5') {
      if (row.infoId == null) return;
      try {
        setIpo(await schApi.getIpo(row.infoId));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    } else {
      message.warning('상세보기를 지원하지 않습니다.');
    }
  };

  // apprView() L207-238: 상신 문서가 없으면 "상신문서가 존재하지 않습니다". 그 뒤 apr.Apr01_Appr.selectById가 비면 "관련 상신문서가 존재하지 않습니다" —
  //   그 조회 API는 전자결재(apr) 변환 때 함께 만든다(다음 단계). 결재상태 열(apprStatusName)은 원본 SQL이 종류 이름에 공백을 붙여(`'AprStatusCode     '`) 항상 비어 있으므로 판단에 쓰지 않는다
  const apprView = (row: Sch04CheckStatus) => {
    if (row.apprId == null) {
      message.warning('상신문서가 존재하지 않습니다');
      return;
    }
    // [E생략] 전자결재 편집창 Apr01_Edit_ApprDoc.retrieveApproval은 다른 도메인 — 다음 단계
    message.info('전자결재 문서보기는 아직 연결되지 않았습니다 (다음 단계)');
  };

  // buildGrid() L150-179 (단일 선택, 읽기 전용)
  const columnDefs = useMemo(() => [
    gb.date('manageDate', 100, '처리일'),
    gb.date('closeDate', 100, '마감일'),
    gb.text('className', 150, '분류'),
    gb.text('title', 500, '체크항목'),
    iconCell<Sch04CheckStatus>('view', 'actionCell', 80, '상세보기', view),   // → view()
    gb.textCenter('statusName', 100, '체크상태'),
    gb.textArea('note', 300, '체크내용'),
    gb.text('apprStatusName', 80, '결재상태'),
    iconCell<Sch04CheckStatus>('view', 'apprViewCell', 60, '', apprView),   // → apprView()
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] searchButton[조회].Select (L142) → retrieve() / [E5] searchText.KeyPress [Enter] (L133) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading}>
          <SearchBar.Field label="처리일">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT}
                onChange={d => { if (d) { latest.current.startDate = d; setStartDate(d); } }} />
              ~
              <DatePicker style={{ width: 120 }} allowClear={false} value={endDate} format={FORMAT}
                onChange={d => { if (d) { latest.current.endDate = d; setEndDate(d); } }} />
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="분류">
            {/* [E2] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L110) → retrieve() */}
            <Select
              style={{ width: 150 }}
              value={classId}
              onChange={v => { latest.current.classId = v; setClassId(v); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
              options={[{ value: '', label: '전체' }, ...classes.map(c => ({ value: c.code, label: c.name }))]}
            />
          </SearchBar.Field>
          <SearchBar.Field label="상태">
            {/* [E4] statusComboBox[ScheduleStatusCode].Collapse (L124) → retrieve() */}
            <SystemCodeComboBox
              kindCd="ScheduleStatusCode" altCode={ALL_CODE} allowClear={false} style={{ width: 100 }}
              value={statusCode} onChange={v => { latest.current.statusCode = v ?? '%'; setStatusCode(v ?? '%'); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input
              style={{ width: 319 }} placeholder="체크항목/체크내용"
              value={searchText} onChange={e => { latest.current.searchText = e.target.value; setSearchText(e.target.value); }}
            />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Sch04CheckStatus> rowData={rows} columnDefs={columnDefs} />
        </div>
      </div>
      <Sch01_Lookup_InfoView target={viewTarget} onClose={() => setViewTarget(null)} />
      <Sch10_Lookup_Ipo ipo={ipo} onClose={() => setIpo(null)} />
    </div>
  );
};
