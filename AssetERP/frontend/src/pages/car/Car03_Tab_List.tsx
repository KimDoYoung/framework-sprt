/**
 * [1187] 경영관리 > 10. 차량관리 > 공용차량 예약관리 (T13)
 * AS-IS: myApp/client/vi/car/Car03_Tab_List.java (191줄) + Car03_Tab_DayofMonth.java (265줄, 아래 날짜별 예약) + Car03_Popup_BookingReg.java (405줄, 예약 팝업)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L57-103: 위 300(여백 20,20,0,20, 테두리) = 제목 줄 50("공용차량 예약현황 (기준일자 : yyyy년 MM월 dd일)" + 오른쪽 새로고침 아이콘) + 현황 그리드(체크 단일), 가운데 = Car03_Tab_DayofMonth
 * 스타일: GCG (page-style.md에 이번에 등록 — 조회 툴바 없음. 판별기는 미분류로 읽는다)
 */
import React, { useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarBooking } from '@/types/car';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { BookingRegTarget, Car03_Popup_BookingReg } from './Car03_Popup_BookingReg';
import { Car03_Tab_DayofMonth, DayofMonthHandle } from './Car03_Tab_DayofMonth';

const gb = gbFor<CarBooking>();
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Car03_Tab_List: React.FC = () => {
  const user = useLoginUser();
  const isManager = user.userId < 0;  // LoginUser.getIsManager() — Car03_Tab_DayofMonth와 같은 판정
  const dayRef = useRef<DayofMonthHandle>(null);
  const [rows, setRows] = useState<CarBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<BookingRegTarget | null>(null);
  const seq = useRef(0);

  // retrieve() L152-158: startDate(오늘)·companyId → car.Car03_Booking.selectByList
  // [E0] 화면 열림 (생성자 L57-68) · [E1] dayofMonthGrid.callbackOnCreate (L47) · [E2] anchor.MouseDown (L73) · [E3] actionCell.callbackOnCreate (L119) · [E4] messageBox.DialogHide (L166) → retrieve()
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);
    try {
      const list = await carApi.searchBookingList();
      if (my === seq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };
  React.useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const canEdit = (row: CarBooking) => isManager || row.personId === user.userId || row.regEmpId === user.userId;

  // delete() L160-186: 권한 검사 → 확인창(YES) → car.Car03_Booking.deleteList(하위 예약까지) → retrieve(). 날짜별 그리드도 다시 읽는다(L132)
  const deleteCheck = (row: CarBooking) => {
    if (!canEdit(row)) { message.warning('작성자만 삭제가능합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '이미 생성된 공용차량 예약정보는 삭제됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await carApi.deleteBookings([row.bookingId as number], true);
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
        await dayRef.current?.retrieve();
      },
    });
  };

  // buildGrid() L105-150 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.date('startDate', 100, '예약 시작일'),  // L139
    gb.date('closeDate', 100, '예약 종료일'),  // L140
    gb.textCenter('time', 120, '예약 시간'),  // L141
    gb.text('infoNm', 160, '차량정보'),  // L142
    gb.text('destination', 240, '행선지'),  // L143
    gb.textCenter('personNm', 100, '예약자'),  // L144
    gb.text('attendance', 240, '참석자'),  // L145
    // actionCell (ImageCell "Edit") L107-127 → Car03_Popup_BookingReg.getList(model, checkYn, cb → retrieve() + dayofMonthGrid.retrieve())
    iconCell<CarBooking>('edit', 'actionCell', 60, '상세보기', row => setPopup({ mode: 'list', row, checkYn: canEdit(row) })),  // L146
    iconCell<CarBooking>('delete', 'cancelCell', 60, '삭제', deleteCheck),  // L147
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user.userId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* getNorthLayout() L70-103 */}
      <div style={{ height: 300, flexShrink: 0, margin: '20px 20px 0 20px', boxSizing: 'border-box', border: '1px solid #d9d9d9', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 50, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '0 0 70%', paddingLeft: 10, fontWeight: 'bold' }}>
            {dayjs().format('공용차량 예약현황 (기준일자 : YYYY년 MM월 DD일)')}
          </div>
          <div style={{ flex: '0 0 30%', display: 'flex', justifyContent: 'flex-end', paddingRight: 20 }}>
            <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void retrieve()} />
          </div>
        </div>
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
      <div style={{ flex: 1, minHeight: 0 }}>
        <Car03_Tab_DayofMonth ref={dayRef} callback={() => void retrieve()} />
      </div>
      <Car03_Popup_BookingReg target={popup} onSaved={() => { void retrieve(); void dayRef.current?.retrieve(); }} onClose={() => setPopup(null)} />
    </div>
  );
};
