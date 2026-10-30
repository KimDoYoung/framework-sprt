/**
 * 법인카드 사용자 이력 그리드 (U13) — Crd01_Tab_Card 아래 오른쪽에 붙는 그리드
 * AS-IS: myApp/client/vi/crd/Crd03_Grid_User.java (267줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-91: 위 = 버튼 줄 50([조회][등록][저장][삭제]) + 셀 편집 그리드(행번호, 체크박스 다중: 시작일자 · 종료일자 · 직원(조회창 트리거) · 직급 · 부서 · 공통카드 여부), 테두리
 * 카드를 고르지 않았거나 아직 저장하지 않은 새 카드(임시 ID)면 쓸 수 없다(AS-IS는 카드 ID 없는 행이 저장될 수 있어 막았다 — 작업방법)
 * UX보강(10): 저장(n)(UX-03), 변경 표시(UX-07), 날짜 편집 열 폭 120(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { crdApi } from '@/api/crd';
import { CrdCardUser } from '@/types/crd';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<CrdCardUser>();
/** setChecked(MULTI) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

const day = (s: string | null | undefined) => (s ? s.slice(0, 10) : null);

/** isDateOverlap() L198-218: 종료일자가 없으면 무기한 */
const isDateOverlap = (m1: CrdCardUser, m2: CrdCardUser): boolean => {
  const start1 = day(m1.frDt)!;
  const end1 = day(m1.toDt);
  const start2 = day(m2.frDt)!;
  const end2 = day(m2.toDt);
  if (end1 == null && end2 == null) return start1 === start2;   // 둘 다 무기한: 시작일이 같을 때만 겹침
  if (end1 == null) return start1 <= end2!;
  if (end2 == null) return start2 <= end1;
  return !(end1 < start2 || start1 > end2);
};

/** update() L165-197: 수정한 행의 사용자·시작일자 필수 → 모든 행끼리 사용기간 겹침 검사 */
const validate = (changed: CrdCardUser[], all: CrdCardUser[]): string | undefined => {
  for (const m of changed) {
    if (m.personId == null) return '사용자를 선택해주세요.';
    if (!m.frDt) return '시작일자를 정확하게 입력해주시길 바랍니다.';
  }
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (all[i].frDt && all[j].frDt && isDateOverlap(all[i], all[j])) return '사용기간이 겹치는 사용자가 존재합니다.';
    }
  }
  return undefined;
};

interface Props {
  /** 위 목록에서 고른 카드 ID (retrieve(cardId)). 없거나 0 이하(저장 전 새 카드)면 쓸 수 없다 */
  cardId: number | null;
}

export const Crd03_Grid_User: React.FC<Props> = ({ cardId }) => {
  const enabled = cardId != null && cardId > 0;
  const [pickRowId, setPickRowId] = useState<number | null>(null);
  const [pickDate, setPickDate] = useState<string | null>(null);

  const crud = useGridCrud<CrdCardUser>({
    idField: 'transId',
    // retrieve() L155-162: crd.Crd03_Trans.selectByCardId(cardId)
    search: useCallback(() => (enabled ? crdApi.searchCardUsers(cardId!) : Promise.resolve([])), [enabled, cardId]),
    // update() L165-197: GridUpdate → crd.Crd03_Trans.update
    save: useCallback((rows: CrdCardUser[]) => crdApi.saveCardUsers(cardId!, rows), [cardId]),
    // deleteRow() L220-242: GridDeleteData → crd.Crd03_Trans.delete
    remove: useCallback((ids: number[]) => crdApi.deleteCardUsers(cardId!, ids), [cardId]),
    // [E4] deleteButton[삭제].Select (L81) → deleteRow(): "삭제"/"선택한 내용을 삭제하시겠습니까?"(폭 300) → [E6] messageBox.DialogHide
    deleteConfirm: '선택한 내용을 삭제하시겠습니까?',
    // insertRow() L245-266: useYn true (공통카드 여부는 처음에 해제)
    newRow: useCallback(() => ({ cardId, useYn: 'true', publicYn: 'false' }), [cardId]),
    firstEditField: 'frDt',
    validate,
  });

  // [E0] 화면 열림 (생성자 L56-91) — 카드가 바뀔 때마다 그 카드의 사용자를 읽는다(Crd01_Tab_Card.userGrid.retrieve(cardId))
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId]);

  // [E2] insertButton[등록].Select (L65) → insertRow() L245-266: 종료일자가 없는 행이 있으면 "종료일자를 입력 후 등록이 가능합니다."
  const insertRow = () => {
    if (crud.rows.some(r => !r.toDt)) {
      message.warning('종료일자를 입력 후 등록이 가능합니다.');
      return;
    }
    crud.addRow();
  };

  // [E5] lookupEmpInfo.TriggerClick (L96) → openLookupEmpInfo() L123-152: 그 행의 시작일자가 없으면 "시작일자를 입력해주세요."
  //   → Emp00_Lookup_SelectSingle.open(시작일자, true, …) → 직원·직급·부서를 그 행에 넣는다
  const openLookupEmpInfo = (row: CrdCardUser) => {
    const live = crud.gridRef.current?.api?.getRowNode(String(row.transId))?.data ?? row;   // 방금 고친 시작일자까지 반영
    if (!live.frDt) {
      message.warning('시작일자를 입력해주세요.');
      return;
    }
    setPickRowId(row.transId);
    setPickDate(day(live.frDt));
  };
  const onPick = (emp: TransInfo | null) => {
    const rowId = pickRowId;
    setPickRowId(null);
    if (!emp || rowId == null) return;
    crud.updateRow(rowId, { personId: emp.personId, personName: emp.korNm, orgName: emp.orgKorNm, titleName: emp.titleNm, cardId });
  };

  // buildGrid() L93-116
  const columnDefs = useMemo(() => [
    gb.date('frDt', 120, '시작일자', { editor: 'date' }),  // L106
    gb.date('toDt', 120, '종료일자', { editor: 'date' }),  // L107
    gb.text('personName', 100, '직원', {  // L108 (LookupTriggerField)
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: CrdCardUser; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) openLookupEmpInfo(p.data); }} />
          {p.value}
        </>
      ),
    }),
    gb.text('titleName', 100, '직급'),  // L109
    gb.text('orgName', 300, '부서'),  // L110
    gb.boolean('publicYn', 100, '공통카드 여부', { editable: true }),  // L111
  ], []);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', opacity: enabled ? 1 : 0.6, pointerEvents: enabled ? 'auto' : 'none' }}>
      <div style={{ flex: 'none', height: 50, padding: '0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L57) → retrieve() */}
        <Button type="search" onClick={crud.retrieve}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L73) → update() */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CrdCardUser> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
      </div>
      <Emp00_Lookup_SelectSingle open={pickRowId != null} separateAddTitle noneLabel={null} transDate={pickDate ?? ''} onResult={onPick} onClose={() => setPickRowId(null)} />
    </div>
  );
};
