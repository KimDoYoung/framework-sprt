import { useMemo, type RefObject } from 'react';
import type { AgGridReact } from 'ag-grid-react';
import type { CellFocusedEvent, ColDef, GridOptions, RowDoubleClickedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { BaseGrid, type BaseGridProps } from './BaseGrid';
import { ActionCell } from './renderers';

/**
 * GridType 4종 — 이름이 곧 ID다. yunhee 변환 명세가 "GridType: SingleGrid"처럼 지정하면 그 컴포넌트를 쓴다 (docs/grid-types.md).
 *
 * | GridType      | AS-IS 신호                                   |
 * | SingleGrid    | 편집기 없음, setChecked 없음                  |
 * | MultiGrid     | setChecked(MULTI/SIMPLE), 편집기 없음         |
 * | CellEditGrid  | addXxx(…, IsField) 편집기 있음                |
 * | ModalEditGrid | 편집기 없음 + 더블클릭/수정 버튼 → *_Edit_* 팝업 |
 */

/** 1개 선택, 읽기 전용. 클릭·방향키로 선택이 바뀌면 onSelect (AS-IS SelectionChanged) */
export interface SingleGridProps<T> extends BaseGridProps<T> {
  onSelect?: (row: T | undefined) => void;
}

export function SingleGrid<T>({ onSelect, onSelectionChanged, onCellFocused, ...rest }: SingleGridProps<T>) {
  return (
    <BaseGrid<T>
      rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
      onSelectionChanged={(e: SelectionChangedEvent<T>) => {
        onSelect?.(e.api.getSelectedRows()[0]);
        onSelectionChanged?.(e);
      }}
      // 방향키로 셀 이동 시 그 행을 선택 (GXT GridSelectionModel과 같게)
      onCellFocused={(e: CellFocusedEvent<T>) => {
        if (e.rowIndex != null && e.rowPinned == null) {
          const node = e.api.getDisplayedRowAtIndex(e.rowIndex);
          if (node && !node.isSelected()) node.setSelected(true, true);
        }
        onCellFocused?.(e);
      }}
      {...rest}
    />
  );
}

/** 체크박스 다중 선택, 읽기 전용. 체크가 바뀌면 onCheckedChange */
export interface MultiGridProps<T> extends BaseGridProps<T> {
  onCheckedChange?: (rows: T[]) => void;
}

export function MultiGrid<T>({ onCheckedChange, onSelectionChanged, ...rest }: MultiGridProps<T>) {
  return (
    <BaseGrid<T>
      rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false }}
      onSelectionChanged={(e: SelectionChangedEvent<T>) => {
        onCheckedChange?.(e.api.getSelectedRows());
        onSelectionChanged?.(e);
      }}
      {...rest}
    />
  );
}

/**
 * 셀 편집 + 체크박스(삭제용) + Enter↓ / Tab→. `useGridCrud` 결과를 crud로 넘긴다.
 *   const crud = useGridCrud<Role>({...});
 *   <CellEditGrid crud={crud} columnDefs={[gb.text('roleNm', 200, '*권한명', { editor: 'text' })]} />
 */
export interface CellEditGridProps<T> extends BaseGridProps<T> {
  crud: { gridRef: RefObject<AgGridReact<T> | null>; gridProps: GridOptions<T> };
}

export function CellEditGrid<T>({ crud, ...rest }: CellEditGridProps<T>) {
  return <BaseGrid<T> gridRef={crud.gridRef} {...(crud.gridProps as BaseGridProps<T>)} {...rest} />;
}

/** 1개 선택 + 행 더블클릭(또는 수정 버튼 컬럼)으로 onEdit → 모달에서 편집 */
export interface ModalEditGridProps<T> extends BaseGridProps<T> {
  onEdit: (row: T) => void;
  onSelect?: (row: T | undefined) => void;
  /** 맨 뒤에 수정 버튼 컬럼 추가 (true면 '수정') */
  editButton?: boolean | string;
}

export function ModalEditGrid<T>({ onEdit, editButton, columnDefs, onRowDoubleClicked, ...rest }: ModalEditGridProps<T>) {
  const cols = useMemo(() => {
    if (!editButton) return columnDefs;
    const action: ColDef<T> = {
      colId: '__edit',
      headerName: '',
      width: 70,
      sortable: false,
      resizable: false,
      cellRenderer: ActionCell,
      cellRendererParams: { label: editButton === true ? '수정' : editButton, onClick: onEdit },
    };
    return [...(columnDefs ?? []), action];
  }, [columnDefs, editButton, onEdit]);

  return (
    <SingleGrid<T>
      columnDefs={cols}
      onRowDoubleClicked={(e: RowDoubleClickedEvent<T>) => {
        if (e.data && e.node.rowPinned == null) onEdit(e.data);
        onRowDoubleClicked?.(e);
      }}
      {...rest}
    />
  );
}
