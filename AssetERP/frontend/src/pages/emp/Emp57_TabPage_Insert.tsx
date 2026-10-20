/**
 * 그룹 담당자 탭 — Emp57_Lookup_Insert 오른쪽 (G11)
 * AS-IS: myApp/client/vi/emp/Emp57_TabPage_Insert.java (184줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L46-61: 툴바 [등록][저장][삭제] + 셀 편집 그리드(체크박스 다중, 5열: 구분 50 · 담당자/사원명 250 · 이메일 220 · 핸드폰 번호 120 · 비고 500 편집).
 *   그룹을 고르기 전(parentId 없음)에는 mask()로 가려진다 (L164-170)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { empAddrBookApi } from '@/api/emp';
import { EmpAddrBookMember } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp10_Lookup_List, AddrBookPick } from './Emp10_Lookup_List';

const gb = gbFor<EmpAddrBookMember>();

interface Props {
  /** retrieve(parentId) L164 — 왼쪽에서 고른 그룹. null이면 가려진다 */
  parentId: number | null;
}

export const Emp57_TabPage_Insert: React.FC<Props> = ({ parentId }) => {
  const [lookupOpen, setLookupOpen] = useState(false);

  // retrieve(parentId) L164-182: 서비스 emp.Emp57_AddrBookGroup.selectByParentId(companyId, parentId)
  const search = useCallback(
    () => (parentId == null ? Promise.resolve([] as EmpAddrBookMember[]) : empAddrBookApi.searchGroupMembers(parentId)),
    [parentId],
  );

  const crud = useGridCrud<EmpAddrBookMember>({
    idField: 'addrBookGroupId',
    search,
    // update() L159-162: GridUpdate → emp.Emp57_AddrBookGroup.update
    save: empAddrBookApi.saveGroupMembers,
    // [E3] deleteButton[삭제].Select (L78) → deleteRow() L136-157: "확인"/"해당 정보를 삭제하시겠습니까?"(폭 350) → [E4] msgBox.DialogHide [YES] (L139) → emp.Emp57_AddrBookGroup.delete
    remove: empAddrBookApi.deleteGroupMembers,
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
    // 행 추가는 [등록]이 주소록 선택창을 거쳐 addRows로 넣는다 — 빈 행은 만들지 않는다
    newRow: useCallback(() => ({}), []),
  });

  // [E0] 화면 열림 (생성자 L46-61) → settings(): 그룹을 고르기 전에는 mask(). 그룹이 바뀔 때마다 retrieve(parentId)
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);

  // [E1] insertButton[등록].Select (L66) → insertRow() L99-134
  const insertRow = () => {
    if (parentId == null) {
      message.warning('좌측 그룹을 선택해주세요');
      return;
    }
    setLookupOpen(true);
  };

  // insertRow() L106-130: 고른 항목마다 GridInsertRow — 상위 = 선택한 그룹, 연결 = 주소록/사원 ID, 구분·이름·이메일·핸드폰은 화면에만 채운다(저장 대상 아님)
  const onPicked = (list: AddrBookPick[]) => {
    if (parentId == null || list.length === 0) return;
    crud.addRows(list.map(m => ({
      parentId,
      relateId: m.addrBookId,
      parentGubun: m.note,
      parentName: m.contactName,
      emailAddress: m.emailAddress,
      mobileTelNo: m.mobileTelNo,
    })), true);
  };

  // buildGrid() L87-97
  const columnDefs = useMemo(() => [
    gb.textCenter('parentGubun', 50, '구분'),  // L90
    gb.text('parentName', 250, '담당자/사원명'),  // L91
    gb.text('emailAddress', 220, '이메일'),  // L92
    gb.text('mobileTelNo', 120, '핸드폰 번호'),  // L93
    gb.text('note', 500, '비고', { editor: 'text' }),  // L94
  ], []);

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E2] updateButton[저장].Select (L72) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<EmpAddrBookMember> crud={crud} columnDefs={columnDefs} />
      </div>
      {parentId == null && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', zIndex: 5 }} />
      )}
      <Emp10_Lookup_List open={lookupOpen} onResult={onPicked} onClose={() => setLookupOpen(false)} />
    </div>
  );
};
