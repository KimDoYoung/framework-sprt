/**
 * [1067] 신청 > 02. 회의실 예약관리 > 회의실 예약관리 (EE14)
 * AS-IS: myApp/client/vi/mrb/Mrb01_Tab_List.java (192줄) + Mrb01_Tab_DayofMonth.java (305줄, 아래 날짜별 예약) + Mrb01_Popup_MeetingRoomReg.java (433줄, 예약 팝업)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L47-68·L70-103: 위 300(여백 20,20,0,20) = 제목 줄("회의실 예약현황 (기준일자 : yyyy년 MM월 dd일)" + 오른쪽 새로고침 아이콘) + 현황 그리드(체크 단일), 가운데 = Mrb01_Tab_DayofMonth
 * 스타일: GCG (견본 Car03_Tab_List — docs/page-style.md. 조회 툴바 없음. yunhee 판별기는 그리드 둘이라 GG로 읽는다)
 */
import React, { useMemo, useRef, useState } from 'react';
import { message, Modal, Splitter } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { mrbApi } from '@/api/mrb';
import { errorMessage } from '@/api/client';
import { MrbBooking } from '@/types/mrb';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { MrbBookingRegTarget, Mrb01_Popup_MeetingRoomReg } from './Mrb01_Popup_MeetingRoomReg';
import { Mrb01_Tab_DayofMonth, DayofMonthHandle } from './Mrb01_Tab_DayofMonth';

const gb = gbFor<MrbBooking>();
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Mrb01_Tab_List: React.FC = () => {
  const user = useLoginUser();
  const isManager = user.userId < 0;  // LoginUser.getIsManager() — Mrb01_Tab_DayofMonth와 같은 판정
  const dayRef = useRef<DayofMonthHandle>(null);
  const [rows, setRows] = useState<MrbBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<MrbBookingRegTarget | null>(null);
  const seq = useRef(0);

  // retrieve() L153-159: bookingDate(오늘)·companyId → mrb.Mrb01_Booking.selectByList
  // [E0] 화면 열림 (생성자 L57-68) · [E1] dayofMonthGrid.callbackOnCreate (L47) · [E2] anchor.MouseDown (L73) · [E3] actionCell.callbackOnCreate (L121) · [E4] messageBox.DialogHide (L167) → retrieve()
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);
    try {
      const list = await mrbApi.searchBookingList();
      if (my === seq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };
  React.useEffect(() => { void retrieve(); }, []);

  const canEdit = (row: MrbBooking) => isManager || row.empId === user.userId;

  // delete() L161-187: 권한 검사 → 확인창(YES) → mrb.Mrb01_Booking.deleteList(하위 예약까지) → retrieve(). 날짜별 그리드도 다시 읽는다(L132)
  const deleteCheck = (row: MrbBooking) => {
    if (!canEdit(row)) { message.warning('작성자만 삭제가능합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '이미 생성된 회의실 예약정보는 삭제됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await mrbApi.deleteBookings([row.bookingId as number], true);
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
        await dayRef.current?.retrieve();
      },
    });
  };

  // buildGrid() L105-151 (setChecked SINGLE). 날짜 열 폭은 UX-08(읽기 전용 90)
  const columnDefs = useMemo(() => [
    gb.date('bookingDate', 90, '예약 시작일'),  // L140
    gb.date('bookingCloseDate', 90, '예약 종료일'),  // L141
    gb.textCenter('time', 120, '예약 시간'),  // L142
    gb.text('subject', 320, '회의제목'),  // L143
    gb.textCenter('empNm', 100, '예약자'),  // L144
    gb.text('roomNm', 160, '회의실명'),  // L145
    gb.text('attendance', 320, '참석자'),  // L146
    // actionCell (ImageCell "Edit") L107-127 → Mrb01_Popup_MeetingRoomReg.getList(model, checkYn, cb → retrieve() + dayofMonthGrid.retrieve())
    iconCell<MrbBooking>('edit', 'actionCell', 60, '상세보기', row => setPopup({ mode: 'list', row, checkYn: canEdit(row) })),  // L147
    iconCell<MrbBooking>('delete', 'cancelCell', 60, '삭제', deleteCheck),  // L148
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user.userId]);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        {/* getNorthLayout() L70-103 — 외곽 테두리 없음, 새로고침 아이콘은 제목 줄 안 오른쪽 끝 */}
        <Splitter.Panel defaultSize={300} min={150}>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '20px 20px 0 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', marginBottom: 8, boxSizing: 'border-box' }}>
              <div style={{ fontWeight: 'bold' }}>
                {dayjs().format('회의실 예약현황 (기준일자 : YYYY년 MM월 DD일)')}
              </div>
              <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void retrieve()} />
            </div>
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
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <Mrb01_Tab_DayofMonth ref={dayRef} callback={() => void retrieve()} />
        </Splitter.Panel>
      </Splitter>
      <Mrb01_Popup_MeetingRoomReg target={popup} onSaved={() => { void retrieve(); void dayRef.current?.retrieve(); }} onClose={() => setPopup(null)} />
    </div>
  );
};
