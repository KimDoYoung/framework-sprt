/**
 * 코드 그룹 팝업 (A13 — 코드구분 그리드의 '그룹' 칸에서 연다)
 * AS-IS: myApp/client/vi/sys/Sys13_Lookup_CodeGroup.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(selectModel): 제목 "코드 그룹", 1100×600 모달, 왼쪽 반 그룹 그리드 / 오른쪽 반 Sys13_TabPage_Code, 아래 가운데 닫기.
 * UX보강(10) B12-2: 저장 = 저장(n)(UX-03). 검색 칸이 없어 SearchBar는 쓰지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { sysApi } from '@/api/sys';
import { CodeGroup, CodeKind } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys13_TabPage_Code, type Sys13_TabPage_CodeHandle } from './Sys13_TabPage_Code';

const gb = gbFor<CodeGroup>();

/** AS-IS buildGrid() L146-156 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('kindGroupCd', 200, '그룹코드', { editor: 'text' }),  // L152
  gb.textArea('kindGroupNm', 280, '그룹설명', { editor: 'text' }),  // L153 (MyTextArea)
];

interface Props {
  open: boolean;
  /** open(Sys08_CodeKindModel selectModel) L56 */
  codeKind: CodeKind;
  onClose: () => void;
}

export const Sys13_Lookup_CodeGroup: React.FC<Props> = ({ open, codeKind, onClose }) => {
  const user = useLoginUser();
  const tabPageCode = useRef<Sys13_TabPage_CodeHandle>(null);
  const columnDefs = useMemo(buildGrid, []);
  // setting() L94-98: 로그인 회사가 0이 아니면 등록·저장·삭제를 막는다
  const isAdminCompany = user.companyId === 0;

  const crud = useGridCrud<CodeGroup>({
    idField: 'codeGroupId',
    // retrieve() L158-167: codekindId
    search: useCallback(() => sysApi.searchCodeGroups(codeKind.codeKindId), [codeKind.codeKindId]),
    save: sysApi.updateCodeGroups,
    remove: sysApi.deleteCodeGroups,
    // insertRow() L169-176: codeKindId, codeId = 0
    newRow: useCallback(() => ({ codeKindId: codeKind.codeKindId, codeId: 0 }), [codeKind.codeKindId]),
    firstEditField: 'kindGroupCd',
    // deleteRow() L178-199
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
  });

  // open() L56-90: 열자마자 retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) crud.retrieve(); }, [open]);

  return (
    <LookupModal
      open={open}
      title="코드 그룹"
      width={1100}
      maskClosable={false}
      centered
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] cancelButton[닫기].Select (L125) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 500, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
          <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none' }}>
            {/* [E1] retrieveButton[조회].Select (L100) → retrieve() */}
            <Button type="search" onClick={crud.retrieve}>조회</Button>
            {/* [E2] insertButton[등록].Select (L106) → insertRow() */}
            <Button type="register" disabled={!isAdminCompany} onClick={crud.addRow}>등록</Button>
            {/* [E3] updateButton[저장].Select (L112) → update() */}
            <Button type="save" count={crud.changes} disabled={!isAdminCompany} onClick={crud.saveRows}>저장</Button>
            {/* [E4] deleteButton[삭제].Select (L118) → deleteRow(), [E7] msgBox YES → sys.Sys13_CodeGroup.deleteAll (useGridCrud 안) */}
            <Button type="delete" disabled={!isAdminCompany} onClick={crud.deleteChecked}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E6] grid.RowClick (L137) → tabPageCode.retrieve(선택한 그룹, codeKindId). SelectionChanged 핸들러는 원본에서 주석 처리 */}
            <CellEditGrid<CodeGroup> crud={crud} columnDefs={columnDefs} sortable={false}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onRowClicked={e => e.data && tabPageCode.current?.retrieve(e.data, codeKind.codeKindId)} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, border: '1px solid #d9d9d9', borderLeft: 'none' }}>
          <Sys13_TabPage_Code ref={tabPageCode} />
        </div>
      </div>
    </LookupModal>
  );
};
