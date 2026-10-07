import { useCallback, useMemo, type CSSProperties, type Ref } from 'react';
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import type { ColDef, ColGroupDef, RowClassParams, SortChangedEvent, FilterChangedEvent } from 'ag-grid-community';
import { GRID_COLORS, gridThemes, gridThemeWithHeader, type GridDensity } from './theme';
import './grid.css';

/**
 * 공통 그리드 기반 (직접 쓰지 않는다 — SingleGrid / MultiGrid / CellEditGrid / ModalEditGrid를 쓴다).
 * AS-IS GridBuilder.build()의 기본: 행번호 40px, 줄무늬, 컬럼선, 굵은 헤더, 헤더 메뉴 없음, 정렬·폭 조절 허용, px 고정 폭.
 * 부모를 채운다(flex 컬럼이면 flex:1, 아니면 height 100%).
 */

/** sumRow: 맨 아래 고정 합계 행 (AS-IS getSumGrid / setSumGrid / setAvgGrid) */
export interface SumRow {
  /** '합계' 글자를 넣을 컬럼 field */
  labelField: string;
  label?: string;
  sum?: string[];
  avg?: string[];
}

export interface BaseGridProps<T> extends Omit<AgGridReactProps<T>, 'theme'> {
  gridRef?: Ref<AgGridReact<T>>;
  /** 행번호 컬럼 (기본 true, AS-IS setRowNumHidden(true) → false) */
  rowNumber?: boolean;
  density?: GridDensity;
  /** 컬럼 정렬 허용 (기본 true, AS-IS setSortable(false) → false) */
  sortable?: boolean;
  /** 이 그리드만 헤더 배경색을 바꿀 때 (기본 theme.ts GRID_COLORS.header) */
  headerColor?: string;
  sumRow?: SumRow;
  wrapperStyle?: CSSProperties;
}

const ROWNUM_ID = '__rownum';

/** grid.css가 쓰는 색 — theme.ts GRID_COLORS를 CSS 변수로 넘긴다 */
const cssVars = { '--gb-summary-row': GRID_COLORS.summaryRow } as CSSProperties;

const rowNumberCol: ColDef = {
  colId: ROWNUM_ID,
  headerName: '',
  width: 40,
  pinned: 'left',
  lockPosition: 'left',
  sortable: false,
  resizable: false,
  suppressMovable: true,
  cellClass: 'gb-rownum',
  valueGetter: p => (p.node?.rowPinned ? '' : (p.node?.rowIndex ?? 0) + 1),
};

const sumOf = (rows: Record<string, unknown>[], f: string) => rows.reduce((s, r) => s + (Number(r[f]) || 0), 0);

export function BaseGrid<T>({
  gridRef,
  rowNumber = true,
  density = 'normal',
  sortable = true,
  headerColor,
  sumRow,
  wrapperStyle,
  columnDefs,
  defaultColDef,
  rowData,
  getRowClass,
  onSortChanged,
  onFilterChanged,
  ...rest
}: BaseGridProps<T>) {
  const cols = useMemo<(ColDef<T> | ColGroupDef<T>)[]>(
    () => (rowNumber ? [rowNumberCol as ColDef<T>, ...(columnDefs ?? [])] : [...(columnDefs ?? [])]),
    [rowNumber, columnDefs],
  );

  const colDef = useMemo<ColDef<T>>(
    () => ({ sortable, resizable: true, suppressHeaderMenuButton: true, ...defaultColDef }),
    [sortable, defaultColDef],
  );

  const pinnedBottom = useMemo(() => {
    if (!sumRow) return undefined;
    const rows = (rowData ?? []) as Record<string, unknown>[];
    const total: Record<string, unknown> = { [sumRow.labelField]: sumRow.label ?? '합계' };
    sumRow.sum?.forEach(f => (total[f] = sumOf(rows, f)));
    sumRow.avg?.forEach(f => (total[f] = rows.length ? sumOf(rows, f) / rows.length : 0));
    return [total as T];
  }, [sumRow, rowData]);

  const rowClass = useCallback(
    (p: RowClassParams<T>) => {
      const own = getRowClass?.(p);
      return p.node.rowPinned === 'bottom' && sumRow ? ['summary-row', ...([] as string[]).concat(own ?? [])] : own;
    },
    [getRowClass, sumRow],
  );

  const theme = useMemo(
    () => (headerColor ? gridThemeWithHeader(density, headerColor) : gridThemes[density]),
    [density, headerColor],
  );

  // 정렬·필터 후 행번호 다시 그리기
  const refreshRowNum = (api: SortChangedEvent<T>['api']) => {
    if (rowNumber) api.refreshCells({ columns: [ROWNUM_ID], force: true });
  };

  return (
    <div style={{ flex: '1 1 0', minHeight: 0, height: '100%', width: '100%', ...cssVars, ...wrapperStyle }}>
      <AgGridReact<T>
        ref={gridRef}
        theme={theme}
        columnDefs={cols}
        defaultColDef={colDef}
        rowData={rowData}
        pinnedBottomRowData={pinnedBottom}
        getRowClass={rowClass}
        onSortChanged={(e: SortChangedEvent<T>) => {
          refreshRowNum(e.api);
          onSortChanged?.(e);
        }}
        onFilterChanged={(e: FilterChangedEvent<T>) => {
          refreshRowNum(e.api);
          onFilterChanged?.(e);
        }}
        {...rest}
      />
    </div>
  );
}
