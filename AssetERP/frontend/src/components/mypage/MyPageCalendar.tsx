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
import { Button, Calendar, Space, message } from 'antd';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import {
  BellFilled, CalendarOutlined, DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, ReloadOutlined, RightOutlined, ShoppingOutlined, StarFilled,
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

/** eventLimit: 칸에 보이는 막대 수 (넘치면 "+n개") */
const VISIBLE_EVENTS = 2;
const DAY = 'YYYY-MM-DD';

export const MyPageCalendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, onEventClick, onRefreshAll, refreshKey = 0 }) => {
  const [viewMonth, setViewMonth] = useState<Dayjs>(() => dayjs(selectedDate).startOf('month'));
  const [events, setEvents] = useState<FrmCalendarEvent[]>([]);
  const [noticeOpen, setNoticeOpen] = useState(false);     // EE66 [🔔 일정표시] → Emp90_Lookup_Notice
  const [bookmarkOpen, setBookmarkOpen] = useState(false); // [⭐ 북마크] → Sys06_Lookup_SearchMenu
  const [ipoOpen, setIpoOpen] = useState(false);           // [📆 공모주] → RDViewer.openSch10(Sch10_Rd_Ipo)
  const [commuteOpen, setCommuteOpen] = useState(false);   // [💼 출퇴근(Beta)] → Att02_Lookup_Commute

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
          setViewMonth(t.startOf('month'));
          onSelectDate(t.format(DAY));
        }}>오늘</Button>
        {/* myCustomButton[새로고침] L146-153 → returnValue() = allRetrieve */}
        <Button size="small" type="primary" className="mypage-cal-btn" style={{ backgroundColor: '#1e3a5f' }} icon={<ReloadOutlined style={{ fontSize: 10 }} />} onClick={onRefreshAll}>새로고침</Button>
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
    const dayColor = !isCurrentMonth ? '#cbd5e1' : dow === 0 ? '#dc2626' : dow === 6 ? '#2563eb' : '#1e293b';
    return (
      <div
        className="mypage-calendar-day-cell"
        style={{
          height: '100%', minHeight: 48, borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '3px 4px', boxSizing: 'border-box',
          backgroundColor: isChosen ? '#eff6ff' : isToday ? '#f8fafc' : isCurrentMonth ? '#ffffff' : '#fafafa',
          boxShadow: isChosen ? 'inset 0 0 0 2px #1677ff' : 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', lineHeight: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontWeight: isChosen ? 800 : dow === 0 ? 600 : 500, color: dayColor, fontSize: 12, lineHeight: '13px' }}>{date.date()}</span>
            {isToday && <span style={{ fontSize: 9, fontWeight: 700, color: '#1677ff', backgroundColor: '#dbeafe', padding: '1px 3px', borderRadius: 2, lineHeight: '11px' }}>오늘</span>}
          </div>
          {list.length > VISIBLE_EVENTS && <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>+{list.length - VISIBLE_EVENTS} 개</span>}
        </div>
        {list.slice(0, VISIBLE_EVENTS).map((e, i) => (
          <div
            key={i}
            title={e.title}
            // eventClick L214-224 → returnValue(날짜) · eventRender click L209-212 → returnTitle(제목)
            onClick={ev => { ev.stopPropagation(); onSelectDate(date.format(DAY)); onEventClick?.(e); }}
            style={{
              backgroundColor: e.color, color: e.textColor, fontSize: 10, fontWeight: 500, padding: '1px 4px', borderRadius: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '13px',
            }}
          >
            {e.title}
          </div>
        ))}
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
        .mypage-calendar-container .ant-picker-content th { padding: 5px 0 !important; color: #334155 !important; font-weight: 600 !important; font-size: 12px !important; background-color: #f8fafc !important; border-bottom: 1px solid #cbd5e1 !important; }
        .mypage-calendar-container .ant-picker-content th:first-child { color: #dc2626 !important; }
        .mypage-calendar-container .ant-picker-content th:last-child { color: #2563eb !important; }
        .mypage-calendar-container .ant-picker-content tbody { height: 100% !important; }
        .mypage-calendar-container .ant-picker-cell { padding: 0 !important; vertical-align: top !important; height: 1% !important; }
        .mypage-calendar-container .ant-picker-cell-inner { padding: 0 !important; border-radius: 0 !important; height: 100% !important; min-height: 48px !important; display: flex !important; flex-direction: column !important; }
        .mypage-calendar-container .ant-picker-content tbody tr:not(:has(.ant-picker-cell-in-view)) { display: none !important; }
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
