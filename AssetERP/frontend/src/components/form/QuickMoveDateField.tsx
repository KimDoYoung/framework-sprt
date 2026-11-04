import React from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

/**
 * 일자 이동 필드 — AS-IS myApp/client/field/QuickMoveDateField.java (◀ [yyyy-MM-dd 100] ▶, 폭 130).
 * - ◀▶ moveDate(±1): 하루씩 옮기고 곧바로 onCommit (L92-100)
 * - 달력에서 날짜를 고르면(collapse) onCommit, 입력칸은 Enter에서도 onCommit (L76-89)
 * - markedDates: 달력에 표시할 날짜(AS-IS setMarkedDates, 'yyyy-MM-dd' 목록). 달력이 열릴 때 부르는 쪽이 `onPanelChange`로 그 달 목록을 채운다
 * 값은 부모가 들고 있고(value, 'yyyy-MM-dd'), onCommit은 바뀐 값을 인자로 받아 조회에 바로 쓴다(상태 반영 전 값이 아니라).
 */
interface Props {
  value: string;
  onChange: (v: string) => void;
  onCommit: (v: string) => void;
  markedDates?: string[];
  /** 달력의 보이는 달이 바뀔 때(AS-IS baseDate.Dom → getMarkingList) — 'yyyy-MM' */
  onMonthChange?: (yyyyMM: string) => void;
  disabled?: boolean;
}

const FMT = 'YYYY-MM-DD';

export const QuickMoveDateField: React.FC<Props> = ({ value, onChange, onCommit, markedDates, onMonthChange, disabled }) => {
  const set = (v: string) => { onChange(v); onCommit(v); };
  const move = (diff: number) => set(dayjs(value).add(diff, 'day').format(FMT));
  const marked = new Set(markedDates ?? []);
  const arrow: React.CSSProperties = { cursor: disabled ? 'default' : 'pointer', userSelect: 'none', fontSize: 11, color: 'inherit' };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <a style={arrow} onMouseDown={e => { e.preventDefault(); if (!disabled) move(-1); }}>◀</a>
      <DatePicker
        style={{ width: 120 }}
        allowClear={false}
        disabled={disabled}
        format={FMT}
        value={dayjs(value)}
        onChange={(d: Dayjs | null) => { if (d) set(d.format(FMT)); }}
        onPanelChange={(d: Dayjs) => onMonthChange?.(d.format('YYYY-MM'))}
        onOpenChange={open => { if (open) onMonthChange?.(dayjs(value).format('YYYY-MM')); }}
        cellRender={(current, info) => {
          if (info.type !== 'date') return info.originNode;
          const on = marked.has((current as Dayjs).format(FMT));
          return (
            <div className="ant-picker-cell-inner" style={on ? { background: '#E33E31', color: '#fff' } : undefined}>
              {(current as Dayjs).date()}
            </div>
          );
        }}
      />
      <a style={arrow} onMouseDown={e => { e.preventDefault(); if (!disabled) move(1); }}>▶</a>
    </span>
  );
};
