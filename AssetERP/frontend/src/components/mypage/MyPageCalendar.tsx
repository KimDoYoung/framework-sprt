/**
 * MyPage 달력
 * AS-IS: myApp/client/vi/frm/Calendar.java (241줄) → iframe fullcalendar.jsp(jQuery FullCalendar, 449줄) → JsonProvider mode=calendar(JsonCalendar)
 *   fullcalendar.jsp makeCalendar L136-294: 머리 가운데 = 제목 + [🔔 일정표시][⭐ 북마크][📆 공모주][💼 출퇴근(Beta)], 오른쪽 = ◀◀ ◀ ▶ ▶▶ [오늘][새로고침]
 *   일정은 날짜 칸에 색 막대(제목 = "나의일정(0/4)"·"부서일정3건" 등), eventLimit(칸이 넘치면 +n개)
 *   날짜 클릭(dayClick)·일정 클릭(eventClick) → JSCaller.returnValue(날짜) → Calendar.toDoListRetrieve(날짜) = Day List·법규·일정 박스를 그 날짜로
 *   일정 클릭은 그와 함께 JSCaller.returnTitle(제목) → 일정 박스가 그 종류의 탭을 연다
 *   [새로고침]·일정표시 창 닫기 → returnValue(null) → Calendar.allRetrieve() = 달력과 모든 박스 다시 조회
 * FullCalendar를 들이지 않고 antd Calendar로 그린다(칸 모양은 TOBE 목업 설계). 머리 버튼은 fullcalendar 툴바 버튼이라 AS-IS ColorButton 이름표(button-types)가 아니다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Calendar, Popover, Space, message } from 'antd';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import {
  BellFilled, CalendarOutlined, CloseOutlined, DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, ReloadOutlined, RightOutlined, ShoppingOutlined, StarFilled,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { frmApi } from '@/api/frm';
import { errorMessage } from '@/api/client';
import type { FrmCalendarEvent } from '@/types/frm';
import { openMenuByNo } from '@/utils/tempData';
import { Emp90_Lookup_Notice } from '@/pages/emp/Emp90_Lookup_Notice';
import { Sys06_Lookup_SearchMenu } from '@/components/lookup/Sys06_Lookup_SearchMenu';
import { Att02_Lookup_Commute } from '@/pages/att/Att02_Lookup_Commute';
import { RdViewer_Sch10 } from '@/pages/sch/RdViewer_Sch10';

interface CalendarProps {
  /** 고른 날짜 'YYYY-MM-DD' */
  selectedDate: string;
  /** 날짜·일정 클릭, [오늘] — AS-IS JSCaller.returnValue(date) */
  onSelectDate: (date: string) => void;
  /** 일정 클릭 — AS-IS JSCaller.returnTitle(제목) (일정 박스 탭 고르기) */
  onEventClick?: (event: FrmCalendarEvent) => void;
  /** [새로고침]·일정표시 창 닫기 — AS-IS returnValue(null) → allRetrieve() */
  onRefreshAll: () => void;
  /** 값이 바뀌면 달력 일정을 다시 읽는다 */
  refreshKey?: number;
}

/** eventLimit: 칸 높이에 막대 한 줄만 들어간다 — 1건이면 그 막대, 2건 이상이면 막대 없이 "+n 개"(n = 전부) (FullCalendar 줄 단위 제한과 같은 모양) */
const VISIBLE_EVENTS = 1;
const DAY = 'YYYY-MM-DD';
/** 휴일(BizNoticeCode 900) 막대는 엷은 빨강 — 사용자 요청(2026-11-06). AS-IS JsonCalendar는 휴일도 다른 일정처럼 테마 기본색 */
const HOLIDAY_KIND = '휴일';
const HOLIDAY_COLOR = { bg: '#FBD5D5', text: '#B42318' };

export const MyPageCalendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, onEventClick, onRefreshAll, refreshKey = 0 }) => {
  const [viewMonth, setViewMonth] = useState<Dayjs>(() => dayjs(selectedDate).startOf('month'));
  const [events, setEvents] = useState<FrmCalendarEvent[]>([]);
  const [noticeOpen, setNoticeOpen] = useState(false);     // EE66 [🔔 일정표시] → Emp90_Lookup_Notice
  const [bookmarkOpen, setBookmarkOpen] = useState(false); // [⭐ 북마크] → Sys06_Lookup_SearchMenu
  const [ipoOpen, setIpoOpen] = useState(false);           // [📆 공모주] → RDViewer.openSch10(Sch10_Rd_Ipo)
  const [commuteOpen, setCommuteOpen] = useState(false);   // [💼 출퇴근(Beta)] → Att02_Lookup_Commute
  const [moreDate, setMoreDate] = useState<string | null>(null); // eventLimit "+n 개" 팝오버를 연 날짜

  // getViewDate L296-311 → calEvent L313-338: 보이는 달(intervalStart ~ intervalEnd-1)의 일정
  const getViewDate = useCallback(async (month: Dayjs) => {
    try {
      setEvents(await frmApi.searchCalendar(month.startOf('month').format(DAY), month.endOf('month').format(DAY)));
    } catch (err) { message.error(errorMessage(err, '달력 조회 실패')); }
  }, []);

  // [E0] Calendar.init → retrieve() → getViewDate(…) (첫 그림 eventAfterAllRender) · 달 이동(◀◀ ◀ ▶ ▶▶ 클릭 L266-271)
  useEffect(() => { void getViewDate(viewMonth); }, [getViewDate, viewMonth, refreshKey]);

  // 다른 곳에서 고른 날짜가 다른 달이면 그 달로
  useEffect(() => {
    const d = dayjs(selectedDate);
    if (!d.isSame(viewMonth, 'month')) setViewMonth(d.startOf('month'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const byDate = useMemo(() => {
    const m = new Map<string, FrmCalendarEvent[]>();
    events.forEach(e => { const k = e.date.slice(0, 10); m.set(k, [...(m.get(k) ?? []), e]); });
    return m;
  }, [events]);

  const today = dayjs();

  const renderHeader = () => (
    <div style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, backgroundColor: '#fafbfc' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{viewMonth.year()}년 {viewMonth.month() + 1}월</span>
        <Space size={4}>
          <Button size="small" className="mypage-cal-btn" icon={<BellFilled style={{ color: '#eab308' }} />} onClick={() => setNoticeOpen(true)}>일정표시</Button>
          <Button size="small" className="mypage-cal-btn" icon={<StarFilled style={{ color: '#eab308' }} />} onClick={() => setBookmarkOpen(true)}>북마크</Button>
          <Button size="small" className="mypage-cal-btn" icon={<CalendarOutlined style={{ color: '#ef4444' }} />} onClick={() => setIpoOpen(true)}>공모주</Button>
          <Button size="small" className="mypage-cal-btn" icon={<ShoppingOutlined style={{ color: '#854d0e' }} />} onClick={() => setCommuteOpen(true)}>출퇴근(Beta)</Button>
        </Space>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Space.Compact size="small">
          <Button icon={<DoubleLeftOutlined style={{ fontSize: 10 }} />} title="이전 연도" onClick={() => setViewMonth(m => m.subtract(1, 'year'))} />
          <Button icon={<LeftOutlined style={{ fontSize: 10 }} />} title="이전 달" onClick={() => setViewMonth(m => m.subtract(1, 'month'))} />
          <Button icon={<RightOutlined style={{ fontSize: 10 }} />} title="다음 달" onClick={() => setViewMonth(m => m.add(1, 'month'))} />
          <Button icon={<DoubleRightOutlined style={{ fontSize: 10 }} />} title="다음 연도" onClick={() => setViewMonth(m => m.add(1, 'year'))} />
        </Space.Compact>
        {/* .fc-today-button L272-284: 오늘 칸 표시 → returnValue(오늘) → getViewDate */}
        <Button size="small" className="mypage-cal-btn" onClick={() => {
          const t = dayjs();
          // 같은 달이어도 getViewDate로 일정을 다시 읽는다 (다른 달이면 viewMonth가 바뀌어 읽힌다)
          if (t.isSame(viewMonth, 'month')) void getViewDate(t); else setViewMonth(t.startOf('month'));
          onSelectDate(t.format(DAY));
        }}>오늘</Button>
        {/* myCustomButton[새로고침] L146-153 → returnValue() = allRetrieve */}
        <Button size="small" type="primary" className="mypage-cal-btn" style={{ backgroundColor: '#1e3a5f' }} icon={<ReloadOutlined style={{ fontSize: 10 }} />} onClick={onRefreshAll}>새로고침</Button>
      </div>
    </div>
  );

  // eventClick L214-224 → returnValue(날짜) · eventRender click L209-212 → returnTitle(제목)
  const eventBar = (date: Dayjs, e: FrmCalendarEvent, i: number, big = false) => (
    <div
      key={i}
      title={e.title}
      onClick={ev => { ev.stopPropagation(); setMoreDate(null); onSelectDate(date.format(DAY)); onEventClick?.(e); }}
      style={{
        backgroundColor: e.kind === HOLIDAY_KIND ? HOLIDAY_COLOR.bg : e.color, color: e.kind === HOLIDAY_KIND ? HOLIDAY_COLOR.text : e.textColor, fontSize: big ? 12 : 10, fontWeight: 500, padding: big ? '2px 6px' : '1px 4px', borderRadius: 3,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: big ? '16px' : '13px', cursor: 'pointer',
      }}
    >
      {e.title}
    </div>
  );

  /** FullCalendar eventLimit 팝오버(fc-more-popover): 머리 = 날짜(ko LL) + ×, 몸 = 그날 일정 전부. 일정을 누르면 칸의 일정과 같다 */
  const morePopover = (date: Dayjs, list: FrmCalendarEvent[]) => (
    // 포털 안 클릭이 React 이벤트로 날짜 칸(dayClick)까지 올라가지 않게 막는다
    <div style={{ width: 200 }} onClick={ev => ev.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: '#eeeeee', borderBottom: '1px solid #ddd', fontSize: 12, fontWeight: 600 }}>
        <span>{date.format('YYYY년 M월 D일')}</span>
        <CloseOutlined style={{ fontSize: 10, cursor: 'pointer' }} onClick={() => setMoreDate(null)} />
      </div>
      <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 260, overflowY: 'auto' }}>
        {list.map((e, i) => eventBar(date, e, i, true))}
      </div>
    </div>
  );

  const fullCellRender = (date: Dayjs, info: CellRenderInfo<Dayjs>) => {
    if (info.type !== 'date') return info.originNode;
    const isCurrentMonth = date.isSame(viewMonth, 'month');
    const isChosen = date.isSame(dayjs(selectedDate), 'day');
    const isToday = date.isSame(today, 'day');
    const dow = date.day();
    const list = byDate.get(date.format(DAY)) ?? [];
    // fullcalendar.jsp: 일요일 빨강(fc-sun), 다른 달은 흐리게, 오늘 fc-today(#fcf8e3), 고른 날 #DCDDE1(dayClick L230-236)
    const isHoliday = list.some(e => e.kind === HOLIDAY_KIND);
    // 토요일 파랑(fc-sat #007dc3, fullcalendar.jsp L101 주석 처리분 — 사용자 요청 2026-11-06)
    const dayColor = dow === 0 || isHoliday ? '#e31b23' : dow === 6 ? '#007dc3' : '#4a5568';
    return (
      <div
        className="mypage-calendar-day-cell"
        style={{
          height: '100%', minHeight: 48, borderRight: '1px solid #dddddd', borderBottom: '1px solid #dddddd', padding: '4px 4px', boxSizing: 'border-box',
          backgroundColor: isChosen ? '#DCDDE1' : isToday ? '#fcf8e3' : '#ffffff',
          cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden',
        }}
      >
        {/* .fc-day-number: 오른쪽 위 */}
        <div style={{ textAlign: 'right', paddingRight: isToday ? 2 : 6, fontSize: 14, lineHeight: '18px', color: dayColor, opacity: isCurrentMonth ? 1 : 0.35 }}>
          {/* 오늘은 날짜에 동그라미 — 사용자 요청(2026-11-06) */}
          {isToday
            ? <span style={{ display: 'inline-block', minWidth: 24, height: 24, lineHeight: '22px', textAlign: 'center', borderRadius: '50%', border: `1.5px solid ${dayColor}`, boxSizing: 'border-box', fontWeight: 700, marginTop: -3 }}>{date.date()}</span>
            : date.date()}
        </div>
        {list.length <= VISIBLE_EVENTS && list.map((e, i) => eventBar(date, e, i))}
        {/* eventLimit: 넘친 일정은 칸 왼쪽 아래 "+n 개"(fc-more) → 누르면 그날 일정 팝오버 */}
        {list.length > VISIBLE_EVENTS && (
          <Popover
            open={moreDate === date.format(DAY)}
            onOpenChange={o => { if (!o) setMoreDate(null); }}
            trigger="click"
            placement="bottomLeft"
            arrow={false}
            overlayInnerStyle={{ padding: 0, borderRadius: 2 }}
            content={morePopover(date, list)}
          >
            <span
              onClick={ev => { ev.stopPropagation(); setMoreDate(date.format(DAY)); }}
              style={{ alignSelf: 'flex-start', fontSize: 11, color: '#4a5568', cursor: 'pointer', lineHeight: '14px', paddingLeft: 2 }}
            >
              +{list.length} 개
            </span>
          </Popover>
        )}
      </div>
    );
  };

  return (
    <div className="mypage-calendar-container" style={{ backgroundColor: '#ffffff', border: '1px solid #d9dfe8', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <style>{`
        .mypage-calendar-container .ant-picker-calendar,
        .mypage-calendar-container .ant-picker-panel,
        .mypage-calendar-container .ant-picker-date-panel { height: 100% !important; display: flex !important; flex-direction: column !important; flex: 1 !important; min-height: 0 !important; }
        .mypage-calendar-container .ant-picker-body { flex: 1 !important; display: flex !important; flex-direction: column !important; min-height: 0 !important; padding: 0 !important; }
        .mypage-calendar-container .ant-picker-content { height: 100% !important; width: 100% !important; border-collapse: collapse !important; table-layout: fixed !important; }
        .mypage-calendar-container .ant-picker-content th { padding: 8px 0 !important; color: #242E3E !important; font-weight: 600 !important; font-size: 13px !important; text-align: center !important; background-color: #F7F8FC !important; border: 1px solid #dddddd !important; }
        .mypage-calendar-container .ant-picker-content th:first-child { color: #242E3E !important; }
        .mypage-calendar-container .ant-picker-content th:last-child { color: #242E3E !important; }
        .mypage-calendar-container .ant-picker-content td:first-child .mypage-calendar-day-cell { border-left: 1px solid #dddddd; }
        .mypage-calendar-container .ant-picker-content tbody { height: 100% !important; }
        .mypage-calendar-container .ant-picker-cell { padding: 0 !important; vertical-align: top !important; height: 1% !important; }
        .mypage-calendar-container .ant-picker-cell-inner { padding: 0 !important; border-radius: 0 !important; height: 100% !important; min-height: 48px !important; display: flex !important; flex-direction: column !important; }
        .mypage-calendar-container .mypage-cal-btn { font-size: 12px; padding: 0 8px; height: 25px; border-radius: 3px; }
      `}</style>
      <Calendar
        fullscreen={false}
        value={dayjs(selectedDate).isSame(viewMonth, 'month') ? dayjs(selectedDate) : viewMonth}
        // dayClick L225-243: 고른 칸 표시 → returnValue(날짜)
        onSelect={(d, info) => { if (info.source === 'date') { if (!d.isSame(viewMonth, 'month')) setViewMonth(d.startOf('month')); onSelectDate(d.format(DAY)); } }}
        headerRender={renderHeader}
        fullCellRender={fullCellRender}
        style={{ height: '100%' }}
      />
      {/* JSCaller.returnOpenNotice L142-151: Emp90_Lookup_Notice.open(callback → callback2·callback4 = allRetrieve) */}
      <Emp90_Lookup_Notice open={noticeOpen} onClosed={onRefreshAll} onClose={() => setNoticeOpen(false)} />
      {/* JSCaller.returnBookmark L153-163: Sys06_Lookup_SearchMenu → MainFrame bookMarkCallback L196-206 = 고른 메뉴 탭 열기 */}
      <Sys06_Lookup_SearchMenu
        open={bookmarkOpen}
        onResult={menu => {
          setBookmarkOpen(false);
          if (menu.menuNo && !openMenuByNo(menu.menuNo)) message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.');
        }}
        onClose={() => setBookmarkOpen(false)}
      />
      {/* JSCaller.returnOpenIpo L118-132: RDViewer.openSch10(Sch10_Rd_Ipo, companyId·personId·YYYYMM=오늘) */}
      <RdViewer_Sch10 open={ipoOpen} onClose={() => setIpoOpen(false)} />
      {/* JSCaller.returnInOut L114-116: new Att02_Lookup_Commute(userId) */}
      <Att02_Lookup_Commute open={commuteOpen} onClose={() => setCommuteOpen(false)} />
    </div>
  );
};

export const MyPageCalender = MyPageCalendar;
export const DashboardCalendar = MyPageCalendar;
