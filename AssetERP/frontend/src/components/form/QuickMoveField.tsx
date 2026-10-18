import React from 'react';
import { Input, Select, Space } from 'antd';

/**
 * 기준년월 이동 필드 — AS-IS myApp/client/field/QuickMoveField.java (◀ [yyyy 45] [n월 60] ▶).
 * - ◀▶ moveMonth(): 12월 다음은 다음 해 1월, 1월 이전은 전 해 12월. 바뀐 값으로 곧바로 onCommit
 * - 월 콤보를 고르면(콤보 collapse) onCommit, 연도 칸은 Enter에서만 onCommit
 * 값은 부모가 들고 있고(year·month), onCommit은 바뀐 값을 인자로 받아 조회에 바로 쓴다(상태 반영 전 값이 아니라).
 */
export interface YearMonth {
  year: number;
  month: number;
}

interface Props extends YearMonth {
  onChange: (v: YearMonth) => void;
  onCommit: (v: YearMonth) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}월` }));

export const QuickMoveField: React.FC<Props> = ({ year, month, onChange, onCommit }) => {
  // moveMonth(diff) L144-169
  const moveMonth = (diff: number) => {
    let y = year;
    let m = month + diff;
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    onChange({ year: y, month: m });
    onCommit({ year: y, month: m });
  };

  const arrow: React.CSSProperties = { cursor: 'pointer', userSelect: 'none', color: 'inherit', textDecoration: 'none' };

  return (
    <Space size={4}>
      <a style={arrow} onMouseDown={() => moveMonth(-1)}>◀</a>
      <Input
        style={{ width: 65 }}
        maxLength={4}
        value={String(year)}
        onChange={e => { const y = Number(e.target.value.replace(/\D/g, '')); onChange({ year: y, month }); }}
        onPressEnter={() => onCommit({ year, month })}
      />
      <Select
        style={{ width: 80 }}
        value={month}
        options={MONTHS}
        onChange={m => { onChange({ year, month: m }); onCommit({ year, month: m }); }}
      />
      <a style={arrow} onMouseDown={() => moveMonth(1)}>▶</a>
    </Space>
  );
};
