/**
 * 그룹별 코드 (A13 — Sys13_Lookup_CodeGroup 오른쪽 반)
 * AS-IS: myApp/client/vi/sys/Sys13_TabPage_Code.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 원본은 MultiGrid(편집기 없음)이지만 등록·저장·삭제를 `useGridCrud`로 묶으려고 CellEditGrid를 쓴다(컬럼은 편집 불가).
 * UX보강(10) B12-2: 저장 = 저장(n)(UX-03). 검색 조건이 없어 SearchBar는 쓰지 않는다
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { CodeAdmin, CodeGroup } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_SelectSingle } from './Sys01_Lookup_SelectSingle';
import { Sys09_Lookup_CodeKind } from './Sys09_Lookup_CodeKind';

const gb = gbFor<CodeGroup>();

/** AS-IS buildGrid() L145-153 (setChecked MULTI) */
const buildGrid = () => [
  gb.textCenter('code', 100, '코드'),  // L149
  gb.text('name', 280, '코드명'),  // L150
];

export interface Sys13_TabPage_CodeHandle {
  /** AS-IS retrieve(codeGroupModel, codeKindId) L230-248 — 부모의 RowClick이 부른다 */
  retrieve: (codeGroup: CodeGroup, codeKindId: number) => void;
}

export const Sys13_TabPage_Code = forwardRef<Sys13_TabPage_CodeHandle>((_props, ref) => {
  const user = useLoginUser();
  // setting() L82-98: 로그인 회사가 0(admin)이 아니면 고객사 칸·등록·저장·삭제를 막는다
  // [E0] 화면 열림 (생성자 L60-80) → setting()
  const isAdminCompany = user.companyId === 0;
  const [companyId, setCompanyId] = useState(user.companyId);
  const [companyName, setCompanyName] = useState(user.companyName);
  const [companyLookupOpen, setCompanyLookupOpen] = useState(false);
  const [codeLookupOpen, setCodeLookupOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // 조회 조건은 부모가 retrieve(codeGroup, codeKindId)로 줄 때마다 바뀐다 → ref에 두고 search가 읽는다
  const current = useRef<{ codeGroup: CodeGroup | null; codeKindId: number | null; companyId: number }>(
    { codeGroup: null, codeKindId: null, companyId: user.companyId });
  const selectFirst = useRef(false);

  const crud = useGridCrud<CodeGroup>({
    idField: 'codeGroupId',
    // retrieve() L230-248: kindGroupCode·codeKindId·companyId. 그룹을 아직 안 골랐으면 원본도 빈 결과
    search: useCallback(async () => {
      const { codeGroup, codeKindId, companyId: cid } = current.current;
      return codeGroup && codeKindId != null ? sysApi.searchCodeGroupMembers(codeGroup.kindGroupCd, codeKindId, cid) : [];
    }, []),
    // update() L209-228: Sys13_CodeGroup.insert (새 행만 보낸다), 저장 뒤 다시 조회
    save: useCallback(async (rows: CodeGroup[]) => { await sysApi.insertCodeGroupMembers(rows); return []; }, []),
    reloadAfterSave: true,
    remove: sysApi.deleteCodeGroupMembers,
    newRow: useCallback(() => ({}), []),
    // deleteRow() L186-207 — [E6] msgBox.DialogHide [YES] (L189) → sys.Sys13_CodeGroup.delete (useGridCrud 안)
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
  });

  // retrieve() 안 grid.getSelectionModel().select(0, false): 조회가 끝나면 첫 행을 선택(체크)한다
  const retrieve = useCallback(async () => {
    selectFirst.current = true;
    await crud.retrieve();
  }, [crud.retrieve]);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectFirst.current || crud.rows.length === 0) return;
    selectFirst.current = false;
    crud.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true);
  }, [crud.rows, crud.gridRef]);

  useImperativeHandle(ref, () => ({
    retrieve: (codeGroup, codeKindId) => {
      current.current = { ...current.current, codeGroup, codeKindId };
      void retrieve();
    },
  }), [retrieve]);

  // [E1] companyName.TriggerClick [result != null] (L99) → retrieve(codeGroupModel, codeKindId)
  const onCompanyResult = (company: { companyId: number; companyNm: string } | null) => {
    setCompanyLookupOpen(false);
    if (!company) return;
    setCompanyName(company.companyNm);
    setCompanyId(company.companyId);
    current.current = { ...current.current, companyId: company.companyId };
    void retrieve();
  };

  // [E3] insertButton[등록].Select (L124) → insertRow() L155-184
  const insertRow = () => {
    const { codeGroup, codeKindId } = current.current;
    if (!codeGroup || codeGroup.codeGroupId == null || codeKindId == null) {
      message.warning('좌측 그룹코드를 선택해주세요');
      return;
    }
    setCodeLookupOpen(true);
  };

  // Sys09_Lookup_CodeKind callback (L162-183): 고른 코드마다 행을 넣는다 (GridInsertRow — 변경 아님이 아니라 저장 때 모두 보냄)
  const onCodesPicked = (list: CodeAdmin[]) => {
    setCodeLookupOpen(false);
    const { codeGroup, codeKindId } = current.current;
    if (!codeGroup || codeKindId == null) return;
    crud.addRows(list.map(m => ({
      codeKindId,
      kindGroupCd: codeGroup.kindGroupCd,
      kindGroupNm: codeGroup.kindGroupNm,
      codeId: m.codeId,
      code: m.code,
      name: m.name,
    })), true);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
        <Space>
          {/* companyName LookupTriggerField (L58, L96-116): admin 회사만 켜짐, 입력은 편집 불가 */}
          <LookupInput width={150} disabled={!isAdminCompany} value={companyName} onOpen={() => setCompanyLookupOpen(true)} />
          {/* [E2] retrieveButton[조회].Select (L118) → retrieve(codeGroupModel, codeKindId) */}
          <Button type="search" onClick={retrieve}>조회</Button>
          <Button type="register" disabled={!isAdminCompany} onClick={insertRow}>등록</Button>
          {/* [E4] updateButton[저장].Select (L130) → update() */}
          <Button type="save" count={crud.changes} disabled={!isAdminCompany} onClick={crud.saveRows}>저장</Button>
          {/* [E5] deleteButton[삭제].Select (L136) → deleteRow() */}
          <Button type="delete" disabled={!isAdminCompany} onClick={crud.deleteChecked}>삭제</Button>
        </Space>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CodeGroup> crud={crud} columnDefs={columnDefs} sortable={false} />
      </div>

      <Sys01_Lookup_SelectSingle open={companyLookupOpen} onResult={onCompanyResult} />
      {current.current.codeKindId != null && (
        <Sys09_Lookup_CodeKind open={codeLookupOpen} codeKindId={current.current.codeKindId} companyId={companyId}
          onResult={onCodesPicked} onClose={() => setCodeLookupOpen(false)} />
      )}
    </div>
  );
});
Sys13_TabPage_Code.displayName = 'Sys13_TabPage_Code';
