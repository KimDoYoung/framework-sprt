/**
 * 공용메일 권한자 — Cmp10_Tab_MailBook 오른쪽 (G13)
 * AS-IS: myApp/client/vi/cmp/Cmp10_Tab_MailBookList.java (215줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L51-64: 툴바 ["사원정보 " 라벨][조회][등록][저장][삭제] + 그리드(체크박스 다중, 행번호, 4열: 조직 160 · 직책 100 · 사번 80 · 성명 80)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { cmpMailBookApi } from '@/api/cmp';
import { CmpMailRole } from '@/types/cmp';
import { TransPerson } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp01_Lookup_PersonModel } from '@/components/lookup/Emp01_Lookup_PersonModel';

const gb = gbFor<CmpMailRole>();

interface Props {
  /** retrieve(mailBookId) L124 — 왼쪽에서 고른 공용메일. null이면 목록을 비운다 */
  mailBookId: number | null;
}

export const Cmp10_Tab_MailBookList: React.FC<Props> = ({ mailBookId }) => {
  const [lookupOpen, setLookupOpen] = useState(false);

  // retrieve(mailBookId) L124-138: mailBookId가 null이면 store.clear(), 아니면 서비스 cmp.Cmp11_MailRole.selectByRoleId(mailBookId)
  const search = useCallback(
    () => (mailBookId == null ? Promise.resolve([] as CmpMailRole[]) : cmpMailBookApi.searchRoles(mailBookId)),
    [mailBookId],
  );

  const crud = useGridCrud<CmpMailRole>({
    idField: 'mailRoleId',
    search,
    // update() L170-204: GridUpdate → cmp.Cmp11_MailRole.updateList (이미 있는 사원은 서버가 건너뜀), 성공하면 retrieve()
    save: async rows => { await cmpMailBookApi.saveRoles(rows); return rows; },
    reloadAfterSave: true,
    // [E4] deleteButton[삭제].Select (L85) → 확인 "선택한 사원정보를 삭제하시겠습니까?" → [E5] msgBox.DialogHide [YES] (L90) → deleteRow() L206-210: cmp.Cmp11_MailRole.delete
    remove: cmpMailBookApi.deleteRoles,
    deleteConfirm: '선택한 사원정보를 삭제하시겠습니까?',
    // 행 추가는 [등록]이 사원찾기를 거쳐 addRows로 넣는다 — 빈 행은 만들지 않는다
    newRow: useCallback(() => ({}), []),
  });

  // [E0] 화면 열림 (생성자 L51-64) → settings(), retrieve(). 공용메일이 바뀔 때마다 retrieve(mailBookId)
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailBookId]);

  // [E2] insertButton[등록].Select (L73) → insertRow() L140-168: 사원찾기(Emp01_Lookup_PersonModel)
  const insertRow = () => {
    if (mailBookId == null) {
      message.warning('좌측 공용메일을 선택해주세요');
      return;
    }
    setLookupOpen(true);
  };

  // insertRow() L146-166: 고른 사원마다 GridInsertRow — 사원 ID·공용메일 ID, 성명·조직·직책·사번은 화면에만 채운다
  const onPicked = (list: TransPerson[]) => {
    if (mailBookId == null || list.length === 0) return;
    crud.addRows(list.map(t => ({
      mailBookId,
      personId: t.personId,
      empKorName: t.korNm,
      orgName: t.orgNm,
      titleName: t.titleNm,
      empNo: t.empNo,
    })), true);
  };

  // buildGrid() (checkBox MULTI)
  const columnDefs = useMemo(() => [
    gb.text('orgName', 160, '조직'),
    gb.text('titleName', 100, '직책'),
    gb.text('empNo', 80, '사번'),
    gb.text('empKorName', 80, '성명'),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>사원정보 </span>
        {/* [E1] retrieveButton[조회].Select (L67) → retrieve() */}
        <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L79) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CmpMailRole> crud={crud} columnDefs={columnDefs} />
      </div>
      <Emp01_Lookup_PersonModel open={lookupOpen} onSelect={onPicked} onClose={() => setLookupOpen(false)} />
    </div>
  );
};
