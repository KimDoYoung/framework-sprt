/**
 * 준수답변 탭 (E05) — Ics30_Tab_Compliance 아래쪽. 고른 준수항목의 CASE별 답변(1~5)을 편집한다
 * AS-IS: myApp/client/vi/ics/Ics33_TabPage_ComplianceAnswer.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L59-86: 위 = 왼쪽 제목 "[준수항목명] 준수답변", 오른쪽 [행 추가][행 삭제][저장] / 아래 = 셀 편집 그리드(행번호, 체크박스 다중:
 *   CASE 150 · 답변1~5 각 200 콤보 AnswerCode "<blank>")
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { IcsCompliance, IcsComplianceAnswer } from '@/types/ics';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<IcsComplianceAnswer>();
/** 체크박스 다중 선택. 렌더마다 새 객체를 주면 부모가 다시 그릴 때 AG Grid가 선택을 지우므로 한 번만 만든다 */
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

const ANSWERS = [1, 2, 3, 4, 5] as const;

export interface Ics33_TabPage_ComplianceAnswerHandle {
  /** retrieve(parentModel) L226-256 — null이면 그리드를 비운다 */
  retrieve: (parent: IcsCompliance | null) => Promise<void>;
  /** setEnable(chk) L258-262 — [행 추가][행 삭제][저장] */
  setEnable: (enabled: boolean) => void;
}

export const Ics33_TabPage_ComplianceAnswer = forwardRef<Ics33_TabPage_ComplianceAnswerHandle>((_props, ref) => {
  const [parent, setParent] = useState<IcsCompliance | null>(null);
  const [enabled, setEnabled] = useState(false);  // 원본은 setEnable이 불리기 전까지 켜져 있지만 화면은 날짜를 고른 뒤에야 쓴다
  const [answerCodes, setAnswerCodes] = useState<Code[]>([]);
  const deleteIds = useRef<number[]>([]);  // deleteList: [행 삭제]로 뺀 행 (저장 때 서버에 보낸다)
  const parentRef = useRef<IcsCompliance | null>(null);
  parentRef.current = parent;

  // [E0] 화면 열림 (생성자 L59-86) → setting(): 답변 콤보 AnswerCode를 읽는다
  useEffect(() => { sysApi.searchCodes('AnswerCode').then(setAnswerCodes).catch(() => undefined); }, []);

  const crud = useGridCrud<IcsComplianceAnswer>({
    idField: 'complianceAnswerId',
    // retrieve() L226-256: 서비스 ics.Ics33_ComplianceAnswer.selectByCompanyId(companyId, startDate, complianceType)
    search: useCallback(async () => {
      const p = parentRef.current;
      return p ? icsApi.searchComplianceAnswers(p.startDate, p.complianceType ?? '') : [];
    }, []),
    save: async () => [],  // 저장은 update()가 직접 한다 (삭제 → 저장 순서)
    remove: async () => undefined,
    // insertRow() L173-186: 회사·기준적용일·준수구분은 위쪽 준수항목에서
    newRow: useCallback(() => ({
      companyId: parentRef.current?.companyId,
      startDate: parentRef.current?.startDate,
      complianceType: parentRef.current?.complianceType,
    }), []),
    firstEditField: 'caseNo',
  });

  useImperativeHandle(ref, () => ({
    retrieve: async p => {
      setParent(p);
      parentRef.current = p;
      deleteIds.current = [];
      if (p) await crud.retrieve(); else crud.clear();
    },
    setEnable: setEnabled,
  }));

  // [E1] insertRowButton[행 추가].Select (L89) → insertRow() L173-186
  const insertRow = () => {
    if (!parent || !parent.complianceType) {
      message.warning('상단 내용을 먼저 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E2] deleteRowButton[행 삭제].Select (L95) → 고른 행을 deleteList에 모으고 그리드에서 뺀다 (확인 창 없음)
  const deleteRow = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    deleteIds.current.push(...checked.map(r => r.complianceAnswerId).filter(id => id > 0));
    crud.removeRows(checked.map(r => r.complianceAnswerId));
  };

  // [E3] updateButton[저장].Select (L104) → update() L188-224: 답변1이 없으면 "답변은 필수선택사항입니다." → 삭제 목록 삭제 → 고친 행 저장 → retrieve(parentModel)
  const update = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    if (changed.some(r => r.answer1Cd == null)) {
      message.warning('답변은 필수선택사항입니다.');
      return;
    }
    try {
      if (deleteIds.current.length > 0) {
        await icsApi.deleteComplianceAnswers(deleteIds.current);
        deleteIds.current = [];
      }
      if (changed.length > 0) await icsApi.saveComplianceAnswers(changed);
      message.success('저장되었습니다.');
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E4] answer1ComboBox[AnswerCode].Collapse (L117) → 그 행의 answer1Code·answer1Name을 바꾼다 ("<blank>"는 비움)
  // [E5] answer2ComboBox[AnswerCode].Collapse (L126) → answer2Code·answer2Name
  // [E6] answer3ComboBox[AnswerCode].Collapse (L135) → answer3Code·answer3Name
  // [E7] answer4ComboBox[AnswerCode].Collapse (L144) → answer4Code·answer4Name
  // [E8] answer5ComboBox[AnswerCode].Collapse (L153) → answer5Code·answer5Name
  const answerCol = useCallback((n: typeof ANSWERS[number]) => {
    const cd = `answer${n}Cd` as const;
    const nm = `answer${n}Name` as const;
    return gb.textCenter(nm, 200, `답변${n}`, {
      editor: 'select',
      values: ['', ...answerCodes.map(c => c.name)],
      valueSetter: p => {
        const code = answerCodes.find(c => c.name === p.newValue)?.code ?? null;
        p.data[cd] = code;
        p.data[nm] = code ? p.newValue : null;
        return true;
      },
    });
  }, [answerCodes]);

  // buildGrid() L112-171
  const columnDefs = useMemo(() => [
    gb.textCenter('caseNo', 150, 'CASE', { editor: 'text' }),  // L162 TextField (모델은 String, DB 열은 numeric — 숫자가 아니면 서버가 거절)
    ...ANSWERS.map(answerCol),  // L163-167
  ], [answerCol]);

  const title = parent ? `[${parent.complianceTypeName ?? ''}] 준수답변` : '';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 36, padding: '0 8px' }}>
        <span style={{ color: '#000', fontWeight: 600, fontSize: 13 }}>{title}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <Button type="addRow" onClick={insertRow} disabled={!enabled}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRow} disabled={!enabled}>행 삭제</Button>
          <Button type="save" onClick={update} disabled={!enabled}>저장</Button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<IcsComplianceAnswer> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
      </div>
    </div>
  );
});
Ics33_TabPage_ComplianceAnswer.displayName = 'Ics33_TabPage_ComplianceAnswer';
