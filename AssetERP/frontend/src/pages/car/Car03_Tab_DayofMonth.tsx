/**
 * 공용차량 예약 — 날짜별 (T13) — Car03_Tab_List 아래에 붙는 하위 화면
 * AS-IS: myApp/client/vi/car/Car03_Tab_DayofMonth.java (265줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L63-134: 왼쪽 300(여백 20,0,20,20, 테두리) = 달력 + [예약하기] 270, 가운데(여백 20,20,20,-2, 테두리) = 라디오(MY 예약 / 전체 예약) + 예약 그리드(체크 단일)
 * 조회가 끝나면 부모의 callback을 부른다(retrieve() L226) — 부모 목록도 같이 다시 읽는다
 */
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Calendar, message, Modal, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarBooking } from '@/types/car';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { BookingRegTarget, Car03_Popup_BookingReg } from './Car03_Popup_BookingReg';

const gb = gbFor<CarBooking>();
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

/** CarBooking.getDateText(): 'yyyy-MM-dd HH:mm ~ yyyy-MM-dd HH:mm' (둘 다 시작일 날짜) */
export const bookingDateText = (b: CarBooking): string =>
  b.startDate && b.startHour && b.startMin && b.closeHour && b.closeMin
    ? `${b.startDate} ${b.startHour}:${b.startMin} ~ ${b.startDate} ${b.closeHour}:${b.closeMin}`
    : '';

export const Car03_Tab_DayofMonth = forwardRef<DayofMonthHandle, Props>(({ callback }, ref) => {
  const user = useLoginUser();
  // LoginUser.getIsManager(): 회사관리자(userId < 0) — 다른 화면과 같은 판정(Apr01_Tab_BizPriorApproval)
  const isManager = user.userId < 0;
  const [date, setDate] = useState<Dayjs>(() => dayjs());
  const [type, setType] = useState<'my' | 'all'>('all');
  const [rows, setRows] = useState<CarBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<BookingRegTarget | null>(null);
  const seq = useRef(0);
  const state = useRef({ date, type });
  state.current = { date, type };

  // retrieve() L213-227: startDate·companyId·personId·type(all/my) → car.Car03_Booking.selectByDate, 그리고 callback
  const retrieve = async (next: { date: Dayjs; type: 'my' | 'all' } = state.current) => {
    const my = ++seq.current;
    setLoading(true);
    try {
      const list = await carApi.searchBookings({ date: next.date.format(FORMAT), type: next.type });
      if (my === seq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
    callback();
  };
  useImperativeHandle(ref, () => ({ retrieve: () => retrieve() }));

  // [E0] 화면 열림 (생성자 L63-76) → init() L78-83: datePicker 오늘, makeEvent(), retrieve() — 처음 열 때 조회 / getWestLayout()·getCenterLayout()은 아래 렌더
  React.useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const canEdit = (row: CarBooking) => isManager || row.personId === user.userId || row.regEmpId === user.userId;

  // deleteCheck() L229-249: 권한 검사 → 확인창 · [E5] messageBox.DialogHide [YES] (L235) → delete() L251-256 (car.Car03_Booking.delete), retrieve()
  const deleteCheck = (row: CarBooking) => {
    if (!canEdit(row)) { message.warning('작성자만 삭제가능합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '회의실 예약을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await carApi.deleteBookings([row.bookingId as number]);
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  const columnDefs = useMemo(() => [
    gb.text('dateText', 240, '예약시간', { valueGetter: p => (p.data ? bookingDateText(p.data) : '') }),  // L202
    gb.text('infoNm', 160, '차량정보'),  // L203
    gb.text('destination', 240, '행선지'),  // L204
    gb.textCenter('personNm', 100, '예약자'),  // L205
    gb.text('attendance', 240, '참석자'),  // L206
    // [E4] actionCell (ImageCell "Edit") (L184) → Car03_Popup_BookingReg.retrieve(model, checkYn, cb → retrieve())
    iconCell<CarBooking>('edit', 'actionCell', 60, '상세보기', row => setPopup({ mode: 'retrieve', row, checkYn: canEdit(row) })),  // L207
    iconCell<CarBooking>('delete', 'cancelCell', 60, '삭제', deleteCheck),  // L208
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user.userId]);

  return (
    <div style={{ height: '100%', display: 'flex' }}>
      {/* getWestLayout() L85-105 */}
      <div style={{ width: 300, flexShrink: 0, margin: '8px 0 20px 20px', boxSizing: 'border-box', border: '1px solid #d9d9d9', background: '#fff', padding: 10 }}>
        {/* [E1] datePicker.ValueChange (L137) → retrieve() */}
        <Calendar fullscreen={false} value={date} onChange={d => { setDate(d); void retrieve({ date: d, type }); }} />
        {/* [E2] insertButton[예약하기].Select (L143) → Car03_Popup_BookingReg.open(datePicker.getValue(), cb → retrieve()) */}
        <div style={{ margin: '10px 0 0' }}>
          <Button type="register" style={{ width: '100%' }} onClick={() => setPopup({ mode: 'open', date: date.format(FORMAT) })}>예약하기</Button>
        </div>
      </div>
      {/* getCenterLayout() L107-134 */}
      <div style={{ flex: 1, minWidth: 0, margin: '8px 20px 20px -2px', boxSizing: 'border-box', border: '1px solid #d9d9d9', background: '#fff', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] toggleAllMy.ValueChange (L162) → retrieve() */}
        <Radio.Group value={type} onChange={e => { setType(e.target.value); void retrieve({ date, type: e.target.value }); }}>
          <Radio value="my">MY 예약</Radio>
          <Radio value="all">전체 예약</Radio>
        </Radio.Group>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<CarBooking>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.bookingId)}
            loading={loading}
            rowSelection={SINGLE_CHECK}
          />
        </div>
      </div>
      <Car03_Popup_BookingReg target={popup} onSaved={() => void retrieve()} onClose={() => setPopup(null)} />
    </div>
  );
});
