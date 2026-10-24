/**
 * 책무 세부내용 창 (N05) — 책무 등록의 세부내용 건수 옆 편집 아이콘, 책무 편집창의 [세부내용(n건)]이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm12_Lookup_TaskRelateDetail.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 850×550(원본) → 열 합계(550+80+80+70+선택·행번호 60+여백 130) 기준 970: 툴바([조회][등록][저장][삭제] · 오른쪽 [변경이력]) + 세부내용 그리드(CellEditGrid) + [닫기]
 * 저장·삭제는 변경사유·삭제사유를 받아 변경이력과 함께 처리한다 (서버가 DB 함수로 이력 생성)
 * UX보강(10): 조회창(UX-05·06은 CRUD 그리드라 행 클릭 선택 미적용), 저장 버튼 UX-03
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmTaskDetail } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Tdm95_Lookup_ChangeHistory } from './Tdm95_Lookup_ChangeHistory';

const gb = gbFor<TdmTaskDetail>();

interface Props {
  /** 값이 있으면 열림 — AS-IS open(taskModel, callback) 의 taskId·책무명 */
  task: { taskId: number; taskName: string | null } | null;
  /** AS-IS callback.execute(grid.getStore().getAll().size()) — 닫을 때 세부내용 건수. 닫기는 이 함수가 끝나고 onClose */
  onClosed: (count: number) => void;
  onClose: () => void;
}

type Pending = { kind: 'save' } | { kind: 'delete'; ids: number[] } | null;

export const Tdm12_Lookup_TaskRelateDetail: React.FC<Props> = ({ task, onClosed, onClose }) => {
  const taskId = task?.taskId;
  const [reasonFor, setReasonFor] = useState<Pending>(null);
  const [history, setHistory] = useState<{ targetId: number | null } | null>(null);
  const reasonRef = useRef<string | null>(null);

  const crud = useGridCrud<TdmTaskDetail>({
    idField: 'taskRelateDetailId',
    // retrieve() L187-197: tdm.Tdm12_TaskRelateDetail.selectByTaskId
    search: useCallback(async () => (taskId ? tdmApi.searchTaskDetails(taskId) : []), [taskId]),
    save: useCallback((rows: TdmTaskDetail[]) => tdmApi.saveTaskDetails(rows, reasonRef.current), []),
    remove: useCallback((ids: number[]) => tdmApi.deleteTaskDetails(ids, reasonRef.current ?? ''), []),
    newRow: useCallback((): Partial<TdmTaskDetail> => ({ taskId, useYn: 'true' }), [taskId]),   // insertRow() L294-303
    firstEditField: 'content',
    // preUpdate() L199-250
    validate: changed => {
      for (const r of changed) {
        if (!r.content) return '책무 세부내용을 입력하세요';
        if (r.seq == null) return '조회순서를 입력하세요';
      }
      return undefined;
    },
  });
  const { retrieve, clear } = crud;

  // [E0] 화면 열림 (생성자 L78-110) → settings(), show() / open(taskModel, callback) → retrieve() L70-76
  useEffect(() => { if (taskId) void retrieve(); else clear(); }, [taskId]);   // eslint-disable-line react-hooks/exhaustive-deps

  // 열 buildGrid() L168-185
  const columnDefs = [
    gb.textArea('content', 550, '책무 세부내용', { editor: 'largeText' }),  // L180
    gb.longCenter('seq', 80, '조회순서', { editor: 'number' }),  // L181
    gb.boolean('useYn', 80, '사용여부', { editable: true }),  // L182
    // L183 historyCell(ImageCell "View") → Tdm95_Lookup_ChangeHistory.open("tdm12_task_relate_detail", 그 행의 ID)
    iconCell<TdmTaskDetail>('view', 'history', 70, '변경이력 ', row => setHistory({ targetId: row.taskRelateDetailId > 0 ? row.taskRelateDetailId : null })),
  ];

  // [E3] updateButton[저장].Select (L125) → preUpdate(): 검사 뒤, 기존 행을 고쳤으면 변경사유를 받고(L253-274) 저장(update L280-292)
  const preUpdate = () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    if (changed.length === 0) {
      message.warning('변경내역이 없습니다');
      return;
    }
    const invalid = changed.map(r => (!r.content ? '책무 세부내용을 입력하세요' : r.seq == null ? '조회순서를 입력하세요' : undefined)).find(Boolean);
    if (invalid) {
      message.warning(invalid);
      return;
    }
    if (changed.some(r => r.taskRelateDetailId > 0)) {
      setReasonFor({ kind: 'save' });
    } else {
      reasonRef.current = null;
      void crud.saveRows();
    }
  };

  // [E4] deleteButton[삭제].Select (L131) → deleteChk() L305-361: 사용이력 검사 → "n건을 삭제하시겠습니까?" → 삭제사유 → deleteRow()
  const deleteChk = async () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    const savedIds = selected.map(r => r.taskRelateDetailId).filter(id => id > 0);
    try {
      if (savedIds.length > 0 && (await tdmApi.countTaskDetailUse(savedIds)) !== 0) {
        message.warning('사용이력이 있는 책무 세부내용은 삭제 할 수 없습니다');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    // [E8] msgBox.DialogHide [YES] (L325) → 삭제사유 입력
    Modal.confirm({
      title: '삭제',
      content: `${selected.length}건을 삭제하시겠습니까?`,
      width: 300,
      onOk: () => setReasonFor({ kind: 'delete', ids: selected.map(r => r.taskRelateDetailId) }),
    });
  };

  const onReason = async (text: string | null) => {
    const pending = reasonFor;
    if (!pending) return;
    if (text == null) {
      message.warning(pending.kind === 'save' ? '저장이 취소되었습니다 (사유 미입력)' : '삭제가 취소되었습니다 (사유 미입력)');
      return;
    }
    reasonRef.current = text;
    if (pending.kind === 'save') {
      await crud.saveRows();
    } else {
      // deleteRow(historyMap) L363-380: 저장된 행만 서버에서 지우고, 화면에서는 모두 뺀다
      const saved = pending.ids.filter(id => id > 0);
      try {
        if (saved.length > 0) await tdmApi.deleteTaskDetails(saved, text);
        crud.removeRows(pending.ids);
        message.success(`${pending.ids.length}건 삭제되었습니다.`);
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
      }
    }
  };

  // [E5] closeButton[닫기].Select [선택>0] (L137) / [E6] messageBox.DialogHide (L142): 반영 안 된 변경이 있으면 확인 뒤 callback(건수) + hide()
  const closeWindow = () => {
    const done = () => { onClosed(crud.rows.length); onClose(); };
    if (crud.hasChanges()) {
      Modal.confirm({
        title: '확인',
        content: <>반영되지 않은 변경사항이 존재합니다.<br />저장하지 않고 닫으시겠습니까?</>,
        width: 350,
        onOk: done,
      });
    } else {
      done();
    }
  };

  return (
    <LookupModal
      open={!!task}
      title={`책무명 : ${task?.taskName ?? '없음'}`}
      width={970}
      closable={false}
      maskClosable={false}
      onCancel={closeWindow}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="close" onClick={closeWindow}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            {/* [E1] retrieveButton[조회].Select (L113) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {/* [E2] insertButton[등록].Select (L119) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            <Button type="save" count={crud.changes} onClick={preUpdate}>저장</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </Space>
          {/* [E7] historyButton[변경이력].Select (L159) → Tdm95_Lookup_ChangeHistory.open("tdm12_task_relate_detail") */}
          <Button type="change" onClick={() => setHistory({ targetId: null })}>변경이력</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TdmTaskDetail> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <AreaMessage
        open={!!reasonFor}
        title={reasonFor?.kind === 'delete' ? '삭제사유' : '변경사유'}
        required
        onResult={onReason}
        onClose={() => setReasonFor(null)}
      />
      <Tdm95_Lookup_ChangeHistory targetTable={history ? 'tdm12_task_relate_detail' : null} targetId={history?.targetId} onClose={() => setHistory(null)} />
    </LookupModal>
  );
};
