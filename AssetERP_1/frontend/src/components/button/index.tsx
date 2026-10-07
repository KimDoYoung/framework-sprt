import React from 'react';
import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';
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

export interface ButtonProps extends Omit<AntButtonProps, 'type'> {
  type?: ButtonType | AntButtonProps['type'];
}

const isButtonType = (t: ButtonProps['type']): t is ButtonType => !!t && t in TYPES;

export const Button: React.FC<ButtonProps> = ({ type, className, icon, children, ...rest }) => {
  if (!isButtonType(type)) return <AntButton type={type} className={className} icon={icon} {...rest}>{children}</AntButton>;
  const [color, typeIcon, iconOnly] = TYPES[type] as [Color, React.ReactNode, boolean?];
  return (
    <AntButton {...rest} className={['erp-btn', `erp-btn-${color}`, className].filter(Boolean).join(' ')} icon={icon ?? typeIcon}>
      {iconOnly ? null : children}
    </AntButton>
  );
};
