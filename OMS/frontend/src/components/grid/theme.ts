import { themeAlpine } from 'ag-grid-community';

/**
 * 공통 그리드 모양 — 값은 여기서만 바꾼다 (docs/grid-types.md).
 * Theming API로 주입한다. 옛 CSS 테마 파일(ag-grid.css / ag-theme-*.css)을 import하면 여기 값을 덮어쓰니 쓰지 않는다.
 */
export const GRID_COLORS = {
  rowHover: '#c4d7eb',
  rowSelected: '#f3cdbb',
  oddRow: '#fafbfc',
  summaryRow: '#f8fafc',
  /** 헤더 배경 (연회색 — 본문 흰 바탕과 구분되게 Ant Design 표준 #fafafa보다 약간 진하게) */
  header: '#dde1e7',
  /** 헤더 경계선 */
  headerBorder: '#e8e8e8',
  /** 기본 테두리 / 행 하단 경계선 (글씨와 겹치지 않는 흐린 색) */
  border: '#f0f0f0',
  /** 헤더 글자색 */
  headerText: '#475569',
  /** 본문 글자색 (눈이 편안한 짙은 차콜) */
  cellText: '#262626',
};

/** density: normal = AS-IS GridBuilder 기본에 가까운 36/32, compact = 28/24 */
export const GRID_DENSITY = {
  normal: { headerHeight: 36, rowHeight: 32 },
  compact: { headerHeight: 28, rowHeight: 24 },
} as const;

export type GridDensity = keyof typeof GRID_DENSITY;

const base = {
  fontSize: 13,
  headerFontWeight: 600, // 과도하게 두껍지 않은 깔끔한 굵기
  headerBackgroundColor: GRID_COLORS.header,
  headerTextColor: GRID_COLORS.headerText,
  cellTextColor: GRID_COLORS.cellText,
  borderColor: GRID_COLORS.border,
  rowBorder: { color: GRID_COLORS.border, style: 'solid', width: 1 },
  columnBorder: false, // 셀 좌우 세로선 없음
  headerRowBorder: { color: GRID_COLORS.headerBorder, style: 'solid', width: 1 },
  headerColumnBorder: false,
  rowHoverColor: GRID_COLORS.rowHover,
  selectedRowBackgroundColor: GRID_COLORS.rowSelected,
  oddRowBackgroundColor: GRID_COLORS.oddRow,
  cellHorizontalPadding: 10,
  wrapperBorder: false, // 외곽 테두리 없음
  wrapperBorderRadius: 0,
  rangeSelectionBorderColor: 'transparent', // 셀 클릭 시 포커스 박스 숨김 (키보드 이동은 유지)
};

export const gridThemes = {
  normal: themeAlpine.withParams({ ...base, ...GRID_DENSITY.normal }),
  compact: themeAlpine.withParams({ ...base, ...GRID_DENSITY.compact }),
};

/** 헤더 색을 그 그리드만 바꿀 때 (BaseGrid headerColor) */
export const gridThemeWithHeader = (density: GridDensity, headerColor: string) =>
  gridThemes[density].withParams({ headerBackgroundColor: headerColor });
