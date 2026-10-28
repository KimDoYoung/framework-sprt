/**
 * 연차수당 정산 탭 (S22) — Pay10_Tab_Retire의 네 번째 탭 "연차수당 정산".
 * AS-IS: myApp/client/vi/pay/Pay15_TabPage_RetireLeave.java (274줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-115: 위 폼 250(왼쪽 폼 260: "{퇴직년도}년 잔여휴가(A) :" · 추가정산(B) · 잔여휴가(C=A+B) · 일당(D) · 연차수당(C*D), 모두 읽기 전용 / 오른쪽 안내 글) +
 *   아래 두 그리드(입사일 기준 연차휴가 / 회계일 기준 연차휴가: 근속 100 · 대상기간 280 · 휴가수 100, 행번호 없음)
 * retrieve(param) L169-198: pay.Pay10_Month.getRetireInfo(personId) — 퇴직정산서(한 건)가 없으면 "선택한 사원의 퇴직정산서 내역이 없습니다. 생성 후 다시시도해주세요",
 *   있으면 callRetireLeave() L200-231 = pay.Pay15_RetireLeave.getRetireLeave(monthId, personId, retireDate, year) + retrieve() L234-244 = selectByMonthId(calcStdType 1·2)
 */
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { InputNumber, message } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayRetireLeaveRow } from '@/types/pay';
import { SingleGrid, gbFor } from '@/components/grid';
import { RETIRE_NO_MONTH, RetireTabHandle, RetireTabParam } from './payRetireTab';

const gb = gbFor<PayRetireLeaveRow>();

/** buildGrid1() L134-141 · buildGrid2() L143-150 (같은 열) */
const buildGrid = () => [
  gb.textCenter('yearCntStr', 100, '근속'),  // L137
  gb.textCenter('periodDateStr', 280, '대상기간'),  // L138
  gb.doubleCenter('leaveDays', 100, '휴가수'),  // L139
];

const LABEL = { width: 145, textAlign: 'right', paddingRight: 10 } as const;
const NUM_FMT = (v: number | string | undefined) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// [E0] 화면 열림 (생성자 L61-115) → settings(): 폼 + 그리드 2개
export const Pay15_TabPage_RetireLeave = forwardRef<RetireTabHandle>((_props, ref) => {
  const [label, setLabel] = useState('0000년 잔여휴가(A) :');
  const [remain, setRemain] = useState<number | null>(null);
  const [add, setAdd] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [dailyAmt, setDailyAmt] = useState<number | null>(null);
  const [retireLeaveAmt, setRetireLeaveAmt] = useState<number | null>(null);
  const [entry, setEntry] = useState<PayRetireLeaveRow[]>([]);
  const [fiscal, setFiscal] = useState<PayRetireLeaveRow[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // init() L153-166: 그리드·필드를 비운다
  const clear = useCallback(() => {
    setLabel('0000년 잔여휴가(A) :');
    setRemain(null); setAdd(null); setTotal(null); setDailyAmt(null); setRetireLeaveAmt(null);
    setEntry([]); setFiscal([]);
  }, []);

  // retrieve(param) L169-198 → callRetireLeave() L200-231 → retrieve() L234-244
  const retrieve = useCallback(async (param: RetireTabParam) => {
    try {
      const res = param.personId == null ? null : await payApi.getRetireLeave(param.personId);
      if (res == null) {
        clear();
        message.warning(RETIRE_NO_MONTH);
        return;
      }
      const month = await payApi.getRetireMonth(param.personId as number);
      setLabel(`${month?.retireDate?.slice(0, 4) ?? '0000'}년 잔여휴가(A) :`);
      setRemain(res.remainLeaveDays ?? null);
      setAdd(res.addLeaveDays ?? null);
      setTotal(res.totalRemainLeaveDays ?? null);
      setDailyAmt(res.dailyAmt ?? null);
      setRetireLeaveAmt(res.retireLeaveAmt ?? null);
      setEntry(res.entry);
      setFiscal(res.fiscal);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [clear]);

  useImperativeHandle(ref, () => ({ retrieve, clear }));

  const row = (text: string, value: number | null, width: number, fmt?: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={LABEL}>{text}</span>
      <InputNumber value={value} disabled controls={false} style={{ width }} formatter={fmt ? NUM_FMT : undefined} />
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', height: 250, flex: 'none', padding: '10px 10px 0' }}>
        <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {row(label, remain, 90)}
          {row('추가정산(B)', add, 90)}
          <div style={{ height: 8 }} />
          {row('잔여휴가(C=A+B)', total, 90)}
          {row('일당(D)', dailyAmt, 120, true)}
          {row('연차수당(C*D)', retireLeaveAmt, 120, true)}
        </div>
        <div style={{ flex: 1, padding: '38px 0 0 10px', fontSize: 13 }}>
          <div style={{ color: '#777777' }}>입사일기준 연차휴가 - 회계일기준 연차휴가</div>
          <div style={{ color: '#4F96C5', marginTop: 8 }}>※ 근로기준법이 정한 원칙(입사일 기준 계산)보다 불리하면 안되므로 퇴직시에는<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;회사가 입사일 기준에 미달하는 연차휴가일수를 수당 등으로 보상해야 한다.</div>
          <div style={{ color: '#777777', marginTop: 28 }}>(기본연봉 / 12개월 / 209시간 * 8시간)</div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 260, display: 'flex', gap: 10, padding: '0 10px 10px' }}>
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
  );
});
Pay15_TabPage_RetireLeave.displayName = 'Pay15_TabPage_RetireLeave';
