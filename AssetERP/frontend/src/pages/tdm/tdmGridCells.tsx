import React from 'react';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { iconCell } from '@/components/grid';

/**
 * AS-IS `addDynamicCell(valueProvider, 폭, 제목, ImageCell("View", …), true)` — 값이 비어 있지 않은 행에만 보기 아이콘을 보인다.
 * (Tdm42_Tab_ManlManagerAdmin 책무매뉴얼 열, Tdm43_Lookup_ManlItem 점검항목 옆 열). 공통 부품 후보 — docs/work/E/E13-작업기록.md 제안
 */
export function dynamicViewCell<T>(field: ColDef<T>['field'], colId: string, width: number, header: string, onClick: (row: T) => void): ColDef<T> {
  const base = iconCell<T>('view', colId, width, header, onClick);
  const Icon = base.cellRenderer as React.FC<CustomCellRendererProps<T>>;
  return { ...base, field, cellRenderer: (p: CustomCellRendererProps<T>) => (p.value ? <Icon {...p} /> : null) };
}

/**
 * AS-IS `addDynamicCell(valueProvider, 폭, 제목, ImageCell(…), Set<값>)` — 값이 허용 목록에 있는 행에만 아이콘을 보인다.
 * (Tdm34_TabPage_RoleAllcDetail 책무기술서 미리보기·상신·상신문서보기 열). dynamicViewCell의 일반형 — docs/work/N/N11-작업기록.md 부품 제안
 */
export function dynamicIconCell<T>(kind: Parameters<typeof iconCell>[0], field: ColDef<T>['field'], colId: string, width: number, header: string, values: string[], onClick: (row: T) => void): ColDef<T> {
  const base = iconCell<T>(kind, colId, width, header, onClick);
  const Icon = base.cellRenderer as React.FC<CustomCellRendererProps<T>>;
  return { ...base, field, cellRenderer: (p: CustomCellRendererProps<T>) => (values.includes(String(p.value ?? '')) ? <Icon {...p} /> : null) };
}
