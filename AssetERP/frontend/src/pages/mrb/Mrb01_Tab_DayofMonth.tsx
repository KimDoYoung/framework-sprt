/**
 * 회의실 예약 — 날짜별 (EE14) — Mrb01_Tab_List 아래에 붙는 하위 화면
 * AS-IS: myApp/client/vi/mrb/Mrb01_Tab_DayofMonth.java (305줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L80-89·L161-205: 왼쪽 300(여백 20,0,20,20, 테두리) = 달력 + [예약하기] 270, 가운데(여백 20,20,20,-2, 테두리) = 라디오(MY 예약 / 전체 예약) + 예약 그리드(체크 단일)
 * 조회가 끝나면 달력의 예약 있는 날을 다시 읽고(getBookingList L133) 부모의 callback을 부른다(retrieve() L250-267)
 * 스타일: GCG (yunhee page-style 판별 — docs/page-style.md)
 */
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Calendar, message, Modal, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { mrbApi } from '@/api/mrb';
import { errorMessage } from '@/api/client';
import { MrbBooking } from '@/types/mrb';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { MrbBookingRegTarget, Mrb01_Popup_MeetingRoomReg } from './Mrb01_Popup_MeetingRoomReg';

const gb = gbFor<MrbBooking>();
const FORMAT = 'YYYY-MM-DD';
/** rowSelection은 상수로 넘긴다(11 §1 함정). setChecked(SINGLE) = 체크박스 단일 선택 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export interface DayofMonthHandle {
  retrieve: () => Promise<void>;
}

interface Props {
  /** callback.execute() — retrieve() 끝에서 (부모 목록 다시 읽기) */
  callback: () => void;
}

/** Mrb01_BookingModel.getDateText() L195-205: 'yyyy-MM-dd HH:mm ~ yyyy-MM-dd HH:mm' (둘 다 시작일 날짜) */
export const bookingDateText = (b: MrbBooking): string =>
  b.bookingDate && b.startHour && b.startMin && b.closeHour && b.closeMin
    ? `${b.bookingDate} ${b.startHour}:${b.startMin} ~ ${b.bookingDate} ${b.closeHour}:${b.closeMin}`
    : '';

export const Mrb01_Tab_DayofMonth = forwardRef<DayofMonthHandle, Props>(({ callback }, ref) => {
  const user = useLoginUser();
  // LoginUser.getIsManager(): 회사관리자(userId < 0) — 다른 화면과 같은 판정(Apr01_Tab_BizPriorApproval)
  const isManager = user.userId < 0;
  const [date, setDate] = useState<Dayjs>(() => dayjs());
  const [panel, setPanel] = useState<Dayjs>(() => dayjs());  // 달력이 보여 주는 달 (datePicker.getYearMonth())
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [type, setType] = useState<'my' | 'all'>('all');
  const [rows, setRows] = useState<MrbBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<MrbBookingRegTarget | null>(null);
  const seq = useRef(0);
  const markSeq = useRef(0);
  const state = useRef({ date, type, panel });
  state.current = { date, type, panel };

  // getBookingList() L133-159: yyyyMM → mrb.Mrb01_Booking.selectByYearMonth → datePicker.setMarkedDates(예약 있는 날)
  const getBookingList = async (month: Dayjs = state.current.panel) => {
    const my = ++markSeq.current;
    try {
      const list = await mrbApi.searchMarkedDates(month.format('YYYYMM'));
      if (my === markSeq.current) setMarked(new Set(list));
    } catch {
      if (my === markSeq.current) setMarked(new Set());
    }
  };

  // retrieve() L250-267: bookingDate·companyId·empId·type(all/my) → mrb.Mrb01_Booking.selectByDate, 그리고 getBookingList(), callback
  const retrieve = async (next: { date: Dayjs; type: 'my' | 'all' } = state.current) => {
    const my = ++seq.current;
    setLoading(true);
    try {
      const list = await mrbApi.searchBookings({ date: next.date.format(FORMAT), type: next.type });
      if (my === seq.current) setRows(list);
      void getBookingList();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
    callback();
  };
  useImperativeHandle(ref, () => ({ retrieve: () => retrieve() }));

  // [E0] 화면 열림 (생성자 L70-89) → settings(), getWestLayout(), getCenterLayout(), retrieve() — 처음 열 때 조회 / 레이아웃은 아래 렌더
  React.useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const canEdit = (row: MrbBooking) => isManager || row.empId === user.userId;

  // deleteCheck() L269-289: 권한 검사 → 확인창 · [E5] messageBox.DialogHide [YES] (L275) → delete() L291-296 (mrb.Mrb01_Booking.delete), retrieve()
  const deleteCheck = (row: MrbBooking) => {
    if (!canEdit(row)) { message.warning('작성자만 삭제가능합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '회의실 예약을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await mrbApi.deleteBookings([row.bookingId as number]);
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L207-248 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.text('dateText', 240, '예약시간', { valueGetter: p => (p.data ? bookingDateText(p.data) : '') }),  // L239
    gb.text('subject', 300, '회의제목'),  // L240
    gb.textCenter('empNm', 100, '예약자'),  // L241
    gb.text('roomNm', 160, '회의실명'),  // L242
    gb.text('attendance', 260, '참석자'),  // L243
    // [E4] actionCell (ImageCell "Edit") (L221) → Mrb01_Popup_MeetingRoomReg.retrieve(model, checkYn, cb → retrieve())
    iconCell<MrbBooking>('edit', 'actionCell', 50, '상세보기', row => setPopup({ mode: 'retrieve', row, checkYn: canEdit(row) })),  // L244
    iconCell<MrbBooking>('delete', 'cancelCell', 60, '삭제', deleteCheck),  // L245
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user.userId]);

  return (
    <div style={{ height: '100%', display: 'flex' }}>
      {/* getWestLayout() L161-181 */}
      <div style={{ width: 300, flexShrink: 0, margin: '8px 0 20px 20px', boxSizing: 'border-box', border: '1px solid #d9d9d9', background: '#fff', padding: 10 }}>
        {/* [E1] datePicker.ValueChange (L100) → retrieve() / setMonthYearChangeHandler (L94) → getBookingList() */}
        <Calendar
          fullscreen={false}
          value={date}
          onChange={d => { setDate(d); setPanel(d); void retrieve({ date: d, type }); }}
          onPanelChange={d => { setPanel(d); void getBookingList(d); }}
          cellRender={(current, info) => {
            if (info.type !== 'date' || !marked.has(current.format(FORMAT))) return info.originNode;
            // setMarkedDates: 예약이 있는 날은 굵게 + 아래 주황 줄
            return React.cloneElement(info.originNode as React.ReactElement<{ style?: React.CSSProperties }>, { style: { fontWeight: 700, boxShadow: 'inset 0 -3px 0 #fa8c16' } });
          }}
        />
        {/* [E2] insertButton[예약하기].Select (L106) → getSeq 뒤 Mrb01_Popup_MeetingRoomReg.open(datePicker.getValue(), cb → retrieve()) */}
        <div style={{ margin: '10px 0 0' }}>
          <Button type="register" style={{ width: '100%' }} onClick={() => setPopup({ mode: 'open', date: date.format(FORMAT) })}>예약하기</Button>
        </div>
      </div>
      {/* getCenterLayout() L183-205 */}
      <div style={{ flex: 1, minWidth: 0, margin: '8px 20px 20px -2px', boxSizing: 'border-box', border: '1px solid #d9d9d9', background: '#fff', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] toggleAllMy.ValueChange (L125) → retrieve() */}
        <Radio.Group value={type} onChange={e => { setType(e.target.value); void retrieve({ date, type: e.target.value }); }}>
          <Radio value="my">MY 예약</Radio>
          <Radio value="all">전체 예약</Radio>
        </Radio.Group>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<MrbBooking>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.bookingId)}
            loading={loading}
            rowSelection={SINGLE_CHECK}
          />
        </div>
      </div>
      <Mrb01_Popup_MeetingRoomReg target={popup} onSaved={() => void retrieve()} onClose={() => setPopup(null)} />
    </div>
  );
});
