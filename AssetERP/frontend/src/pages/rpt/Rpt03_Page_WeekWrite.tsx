/**
 * 건의사항 및 기타 요청사항 그리드 (Z11) — Rpt03_Tab_WeekWrite 아래(300)에 붙는 부분
 * AS-IS: myApp/client/vi/rpt/Rpt03_Page_WeekWrite.java (226줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L53-67: 툴바 50([등록][저장][삭제]) + 셀 편집 그리드(행번호, 체크박스 다중, 순번 60 · 건의사항 및 기타 요청사항 기재 1500), 업무구분 999 행만
 * 등록·저장·삭제는 먼저 제출·확인 상태를 본다(fixCheck L168-196 → confirmCheck L198-224)
 */
import React, { useCallback, useEffect, useRef } from 'react';
import { message, Space } from 'antd';
import { rptWeekApi } from '@/api/rpt';
import { RptWeek } from '@/types/rpt';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<RptWeek>();

interface Props {
  /** 보고주간 (yyyy-MM-dd) — 없으면 비어 있다 */
  startDate: string | null;
  closeDate: string | null;
  /** 부르는 쪽이 다시 조회할 때마다 올린다 (AS-IS weekWritePage.retrieve(startDate, closeDate)) */
  nonce: number;
}

const columnDefs = [
  gb.longCenter('seq', 60, '순번', { editor: 'number' }),  // L96
  gb.text('content', 1500, '건의사항 및 기타 요청사항 기재', { editor: 'text' }),  // L97
];

export const Rpt03_Page_WeekWrite: React.FC<Props> = ({ startDate, closeDate, nonce }) => {
  const rowsRef = useRef<RptWeek[]>([]);

  // [E0] 화면 열림 (생성자 L53-67) → settings() — 조회는 부르는 쪽이 보고주간을 정하면 시작한다
  // retrieve(startDate, closeDate) L102-120: 서비스 rpt.Rpt03_Week.selectByStartDate(…, weekBizTypeCode "999")
  const search = useCallback(async () => (startDate && closeDate ? rptWeekApi.search(startDate, closeDate, true) : []), [startDate, closeDate]);

  // update() L136-139: rpt.Rpt03_Week.update — 바꾼 행(새 행은 임시 음수 ID)
  const save = useCallback(
    (changed: RptWeek[]) => rptWeekApi.saveRequests(changed.map(r => ({
      weekId: r.weekId,
      weekStartDate: startDate!,
      weekCloseDate: closeDate!,
      content: r.content ?? null,
      dueDate: r.dueDate ?? null,
      seq: r.seq ?? null,
      bold: r.bold ?? false,
      note: r.note ?? null,
    }))),
    [startDate, closeDate],
  );
  const remove = useCallback((ids: number[]) => rptWeekApi.delete(ids), []);

  // insert() L122-133: 업무구분 999 · 기간 · 순번 = 행 수 + 1
  const newRow = useCallback((): Partial<RptWeek> => ({
    bizType: '999', weekStartDate: startDate, weekCloseDate: closeDate, seq: rowsRef.current.length + 1,
  }), [startDate, closeDate]);

  const crud = useGridCrud<RptWeek>({
    idField: 'weekId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'content',
    deleteConfirm: '해당 내용을 삭제하시겠습니까?',
    reloadAfterSave: true,
  });
  rowsRef.current = crud.rows;
  const { retrieve } = crud;

  useEffect(() => {
    if (startDate && closeDate) void retrieve(); else crud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, closeDate, nonce]);

  // fixCheck(action) L168-196 → confirmCheck L198-224: 제출 처리된 보고·확인 처리된 보고는 수정 불가
  const fixCheck = async (action: () => void | Promise<void>) => {
    if (!startDate || !closeDate) return;
    try {
      const state = await rptWeekApi.getState(startDate, closeDate);
      if (state.fixYn) {
        message.warning('제출 처리된 보고입니다. 수정이 불가합니다.');
        void retrieve();
      } else if (state.confirmerId != null) {
        message.warning('확인 처리된 보고입니다. 수정이 불가합니다.');
        void retrieve();
      } else {
        await action();
      }
    } catch {
      message.error('상태 확인 실패');
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space>
        {/* [E1] insertButton[등록].Select (L70) → fixCheck(), insert() */}
        <Button type="register" onClick={() => fixCheck(() => crud.addRow())}>등록</Button>
        {/* [E2] updateButton[저장].Select (L77) → fixCheck(), update() */}
        <Button type="save" count={crud.changes} onClick={() => fixCheck(() => crud.saveRows())}>저장</Button>
        {/* [E3] deleteButton[삭제].Select (L84) → fixCheck(), deleteChk() → [E4] msgBox.DialogHide [YES] (L144) → delete() */}
        <Button type="delete" disabled={!crud.hasChecked} onClick={() => fixCheck(() => crud.deleteChecked())}>삭제</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<RptWeek> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );
};
