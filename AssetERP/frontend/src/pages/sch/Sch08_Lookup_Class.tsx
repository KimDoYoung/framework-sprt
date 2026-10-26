/**
 * 스케줄분류 추가 창 (O01) — Sch01_Lookup_Info의 [분류추가]에서 연다
 * AS-IS: myApp/client/vi/sch/Sch08_Lookup_Class.java (257줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L62-96: 모달 650×500 "스케줄분류 추가", 위 툴바 50([행 추가][행 삭제] + 새로고침 아이콘), 그리드(체크 다중 + 셀 편집: 분류 200 · 조회순서 70 · 비고 150 · 사용 70),
 *   아래 가운데 [저장][닫기]. 삭제는 화면에서만 빼 두었다가 [저장]에서 서버에 보낸다(deleteList)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch08Class } from '@/types/sch';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<Sch08Class>();
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

interface Props {
  open: boolean;
  /** updateEnd() L248-252: callback.execute(null) — 저장·삭제가 끝난 뒤. 부른 쪽이 분류 콤보를 다시 읽는다 */
  onSaved: () => void;
  /** [닫기] — hide() */
  onClose: () => void;
}

export const Sch08_Lookup_Class: React.FC<Props> = ({ open, onSaved, onClose }) => {
  const user = useLoginUser();
  // deleteList: [행 삭제]로 화면에서 뺀 기존 행. [저장]에서 서버에 보낸다
  const deleteList = useRef<number[]>([]);
  const [deleteCount, setDeleteCount] = useState(0);

  const crud = useGridCrud<Sch08Class>({
    idField: 'classId',
    search: schApi.searchClasses,
    save: useCallback(async () => [], []),
    remove: useCallback(async () => 0, []),
    // insertRow() L151-158: personId = 로그인 사용자, useYn = true
    newRow: () => ({ personId: user.userId, useYn: true }),
    firstEditField: 'className',
  });
  const { retrieve: retrieveRows } = crud;

  // retrieve() L137-149: deleteList.clear() 뒤 sch.Sch08_Class.selectByPersonId — 새로고침 아이콘(E1)도 같다
  const retrieve = useCallback(async () => {
    deleteList.current = [];
    setDeleteCount(0);
    await retrieveRows();
  }, [retrieveRows]);

  // open() L62-96 → setting(), show(), retrieve()
  useEffect(() => {
    if (open) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] insertButton[행 추가].Select (L99) → insertRow() — crud.addRow (항상 맨 아래, 03 원칙 17)

  // [E3] deleteButton[행 삭제].Select (L105) → deleteRow() L160-180: 선택한 행마다 sch.Sch08_Class.checkClassId(사용 이력 체크) → 통과하면 deleteList에 담고 화면에서 뺀다.
  //   사용 중이면 서버 메시지("사용중인 분류는 삭제 불가합니다")를 보이고 중단. (원본은 행별로 따로 불러 먼저 통과한 행만 빠지고 deleteList를 비우는 비동기 꼬임이 있어, 여기서는 모두 통과해야 뺀다)
  const deleteRow = async () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    const saved = selected.filter(r => r.classId > 0);
    try {
      for (const row of saved) await schApi.checkClassDelete(row.classId);
    } catch (err) {
      message.warning(errorMessage(err, '삭제할 수 없습니다'));
      return;
    }
    deleteList.current = [...deleteList.current, ...saved.map(r => r.classId)];
    setDeleteCount(deleteList.current.length);
    crud.removeRows(selected.map(r => r.classId));
  };

  // [E4] updateButton[저장].Select (L111) → preUpdate() L182-209 → update() L211-246
  const preUpdate = async () => {
    const changed = crud.getChanged();
    if (changed.length + deleteList.current.length === 0) {
      message.warning('저장 및 삭제 내역이 없습니다.');
      return;
    }
    for (const row of changed) {
      if (!row.className) {
        message.warning('분류를 입력하세요');
        return;
      }
      if (row.seq == null) {
        message.warning('조회순서를 입력하세요');
        return;
      }
    }
    try {
      if (changed.length > 0) await schApi.saveClasses(changed);
      if (deleteList.current.length > 0) await schApi.deleteClasses(deleteList.current);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('저장이 완료되었습니다');
    await retrieve();
    onSaved();
  };

  // buildGrid() L125-135: 체크 다중, 분류 200(편집) · 조회순서 70(편집) · 비고 150(편집) · 사용 70(체크 편집)
  const columnDefs = useMemo(() => [
    gb.text('className', 200, '분류', { editor: 'text' }),
    gb.longCenter('seq', 70, '조회순서', { editor: 'number' }),
    gb.text('note', 150, '비고', { editor: 'text' }),
    gb.boolean('useYn', 70, '사용', { editable: true }),
  ], []);

  const saveCount = { ...crud.changes, modified: crud.changes.modified + deleteCount };

  return (
    <LookupModal
      open={open}
      title="스케줄분류 추가"
      width={720}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Button type="save" count={saveCount} onClick={preUpdate}>저장</Button>
          {/* [E5] cancelButton[닫기].Select (L117) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 340 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button type="addRow" onClick={() => crud.addRow()}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          {/* [E1] anchor.MouseDown (L74) → retrieve() */}
          <ReloadOutlined style={{ cursor: 'pointer' }} onMouseDown={() => void retrieve()} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Sch08Class> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
        </div>
      </div>
    </LookupModal>
  );
};
