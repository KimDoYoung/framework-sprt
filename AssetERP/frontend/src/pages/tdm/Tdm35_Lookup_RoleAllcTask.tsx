/**
 * 책무 및 세부내용 창 (N11) — 임원별 직책배정 하단 탭의 [책무보기] 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm35_Lookup_RoleAllcTask.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1260×550(원본): 왼쪽 책무 그리드(500) + 오른쪽 책무 세부내용 그리드 + [닫기]
 * UX보강(10): 조회창(UX-05)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRoleAllcTask, TdmRoleAllcTaskDetail } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gbTask = gbFor<TdmRoleAllcTask>();
const gbDetail = gbFor<TdmRoleAllcTaskDetail>();

/** taskBuildGrid() L78-82 */
const buildTaskGrid = () => [
  gbTask.textArea('taskName', 450, '책무'),  // L80
];

/** detailBuildGrid() L84-88 */
const buildDetailGrid = () => [
  gbDetail.textArea('taskRelateDetailName', 700, '책무 세부내용'),  // L86
];

interface Props {
  /** 책무배분일 ID (값이 있으면 열림) */
  roleAllcDetailId: number | null;
  onClose: () => void;
}

export const Tdm35_Lookup_RoleAllcTask: React.FC<Props> = ({ roleAllcDetailId, onClose }) => {
  const taskGridRef = useRef<AgGridReact<TdmRoleAllcTask>>(null);
  const [tasks, setTasks] = useState<TdmRoleAllcTask[]>([]);
  const [details, setDetails] = useState<TdmRoleAllcTaskDetail[]>([]);
  const taskCols = useMemo(buildTaskGrid, []);
  const detailCols = useMemo(buildDetailGrid, []);

  // [E0] 화면 열림 (생성자 L34-39) → open() L41-58 → settings()
  // retrieve() L90-104: tdm.Tdm35_RoleAllcTask.selectTask(roleAllcDetailId) → 첫 행 선택
  useEffect(() => {
    if (roleAllcDetailId == null) return;
    setTasks([]);
    setDetails([]);
    let alive = true;
    tdmApi.searchRoleAllcTasks(roleAllcDetailId)
      .then(list => {
        if (!alive) return;
        setTasks(list);
        if (list.length > 0) setTimeout(() => taskGridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true));
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
    return () => { alive = false; };
  }, [roleAllcDetailId]);

  // [E2] taskGrid.SelectionChanged [선택>0] (L68) → retrieveDetail() L106-121: tdm.Tdm35_RoleAllcTask.selectTaskDetail(roleAllcDetailId, taskId, apprYn)
  const retrieveDetail = useCallback(async (task: TdmRoleAllcTask) => {
    if (roleAllcDetailId == null) return;
    try {
      setDetails(await tdmApi.searchRoleAllcTaskDetails(roleAllcDetailId, task.taskId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [roleAllcDetailId]);

  return (
    <LookupModal
      open={roleAllcDetailId != null}
      title="책무 및 세부내용"
      width={1260}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] closeButton[닫기].Select (L61) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex' }}>
        <div style={{ width: 500, height: '100%' }}>
          <SingleGrid<TdmRoleAllcTask>
            gridRef={taskGridRef}
            rowData={tasks}
            columnDefs={taskCols}
            getRowId={p => String(p.data.roleAllcTaskId)}
            onSelect={row => { if (row) void retrieveDetail(row); }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, height: '100%', marginLeft: -2 }}>
          <SingleGrid<TdmRoleAllcTaskDetail>
            rowData={details}
            columnDefs={detailCols}
            getRowId={p => String(p.data.roleAllcTaskId)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
