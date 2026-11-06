/**
 * MyPage (대시보드) — 로그인 뒤 첫 탭
 * AS-IS: myApp/client/vi/TabBorder.java (212줄) — BorderLayout: 서쪽 770(달력 507 + 기준일·[등록 바로가기] + 일정 박스) / 가운데 3등분(Day List · 전자결재 · 법규) / 동쪽 현황판
 *   Calendar(crmGrid, toDoGrid, outstandingGrid, apprGird, icsNoticeGrid, empGrid, relateGrid, seletDateStr) L66 — 달력이 박스들을 다시 조회시킨다
 *   toDoListRetrieve(date) L117-123: Day List · 법규 · 일정 박스만 그 날짜로 / allRetrieve() L125-134: 달력과 모든 박스
 *   Monitoring_Page_CrmProject·Monitoring_Page_Outstanding은 Calendar가 retrieve만 부르고 화면에 붙이지 않아 변환하지 않는다
 *   retrieve() L136-181: 처음 한 번(static count), 회사관리자가 아니면 bbs.Bbs02_Notice.selectByTargetCompany → 1건이면 Bbs02_Popup_NoticeAdmin, 2건 이상이면 Bbs02_Lookup_NoticeAdmin
 * 배치 비율은 TOBE 목업(사용자 설계)을 따른다
 */
import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { bbsNoticeApi } from '@/api/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import type { FrmCalendarEvent } from '@/types/frm';
import { Bbs02_Popup_NoticeAdmin, type NoticePopupInfo } from '@/pages/bbs/Bbs02_Popup_NoticeAdmin';
import { Bbs02_Lookup_NoticeAdmin } from '@/pages/bbs/Bbs02_Lookup_NoticeAdmin';
import { MyPageCalendar } from './MyPageCalendar';
import { ScheduleGridBox, type ScheduleTabKey } from './ScheduleGridBox';
import { DayListBox } from './DayListBox';
import { ApprovalGridBox } from './ApprovalGridBox';
import { ComplianceGridBox } from './ComplianceGridBox';
import { EmployeePanel } from './EmployeePanel';

/** AS-IS Calendar.count (static) — 공지 창은 접속(앱 실행)마다 한 번 */
let noticeChecked = false;

/** 달력 일정 종류 → 일정 박스 탭 (Monitoring_Page_Relate.clearPanel L643-663, 제목의 "(n/m)"·"n건"을 뗀 이름) */
const KIND_TAB: Record<string, ScheduleTabKey> = {
  스케줄: 'grid01', 나의일정: 'grid01', 부서일정: 'grid01_1', 업무활동: 'grid02', 알림: 'grid03', 자리비움: 'grid04', 예약: 'grid05',
};

export const MyPageView: React.FC = () => {
  const user = useLoginUser();
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format('YYYY-MM-DD'));
  const [allKey, setAllKey] = useState(0);     // allRetrieve
  const [dateKey, setDateKey] = useState(0);   // toDoListRetrieve (같은 날짜를 다시 눌러도 다시 조회)
  const [focusTab, setFocusTab] = useState<ScheduleTabKey | null>(null);
  const [notice, setNotice] = useState<NoticePopupInfo | null>(null);
  const [noticeListOpen, setNoticeListOpen] = useState(false);

  // JSCaller.returnValue(date) → toDoListRetrieve(date) L117-123
  const onSelectDate = useCallback((date: string) => { setSelectedDate(date); setDateKey(k => k + 1); }, []);
  // JSCaller.returnValue(null) → allRetrieve() L125-134
  const onRefreshAll = useCallback(() => setAllKey(k => k + 1), []);
  // JSCaller.returnTitle(제목) → Monitoring_Page_Relate tabCallback → focusStr
  const onEventClick = useCallback((e: FrmCalendarEvent) => setFocusTab(KIND_TAB[e.kind] ?? null), []);

  // Calendar.retrieve() L136-181: 처음 한 번, 회사관리자가 아니면 읽지 않은 대상 공지
  useEffect(() => {
    if (noticeChecked || user.userId <= 0) return;
    noticeChecked = true;
    bbsNoticeApi.searchByTargetCompany().then(list => {
      if (list.length === 1) {
        const n = list[0];
        setNotice({ noticeId: n.noticeId, title: n.title, notice: n.notice ?? null, commentYn: n.commentYn ?? false, title2: n.title2 });
      } else if (list.length > 1) {
        setNoticeListOpen(true);
      }
    }).catch(() => { /* 공지 확인 실패는 MyPage를 막지 않는다 */ });
  }, [user.userId]);

  const dateBoxKey = allKey + dateKey;

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', width: '100%', overflow: 'hidden', padding: 6, gap: 6, backgroundColor: '#f0f2f5', boxSizing: 'border-box' }}>
      {/* ── 서쪽: 달력 + 일정 박스 ── */}
      <div style={{ flex: '0 0 48%', minWidth: 380, display: 'flex', flexDirection: 'column', gap: 6, height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MyPageCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} onEventClick={onEventClick} onRefreshAll={onRefreshAll} refreshKey={allKey} />
        </div>
        <div style={{ height: 336, flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ScheduleGridBox selectDate={selectedDate} refreshKey={dateBoxKey} focusTab={focusTab} />
        </div>
      </div>

      {/* ── 가운데: Day List · 전자결재 · 법규 ── */}
      <div style={{ flex: 1, minWidth: 420, display: 'flex', flexDirection: 'column', gap: 6, height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1.1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <DayListBox selectDate={selectedDate} refreshKey={dateBoxKey} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ApprovalGridBox refreshKey={allKey} />
        </div>
        <div style={{ flex: 0.9, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ComplianceGridBox selectDate={selectedDate} refreshKey={dateBoxKey} />
        </div>
      </div>

      {/* ── 동쪽: 현황판 ── */}
      <EmployeePanel refreshKey={allKey} />

      <Bbs02_Popup_NoticeAdmin notice={notice} onClose={() => setNotice(null)} />
      <Bbs02_Lookup_NoticeAdmin open={noticeListOpen} onClose={() => setNoticeListOpen(false)} />
    </div>
  );
};
