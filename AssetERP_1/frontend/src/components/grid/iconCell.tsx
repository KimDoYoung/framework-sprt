import { Button as AntButton } from 'antd';
import { DownloadOutlined, EditOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';

/**
 * AS-IS `gridBuilder.addCell(properties.actionCell(), 폭, 제목, ImageCell("Edit"|"View"|"Upload"|"Down", delegate))` — 아이콘 버튼 셀.
 * 클릭한 행(`p.data`)을 onClick으로 넘긴다(행 선택은 바꾸지 않는다). colId는 같은 제목이 둘 이상이면 서로 달라야 하므로 호출하는 쪽이 준다.
 *   iconCell<Row>('edit', 'actionCell01', 100, '문서권한', row => open(row))
 */
const ICONS = {
  edit: <EditOutlined />,
  view: <SearchOutlined />,
  upload: <UploadOutlined />,
  down: <DownloadOutlined />,
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
