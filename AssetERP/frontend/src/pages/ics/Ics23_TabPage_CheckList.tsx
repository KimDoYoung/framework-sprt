/**
 * 체크리스트 중분류 관리 (E04) — Ics21_Lookup_CheckList(분류관리) 오른쪽 반
 * AS-IS: myApp/client/vi/ics/Ics23_TabPage_CheckList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-72: 위 툴바 [조회][등록][저장][삭제] + 셀 편집 그리드(체크박스 다중: 잠금 아이콘 40 · 중분류명 200 · 순서 50 · 비고 150 · 사용여부 100 · 사용종료일 100)
 * 부르는 쪽이 선택한 대분류(parent)를 준다. 없으면 목록이 비고 [등록]이 안내한다 (AS-IS retrieve(null) → store.clear())
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { message, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { IcsChecklistLClass, IcsChecklistMClass } from '@/types/ics';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<IcsChecklistMClass>();

interface Props {
  /** retrieve(parentModel) L226-246 — 고른 대분류. 없으면 비운다 */
  parent: IcsChecklistLClass | null;
}

export const Ics23_TabPage_CheckList: React.FC<Props> = ({ parent }) => {
  const user = useLoginUser();
  const parentRef = useRef(parent);
  parentRef.current = parent;
  const parentId = parent?.checklistLClassId ?? null;

  const crud = useGridCrud<IcsChecklistMClass>({
    idField: 'checklistMClassId',
    // retrieve(parentModel) L226-246: 서비스 ics.Ics23_ChecklistMClass.selectByCompanyId(checklistLClassId, companyId)
    search: useCallback(async () => (parentRef.current == null ? [] : icsApi.searchChecklistMClasses(parentRef.current.checklistLClassId)), []),
    // update() L183-224: GridUpdate → ics.Ics23_ChecklistMClass.update(companyId) → 끝나면 retrieve(parentModel)
    save: rows => icsApi.saveChecklistMClasses(rows.map(r => ({ ...r, closeDate: r.useYn === 'true' ? null : r.closeDate }))),
    reloadAfterSave: true,
    // deleteRow() L160-181: HtmlMessageBox "확인" / "해당 정보를 삭제하시겠습니까?" → GridDeleteData → ics.Ics23_ChecklistMClass.delete
    remove: icsApi.deleteChecklistMClasses,
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
    // insertRow() L115-128: 회사 = 로그인 회사, 대분류 = 고른 대분류, 사용 true
    newRow: useCallback(() => ({ companyId: user.companyId, checklistLClassId: parentRef.current?.checklistLClassId, useYn: 'true' }), [user.companyId]),
    firstEditField: 'checklistMClassName',
    // update() L183-211: 수정한 행마다 분류명 → 순서 → 사용종료일(사용여부가 false면) 검사 — 뒤의 검사가 앞의 메시지를 덮는다
    validate: changed => {
      let msg: string | undefined;
      for (const m of changed) {
        if (!m.checklistMClassName) msg = '분류명은 필수입력사항입니다.';
        if (m.seq == null) msg = '순서는 필수입력사항입니다.';
        if (m.useYn !== 'true' && !m.closeDate) msg = '사용종료일은 필수선택항목입니다.';
      }
      return msg;
    },
  });

  // [E0] 화면 열림 (생성자 L55-72) → setting(). 대분류를 고를 때마다 retrieve(parentModel)
  const retrieveRef = useRef(crud.retrieve);
  retrieveRef.current = crud.retrieve;
  useEffect(() => { void retrieveRef.current(); }, [parentId]);

  // 공통(회사 0) 분류는 관리자 회사만 이름·순서·비고를 고친다 — 고객사는 사용여부·사용종료일만(서버가 ics24에 저장)
  const locked = (p: { data?: IcsChecklistMClass }) => user.companyId !== 0 && p.data?.companyId === 0;

  // buildGrid() L101-113
  const columnDefs = useMemo(() => [
    gb.booleanIcon(undefined, 40, '', { colId: 'lock', valueGetter: p => p.data?.companyId === 0 }),  // L105 addLongLockIcon(companyId) — 공통(0)이면 잠금
    gb.text('checklistMClassName', 200, '중분류명', { editor: 'text', editable: p => !locked(p) }),  // L106
    gb.long('seq', 50, '순서', { editor: 'number', editable: p => !locked(p) }),  // L107
    gb.text('note', 150, '비고', { editor: 'text', editable: p => !locked(p) }),  // L108
    gb.boolean('useYn', 100, '사용여부', { editable: true }),  // L109
    gb.date('closeDate', 100, '사용종료일', { editor: 'date' }),  // L110
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user.companyId]);

  // insertRow(): 대분류를 안 골랐으면 "좌측 대분류를 먼저 선택해주세요"
  // [E2] insertButton[등록].Select (L81) → insertRow()
  const insertRow = () => {
    if (parent == null) {
      message.warning('좌측 대분류를 먼저 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E4] deleteButton[삭제].Select (L93) → deleteCheck() L130-158: 고객사가 공통 분류를 지우려 하면 "삭제불가능한 분류가 포함되어있습니다",
  //   서비스 ics.Ics23_ChecklistMClass.deleteCheck — 작성 기록이 있으면 "사용중인 체크리스트는 삭제가 불가능합니다." → 아니면 deleteRow() 확인 창 [E5] msgBox.DialogHide [YES] (L163) → delete
  const deleteCheck = async () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (user.companyId !== 0 && checked.some(r => r.companyId === 0)) {
      message.warning('삭제불가능한 분류가 포함되어있습니다');
      return;
    }
    const saved = checked.map(r => r.checklistMClassId).filter(id => id > 0);
    if (saved.length > 0 && (await icsApi.checkDeleteChecklistMClasses(saved)) > 0) {
      message.warning('사용중인 체크리스트는 삭제가 불가능합니다.');
      return;
    }
    crud.deleteChecked();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, boxSizing: 'border-box' }}>
      <Space wrap>
        {/* [E1] retrieveButton[조회].Select (L75) → retrieve(parentModel) */}
        <Button type="search" onClick={crud.retrieve}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L87) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={deleteCheck}>삭제</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<IcsChecklistMClass> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );
};
