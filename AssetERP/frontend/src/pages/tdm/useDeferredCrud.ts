/**
 * 연결창(Tdm21·22·23 RoleRelate…)이 같이 쓰는 "삭제는 화면에서만 빼 두었다가 [저장]에서 서버에 보낸다" 흐름 (N08).
 * AS-IS: 각 창의 retrieve() deleteList.clear() · deleteRow() · update() · closeButton 확인(E5·E6).
 * useGridCrud를 쓰되 저장·삭제는 화면이 직접 부른다.
 */
import { useCallback, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { errorMessage } from '@/api/client';
import { useGridCrud } from '@/hooks/useGridCrud';

interface Options<T extends object> {
  idField: keyof T & string;
  search: () => Promise<T[]>;
  newRow?: () => Partial<T>;
}

export function useDeferredCrud<T extends object>({ idField, search, newRow }: Options<T>) {
  const deleteList = useRef<number[]>([]);
  const [deleteCount, setDeleteCount] = useState(0);
  const crud = useGridCrud<T>({
    idField,
    search,
    save: useCallback(async () => [], []),
    remove: useCallback(async () => 0, []),
    newRow: newRow ?? (() => ({})),
  });
  const { retrieve: retrieveRows } = crud;

  const idOf = (r: T) => Number((r as Record<string, unknown>)[idField]);

  /** retrieve(): deleteList.clear() 뒤 조회 */
  const retrieve = useCallback(async () => {
    deleteList.current = [];
    setDeleteCount(0);
    try {
      await retrieveRows();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [retrieveRows]);

  const reset = useCallback(() => {
    crud.clear();
    deleteList.current = [];
    setDeleteCount(0);
  }, [crud.clear]);   // eslint-disable-line react-hooks/exhaustive-deps

  /** deleteRow(): 미선택 "삭제할 내역을 선택하세요", 아니면 deleteList에 담고 화면에서 뺀다 */
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제할 내역을 선택하세요');
      return;
    }
    const ids = selected.map(idOf);
    deleteList.current = [...deleteList.current, ...ids.filter(id => id > 0)];
    setDeleteCount(deleteList.current.length);
    crud.removeRows(ids);
  };

  /**
   * update(): 변경이 없으면 "변경된 내역이 없습니다", validate가 문구를 주면 그것을 보이고 중단,
   * 저장(save) → 삭제(remove) 순서, 끝나면 "저장이 완료되었습니다" 뒤 retrieve()
   */
  const commit = async (opts: {
    validate?: (changed: T[], all: T[]) => string | undefined;
    save: (changed: T[]) => Promise<unknown>;
    remove: (ids: number[]) => Promise<unknown>;
  }) => {
    const changed = crud.getChanged();
    if (changed.length === 0 && deleteList.current.length === 0) {
      message.warning('변경된 내역이 없습니다');
      return;
    }
    const msg = opts.validate?.(changed, crud.rows);
    if (msg) {
      message.warning(msg);
      return;
    }
    try {
      if (changed.length > 0) await opts.save(changed);
      if (deleteList.current.length > 0) await opts.remove(deleteList.current);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('저장이 완료되었습니다');
    await retrieve();
  };

  /** [닫기]: 반영 안 된 변경이 있으면 확인(450) 뒤 행 수를 돌려주고 닫는다 */
  const close = (onClose: (count: number) => void) => {
    if (deleteList.current.length > 0 || crud.hasChanges()) {
      Modal.confirm({
        title: '확인',
        content: '반영되지 않은 변경사항이 존재합니다. 그냥 닫으시겠습니까?',
        width: 450,
        onOk: () => onClose(crud.rows.length),
      });
    } else {
      onClose(crud.rows.length);
    }
  };

  /** 저장 버튼 UX-03 건수 (삭제 대기 포함) */
  const saveCount = { ...crud.changes, modified: crud.changes.modified + deleteCount };

  return { crud, retrieve, reset, deleteRow, commit, close, saveCount };
}
