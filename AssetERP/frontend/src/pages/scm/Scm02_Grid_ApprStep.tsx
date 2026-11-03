/**
 * 의뢰 결재선 그리드 (EE15) — Scm01_Edit_Sr 아래 오른쪽(770×160)
 * AS-IS: myApp/client/vi/scm/Scm02_Grid_ApprStep.java (165줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprStepGrid() L79-110: 구분 80 · 결재상태 80 · 결재일 100 · 결재자 150 · 결재의견 80(Edit 아이콘) · 반려사유 80(Edit 아이콘), 모두 정렬 없음
 *   (AS-IS는 store에 결재상태 정렬을 걸어 두지만 서버가 결재순(seq)으로 주고 내 차례 판정이 그 순서를 쓴다 — 서버 순서 그대로 보인다)
 * open() L35-49: 상신자('00') 줄이 없으면 makeMeLine()(로그인 사원을 상신자로) 뒤 Scm02_Edit_ApprStep(결재선 설정)을 연다
 * retrieveApprStepGrid L69-76: scm.Scm02_SrApprStep.selectBySrId — 조회는 Scm01_Edit_Sr이 한다(여기는 steps 를 받아 보인다)
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { message } from 'antd';
import { aprStepEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { SrApprStep } from '@/types/scm';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Scm02_Edit_ApprStep, makeStep, renumber } from './Scm02_Edit_ApprStep';
import { Scm02_Edit_NoteMessage } from './Scm02_Edit_NoteMessage';

const gb = gbFor<SrApprStep>();

export interface ScmApprStepGridHandle {
  /** open() — 결재선 설정 창 */
  open: () => Promise<void>;
}

interface Props {
  srId: number | null;
  steps: SrApprStep[];
  /** 결재선 설정 [확인] · 결재의견/반려사유 저장 뒤 바뀐 결재선 */
  onChange: (steps: SrApprStep[]) => void;
}

// [E0] 화면 열림 (생성자 L51-61) → 결재선 그리드를 가득 채운다
export const Scm02_Grid_ApprStep = forwardRef<ScmApprStepGridHandle, Props>(({ srId, steps, onChange }, ref) => {
  const user = useLoginUser();
  const [editor, setEditor] = useState<{ open: boolean; steps: SrApprStep[] }>({ open: false, steps: [] });
  const [note, setNote] = useState<{ step: SrApprStep; comment: '결재의견' | '반려사유' } | null>(null);

  /** makeMeLine L55-57 → insertApprovalEmp("00", LoginUser.getUserModel()): 로그인 사원의 소속·직책으로 상신자 줄 */
  const makeMeLine = async (): Promise<SrApprStep> => {
    let me;
    try {
      me = (await aprStepEditApi.emps('org', { orgCodeId: Number(user.deptId) })).find(e => e.personId === user.userId);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    return makeStep('00', srId, me ?? { personId: user.userId, orgCodeId: Number(user.deptId), empKorName: user.name });
  };

  useImperativeHandle(ref, () => ({
    open: async () => {
      if (steps.some(s => s.stepTypeCd === '00')) setEditor({ open: true, steps });
      else setEditor({ open: true, steps: renumber([await makeMeLine(), ...steps]) });
    },
  }), [steps, srId, user]);

  const columnDefs = useMemo(() => [
    gb.textCenter('stepTypeNm', 80, '구분'),
    gb.textCenter('stepStatusNm', 80, '결재상태'),
    gb.date('apprDate', 100, '결재일'),
    gb.text('stepApprName', 150, '결재자'),
    iconCell<SrApprStep>('edit', 'noteAction', 80, '결재의견', row => setNote({ step: row, comment: '결재의견' })),
    iconCell<SrApprStep>('edit', 'rejectAction', 80, '반려사유', row => setNote({ step: row, comment: '반려사유' })),
  ], []);

  return (
    <>
      <SingleGrid<SrApprStep> rowData={steps} columnDefs={columnDefs} getRowId={p => String(p.data.srApprStepId)} />
      <Scm02_Edit_ApprStep
        open={editor.open}
        srId={srId}
        steps={editor.steps}
        onConfirm={onChange}
        onClose={() => setEditor(e => ({ ...e, open: false }))}
      />
      <Scm02_Edit_NoteMessage
        step={note?.step ?? null}
        comment={note?.comment ?? '결재의견'}
        onSaved={saved => onChange(steps.map(s => (s.srApprStepId === saved.srApprStepId ? saved : s)))}
        onClose={() => setNote(null)}
      />
    </>
  );
});
Scm02_Grid_ApprStep.displayName = 'Scm02_Grid_ApprStep';
