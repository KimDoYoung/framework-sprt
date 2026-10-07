import { useCallback, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import type { CellValueChangedEvent, ColDef, GetRowIdParams, GridOptions } from 'ag-grid-community';
import { errorMessage } from '../api/client';

/**
 * 그리드 CRUD 공통 훅 (AS-IS GridRetrieveData / GridInsertRow / GridUpdate / GridDeleteData).
 * 행 ID는 숫자이고, 행추가 행은 임시 음수 ID(-1, -2, …)를 가진다 — 서버는 0 이하 ID를 신규로 INSERT 한다.
 *
 * 사용법: `const crud = useGridCrud({...})` → `<AgGridReact ref={crud.gridRef} columnDefs={…} {...crud.gridProps} />`,
 * 버튼에 `crud.retrieve / addRow / saveRows / deleteChecked`. 편집 컬럼은 `editableCol({...})`로 만든다.
 * Lookup으로 행을 넣을 때는 `addRows([...])`, 셀 값을 코드로 바꿀 때는 `updateRow(id, patch)`.
 */
export interface GridCrudOptions<T> {
  /** 숫자 ID 필드 */
  idField: keyof T & string;
  search: () => Promise<T[]>;
  /** 추가·변경된 행 → 저장된 행(요청과 같은 순서) */
  save: (rows: T[]) => Promise<T[]>;
  remove: (ids: number[]) => Promise<unknown>;
  /** 행추가 시 기본값 (ID는 훅이 넣는다) */
  newRow: () => Omit<T, keyof T & string> | Partial<T>;
  /** 행추가 후 편집을 시작할 컬럼 */
  firstEditField?: string;
  /** 저장 전 검사. 메시지를 돌려주면 저장하지 않는다 */
  validate?: (changed: T[], all: T[]) => string | undefined;
  /** 삭제 확인 문구. 함수면 체크한 행 수를 받는다 (AS-IS "n건을 삭제하시겠습니까?") */
  deleteConfirm?: string | ((count: number) => string);
  /** 저장 응답이 저장된 행이 아니라 목록 전체일 때: 제자리 교체 대신 다시 조회 */
  reloadAfterSave?: boolean;
  /** 저장·삭제 후 (목록 밖의 화면 갱신용) */
  onChanged?: () => void;
}

/** 편집 가능한 컬럼 (파란색 글자). editable: false를 주면 그대로 둔다 (권한에 따라 읽기 전용) */
export const editableCol = <T,>(col: ColDef<T>): ColDef<T> =>
  col.editable === false
    ? col
    : { editable: true, ...col, cellStyle: { color: '#1677ff', ...(col.cellStyle as object) } };

export function useGridCrud<T extends object>(options: GridCrudOptions<T>) {
  const { idField, search, save, remove, newRow, firstEditField, validate, deleteConfirm, reloadAfterSave, onChanged } = options;
  const gridRef = useRef<AgGridReact<T>>(null);
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const dirty = useRef(new Set<number>());
  const tempSeq = useRef(0);

  const getId = useCallback((row: T) => row[idField] as unknown as number, [idField]);

  const retrieve = useCallback(async () => {
    gridRef.current?.api?.stopEditing(true);
    setLoading(true);
    try {
      const data = await search();
      dirty.current.clear();
      setRows(data);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [search]);

  /**
   * 선택(포커스) 행 바로 아래에 임시 행들을 넣는다. inits는 행마다 newRow()에 덮어쓸 값(Lookup에서 고른 사원 등).
   * 한 행만 넣으면 firstEditField 편집을 시작한다.
   */
  const addRows = useCallback((inits: Partial<T>[] = [{}]) => {
    const api = gridRef.current?.api;
    api?.stopEditing();
    const added = inits.map(init => ({ ...newRow(), ...init, [idField]: --tempSeq.current } as T));
    const focused = api?.getFocusedCell();
    const focusedRow = focused ? api?.getDisplayedRowAtIndex(focused.rowIndex)?.data : undefined;
    added.forEach(r => dirty.current.add(getId(r)));
    setRows(prev => {
      const at = focusedRow ? prev.findIndex(r => getId(r) === getId(focusedRow)) : -1;
      return at < 0 ? [...prev, ...added] : [...prev.slice(0, at + 1), ...added, ...prev.slice(at + 1)];
    });
    if (added.length !== 1) return;
    const tempId = getId(added[0]);
    setTimeout(() => {
      const rowIndex = api?.getRowNode(String(tempId))?.rowIndex;
      if (api && rowIndex != null && firstEditField) {
        api.ensureIndexVisible(rowIndex);
        api.setFocusedCell(rowIndex, firstEditField);
        api.startEditingCell({ rowIndex, colKey: firstEditField });
      }
    });
  }, [newRow, idField, getId, firstEditField]);

  const addRow = useCallback(() => addRows(), [addRows]);

  /** 코드로 행 값을 바꾼다 (Lookup 선택 등). 변경 행으로 표시된다 */
  const updateRow = useCallback((id: number, patch: Partial<T>) => {
    dirty.current.add(id);
    setRows(prev => prev.map(r => (getId(r) === id ? { ...r, ...patch } : r)));
  }, [getId]);

  /** 목록 비우기 (마스터 선택 해제 시) */
  const clear = useCallback(() => {
    dirty.current.clear();
    setRows([]);
  }, []);

  /** 추가·변경된 행만 저장하고, 저장된 행으로 제자리 교체(재조회하지 않음) */
  const saveRows = useCallback(async () => {
    gridRef.current?.api?.stopEditing();
    const changed = rows.filter(r => dirty.current.has(getId(r)));
    if (changed.length === 0) {
      message.info('저장할 내용이 없습니다.');
      return;
    }
    const invalid = validate?.(changed, rows);
    if (invalid) {
      message.warning(invalid);
      return;
    }
    setLoading(true);
    try {
      const saved = await save(changed);
      if (reloadAfterSave) {
        dirty.current.clear();
        setRows(await search());
      } else {
        const replace = new Map(changed.map((r, i) => [getId(r), saved[i]]));
        replace.forEach((_, id) => dirty.current.delete(id));
        setRows(prev => prev.map(r => replace.get(getId(r)) ?? r));
      }
      message.success(`${changed.length}건 저장되었습니다.`);
      onChanged?.();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setLoading(false);
    }
  }, [rows, getId, validate, save, reloadAfterSave, search, onChanged]);

  /** 체크된 행 삭제 (확인 후). 임시 행은 서버 호출 없이 뺀다 */
  const deleteChecked = useCallback(() => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: (typeof deleteConfirm === 'function' ? deleteConfirm(checked.length) : deleteConfirm) ?? '선택한 행을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        const ids = checked.map(getId);
        const savedIds = ids.filter(id => id > 0);
        try {
          if (savedIds.length > 0) await remove(savedIds);
          const removed = new Set(ids);
          removed.forEach(id => dirty.current.delete(id));
          setRows(prev => prev.filter(r => !removed.has(getId(r))));
          message.success(`${ids.length}건 삭제되었습니다.`);
          if (savedIds.length > 0) onChanged?.();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  }, [getId, remove, deleteConfirm, onChanged]);

  const onCellValueChanged = useCallback((e: CellValueChangedEvent<T>) => {
    if (e.data && e.oldValue !== e.newValue) dirty.current.add(getId(e.data));
  }, [getId]);

  const gridProps: GridOptions<T> = {
    rowData: rows,
    loading,
    getRowId: (p: GetRowIdParams<T>) => String(getId(p.data)),
    onCellValueChanged,
    rowSelection: { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false },
    // Enter → 아래 행 같은 컬럼, Tab → 오른쪽 셀(기본)
    enterNavigatesVertically: true,
    enterNavigatesVerticallyAfterEdit: true,
    stopEditingWhenCellsLoseFocus: true,
  };

  /** 저장하지 않은 추가·변경 행이 있는지 (AS-IS grid.getStore().getModifiedRecords().size() > 0) */
  const hasChanges = useCallback(() => dirty.current.size > 0, []);

  return { gridRef, rows, loading, retrieve, addRow, addRows, updateRow, clear, saveRows, deleteChecked, hasChanges, gridProps };
}
