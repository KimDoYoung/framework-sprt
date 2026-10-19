/**
 * 평가등급 창 (E26) — Emp41_Tab_EvalList의 기준 적용일 "평가등급" 아이콘에서 연다
 * AS-IS: myApp/client/vi/emp/Emp42_Lookup_EvalGrade.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L57-86: 모달 650×500 "평가등급", 위 = 툴바 [조회] + (확정 전만) [등록][삭제], 아래 = 셀 편집 그리드(행번호, 체크박스 없음·단일 선택:
 *   평가등급 100 · 등급가중치 100 · 등급기준점수 120 · 이상/미만 120(콤보 CompareCode) · 평정사유 필수 140(체크)),
 *   아래 가운데 (확정 전만) [저장] + [닫기]
 * 삭제는 서버를 부르지 않고 삭제대기에 모았다가 [저장]에서 모든 행과 함께 보낸다 (L112-120·L206-238)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { EvalGrade } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<EvalGrade>();
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/** buildGrid() L146-166 — [E6] compareComboBox[CompareCode].Collapse (L151) → 고른 코드·이름을 그 행에 반영 */
const buildGrid = (compareCodes: Code[]) => [
  gb.textCenter('grade', 100, '평가등급', { editor: 'text' }),  // L159
  gb.doubleCenter('gradeWeight', 100, '등급가중치', { editor: 'number' }),  // L160
  gb.long('gradeScore', 120, '등급기준점수', { editor: 'number' }),  // L161
  gb.textCenter('compareName', 120, '이상/미만', {  // L162
    editor: 'select',
    values: compareCodes.map(c => c.name),
    valueSetter: p => {
      p.data.compareName = p.newValue;
      p.data.compareCode = compareCodes.find(c => c.name === p.newValue)?.code ?? p.data.compareCode;
      return true;
    },
  }),
  gb.boolean('reasonYn', 140, '평정사유 필수', { editable: true }),  // L163 addBoolean
];

interface Props {
  /** open(evalListStdId, fixYn) L57-86 — 값이 있으면 열린다 */
  target: { evalListStdId: number; fixYn: boolean } | null;
  onClose: () => void;
}

export const Emp42_Lookup_EvalGrade: React.FC<Props> = ({ target, onClose }) => {
  const open = target !== null;
  const evalListStdId = target?.evalListStdId;
  const fixed = target?.fixYn ?? false;
  const [compareCodes, setCompareCodes] = useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(compareCodes), [compareCodes]);
  // deleteList (L52): [삭제]가 모아 두었다가 [저장]에서 보낸다. 건수는 저장(n)에 보이도록 상태로도 든다
  const deleteList = useRef<number[]>([]);
  const [pendingDeletes, setPendingDeletes] = useState(0);

  const crud = useGridCrud<EvalGrade>({
    idField: 'evalGradeId',
    // retrieve() L168-179 → emp.Emp42_EvalGrade.selectByEvalListStdId
    search: useCallback(() => (evalListStdId ? empEvalApi.searchEvalGrades(evalListStdId) : Promise.resolve([])), [evalListStdId]),
    save: useCallback(async () => [], []),  // 쓰지 않음 — updateChk()가 모든 행을 모아 보낸다
    remove: useCallback(async () => 0, []),  // 쓰지 않음 — 삭제는 deleteList에 모은다
    // insertRow() L199-204: evalListStdId만 지정
    newRow: useCallback(() => ({ evalListStdId }), [evalListStdId]),
    firstEditField: 'grade',
  });

  // [E0] open() L57-86: 코드 로드 + 열 때 retrieve()
  useEffect(() => {
    if (!open) return;
    sysApi.searchCodes('CompareCode').then(setCompareCodes).catch(() => {});
    deleteList.current = [];
    setPendingDeletes(0);
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, evalListStdId]);

  // [E1] retrieveButton[조회].Select (L89) → retrieve(): 삭제대기는 그대로 둔다(원본 retrieve는 deleteList를 비우지 않음)
  const retrieve = () => crud.retrieve();

  /** eventChk() L181-197: 사용중이면(작성중·완료된 평가 대상자) 수정 불가 */
  const checkNotInUse = async (): Promise<boolean> => {
    if (!evalListStdId) return false;
    if (await empEvalApi.isEvalListStdInUse(evalListStdId)) {
      message.warning('사용중인 평가등급표는 수정이 불가능합니다');
      return false;
    }
    return true;
  };

  // [E2] insertButton[등록].Select [(boolean)result] (L95) → eventChk(), insertRow()
  const insertRow = async () => {
    if (await checkNotInUse()) crud.addRow();
  };

  // [E3] deleteButton[삭제].Select (L112): 선택한 행을 store에서 빼고 deleteList에 모은다
  const deleteRow = () => {
    const ids = (crud.gridRef.current?.api?.getSelectedRows() ?? []).map(r => r.evalGradeId);
    deleteList.current.push(...ids.filter(id => id > 0));
    setPendingDeletes(deleteList.current.length);
    crud.removeRows(ids);
  };

  // [E4] updateButton[저장].Select [(boolean)result] (L121) → eventChk(), updateChk() L206-223 → update() L225-238
  const updateChk = async () => {
    if (!evalListStdId || !(await checkNotInUse())) return;
    crud.gridRef.current?.api?.stopEditing();
    // updateChk()는 화면의 모든 행을 보낸다. 서버는 새 행(ID 0 이하)만 INSERT, 나머지는 UPDATE
    const all: EvalGrade[] = [];
    crud.gridRef.current?.api?.forEachNode(n => { if (n.data) all.push(n.data); });
    try {
      await empEvalApi.updateEvalGrades(evalListStdId, all, deleteList.current);
      message.success('정상적으로 저장되었습니다');
      deleteList.current = [];
      setPendingDeletes(0);
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="평가등급"
      width={650}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {!fixed && <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + pendingDeletes }} onClick={updateChk}>저장</Button>}
          {/* [E5] closeButton[닫기].Select (L138) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        <Space>
          <Button type="search" onClick={retrieve}>조회</Button>
          {!fixed && <>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </>}
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<EvalGrade> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_ROW_SELECTION} />
        </div>
      </div>
    </LookupModal>
  );
};
