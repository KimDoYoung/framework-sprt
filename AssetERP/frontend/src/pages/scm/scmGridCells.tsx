/**
 * scm 화면 그리드의 ▲ ▼ 셀 (AS-IS `ImageCell("▲"|"▼", delegate)` — Scm11_Lookup_DevStep·Scm12_Lookup_DevStepRule).
 * 클릭한 행(`p.data`)을 onClick으로 넘긴다. 행 선택은 바꾸지 않는다.
 */
import React from 'react';
import { Button as AntButton } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';

export function arrowCell<T>(dir: 'up' | 'down', colId: string, onClick: (row: T) => void): ColDef<T> {
  return {
    colId,
    width: 30,
    headerName: ' ',
    headerClass: 'gb-hdr',
    editable: false,
    cellStyle: { padding: 0, textAlign: 'center' },
    cellRenderer: (p: CustomCellRendererProps<T>) => (
      <AntButton type="text" size="small" icon={dir === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        onClick={e => { e.stopPropagation(); if (p.data) onClick(p.data); }} />
    ),
  };
}

/** 안쪽 여백 12 · 줄 간격 10 (modal-style 12 — 모달 본문) */
export const MODAL_HEADER_STYLE: React.CSSProperties = { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 };
