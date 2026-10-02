import { themeAlpine } from 'ag-grid-community';

/**
 * 공통 그리드 모양 — 값은 여기서만 바꾼다 (docs/grid-types.md).
 * Theming API로 주입하므로 전역 `.ag-theme-alpine` CSS(flexlayout-custom.css)를 쓰는 기존 그리드와 섞이지 않는다.
 */
export const GRID_COLORS = {
  rowHover: '#f1f5f9',
  rowSelected: '#dbeafe',
  oddRow: '#fafbfc',
  summaryRow: '#f8fafc',
  /** 헤더 배경 (그리드별로는 headerColor prop) */
  header: '#f5f5f5',
};

/** density: normal = AS-IS GridBuilder 기본에 가까운 36/32, compact = 28/24 */
export const GRID_DENSITY = {
  normal: { headerHeight: 36, rowHeight: 32 },
  compact: { headerHeight: 28, rowHeight: 24 },
} as const;

export type GridDensity = keyof typeof GRID_DENSITY;

const base = {
  fontSize: 13,
  headerFontWeight: 700, // AS-IS setHtmlGridStyle: <b>헤더</b>
  headerBackgroundColor: GRID_COLORS.header,
  rowHoverColor: GRID_COLORS.rowHover,
  selectedRowBackgroundColor: GRID_COLORS.rowSelected,
  oddRowBackgroundColor: GRID_COLORS.oddRow, // AS-IS setStripeRows(true)
  columnBorder: true, // AS-IS setColumnLines(true)
  headerColumnBorder: true,
  cellHorizontalPadding: 8,
  wrapperBorderRadius: 2,
};

export const gridThemes = {
  normal: themeAlpine.withParams({ ...base, ...GRID_DENSITY.normal }),
  compact: themeAlpine.withParams({ ...base, ...GRID_DENSITY.compact }),
};

/** 헤더 색을 그 그리드만 바꿀 때 (BaseGrid headerColor) */
export const gridThemeWithHeader = (density: GridDensity, headerColor: string) =>
  gridThemes[density].withParams({ headerBackgroundColor: headerColor });
