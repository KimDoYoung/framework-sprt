import { useCallback, useMemo, type CSSProperties, type Ref } from 'react';
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import type { ColDef, ColGroupDef, RowClassParams, RowDataUpdatedEvent, SortChangedEvent, FilterChangedEvent } from 'ag-grid-community';
import { GRID_COLORS, gridThemes, gridThemeWithHeader, type GridDensity } from './theme';
import './grid.css';

/**
 * 공통 그리드 기반 (직접 쓰지 않는다 — SingleGrid / MultiGrid / CellEditGrid / ModalEditGrid를 쓴다).
 * AS-IS GridBuilder.build()의 기본: 행번호 40px, 줄무늬, 컬럼선, 굵은 헤더, 헤더 메뉴 없음, 폭 조절 허용, px 고정 폭.
 * 헤더 클릭 정렬은 기본으로 끈다(03 원칙 13, 사용자 결정 2026-10-12) — 요청이 있는 그리드만 sortable을 준다.
 * 부모를 채운다(flex 컬럼이면 flex:1, 아니면 height 100%).
 */

/** sumRow: 맨 아래 고정 합계 행 (AS-IS getSumGrid / setSumGrid / setAvgGrid) */
export interface SumRow {
  /** '합계' 글자를 넣을 컬럼 field */
  labelField: string;
  label?: string;
  sum?: string[];
  avg?: string[];
  /** 행 개수를 넣을 컬럼 field들 (AS-IS getAggregationGrid의 CountSummaryType, G17) */
  count?: string[];
}

export interface BaseGridProps<T> extends Omit<AgGridReactProps<T>, 'theme'> {
  gridRef?: Ref<AgGridReact<T>>;
  /** 행번호 컬럼 (기본 true, AS-IS setRowNumHidden(true) → false) */
  rowNumber?: boolean;
  density?: GridDensity;
  /** 헤더 클릭 정렬 (기본 false — 03 원칙 13. 사용자가 요청한 그리드만 true) */
  sortable?: boolean;
  /** 얼룩말(홀수 행 배경) 줄무늬 (기본 true — AS-IS setStripeRows(true)). 트리 그리드는 `useTreeGrid().gridProps`가 false로 넣는다 */
  zebra?: boolean;
  /** 이 그리드만 헤더 배경색을 바꿀 때 (기본 theme.ts GRID_COLORS.header) */
  headerColor?: string;
  sumRow?: SumRow;
  /** 모든 셀을 세로 가운데로 (AS-IS는 전부 vertical center — 03 원칙 20, 기본 true. 끄려면 `vCenter={false}`) */
  vCenter?: boolean;
  wrapperStyle?: CSSProperties;
  /**
   * UX-14 그리드 안에서 거르기: 헤더 아래에 열마다 글자 입력칸(포함 검색)을 둔다. 받은 행만 거르고 서버 조회는 그대로.
   * 값이 있는 열(`field`)에만 붙는다(아이콘 열 제외). 셀에 보이는 글자(valueFormatter 결과)로 비교한다 — 날짜는 'yyyy-mm-dd', ID는 쉼표 없음
   */
  filterable?: boolean;
}

/** UX-14: 보이는 글자로 포함 검색하는 열 필터 */
function withTextFilter<T>(c: ColDef<T> | ColGroupDef<T>): ColDef<T> | ColGroupDef<T> {
  if ('children' in c) return { ...c, children: c.children.map(withTextFilter) };
  if (!c.field || c.filter !== undefined) return c;
  const fmt = typeof c.valueFormatter === 'function' ? c.valueFormatter : undefined;
  return {
    ...c,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    suppressFloatingFilterButton: true,
    filterParams: { filterOptions: ['contains'], maxNumConditions: 1 },
    filterValueGetter: p => {
      const v = (p.data as Record<string, unknown> | undefined)?.[c.field as string];
      if (v === undefined || v === null) return '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fmt ? String(fmt({ ...p, value: v } as any) ?? '') : String(v);
    },
  };
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

/** AG Grid 기본 영어 문구 → 한글. 렌더마다 새 객체가 되지 않게 모듈에 둔다(화면에서 localeText를 주면 그쪽이 우선) */
const LOCALE_TEXT = { noRowsToShow: '조회된 내용이 없습니다.' };

const sumOf =(rows: Record<string, unknown>[], f: string) => rows.reduce((s, r) => s + (Number(r[f]) || 0), 0);

export function BaseGrid<T>({
  gridRef,
  rowNumber = true,
  density = 'normal',
  sortable = false,
  zebra = true,
  headerColor,
  sumRow,
  vCenter = true,
  wrapperStyle,
  filterable = false,
  columnDefs,
  defaultColDef,
  rowData,
  getRowClass,
  onSortChanged,
  onFilterChanged,
  onRowDataUpdated,
  ...rest
}: BaseGridProps<T>) {
  const cols = useMemo<(ColDef<T> | ColGroupDef<T>)[]>(() => {
    const data = filterable ? (columnDefs ?? []).map(withTextFilter) : [...(columnDefs ?? [])];
    return rowNumber ? [rowNumberCol as ColDef<T>, ...data] : data;
  }, [rowNumber, columnDefs, filterable]);

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
    sumRow.count?.forEach(f => (total[f] = rows.length));
    return [total as T];
  }, [sumRow, rowData]);

  const rowClass = useCallback(
    (p: RowClassParams<T>) => {
      const own = getRowClass?.(p);
      return p.node.rowPinned === 'bottom' && sumRow ? ['summary-row', ...([] as string[]).concat(own ?? [])] : own;
    },
    [getRowClass, sumRow],
  );

  const theme = useMemo(() => {
    const t = headerColor ? gridThemeWithHeader(density, headerColor) : gridThemes[density];
    return zebra ? t : t.withParams({ oddRowBackgroundColor: 'transparent' });
  }, [density, headerColor, zebra]);

  // 정렬·필터·데이터 교체 후 행번호 다시 그리기 (getRowId로 행을 재사용하면 순서가 바뀌어도 셀이 그대로 남는다)
  const refreshRowNum = (api: SortChangedEvent<T>['api']) => {
    if (rowNumber) api.refreshCells({ columns: [ROWNUM_ID], force: true });
  };

  return (
    <div className={vCenter ? 'gb-vcenter' : undefined} style={{ flex: '1 1 0', minHeight: 0, height: '100%', width: '100%', ...cssVars, ...wrapperStyle }}>
      <AgGridReact<T>
        ref={gridRef}
        theme={theme}
        columnDefs={cols}
        defaultColDef={colDef}
        rowData={rowData}
        localeText={LOCALE_TEXT}
        animateRows={false}
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
        onRowDataUpdated={(e: RowDataUpdatedEvent<T>) => {
          refreshRowNum(e.api);
          onRowDataUpdated?.(e);
        }}
        {...rest}
      />
    </div>
  );
}
