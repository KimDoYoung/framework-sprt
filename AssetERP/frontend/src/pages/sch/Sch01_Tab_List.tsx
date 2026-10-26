/**
 * [1226] 스케줄 > 01. 업무일정 > 기간별 업무일정 조회 (O02)
 * AS-IS: myApp/client/vi/sch/Sch01_Tab_List.java (265줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L58-95: center=세로 테두리 박스(툴바 + 그리드). 툴바 = 마감일(시작 ~ 종료, 기본 오늘) · 분류(150, 전체 + 내 분류 + 공모주) · 공유구분(100, 전체/나의 스케줄/공유 스케줄,
 *   기본 나의 스케줄) · 주기(80, CycleCode005, 전체 %) · 검색(230, "스케줄명/상세내용/담당부서/담당자") · [데일리 체크리스트만 보기] · [조회]. 그리드는 단일 선택, 아이콘 열 1(상세보기)
 * 연결: Sch01_Lookup_InfoView(업무일정 보기 + 첨부 Bbs02_Lookup_File) · Sch10_Lookup_Ipo(분류가 공모주인 행)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 조건 6개라 줄바꿈 위험이 있어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch01Period, Sch08ClassCombo, Sch10Ipo } from '@/types/sch';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Sch01_Lookup_InfoView, InfoViewTarget } from '@/components/lookup/Sch01_Lookup_InfoView';
import { Sch10_Lookup_Ipo } from '@/components/lookup/Sch10_Lookup_Ipo';

const gb = gbFor<Sch01Period>();
const ALL_CODE: [string, string] = ['%', '전체'];   // CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", …, "%", "전체")
const FORMAT = 'YYYY-MM-DD';
const SHARE_TYPES = [['%', '전체'], ['1', '나의 스케줄'], ['2', '공유 스케줄']];   // shareTypeComboBox L128-134

export const Sch01_Tab_List: React.FC = () => {
  const today = useMemo(() => dayjs(), []);
  const [startDate, setStartDate] = useState<Dayjs>(today);
  const [closeDate, setCloseDate] = useState<Dayjs>(today);
  const [classes, setClasses] = useState<Sch08ClassCombo[]>([]);
  const [classId, setClassId] = useState('');
  const [shareType, setShareType] = useState('1');
  const [cycleCode, setCycleCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [dailyYn, setDailyYn] = useState(false);
  const [rows, setRows] = useState<Sch01Period[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<InfoViewTarget | null>(null);
  const [ipo, setIpo] = useState<Sch10Ipo | null>(null);

  // 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ startDate, closeDate, classId, shareType, cycleCode, searchText, dailyYn });
  latest.current = { startDate, closeDate, classId, shareType, cycleCode, searchText, dailyYn };

  // retrieve() L202-236: sch.Sch01_Info.selectByCloseDate(마감일 시작·종료, 분류(없으면 전체), 공유구분, 주기, 데일리, "%검색%")
  const retrieve = useCallback(async () => {
    const c = latest.current;
    setLoading(true);
    try {
      setRows(await schApi.searchInfosByPeriod({
        startDate: c.startDate.format(FORMAT), endDate: c.closeDate.format(FORMAT), classId: c.classId ? Number(c.classId) : null,
        shareType: c.shareType, cycleCode: c.cycleCode, dailyYn: c.dailyYn, searchText: c.searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L58-95) → settings() L97-174: 마감일 = 오늘, 분류 "전체", 공유구분 "나의 스케줄", 주기 "전체" — 주기 콤보가 만들어지면 곧바로 retrieve()
  useEffect(() => {
    schApi.searchClassCombo(true).then(setClasses).catch(() => setClasses([])).finally(() => { void retrieve(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lookupSch() L238-257: 분류가 공모주(classId 0)면 sch.Sch10_Ipo.selectById(realInfoId) → Sch10_Lookup_Ipo, 아니면 Sch01_Lookup_InfoView.open(realInfoId, deadlineId)
  const lookupSch = async (row: Sch01Period) => {
    if (row.realInfoId == null) return;
    if (row.classId != null && row.classId === 0) {
      try {
        setIpo(await schApi.getIpo(row.realInfoId));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    } else if (row.deadlineId != null) {
      setViewTarget({ infoId: row.realInfoId, deadlineId: row.deadlineId });
    }
  };

  // buildGrid() L176-200 (단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('closeDate', 90, '마감일'),  // L187
    gb.date('manageDate', 90, '처리일'),  // L188
    gb.text('className', 130, '분류'),  // L189
    gb.text('title', 250, '일정명'),  // L190
    gb.textArea('contentLimit', 350, '상세내용'),  // L191
    gb.text('deadlineName', 150, '주기'),  // L192
    iconCell<Sch01Period>('view', 'actionCell', 80, '상세보기', lookupSch),  // L193 → lookupSch()
    gb.textCenter('statusName', 80, '처리여부'),  // L194
    gb.textCenter('personName', 80, '처리자'),  // L195
    gb.text('managerOrgInfo', 200, '등록자'),  // L196 (SQL에 없는 열 — 원본도 빈 칸)
    gb.text('note', 250, '비고'),  // L197
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] searchButton[조회].Select (L168) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="마감일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT}
              onChange={d => { if (d) { latest.current.startDate = d; setStartDate(d); } }} />
            <span>~</span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT}
              onChange={d => { if (d) { latest.current.closeDate = d; setCloseDate(d); } }} />
          </SearchBar.Field>
          <SearchBar.Field label="분류">
            {/* [E1] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L114) → retrieve() */}
            <Select
              style={{ width: 150 }}
              value={classId}
              onChange={v => { latest.current.classId = v; setClassId(v); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
              options={[{ value: '', label: '전체' }, ...classes.map(c => ({ value: c.code, label: c.name }))]}
            />
          </SearchBar.Field>
          <SearchBar.Field label="공유구분">
            {/* [E2] shareTypeComboBox[나의 스케줄].Collapse (L128) → retrieve() */}
            <Select
              style={{ width: 120 }}
              value={shareType}
              onChange={v => { latest.current.shareType = v; setShareType(v); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
              options={SHARE_TYPES.map(([value, label]) => ({ value, label }))}
            />
          </SearchBar.Field>
          <SearchBar.Field label="주기">
            {/* [E3] cycleComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L147) → retrieve() */}
            <SystemCodeComboBox
              kindGroupCd="CycleCode005" altCode={ALL_CODE} allowClear={false} style={{ width: 100 }}
              applyDate={startDate.format(FORMAT)}
              value={cycleCode} onChange={v => { latest.current.cycleCode = v ?? '%'; setCycleCode(v ?? '%'); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E4] searchText.KeyPress [Enter] (L156) → retrieve() — SearchBar.Input이 Enter = 조회 */}
            <SearchBar.Input style={{ width: 230 }} placeholder="스케줄명/상세내용/담당부서/담당자" value={searchText}
              onChange={e => { latest.current.searchText = e.target.value; setSearchText(e.target.value); }} />
          </SearchBar.Field>
          <Checkbox checked={dailyYn} onChange={e => { latest.current.dailyYn = e.target.checked; setDailyYn(e.target.checked); }}>데일리 체크리스트만 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Sch01Period> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.infoId)} />
        </div>
      </div>
      <Sch01_Lookup_InfoView target={viewTarget} onClose={() => setViewTarget(null)} />
      <Sch10_Lookup_Ipo ipo={ipo} onClose={() => setIpo(null)} />
    </div>
  );
};
