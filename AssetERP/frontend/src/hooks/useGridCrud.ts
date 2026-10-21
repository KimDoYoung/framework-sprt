import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import type { CellClassParams, CellValueChangedEvent, ColDef, GetRowIdParams, GridOptions, RowClassParams } from 'ag-grid-community';
import type { ChangeCount } from '../components/button';
import { errorMessage } from '../api/client';

/**
 * 그리드 CRUD 공통 훅 (AS-IS GridRetrieveData / GridInsertRow / GridUpdate / GridDeleteData).
 * 행 ID는 숫자이고, 행추가 행은 임시 음수 ID(-1, -2, …)를 가진다 — 서버는 0 이하 ID를 신규로 INSERT 한다.
 *
 * 사용법: `const crud = useGridCrud({...})` → `<AgGridReact ref={crud.gridRef} columnDefs={…} {...crud.gridProps} />`,
 * 버튼에 `crud.retrieve / addRow / saveRows / deleteChecked`. 편집 컬럼은 `editableCol({...})`로 만든다.
 * Lookup으로 행을 넣을 때는 `addRows([...])`, 셀 값을 코드로 바꿀 때는 `updateRow(id, patch)`.
 * 저장 버튼은 UX-03(10-UX보강)으로 `<Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>`.
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
  /**
   * 행추가 위치 (03 원칙 17). 기본 'last' = 항상 맨 아래. 'first' = 맨 위, 'afterSelected' = 선택한 행 아래(없으면 포커스된 행, 그것도 없으면 맨 아래 — AS-IS GridInsertRow 기본).
   * 어느 쪽이든 새 행이 화면 밖이면 자동으로 스크롤한다
   */
  insertAt?: 'last' | 'first' | 'afterSelected';
  /** 저장 전 검사. 메시지를 돌려주면 저장하지 않는다 */
  validate?: (changed: T[], all: T[]) => string | undefined;
  /** 삭제 확인 문구. 함수면 체크한 행 수를 받는다 (AS-IS "n건을 삭제하시겠습니까?"). false면 확인 없이 삭제 */
  deleteConfirm?: string | ((count: number) => string) | false;
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
  const { idField, search, save, remove, newRow, firstEditField, insertAt = 'last', validate, deleteConfirm, reloadAfterSave, onChanged } = options;
  const gridRef = useRef<AgGridReact<T>>(null);
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const dirty = useRef(new Set<number>());
  const tempSeq = useRef(0);
  // UX-07 변경 셀 표시: 행ID → (바뀐 필드 → 처음 값). 처음 값으로 되돌리면 표시를 지운다
  const cellDirty = useRef(new Map<number, Map<string, unknown>>());
  // dirty는 ref라 바뀌어도 다시 그려지지 않는다 — UX-03 저장(n) 표시를 위해 바꿀 때마다 version을 올린다
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion(v => v + 1), []);
  const [editing, setEditing] = useState(false);

  const getId = useCallback((row: T) => row[idField] as unknown as number, [idField]);

  const retrieve = useCallback(async () => {
    gridRef.current?.api?.stopEditing(true);
    setLoading(true);
    try {
      const data = await search();
      dirty.current.clear();
      cellDirty.current.clear();
      bump();
      setRows(data);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [search, bump]);

  /**
   * 임시 행들을 insertAt 위치(기본 맨 아래)에 넣고, 화면 밖이면 스크롤한다. inits는 행마다 newRow()에 덮어쓸 값(Lookup에서 고른 사원 등).
   * 한 행만 넣으면 firstEditField 편집을 시작한다.
   * AS-IS GridInsertRow는 행을 store에 넣기만 하고 "변경"으로 치지 않는다 — 셀을 고치거나 콜백에서 record.addChange를 해야
   * GridUpdate(getModifiedRecords)가 보낸다. markDirty: AS-IS가 넣은 뒤 addChange로 값을 채우면 true(Sys05 사원찾기 등),
   * 모델 setter로만 채우면 false(빈 행·기본값 — 아무것도 고치지 않고 저장하면 저장되지 않는다).
   */
  const addRows = useCallback((inits: Partial<T>[] = [{}], markDirty = true) => {
    const api = gridRef.current?.api;
    api?.stopEditing();
    const added = inits.map(init => ({ ...newRow(), ...init, [idField]: --tempSeq.current } as T));
    if (added.length === 0) return;
    // afterSelected만 기준 행이 필요하다: 선택한 행 → 없으면 포커스된 행
    let anchor: T | undefined;
    if (insertAt === 'afterSelected') {
      const focused = api?.getFocusedCell();
      anchor = api?.getSelectedRows()[0] ?? (focused ? api?.getDisplayedRowAtIndex(focused.rowIndex)?.data : undefined);
    }
    if (markDirty) { added.forEach(r => dirty.current.add(getId(r))); bump(); }
    setRows(prev => {
      if (insertAt === 'first') return [...added, ...prev];
      const at = anchor ? prev.findIndex(r => getId(r) === getId(anchor!)) : -1;
      return at < 0 ? [...prev, ...added] : [...prev.slice(0, at + 1), ...added, ...prev.slice(at + 1)];
    });
    const lastId = getId(added[added.length - 1]);
    setTimeout(() => {
      // 새 행이 화면 밖이면 보이게 스크롤 (여러 행이면 마지막 행 기준)
      const lastIndex = api?.getRowNode(String(lastId))?.rowIndex;
      if (api && lastIndex != null) api.ensureIndexVisible(lastIndex);
      if (added.length !== 1 || !firstEditField) return;
      const rowIndex = api?.getRowNode(String(getId(added[0])))?.rowIndex;
      if (api && rowIndex != null) {
        api.setFocusedCell(rowIndex, firstEditField);
        api.startEditingCell({ rowIndex, colKey: firstEditField });
      }
    });
  }, [newRow, idField, getId, firstEditField, insertAt, bump]);

  /** [등록] 버튼: 빈 행(newRow 기본값만). 변경으로 치지 않는다 — AS-IS GridInsertRow */
  const addRow = useCallback(() => addRows([{}], false), [addRows]);

  /** UX-07: 셀 값이 처음 값과 달라지면 표시, 같아지면 지운다 */
  const markCell = useCallback((id: number, field: string, oldValue: unknown, newValue: unknown) => {
    const fields = cellDirty.current.get(id) ?? new Map<string, unknown>();
    const orig = fields.has(field) ? fields.get(field) : oldValue;
    if ((orig ?? '') === (newValue ?? '')) fields.delete(field); else fields.set(field, orig);
    if (fields.size > 0) cellDirty.current.set(id, fields); else cellDirty.current.delete(id);
  }, []);

  /** 코드로 행 값을 바꾼다 (Lookup 선택 등). 변경 행으로 표시된다 */
  const updateRow = useCallback((id: number, patch: Partial<T>) => {
    dirty.current.add(id);
    setRows(prev => prev.map(r => {
      if (getId(r) !== id) return r;
      Object.entries(patch).forEach(([f, v]) => markCell(id, f, (r as Record<string, unknown>)[f], v));
      return { ...r, ...patch };
    }));
    bump();
  }, [getId, bump]);

  /** 서버에서 다시 읽은 한 행으로 바꾼다 (AS-IS grid.getStore().update(model) — 조회창을 닫은 뒤 refresh). 변경 표시는 지운다 */
  const replaceRow = useCallback((id: number, row: T) => {
    dirty.current.delete(id);
    cellDirty.current.delete(id);
    bump();
    setRows(prev => prev.map(r => (getId(r) === id ? row : r)));
  }, [getId, bump]);

  /** 목록 비우기 (마스터 선택 해제 시) */
  const clear = useCallback(() => {
    dirty.current.clear();
    cellDirty.current.clear();
    bump();
    setRows([]);
  }, [bump]);

  /** 추가·변경된 행만 저장하고, 저장된 행으로 제자리 교체(재조회하지 않음) */
  const saveRows = useCallback(async () => {
    gridRef.current?.api?.stopEditing();
    const changed = rows.filter(r => dirty.current.has(getId(r)));
    // AS-IS GridUpdate: getModifiedRecords()가 0건이면 서버를 부르지 않고 아무 메시지도 없다
    if (changed.length === 0) return;
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
        cellDirty.current.clear();
        bump();
        setRows(await search());
      } else {
        const replace = new Map(changed.map((r, i) => [getId(r), saved[i]]));
        replace.forEach((_, id) => { dirty.current.delete(id); cellDirty.current.delete(id); });
        bump();
        setRows(prev => prev.map(r => replace.get(getId(r)) ?? r));
      }
      message.success(`${changed.length}건 저장되었습니다.`);
      onChanged?.();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setLoading(false);
    }
  }, [rows, getId, validate, save, reloadAfterSave, search, onChanged, bump]);

  /**
   * 서버를 부르지 않고 행만 뺀다 (AS-IS 삭제를 deleteList에 모았다가 저장 때 보내는 화면 — 거래처 계좌 `Sys17_Grid_CorpAccount`).
   * 부른 쪽이 지운 ID를 기억해 저장 때 보낸다
   */
  const removeRows = useCallback((ids: number[]) => {
    const removed = new Set(ids);
    removed.forEach(id => { dirty.current.delete(id); cellDirty.current.delete(id); });
    bump();
    setRows(prev => prev.filter(r => !removed.has(getId(r))));
  }, [getId, bump]);

  /** 체크된 행 삭제 (확인 후). 임시 행은 서버 호출 없이 뺀다 */
  const deleteChecked = useCallback(() => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    const doDelete = async () => {
      const ids = checked.map(getId);
      const savedIds = ids.filter(id => id > 0);
      try {
        if (savedIds.length > 0) await remove(savedIds);
        const removed = new Set(ids);
        removed.forEach(id => { dirty.current.delete(id); cellDirty.current.delete(id); });
        bump();
        setRows(prev => prev.filter(r => !removed.has(getId(r))));
        message.success(`${ids.length}건 삭제되었습니다.`);
        if (savedIds.length > 0) onChanged?.();
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
      }
    };
    // deleteConfirm: false → 확인 없이 바로 (AS-IS가 확인 창 없이 GridDeleteData를 부르는 화면)
    if (deleteConfirm === false) {
      void doDelete();
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: (typeof deleteConfirm === 'function' ? deleteConfirm(checked.length) : deleteConfirm) ?? '선택한 행을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: doDelete,
    });
  }, [getId, remove, deleteConfirm, onChanged, bump]);

  const onCellValueChanged = useCallback((e: CellValueChangedEvent<T>) => {
    if (!e.data || e.oldValue === e.newValue) return;
    const id = getId(e.data);
    const field = e.colDef.field;
    if (field) markCell(id, field, e.oldValue, e.newValue);
    if (!dirty.current.has(id)) dirty.current.add(id);
    bump();
  }, [getId, bump, markCell]);

  // UX-07: 다시 그려도 값이 안 바뀐 셀은 갱신되지 않으므로 표시 상태가 바뀔 때 셀 클래스를 다시 계산한다
  useEffect(() => { gridRef.current?.api?.refreshCells({ force: true }); }, [version, rows]);

  const gridProps: GridOptions<T> = {
    rowData: rows,
    loading,
    getRowId: (p: GetRowIdParams<T>) => String(getId(p.data)),
    onCellValueChanged,
    // UX-07 변경 표시: 추가 행 = 연초록 행, 수정 행 = 바뀐 셀만 연노랑
    getRowClass: (p: RowClassParams<T>) => (p.data && getId(p.data) <= 0 && dirty.current.has(getId(p.data)) ? 'gb-row-new' : undefined),
    defaultColDef: {
      cellClassRules: {
        'gb-cell-changed': (p: CellClassParams<T>) => {
          const field = p.colDef.field;
          // 추가 행은 행 전체가 초록이므로 셀 표시는 저장된 행(ID > 0)에만 한다
          return !!p.data && !!field && getId(p.data) > 0 && !!cellDirty.current.get(getId(p.data))?.has(field);
        },
      },
    } as ColDef<T>,
    // 셀 편집 중(아직 값이 확정 안 됨)에도 저장(n)을 누를 수 있게 한다 — saveRows가 stopEditing으로 확정한 뒤 모은다
    onCellEditingStarted: () => setEditing(true),
    onCellEditingStopped: () => setEditing(false),
    rowSelection: { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false },
    // Enter → 아래 행 같은 컬럼, Tab → 오른쪽 셀(기본)
    enterNavigatesVertically: true,
    enterNavigatesVerticallyAfterEdit: true,
    stopEditingWhenCellsLoseFocus: true,
  };

  /** 저장하지 않은 추가·변경 행이 있는지 (AS-IS grid.getStore().getModifiedRecords().size() > 0) */
  const hasChanges = useCallback(() => dirty.current.size > 0, []);

  /** 저장하지 않은 추가·변경 행 (AS-IS grid.getStore().getModifiedRecords() — 저장 전 검사·Lookup 전 검사용) */
  const getChanged = useCallback(() => rows.filter(r => dirty.current.has(getId(r))), [rows, getId]);

  /** UX-03 저장(n): 저장하지 않은 추가(임시 음수 ID)·수정 행 수. 셀 편집 중이면 editing=true(버튼을 끄지 않음) */
  const changes = useMemo<ChangeCount>(() => {
    let added = 0;
    let modified = 0;
    rows.forEach(r => {
      if (!dirty.current.has(getId(r))) return;
      if (getId(r) <= 0) added++; else modified++;
    });
    return { added, modified, editing };
  }, [rows, getId, editing, version]);  // eslint-disable-line react-hooks/exhaustive-deps

  return { gridRef, rows, loading, retrieve, addRow, addRows, updateRow, replaceRow, removeRows, clear, saveRows, deleteChecked, hasChanges, getChanged, changes, gridProps };
}
