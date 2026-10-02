import React from 'react';
import { Button, Checkbox } from 'antd';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { fmtDouble, fmtLong, toNum } from './format';

/** AS-IS addTextStatus: 상태값별 굵은 색 글씨 */
const STATUS_COLORS: Record<string, string> = {
  완료: '#4472C4',
  점검진행: '#4472C4',
  반려: '#CE4242',
  승인반려: '#CE4242',
  미흡: '#D49208',
  개선: '#D49208',
};

export const StatusCell: React.FC<CustomCellRendererProps> = ({ value }) =>
  value ? <b style={{ color: STATUS_COLORS[String(value)] }}>{String(value)}</b> : null;

/**
 * AS-IS addLongColor / addDoubleColor: 부호별 굵은 색 숫자.
 * 원본 그대로 Long은 음수 빨강·양수 파랑, Double은 양수 빨강·음수 파랑이다 (GridBuilder L1207 / L1055).
 */
export const SignColorCell: React.FC<CustomCellRendererProps & { kind: 'long' | 'double' }> = ({ value, kind }) => {
  if (value === undefined || value === null || value === '') return null;
  const n = toNum(value);
  const red = '#E74C3C';
  const blue = '#5280B9';
  const color = n === 0 ? '#404040' : (kind === 'long' ? n < 0 : n > 0) ? red : blue;
  return <b style={{ color }}>{kind === 'long' ? fmtLong(n) : fmtDouble(n)}</b>;
};

/** 값 + 작은 비율 한 줄 우측 정렬 (예: 전일대비 1,200 (0.85)). rateField의 부호로 색을 정한다 */
export const ValueWithRateCell: React.FC<CustomCellRendererProps & { rateField: string }> = ({ value, data, rateField }) => {
  if (value === undefined || value === null || value === '') return null;
  const rate = toNum((data as Record<string, unknown> | undefined)?.[rateField]);
  const color = rate > 0 ? '#ef4444' : rate < 0 ? '#3b82f6' : undefined;
  return (
    <span style={{ color, fontWeight: 600, display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 3 }}>
      <span>{fmtLong(value)}</span>
      <span style={{ fontSize: 10, opacity: 0.85 }}>({rate.toFixed(2)})</span>
    </span>
  );
};

/** 행 안의 작은 버튼 — 클릭이 행 선택·더블클릭으로 번지지 않게 막는다 */
export const ActionCell: React.FC<CustomCellRendererProps & { label: string; onClick: (row: unknown) => void }> = ({
  data,
  node,
  label,
  onClick,
}) =>
  node?.rowPinned ? null : (
    <Button
      size="small"
      onClick={e => {
        e.stopPropagation();
        onClick(data);
      }}
      onDoubleClick={e => e.stopPropagation()}
    >
      {label}
    </Button>
  );

/**
 * gb.boolean / gb.booleanYn2: 네모 체크박스, 선택·해제 두 상태만 (null도 해제로 본다).
 * editable이면 클릭으로 바꾸고 setDataValue → onCellValueChanged(useGridCrud 변경 행)로 이어진다. 아니면 보기만.
 */
export const CheckCell: React.FC<CustomCellRendererProps & { editable?: boolean }> = ({ value, node, colDef, editable }) =>
  node?.rowPinned ? null : (
    <Checkbox
      checked={value === true || value === 'Y' || value === 'true'}
      style={editable ? undefined : { pointerEvents: 'none' }}
      onChange={e => {
        if (editable && colDef?.field) node.setDataValue(colDef.field, e.target.checked);
      }}
    />
  );
