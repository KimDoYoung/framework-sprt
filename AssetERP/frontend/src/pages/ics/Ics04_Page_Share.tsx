/**
 * 법규관리 공유부서 페이지 (H10) — 법규 관리그룹 등록(Ics02_Tab_Manager)의 오른쪽. 고른 관리그룹의 공유 부서를 읽고 더하고 지운다
 * AS-IS: myApp/client/vi/ics/Ics04_Page_Share.java (200줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L48-91): 툴바 50(제목 "법규관리 공유부서" · [조회][저장][부서추가][삭제]) + 그리드(구분 120 가운데 · 부서 360, 체크). 관리그룹이 없으면 전체 비활성(setEnabled(false))
 * [사원추가](insertButton01·insertRow01)는 주석 처리돼 있어 만들지 않는다.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { IcsShare } from '@/types/ics';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { OrgInfo } from '@/types/emp';

const gb = gbFor<IcsShare>();

/** AS-IS buildGrid() (setChecked MULTI): 구분 · 부서 — 편집 열 없음, 행은 [부서추가]로만 생긴다 */
const COLUMNS = [
  gb.textCenter('shareName', 120, '구분'),  // L121
  gb.text('orgName', 360, '부서'),  // L122
];

interface Props {
  /** 고른 관리그룹 (없으면 비활성: AS-IS retrieve(null) → store.clear) */
  managerId: number | null;
}

export const Ics04_Page_Share: React.FC<Props> = ({ managerId }) => {
  const managerRef = useRef<number | null>(managerId);
  managerRef.current = managerId;
  const [orgOpen, setOrgOpen] = useState(false);

  const crud = useGridCrud<IcsShare>({
    idField: 'shareId',
    // retrieve(Long managerId) L107-119: ics.Ics04_Share.selectByManagerId(companyId, managerId)
    search: useCallback(() => (managerRef.current == null ? Promise.resolve([]) : icsApi.searchManagerShares(managerRef.current)), []),
    // update() L186-189: GridUpdate — 새 부서 행(companyId·managerId·shareCode "2"·orgId)만
    save: useCallback((rows: IcsShare[]) => icsApi.saveManagerShares(managerRef.current as number,
      rows.map(r => ({ shareId: r.shareId, shareCode: r.shareCode, orgId: r.orgId }))), []),
    // deleteRow() L191-195: GridDeleteData — 확인창 없이 체크한 행
    remove: useCallback((ids: number[]) => icsApi.deleteManagerShares(managerRef.current as number, ids), []),
    newRow: () => ({}),
    deleteConfirm: false,
  });

  // [E0] 화면 열림 (생성자 L48-91) · 부르는 쪽 SelectionChanged(retrieveShare) → retrieve(managerId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, [managerId]);

  const enabled = managerId != null;

  // [E2] insertButton02[부서추가].Select (L61) → insertRow02() L157-184: Org00_Lookup_SelectMulti(오늘) → 고른 조직마다 새 행(구분 "부서"·shareCode "2")을 변경으로
  const insertRow02 = (orgs: OrgInfo[]) => {
    if (orgs.length === 0) return;
    crud.addRows(orgs.map(o => ({ shareCode: '2', shareName: '부서', orgId: o.orgCodeId, orgName: o.parentFullNm })), true);
  };

  // [E4] deleteButton[삭제].Select (L73) → deleteRow(): 체크 없으면 경고만 (05 §8 사용자 결정)
  const deleteRow = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    void crud.deleteChecked();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, boxSizing: 'border-box', opacity: enabled ? 1 : 0.6, pointerEvents: enabled ? 'auto' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        <b style={{ fontSize: 14, marginRight: 8 }}>법규관리 공유부서</b>
        {/* [E1] retrieveButton[조회].Select (L49) → retrieve() */}
        <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
        {/* [E3] updateButton[저장].Select (L67) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="addRow" onClick={() => setOrgOpen(true)}>부서추가</Button>
        <Button type="delete" onClick={deleteRow}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<IcsShare> crud={crud} columnDefs={COLUMNS} />
      </div>
      <Org00_Lookup_SelectMulti
        baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined}
        onSelect={insertRow02}
        onClose={() => setOrgOpen(false)}
      />
    </div>
  );
};
