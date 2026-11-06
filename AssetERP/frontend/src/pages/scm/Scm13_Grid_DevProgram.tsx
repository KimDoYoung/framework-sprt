/**
 * 변경프로그램 그리드 (EE17) — Scm11_Edit_DevStep 아래 왼쪽(570×220)
 * AS-IS: myApp/client/vi/scm/Scm13_Grid_DevProgram.java (108줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprStepGrid() L47-69 (체크 없음, 한 줄 선택): 구분 100 · 프로그램ID 310 · 배포순서 60 · [소스] 30(→ Scm13_Edit_DevProgram.edit, 저장하면 다시 조회)
 * retrieve(devStepModel) L36-45: scm.Scm13_DevProgram.selectByDevId(devId)
 * [E1] actionCell.callbackOnCreate (L52) → retrieve() — 편집창에서 저장한 뒤
 * [E2] msgBox.DialogHide [YES] (L74) → deleteRow() L71-103: 확인창 "삭제하시겠습니까?" → scm.Scm30_Program.updateUseYn(programId, false) → scm.Scm13_DevProgram.delete(선택한 줄)
 *   (색인은 "호출처 없음/도달 불가"로 표시했지만 Scm11_Edit_DevStep.deleteButton13이 checkMyTurn 통과 뒤 deleteRow()를 부른다 — 구현한다)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { DevProgram } from '@/types/scm';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Scm13_Edit_DevProgram } from './Scm13_Edit_DevProgram';

const gb = gbFor<DevProgram>();

export interface ScmDevProgramHandle {
  retrieve: () => Promise<void>;
  /** deleteRow() L71-103 — 선택한 줄을 확인 뒤 지운다 */
  deleteRow: () => void;
}

interface Props {
  /** retrieve(devStepModel) — 개발 번호. null이면 비운다(clear) */
  devId: number | null;
  /** 편집창의 [저장]이 끝난 뒤 (callback.execute()) */
  onChanged?: () => void;
}

export const Scm13_Grid_DevProgram = forwardRef<ScmDevProgramHandle, Props>(({ devId, onChanged }, ref) => {
  // [E0] 화면 열림 (생성자 L31-34) → 그리드를 가득 채운다 (조회는 부르는 쪽이 retrieve(devStepModel))
  const [rows, setRows] = useState<DevProgram[]>([]);
  const [target, setTarget] = useState<DevProgram | null>(null);

  const retrieve = useCallback(async () => {
    if (devId == null) { setRows([]); return; }
    try {
      setRows(await scmApi.searchDevPrograms(devId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [devId]);

  useEffect(() => { void retrieve(); }, [retrieve]);
  const gridRef = useRef<AgGridReact<DevProgram>>(null);
  const deleteRow = () => {
    const selected = gridRef.current?.api?.getSelectedRows()[0];
    if (!selected) { message.warning('삭제할 변경프로그램을 선택해주세요'); return; }
    Modal.confirm({
      title: '삭제', content: '삭제하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await scmApi.deleteDevProgram(selected.devProgramId as number, selected.programId);
          await retrieve();
          onChanged?.();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };
  useImperativeHandle(ref, () => ({ retrieve, deleteRow }), [retrieve]);  // eslint-disable-line react-hooks/exhaustive-deps

  const columnDefs = useMemo(() => [
    gb.text('programTypeNm', 100, '구분'),
    gb.text('programCd', 310, '프로그램ID'),
    gb.long('deploySeq', 60, '배포순서'),
    iconCell<DevProgram>('edit', 'sourceCell', 30, '소스', setTarget),
  ], []);

  return (
    <>
      <SingleGrid<DevProgram> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.devProgramId)} />
      {/* 소스 아이콘 (L48-59) → Scm13_Edit_DevProgram.edit(selectedItem, callback: retrieve()) */}
      <Scm13_Edit_DevProgram open={target != null} mode="edit" program={target} systemCd={target?.systemCd ?? null}
        onSaved={() => { void retrieve(); onChanged?.(); }} onClose={() => setTarget(null)} />
    </>
  );
});
Scm13_Grid_DevProgram.displayName = 'Scm13_Grid_DevProgram';
