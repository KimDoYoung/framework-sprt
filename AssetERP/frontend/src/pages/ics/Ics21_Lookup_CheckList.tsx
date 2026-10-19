/**
 * 체크리스트 분류관리 창 (E04) — Ics10_Tab_ChecklistAdmin의 [분류관리]에서 연다 (Ics10_Tab_Checklist도 씀)
 * AS-IS: myApp/client/vi/ics/Ics21_Lookup_CheckList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L81-114: 모달 1450×600 "분류관리", 왼쪽 반 = 툴바 [조회][등록][저장][삭제] + 대분류 셀 편집 그리드(체크박스 단일: 잠금 40 · 대분류명 200 · 순서 50 · 비고 150 ·
 *   사용여부 100 · 사용종료일 100), 오른쪽 반 = 중분류(Ics23_TabPage_CheckList), 아래 가운데 [닫기]
 */
import React, { useCallback, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { SelectionChangedEvent } from 'ag-grid-community';
import { icsApi } from '@/api/ics';
import { IcsChecklistLClass } from '@/types/ics';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Ics23_TabPage_CheckList } from './Ics23_TabPage_CheckList';

const gb = gbFor<IcsChecklistLClass>();
/** 대분류 그리드는 체크박스 단일 선택. 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const L_SELECTION = { mode: 'singleRow', checkboxes: true } as const;

interface Props {
  /** open(callback) L81-114 — 값이 true면 열린다 */
  open: boolean;
  /** cancelButton[닫기]의 callback.execute() — 부른 쪽이 분류 콤보를 다시 읽는다 */
  onClosed: () => void;
  /** 창의 닫기(X) — callback 없이 닫는다 */
  onClose: () => void;
}

export const Ics21_Lookup_CheckList: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const user = useLoginUser();
  const [parent, setParent] = useState<IcsChecklistLClass | null>(null);

  const crud = useGridCrud<IcsChecklistLClass>({
    idField: 'checklistLClassId',
    // retrieve() L177-186: 서비스 ics.Ics21_ChecklistLClass.selectByCompanyId(companyId)
    search: useCallback(() => icsApi.searchChecklistLClasses(), []),
    // update() L250-291: GridUpdate(companyId) → ics.Ics21_ChecklistLClass.update → 끝나면 retrieve()
    save: rows => icsApi.saveChecklistLClasses(rows.map(r => ({ ...r, closeDate: r.useYn === 'true' ? null : r.closeDate }))),
    reloadAfterSave: true,
    // deleteRow() L227-248: HtmlMessageBox "확인" / "해당 정보를 삭제하시겠습니까?" → GridDeleteData → ics.Ics21_ChecklistLClass.delete
    remove: icsApi.deleteChecklistLClasses,
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
    // insertRow() L188-195: 회사 = 로그인 회사, 사용 true
    newRow: useCallback(() => ({ companyId: user.companyId, useYn: 'true' }), [user.companyId]),
    firstEditField: 'checklistLClassName',
    // update() L250-291: 수정한 행마다 분류명 → 순서 → 사용종료일(사용여부가 false면) 검사 — 뒤의 검사가 앞의 메시지를 덮는다
    validate: changed => {
      let msg: string | undefined;
      for (const m of changed) {
        if (!m.checklistLClassName) msg = '분류명은 필수입력사항입니다.';
        if (m.seq == null) msg = '순서는 필수입력사항입니다.';
        if (m.useYn !== 'true' && !m.closeDate) msg = '사용종료일은 필수선택항목입니다.';
      }
      return msg;
    },
  });

  // 열림 open() L81-114 (원본 이벤트 아님) → setting(), show(), retrieve()
  React.useEffect(() => {
    if (!open) return;
    crud.gridRef.current?.api?.deselectAll();  // 원본은 창을 매번 새로 만든다 — 이전에 고른 대분류 선택을 남기지 않는다
    setParent(null);
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 공통(회사 0) 분류는 관리자 회사만 이름·순서·비고를 고친다 — 고객사는 사용여부·사용종료일만(서버가 ics22에 저장)
  const locked = (p: { data?: IcsChecklistLClass }) => user.companyId !== 0 && p.data?.companyId === 0;

  // buildGrid() L161-175
  const columnDefs = useMemo(() => [
    gb.booleanIcon(undefined, 40, '', { colId: 'lock', valueGetter: p => p.data?.companyId === 0 }),  // L167 addLongLockIcon(companyId)
    gb.text('checklistLClassName', 200, '대분류명', { editor: 'text', editable: p => !locked(p) }),  // L168
    gb.long('seq', 50, '순서', { editor: 'number', editable: p => !locked(p) }),  // L169
    gb.text('note', 150, '비고', { editor: 'text', editable: p => !locked(p) }),  // L170
    gb.boolean('useYn', 100, '사용여부', { editable: true }),  // L171
    gb.date('closeDate', 100, '사용종료일', { editor: 'date' }),  // L172
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user.companyId]);

  // [E6] grid.RowClick (L148-157): 고른 행이 하나면 tabPage.retrieve(그 행), 아니면 tabPage.retrieve(null)
  const onSelectionChanged = (e: SelectionChangedEvent<IcsChecklistLClass>) => {
    const sel = e.api.getSelectedRows();
    setParent(sel.length === 1 ? sel[0] : null);
  };

  // [E4] deleteButton[삭제].Select (L135) → deleteCheck() L197-225: 고객사가 공통 분류를 지우려 하면 "삭제불가능한 분류가 포함되어있습니다",
  //   서비스 ics.Ics21_ChecklistLClass.deleteCheck — 작성 기록이 있으면 "사용중인 체크리스트는 삭제가 불가능합니다." → 아니면 deleteRow() 확인 창 → [E7] msgBox.DialogHide [YES] (L230) → delete
  const deleteCheck = async () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (user.companyId !== 0 && checked.some(r => r.companyId === 0)) {
      message.warning('삭제불가능한 분류가 포함되어있습니다');
      return;
    }
    const saved = checked.map(r => r.checklistLClassId).filter(id => id > 0);
    if (saved.length > 0 && (await icsApi.checkDeleteChecklistLClasses(saved)) > 0) {
      message.warning('사용중인 체크리스트는 삭제가 불가능합니다.');
      return;
    }
    crud.deleteChecked();
  };

  return (
    <LookupModal
      open={open}
      title="분류관리"
      width={1490}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] cancelButton[닫기].Select (L141) → callback.execute(); hide() */}
          <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', height: 450, gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, padding: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          <Space wrap>
            {/* [E1] retrieveButton[조회].Select (L117) → retrieve() */}
            <Button type="search" onClick={crud.retrieve}>조회</Button>
            {/* [E2] insertButton[등록].Select (L123) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E3] updateButton[저장].Select (L129) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteCheck}>삭제</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<IcsChecklistLClass>
              crud={crud}
              columnDefs={columnDefs}
              rowSelection={L_SELECTION}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          <Ics23_TabPage_CheckList parent={parent} />
        </div>
      </div>
    </LookupModal>
  );
};
