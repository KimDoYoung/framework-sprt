/**
 * 잔여연차 일수계산 창 (S22) — Pay10_Tab_Retire의 "퇴직정보 입력 전 미리 잔여일수 확인" 링크가 연다.
 * AS-IS: myApp/client/vi/pay/Pay10_Lookup_RemLeaveDays.java (233줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-115: 900×600 모달 "잔여연차 일수계산", 왼쪽 폼 260(퇴사일 · "0000년 잔여휴가(A)" · 추가정산(B) · 잔여휴가(C=A+B), 값 칸은 읽기 전용) + 오른쪽 안내 글,
 *   아래 두 그리드(입사일 기준 연차휴가 / 회계일 기준 연차휴가: 근속 80 · 대상기간 200 · 휴가수 50). [계산][닫기]
 * [E0] open(personId) L117-120: 퇴사일 = 오늘(settings L122-146)
 * [E1] calcButton[계산].Select (L133) → calcRetireLeaveDays() L166-210: 퇴사일이 없으면 "퇴사일을 입력하세요" → pay.Pay15_RetireLeave.calcRetireLeaveDays(personId, retireDate)
 *   → 실패면 서버 문구, 성공이면 "{퇴사년도}년 잔여휴가(A) :" + selectRemLeaveDays 값 + retrieve() L212-222(monthId = 사원ID, 기준 1·2)
 * [E2] closeButton[닫기].Select (L140) → hide()
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, InputNumber, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayRetireLeaveRow } from '@/types/pay';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<PayRetireLeaveRow>();

/** buildGrid1() L148-155 · buildGrid2() L157-164 (같은 열) */
const buildGrid = () => [
  gb.textCenter('yearCntStr', 80, '근속'),  // L151
  gb.textCenter('periodDateStr', 200, '대상기간'),  // L152
  gb.doubleCenter('leaveDays', 50, '휴가수'),  // L153
];

const LABEL = { width: 145, textAlign: 'right', paddingRight: 10 } as const;
const GRAY = '#777777';
const BLUE = '#4F96C5';

interface Props {
  /** open(personId) — 값이 있으면 열린다 */
  personId: number | null;
  onClose: () => void;
}

export const Pay10_Lookup_RemLeaveDays: React.FC<Props> = ({ personId, onClose }) => {
  const [retireDate, setRetireDate] = useState<Dayjs | null>(dayjs());
  const [label, setLabel] = useState('0000년 잔여휴가(A) :');
  const [remain, setRemain] = useState<number | null>(null);
  const [add, setAdd] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [entry, setEntry] = useState<PayRetireLeaveRow[]>([]);
  const [fiscal, setFiscal] = useState<PayRetireLeaveRow[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // [E0] open(personId) L117-120 + settings L122-146: 퇴사일 = 오늘, 나머지는 비운다
  useEffect(() => {
    if (personId === null) return;
    setRetireDate(dayjs());
    setLabel('0000년 잔여휴가(A) :');
    setRemain(null); setAdd(null); setTotal(null);
    setEntry([]); setFiscal([]);
  }, [personId]);

  // [E1] calcButton[계산].Select (L133) → calcRetireLeaveDays() L166-210
  const calcRetireLeaveDays = async () => {
    if (personId === null) return;
    if (!retireDate) {
      message.warning('퇴사일을 입력하세요');
      return;
    }
    try {
      const res = await payApi.calcRetireLeave(personId, retireDate.format('YYYY-MM-DD'));
      setLabel(`${retireDate.format('YYYY')}년 잔여휴가(A) :`);
      setRemain(res.remainLeaveDays ?? null);
      setAdd(res.addLeaveDays ?? null);
      setTotal(res.totalRemainLeaveDays ?? null);
      setEntry(res.entry);
      setFiscal(res.fiscal);
    } catch (err) {
      message.error(errorMessage(err, '계산 실패'));
    }
  };

  return (
    <LookupModal open={personId !== null} title="잔여연차 일수계산" width={930} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="search" onClick={calcRetireLeaveDays}>계산</Button>
            {/* [E2] closeButton[닫기].Select (L140) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 470, display: 'flex', flexDirection: 'column', gap: 10, boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: 200, flexShrink: 0 }}>
          <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 10, padding: '5px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={LABEL}>퇴사일</span>
              <DatePicker value={retireDate} onChange={setRetireDate} format="YYYY-MM-DD" style={{ width: 150 }} /></div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={LABEL}>{label}</span>
              <InputNumber value={remain} disabled style={{ width: 90 }} /></div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={LABEL}>추가정산(B)</span>
              <InputNumber value={add} disabled style={{ width: 90 }} /></div>
            <div style={{ height: 8 }} />
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={LABEL}>잔여휴가(C=A+B)</span>
              <InputNumber value={total} disabled style={{ width: 90 }} /></div>
          </div>
          <div style={{ flex: 1, padding: '60px 0 0 10px', fontSize: 13 }}>
            <div style={{ color: GRAY }}>입사일기준 연차휴가 - 회계일기준 연차휴가</div>
            <div style={{ color: BLUE, marginTop: 8 }}>※ 근로기준법이 정한 원칙(입사일 기준 계산)보다 불리하면 안되므로 퇴직시에는<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;회사가 입사일 기준에 미달하는 연차휴가일수를 수당 등으로 보상해야 한다.</div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 13 }}>* 입사일 기준 연차휴가</div>
            <div style={{ flex: 1, minHeight: 0 }}><SingleGrid<PayRetireLeaveRow> rowData={entry} columnDefs={columnDefs} rowNumber={false} getRowId={p => String(p.data.retireLeaveId)} /></div>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 13 }}>* 회계일 기준 연차휴가</div>
            <div style={{ flex: 1, minHeight: 0 }}><SingleGrid<PayRetireLeaveRow> rowData={fiscal} columnDefs={columnDefs} rowNumber={false} getRowId={p => String(p.data.retireLeaveId)} /></div>
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
