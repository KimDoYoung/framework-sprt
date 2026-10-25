import React from 'react';
import { Button as AntButton } from 'antd';
import { CheckOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, HistoryOutlined, MailOutlined, PlusOutlined, SearchOutlined, StopOutlined, SwapOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';

/**
 * AS-IS `gridBuilder.addCell(properties.actionCell(), 폭, 제목, ImageCell("Edit"|"View"|"Upload"|"Down"|"Add"|"Delete"|"Check"|"TreeChange"|"Send"|"History", delegate))` — 아이콘 버튼 셀.
 * 클릭한 행(`p.data`)을 onClick으로 넘긴다(행 선택은 바꾸지 않는다). colId는 같은 제목이 둘 이상이면 서로 달라야 하므로 호출하는 쪽이 준다.
 *   iconCell<Row>('edit', 'actionCell01', 100, '문서권한', row => open(row))
 */
const ICONS = {
  edit: <EditOutlined />,
  view: <SearchOutlined />,
  upload: <UploadOutlined />,
  down: <DownloadOutlined />,
  add: <PlusOutlined />,
  delete: <DeleteOutlined />,
  check: <CheckOutlined />,
  move: <SwapOutlined />, // TreeChange
  send: <MailOutlined />, // Send (메일 보내기)
  history: <HistoryOutlined />, // History (기록 보기)
};

export function iconCell<T>(kind: keyof typeof ICONS, colId: string, width: number, header: string, onClick: (row: T) => void): ColDef<T> {
  return {
    colId,
    width,
    headerName: header,
    headerClass: 'gb-hdr',
    editable: false,
    cellStyle: { padding: 0, textAlign: 'center' },
    cellRenderer: (p: CustomCellRendererProps<T>) => (
      <AntButton type="text" size="small" icon={ICONS[kind]}
        onClick={e => { e.stopPropagation(); if (p.data) onClick(p.data); }} />
    ),
  };
}

/** AS-IS GridBuilder.banIcon — 아이콘을 쓸 수 없는 행에 그리는 회색 네모 안의 금지 표시 */
export const BanIcon: React.FC = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, background: '#D8D8DA', color: '#fff', borderRadius: 2 }}>
    <StopOutlined />
  </span>
);

/**
 * AS-IS `gridBuilder.addDynamicCell(valueProvider, 폭, 제목, ImageCell(...), true)` — 행의 값이 있을 때만 아이콘 버튼, 없으면 금지 표시(BanIcon).
 * hasValue가 AS-IS의 `value != null`에 해당한다.
 *   dynamicIconCell<Row>('edit', 'apprCell', 70, '승인의견', row => open(row), row => row.apprButtonEnable != null)
 */
export function dynamicIconCell<T>(kind: keyof typeof ICONS, colId: string, width: number, header: string, onClick: (row: T) => void, hasValue: (row: T) => boolean): ColDef<T> {
  const base = iconCell<T>(kind, colId, width, header, onClick);
  const render = base.cellRenderer as (p: CustomCellRendererProps<T>) => React.ReactNode;
  return { ...base, cellRenderer: (p: CustomCellRendererProps<T>) => (p.data && hasValue(p.data) ? render(p) : <BanIcon />) };
}
