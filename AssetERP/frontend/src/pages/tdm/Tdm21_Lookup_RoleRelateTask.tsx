/**
 * 연결책무 창 (N08) — 직책 그리드의 연결책무 아이콘·직책 편집창의 [연결책무(n건)]가 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm21_Lookup_RoleRelateTask.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 열 합계 1020+행번호·선택 60+여백 130 = 1210이 1120을 넘어 1120(03 원칙 21, 가로 스크롤): 툴바([행 추가][행 삭제] + 새로고침) + CellEditGrid(체크, 편집 열 없음) + [저장][닫기]
 * `viewOnly`(AS-IS view(roleId)): 행 추가·행 삭제·[저장]을 감춘다
 * 행 삭제는 화면에서만 빼 두었다가 [저장]에서 서버에서 지운다 (update() L234-271: 저장 → 삭제 순서)
 * UX보강(10): 조회창(UX-05·06은 Tdm10 안에서), 저장 버튼 UX-03
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { tdmApi } from '@/api/tdm';
import { TdmRoleTask } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Tdm10_Lookup_SelectMulti } from './Tdm10_Lookup_SelectMulti';
import { useDeferredCrud } from './useDeferredCrud';

const gb = gbFor<TdmRoleTask>();

/** buildGrid() L165-175 (setChecked MULTI) */
const buildGrid = () => [
  gb.textCenter('taskClassName', 120, '책무구분'),  // L168
  gb.textArea('taskTypeName', 270, '책무유형'),  // L169
  gb.textArea('taskName', 450, '책무'),  // L170
  gb.date('startDate', 90, '사용시작일'),  // L171
  gb.date('endDate', 90, '사용종료일'),  // L172
];

interface Props {
  /** 값이 있으면 열림 — AS-IS open(roleId, callback) */
  roleId: number | null;
  /** AS-IS view(roleId) — 보기 전용 */
  viewOnly?: boolean;
  /** [닫기] — AS-IS callback.execute(그리드 행 수) 뒤 hide(): 부르는 쪽이 건수를 바꾼다 */
  onClose: (count: number) => void;
}

export const Tdm21_Lookup_RoleRelateTask: React.FC<Props> = ({ roleId, viewOnly = false, onClose }) => {
  const [taskLookup, setTaskLookup] = useState(false);
  const columnDefs = useMemo(buildGrid, []);
  const { crud, retrieve, reset, deleteRow, commit, close, saveCount } = useDeferredCrud<TdmRoleTask>({
    idField: 'roleRelateTaskId',
    search: useCallback(async () => (roleId ? tdmApi.searchRoleTasks(roleId) : []), [roleId]),
    newRow: useCallback((): Partial<TdmRoleTask> => ({ roleId: roleId ?? undefined }), [roleId]),
  });

  // [E0] 화면 열림 (생성자 L61-66) → open() L77-96 → retrieve() / [E1] anchor.MouseDown (L101) → retrieve()
  useEffect(() => {
    if (roleId) void retrieve(); else reset();
  }, [roleId]);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] insertButton[행 추가].Select (L112) → insertRow() L191-219: Tdm10_Lookup_SelectMulti → 고른 책무마다 새 행
  const insertRows = (tasks: { taskId: number; taskClassName: string | null; taskTypeName: string | null; taskName: string | null; startDate: string | null; endDate: string | null }[]) => {
    crud.addRows(
      tasks.map(t => ({ roleId: roleId ?? undefined, taskId: t.taskId, taskClassName: t.taskClassName, taskTypeName: t.taskTypeName, taskName: t.taskName, startDate: t.startDate, endDate: t.endDate })),
      true,
    );
  };

  // [E6] msgBox.DialogHide [YES] (L137) → callback.execute(행 수) + hide() — useDeferredCrud.close의 확인
  // [E4] updateButton[저장].Select (L124) → update() L234-271: tdm.Tdm21_RoleRelateTask.update → delete
  const update = () => commit({
    save: changed => tdmApi.saveRoleTasks(roleId!, changed),
    remove: ids => tdmApi.deleteRoleTasks(roleId!, ids),
  });

  return (
    <LookupModal
      open={!!roleId}
      title="연결책무"
      width={1120}
      closable={false}
      maskClosable={false}
      onCancel={() => close(onClose)}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!viewOnly && <Button type="save" count={saveCount} onClick={update}>저장</Button>}
            {/* [E5] closeButton[닫기].Select (L130) → 변경이 있으면 확인(E6, L137) 뒤 callback.execute(행 수) + hide() */}
            <Button type="close" onClick={() => close(onClose)}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {!viewOnly && <Button type="addRow" onClick={() => setTaskLookup(true)}>행 추가</Button>}
          {/* [E3] deleteButton[행 삭제].Select (L118) → deleteRow() L221-232 */}
          {!viewOnly && <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>}
          <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void retrieve()} />
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TdmRoleTask> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Tdm10_Lookup_SelectMulti open={taskLookup} onSelect={insertRows} onClose={() => setTaskLookup(false)} />
    </LookupModal>
  );
};
