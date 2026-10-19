import React, { useEffect, useRef, useState } from 'react';
import { Button as AntButton, Tooltip, type ButtonProps as AntButtonProps } from 'antd';
import {
  AimOutlined, ArrowRightOutlined, BookOutlined, CalculatorOutlined, CheckOutlined, DeleteOutlined, DownloadOutlined,
  EditOutlined, EyeOutlined, FolderAddOutlined, LeftCircleOutlined, MailOutlined, MinusOutlined, MinusSquareOutlined,
  PlusOutlined, PlusSquareOutlined, PrinterOutlined, SearchOutlined, SettingOutlined, StopOutlined, SwapOutlined,
  TeamOutlined, UndoOutlined, UploadOutlined, UserDeleteOutlined,
} from '@ant-design/icons';
import './button.css';

/**
 * 공통 버튼 — type(의미)으로 색·아이콘을 정한다. 이름표: docs/button-types.md (AS-IS ColorButtonBar).
 * 화면에서는 antd Button 대신 이것만 쓴다. antd 원래 type(primary, default, link …)도 그대로 동작한다.
 *
 * UX보강(docs/10-UX보강.md):
 * - UX-01 onClick이 Promise를 돌려주면 끝날 때까지 loading(아이콘 스피너·중복 클릭 무시). `loading` prop을 주면 그 값이 우선.
 * - UX-03 `count`(useGridCrud의 `changes` 또는 숫자)를 주면 문구 `저장(3)`, 0건이면 비활성, 툴팁에 추가·수정 수.
 */
type Color = 'blue' | 'mint' | 'red' | 'orange' | 'green' | 'lightBlue' | 'darkGray' | 'dark' | 'mainTheme';

const TYPES = {
  search: ['blue', <SearchOutlined />],
  addRow: ['blue', <PlusOutlined />],
  unassign: ['blue', <UserDeleteOutlined />],
  send: ['blue', <MailOutlined />],
  calculate: ['blue', <CalculatorOutlined />],
  save: ['mint', <CheckOutlined />],
  expand: ['mint', <PlusSquareOutlined />],
  collapse: ['mint', <MinusSquareOutlined />],
  bookmark: ['mint', <BookOutlined />],
  plus: ['mint', <PlusOutlined />, true],
  minus: ['mint', <MinusOutlined />, true],
  delete: ['red', <DeleteOutlined />],
  removeRow: ['red', <MinusOutlined />],
  cancel: ['red', <StopOutlined />],
  move: ['red', <SwapOutlined />],
  upload: ['orange', <UploadOutlined />],
  download: ['orange', <DownloadOutlined />],
  view: ['orange', <EyeOutlined />],
  goto: ['orange', <ArrowRightOutlined />],
  group: ['orange', <TeamOutlined />],
  assign: ['orange', <CheckOutlined />],
  close: ['orange', <StopOutlined />],
  print: ['darkGray', <PrinterOutlined />],
  attach: ['darkGray', <FolderAddOutlined />],
  org: ['darkGray', <TeamOutlined />],
  reset: ['lightBlue', <UndoOutlined />],
  change: ['lightBlue', <SwapOutlined />],
  register: ['green', <EditOutlined />],
  generate: ['green', <AimOutlined />],
  select: ['green', <LeftCircleOutlined />],
  settings: ['dark', <SettingOutlined />],
  shortcut: ['mainTheme', <ArrowRightOutlined />, true],
} satisfies Record<string, [Color, React.ReactNode, iconOnly?: boolean]>;

export type ButtonType = keyof typeof TYPES;

/** UX-03 저장(n) — useGridCrud().changes. editing: 셀 편집 중(값 확정 전)이라 0건이어도 끄지 않는다 */
export interface ChangeCount {
  added: number;
  modified: number;
  editing?: boolean;
}

export interface ButtonProps extends Omit<AntButtonProps, 'type' | 'onClick'> {
  type?: ButtonType | AntButtonProps['type'];
  /** Promise를 돌려주면 끝날 때까지 loading (UX-01) */
  onClick?: (e: React.MouseEvent<HTMLElement>) => unknown;
  /** 변경 건수 — 문구 뒤에 (n), 0이면 비활성 (UX-03) */
  count?: number | ChangeCount;
}

const isButtonType = (t: ButtonProps['type']): t is ButtonType => !!t && t in TYPES;

/** UX-01: onClick 결과가 Promise면 settle될 때까지 true. 중복 실행은 막고(loading 중 무시) 언마운트 뒤에는 state를 건드리지 않는다 */
export function usePromiseLoading<A extends unknown[]>(fn: ((...args: A) => unknown) | undefined) {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const alive = useRef(true);
  // StrictMode(개발)는 마운트 직후 cleanup을 한 번 돌리므로 effect에서 다시 true로 되돌린다
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const run = (...args: A) => {
    if (busyRef.current || !fn) return;
    const result = fn(...args);
    if (!(result instanceof Promise)) return;
    busyRef.current = true;
    setBusy(true);
    result.finally(() => {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }).catch(() => undefined);
  };
  return [busy, run] as const;
}

export const Button: React.FC<ButtonProps> = ({ type, className, icon, children, onClick, loading, count, disabled, ...rest }) => {
  const [busy, run] = usePromiseLoading(onClick);
  const n = count == null ? undefined : typeof count === 'number' ? count : count.added + count.modified;
  const label = n == null || children == null ? children : <>{children}({n})</>;
  const common = {
    ...rest,
    loading: loading ?? busy,
    disabled: disabled || (n === 0 && !(typeof count === 'object' && count.editing)),
    onClick: run,
  };
  let button: React.ReactElement;
  if (!isButtonType(type)) {
    button = <AntButton type={type} className={className} icon={icon} {...common}>{label}</AntButton>;
  } else {
    const [color, typeIcon, iconOnly] = TYPES[type] as [Color, React.ReactNode, boolean?];
    button = (
      <AntButton {...common} className={['erp-btn', `erp-btn-${color}`, className].filter(Boolean).join(' ')} icon={icon ?? typeIcon}>
        {iconOnly ? null : label}
      </AntButton>
    );
  }
  if (typeof count !== 'object' || n === 0) return button;
  return <Tooltip title={`추가 ${count.added} · 수정 ${count.modified}`}>{button}</Tooltip>;
};
