/**
 * MyPage 일정 박스 — 나의일정 · 부서일정 · 업무활동 · 알림 · 자리비움 · 예약 (탭 6개, 탭마다 그리드·SQL 따로)
 * AS-IS: myApp/client/vi/frm/Monitoring_Page_Relate.java (679줄, TabBorder 서쪽 아래) + TabBorder의 기준일 글자·[등록 바로가기](L37-38, E1 L154)
 * 함수 이름은 원본 메서드 이름 그대로. 모양은 MyPage 공통 MonitorGridBox(칩 탭 줄 = AS-IS PlainTabPanel)
 * 헤더 왼쪽 = TabBorder seletDateStr("yyyy년 MM월 dd일"), 오른쪽 = baroButton(탭에 따라 문구·숨김, relateGrid 콜백 L41-56)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import { frmApi } from '@/api/frm';
import { mrbApi } from '@/api/mrb';
import { carApi } from '@/api/car';
import { bbsFloralApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import type { FrmRelateBooking, FrmRelateLeave, FrmRelateMySchedule, FrmRelateNotice, FrmRelateOrgSchedule } from '@/types/frm';
import type { MktHistory } from '@/types/mkt';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { openMenuByNo } from '@/utils/tempData';
import { Sch01_Lookup_InfoView, type InfoViewTarget } from '@/components/lookup/Sch01_Lookup_InfoView';
import { Mkt03_Lookup_History, type MktHistoryTarget } from '@/pages/mkt/Mkt03_Lookup_History';
import { Sch14_Lookup_IpoMismatch } from '@/pages/sch/Sch14_Lookup_IpoMismatch';
import { Bbs20_Edit_FloralRequest, type FloralEditTarget } from '@/pages/bbs/Bbs20_Edit_FloralRequest';
import { Mrb01_Popup_MeetingRoomReg, type MrbBookingRegTarget } from '@/pages/mrb/Mrb01_Popup_MeetingRoomReg';
import { Car03_Popup_BookingReg, type BookingRegTarget } from '@/pages/car/Car03_Popup_BookingReg';
import { MonitorGridBox, monitorDate, monitorDetail, monitorText, type MonitorTab } from './MonitorGridBox';

/** 탭 키 = AS-IS 그리드 이름 */
export type ScheduleTabKey = 'grid01' | 'grid01_1' | 'grid02' | 'grid03' | 'grid04' | 'grid05';

/** 탭 이름 (configName01~05 L90-95) — 달력 일정 제목으로 탭을 고를 때도 쓴다(clearPanel L643-663, "스케줄"은 나의일정) */
export const SCHEDULE_TAB_NAMES: Record<ScheduleTabKey, string> = {
  grid01: '나의일정', grid01_1: '부서일정', grid02: '업무활동', grid03: '알림', grid04: '자리비움', grid05: '예약',
};

interface Props {
  /** 기준일 'YYYY-MM-DD' — 없으면 오늘 (AS-IS retrieve(date) L492-496 → LoginUser.setSelectDate) */
  selectDate?: string;
  /** 값이 바뀌면 다시 조회 (AS-IS Calendar.allRetrieve → relateGrid.retrieve()) */
  refreshKey?: number;
  /** 달력 일정 클릭으로 고른 탭 (AS-IS JSCaller.setTabCallback → focusStr, clearPanel L643-663) */
  focusTab?: ScheduleTabKey | null;
}

type TextMsg = { title: string; text: string };

export const ScheduleGridBox: React.FC<Props> = ({ selectDate, refreshKey = 0, focusTab = null }) => {
  const user = useLoginUser();
  const stdDate = selectDate ?? dayjs().format('YYYY-MM-DD');

  const [grid01, setGrid01] = useState<FrmRelateMySchedule[]>([]);
  const [grid01_1, setGrid01_1] = useState<FrmRelateOrgSchedule[]>([]);
  const [grid02, setGrid02] = useState<MktHistory[]>([]);
  const [grid03, setGrid03] = useState<FrmRelateNotice[]>([]);
  const [grid04, setGrid04] = useState<FrmRelateLeave[]>([]);
  const [grid05, setGrid05] = useState<FrmRelateBooking[]>([]);
  const [activeTab, setActiveTab] = useState<ScheduleTabKey>('grid01');
  const [loading, setLoading] = useState(false);

  const [infoView, setInfoView] = useState<InfoViewTarget | null>(null);
  const [mktTarget, setMktTarget] = useState<MktHistoryTarget | null>(null);
  const [ipoMismatch, setIpoMismatch] = useState(false);
  const [floral, setFloral] = useState<FloralEditTarget | null>(null);
  const [mrb, setMrb] = useState<MrbBookingRegTarget | null>(null);
  const [car, setCar] = useState<BookingRegTarget | null>(null);
  const [textMsg, setTextMsg] = useState<TextMsg | null>(null);
  const [baroChoice, setBaroChoice] = useState<'grid04' | 'grid05' | null>(null);

  const fail = (err: unknown) => message.error(errorMessage(err, '조회 실패'));
  const focusRef = useRef(focusTab);
  focusRef.current = focusTab;

  // retrieve01~05 L322-424: 탭마다 따로 조회 → clearPanel()
  const retrieve01 = useCallback(async () => setGrid01(await frmApi.searchRelateMySchedules(stdDate)), [stdDate]);   // sch.Sch01_Info.selectMyPageSchedule
  const retrieve01_1 = useCallback(async () => setGrid01_1(await frmApi.searchRelateOrgSchedules(stdDate)), [stdDate]); // sch.Sch01_Info.selectMyPageOrgSchedule
  const retrieve02 = useCallback(async () => setGrid02(await frmApi.searchRelateHistories(stdDate)), [stdDate]);     // mkt.Mkt03_History.selectByRegDate
  const retrieve03 = useCallback(async () => setGrid03(await frmApi.searchRelateNotices(stdDate)), [stdDate]);       // bbs.Bbs02_Notice.selectPersonNotice
  const retrieve04 = useCallback(async () => setGrid04(await frmApi.searchRelateLeaves(stdDate)), [stdDate]);        // emp.Emp20_Leave.selectByDate
  const retrieve05 = useCallback(async () => setGrid05(await frmApi.searchRelateBookings(stdDate)), [stdDate]);      // mrb.Mrb01_Booking.selectByBookingDate

  // retrieve() L498-508: 6개 모두 조회. clearPanel()은 탭을 다시 붙이므로 focusStr이 없으면 첫 탭(나의일정)이 된다
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([retrieve01(), retrieve01_1(), retrieve02(), retrieve03(), retrieve04(), retrieve05()].map(p => p.catch(fail)));
    } finally { setLoading(false); }
    setActiveTab(focusRef.current ?? 'grid01');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrieve01, retrieve01_1, retrieve02, retrieve03, retrieve04, retrieve05]);

  // [E0] 화면 열림 (생성자 L107-123) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve, refreshKey]);

  // clearPanel L643-663: 달력에서 고른 일정 종류의 탭을 연다
  useEffect(() => { if (focusTab) setActiveTab(focusTab); }, [focusTab]);

  // ── 상세보기 ──────────────────────────────────────────────

  // buildGrid01 viewCell L164-169 → view01() L426-453: sch.Sch04_List.selectByToDoList → Sch04_Lookup_SchList.open(model, "010", callback → retrieve01())
  const view01 = (_row: FrmRelateMySchedule) => {
    message.info('나의일정 상세(Sch04_Lookup_SchList)는 아직 변환 전입니다 — 다음 단계에서 연결됩니다');
  };

  // buildGrid01_1 viewCell L183-188 → view01_1() L455-458: Sch01_Lookup_InfoView.open(realInfoId, deadlineId)
  const view01_1 = (row: FrmRelateOrgSchedule) => {
    if (row.deadlineId == null) return;
    setInfoView({ infoId: row.realInfoId, deadlineId: row.deadlineId });
  };

  // buildGrid02 viewCell L201-208 → Mkt03_Lookup_History(grid02).open(selectModel, null) — open() = 보기
  const view02 = (row: MktHistory) => setMktTarget({ mode: 'view', row });

  // buildGrid03 viewCell L222-267: 알림 종류별
  const view03 = async (row: FrmRelateNotice) => {
    switch (row.noticeType) {
      case '10010':   // 공지사항 → bbs.Bbs02_Notice.selectById → Bbs02_Popup_Notice.openWithComment(title, notice, keyId, null)
        message.info('공지사항 보기(Bbs02_Popup_Notice)는 아직 변환 전입니다 — 다음 단계에서 연결됩니다');
        break;
      case '10020':   // 메세지 → SocketMessage.show(title)
        setTextMsg({ title: '실시간 알림', text: row.title ?? '' });
        break;
      case '10030':   // 공모주일정 → Sch14_Lookup_IpoMismatch.open()
        setIpoMismatch(true);
        break;
      case '10080':   // 화환신청
      case '10081':   // 화환발송완료 → Bbs20_Edit_FloralRequest.open(realNoticeId, null) = selectById → view()
        if (row.realNoticeId == null) return;
        try { setFloral({ mode: 'VIEW', model: await bbsFloralApi.getRequest(row.realNoticeId) }); }
        catch (err) { fail(err); }
        break;
      case '10040':   // 계약사 계약종료
      case '10050':   // 임원만료
      case '10060':   // 임직원 계약만료
      case '10070':   // 업무공유 → NoticeMessage.show(notice)
        setTextMsg({ title: '알림', text: row.notice ?? '' });
        break;
      default:
        break;
    }
  };

  // buildGrid04 viewCell L281-289 → NoticeMessage.showIcon("내용", leaveName)
  const view04 = (row: FrmRelateLeave) => setTextMsg({ title: '내용', text: row.leaveName ?? '' });

  // buildGrid05 viewCell L302-307 → view05() L460-490: 예약자 본인이면 checkYn(저장 가능), 회의실(12010)·공용차량(12020) 등록창 retrieve(bookingId, checkYn)
  //   TOBE 등록창은 행 전체가 필요해 그 날짜의 예약 목록(기존 API)에서 같은 예약 ID를 찾아 넘긴다
  const view05 = async (row: FrmRelateBooking) => {
    const checkYn = user.userId === row.empId;
    try {
      if (row.type === '12010') {
        const found = (await mrbApi.searchBookings({ date: row.bookingDate, type: 'all' })).find(b => b.bookingId === row.bookingId);
        if (found) setMrb({ mode: 'retrieve', row: found, checkYn });
      } else if (row.type === '12020') {
        const found = (await carApi.searchBookings({ date: row.bookingDate, type: 'all' })).find(b => b.bookingId === row.bookingId);
        if (found) setCar({ mode: 'retrieve', row: found, checkYn });
      }
    } catch (err) { fail(err); }
  };

  // ── 바로가기 (TabBorder baroButton E1 L154 → relateGrid.openTab() L510-522) ──
  const openTab = () => {
    const go = (no: string) => { if (!openMenuByNo(no)) message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.'); };
    if (activeTab === 'grid01') go('1042');           // openTab01 L524-527
    else if (activeTab === 'grid01_1') go('1357');    // openTab01_1 L529-532
    else if (activeTab === 'grid02') go('1405');      // openTab02 L534-537
    else if (activeTab === 'grid04') setBaroChoice('grid04');   // openTab04 L539-578: [휴가][외출][출장]
    else if (activeTab === 'grid05') setBaroChoice('grid05');   // openTab05 L580-609: [회의실][공용차량]
  };
  // TabBorder relateGrid 콜백 L41-56: 알림이면 숨김, 부서일정이면 "↪ 일정 바로가기", 나머지 "↪ 등록 바로가기"
  const baroText = activeTab === 'grid01_1' ? '↪ 일정 바로가기' : '↪ 등록 바로가기';

  // 탭 이름 + 건수 (clearPanel L611-627)
  const counts: Record<ScheduleTabKey, number> = {
    grid01: grid01.length, grid01_1: grid01_1.length, grid02: grid02.length, grid03: grid03.length, grid04: grid04.length, grid05: grid05.length,
  };
  const tabs: MonitorTab[] = (Object.keys(SCHEDULE_TAB_NAMES) as ScheduleTabKey[]).map(k => ({ key: k, label: SCHEDULE_TAB_NAMES[k], count: counts[k] }));

  const common = {
    title: <span>{dayjs(stdDate).format('YYYY년 MM월 DD일')}</span>,
    extra: activeTab === 'grid03' ? undefined : <Button type="goto" size="small" onClick={openTab}>{baroText}</Button>,
    tabs, activeTab, onTabChange: (k: string) => setActiveTab(k as ScheduleTabKey), loading,
  };

  // [E1] plainTabPanel.Selection (L141) → callback(탭 이름) = 바로가기 문구 (위 baroText)
  const box = (() => {
    switch (activeTab) {
      case 'grid01':   // buildGrid01 L163-180
        return <MonitorGridBox<FrmRelateMySchedule> {...common} rowKey="rowId" dataSource={grid01} columns={[
          monitorText<FrmRelateMySchedule>('className', 120, '분류'),
          monitorText<FrmRelateMySchedule>('title', undefined, '나의일정명'),
          monitorText<FrmRelateMySchedule>('managerName', 90, '등록자', 'center'),
          monitorDate<FrmRelateMySchedule>('closeDate', 90, '마감일'),
          monitorDate<FrmRelateMySchedule>('manageDate', 90, '처리일'),
          monitorDetail<FrmRelateMySchedule>(60, view01),
        ]} />;
      case 'grid01_1': // buildGrid01_1 L182-198
        return <MonitorGridBox<FrmRelateOrgSchedule> {...common} rowKey="rowId" dataSource={grid01_1} columns={[
          monitorText<FrmRelateOrgSchedule>('orgName', 180, '등록부서'),
          monitorText<FrmRelateOrgSchedule>('className', 100, '분류'),
          monitorText<FrmRelateOrgSchedule>('title', undefined, '일정명'),
          monitorDate<FrmRelateOrgSchedule>('closeDate', 90, '마감일'),
          monitorDetail<FrmRelateOrgSchedule>(60, view01_1),
        ]} />;
      case 'grid02':   // buildGrid02 L200-219
        return <MonitorGridBox<MktHistory> {...common} rowKey="historyId" dataSource={grid02} columns={[
          monitorDate<MktHistory>('activityDate', 90, '활동일'),
          monitorText<MktHistory>('targetCompanyName', 150, '활동처'),
          monitorText<MktHistory>('activityTitle', undefined, '활동내용'),
          monitorText<MktHistory>('personOrgName', 120, '작성자'),
          monitorDate<MktHistory>('regDate', 90, '작성일'),
          monitorDetail<MktHistory>(60, view02),
        ]} />;
      case 'grid03':   // buildGrid03 L221-278 (공지일 열은 AS-IS 주석)
        return <MonitorGridBox<FrmRelateNotice> {...common} rowKey="rowId" dataSource={grid03} columns={[
          monitorText<FrmRelateNotice>('noticeTypeName', 80, '구분', 'center'),
          monitorText<FrmRelateNotice>('title', undefined, '내용'),
          monitorDetail<FrmRelateNotice>(60, row => void view03(row)),
        ]} />;
      case 'grid04':   // buildGrid04 L280-299
        return <MonitorGridBox<FrmRelateLeave> {...common} rowKey="rowId" dataSource={grid04} columns={[
          monitorText<FrmRelateLeave>('personName', 120, '사원명'),
          monitorText<FrmRelateLeave>('leaveName', undefined, '내용'),
          monitorText<FrmRelateLeave>('stdPeriod', 170, '기간'),
          monitorDetail<FrmRelateLeave>(60, view04),
        ]} />;
      default:         // buildGrid05 L301-320
        return <MonitorGridBox<FrmRelateBooking> {...common} rowKey="rowId" dataSource={grid05} columns={[
          monitorText<FrmRelateBooking>('typeName', 80, '구분', 'center'),
          monitorText<FrmRelateBooking>('empName', 120, '예약자'),
          monitorText<FrmRelateBooking>('content', undefined, '내용'),
          monitorText<FrmRelateBooking>('attendance', 120, '참석자'),
          monitorText<FrmRelateBooking>('time', 100, '예약시간', 'center'),
          monitorDetail<FrmRelateBooking>(60, row => void view05(row)),
        ]} />;
    }
  })();

  const choiceButtons = baroChoice === 'grid04'
    ? [['휴가', '1032'], ['외출', '1358'], ['출장', '1359']]     // [E2] 휴가 · [E3] 외출 · [E4] 출장 button01~03.Select (L554·L562·L570)
    : [['회의실', '1067'], ['공용차량', '1187']];               // [E5]·[E6] button01~02.Select (L593·L601)

  return (
    <>
      {box}
      {/* openTab04·openTab05: MessageBox "등록 바로가기" / "항목을 선택해주세요" + 버튼 → 그 화면 탭 열기 */}
      <LookupModal
        open={baroChoice != null}
        title="등록 바로가기"
        width={360}
        onCancel={() => setBaroChoice(null)}
        footer={
          <div style={{ textAlign: 'center' }}>
            {choiceButtons.map(([label, no]) => (
              <Button key={no} type="goto" onClick={() => {
                setBaroChoice(null);
                if (!openMenuByNo(no)) message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.');
              }}>{label}</Button>
            ))}
          </div>
        }
      >
        <div style={{ padding: '12px 2px' }}>항목을 선택해주세요</div>
      </LookupModal>
      {/* SocketMessage·NoticeMessage(450×250, 읽기 전용 글상자 + [닫기]) */}
      <LookupModal
        open={textMsg != null}
        title={textMsg?.title}
        width={450}
        maskClosable={false}
        onCancel={() => setTextMsg(null)}
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={() => setTextMsg(null)}>닫기</Button></div>}
      >
        <Input.TextArea readOnly value={textMsg?.text ?? ''} style={{ height: 150, resize: 'none' }} />
      </LookupModal>
      <Sch01_Lookup_InfoView target={infoView} onClose={() => setInfoView(null)} />
      <Mkt03_Lookup_History
        target={mktTarget}
        onSaved={saved => setGrid02(prev => prev.map(r => (r.historyId === saved.historyId ? saved : r)))}
        onClose={() => setMktTarget(null)}
      />
      <Sch14_Lookup_IpoMismatch open={ipoMismatch} onClose={() => setIpoMismatch(false)} />
      <Bbs20_Edit_FloralRequest target={floral} onClose={() => setFloral(null)} />
      <Mrb01_Popup_MeetingRoomReg
        target={mrb}
        onSaved={() => { if (mrb && mrb.mode !== 'open' && mrb.checkYn) void retrieve05().catch(fail); }}
        onClose={() => setMrb(null)}
      />
      <Car03_Popup_BookingReg
        target={car}
        onSaved={() => { if (car && car.mode !== 'open' && car.checkYn) void retrieve05().catch(fail); }}
        onClose={() => setCar(null)}
      />
    </>
  );
};
