/**
 * 코드 그리드 (A13 시스템 공통코드 관리 오른쪽 / A14 고객사 공통코드가 같은 클래스를 쓴다)
 * AS-IS: myApp/client/vi/sys/Sys09_Grid_Code.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * isAdmin = 생성자 인자. codeKind를 주면 retrieveCode(codeKind), companyId도 주면 retrieveCode(codeKind, companyId)(A14용).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Space, Typography } from 'antd';
import { sysApi } from '@/api/sys';
import { CodeAdmin, CodeKind } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<CodeAdmin>();

/** AS-IS buildGrid() L101-115 */
const buildGrid = () => [
  gb.text('code', 60, '코드', { editor: 'text' }),  // L105
  gb.text('name', 150, '코드명', { editor: 'text' }),  // L106
  gb.text('seq', 80, '조회순서', { editor: 'text' }),  // L107
  gb.boolean('closeYn', 60, '미사용', { editable: true }),  // L108
  gb.date('applyDate', 100, '시작일자', { editor: 'date' }),  // L109
  gb.date('closeDate', 100, '종료일자', { editor: 'date' }),  // L110
  gb.textArea('note', 300, '상세설명', { editor: 'text' }),  // L111
];

interface Props {
  /** 생성자 Sys09_Grid_Code(boolean isAdmin) L51 */
  isAdmin: boolean;
  codeKind?: CodeKind | null;
  /** retrieveCode(codeKind, companyId) L145-157 — 고른 고객사. 항상 편집 가능 */
  companyId?: number;
}

export const Sys09_Grid_Code: React.FC<Props> = ({ isAdmin, codeKind, companyId: pickedCompanyId }) => {
  const user = useLoginUser();
  const [detailCodeKindName, setDetailCodeKindName] = useState('');
  const columnDefs = useMemo(buildGrid, []);

  // retrieveCode() L117-157: 어느 회사의 코드를 보고, 저장·등록·삭제를 막을지
  const target = useMemo(() => {
    if (!codeKind) return null;
    if (pickedCompanyId !== undefined) return { companyId: pickedCompanyId, editable: true };
    // 시스템 코드구분 → 회사 0 (admin만 편집), 아니면 로그인 회사 (일반 사용자만 편집)
    return codeKind.sysYn === 'true'
      ? { companyId: 0, editable: isAdmin }
      : { companyId: user.companyId, editable: !isAdmin };
  }, [codeKind, pickedCompanyId, isAdmin, user.companyId]);
  // 코드구분을 고르기 전에는 버튼이 켜져 있다 (필드 기본값)
  const editable = target ? target.editable : true;

  const crud = useGridCrud<CodeAdmin>({
    idField: 'codeId',
    // retrieve() L159-167: codeKindId·companyId·searchText (store를 먼저 비운다)
    search: useCallback(
      () => (codeKind && target ? sysApi.searchCodesByKind(codeKind.codeKindId, target.companyId, detailCodeKindName) : Promise.resolve([])),
      [codeKind, target, detailCodeKindName]),
    save: sysApi.updateCodeAdmins,
    remove: useCallback((ids: number[]) => sysApi.deleteCodeAdmins(target?.companyId, ids), [target]),
    // insertRow() L169-186: 회사 = this.companyId, 시작일자 1910-01-01, 코드구분
    newRow: useCallback(() => ({
      companyId: target?.companyId ?? 0,
      codeKindId: codeKind?.codeKindId,
      applyDate: '1910-01-01',
    }), [target, codeKind]),
    firstEditField: 'code',
    // deleteRow() L193-214
    deleteConfirm: '선택한 코드를 삭제하시겠습니까?',
  });

  const retrieve = crud.retrieve;
  const update = crud.saveRows;
  const insertRow = crud.addRow;
  const deleteRow = crud.deleteChecked; // [E6] msgBox.DialogHide [YES] (L199) → sys.Sys09_Code.delete (useGridCrud 안)

  // [E0] 화면 열림 / retrieveCode(codeKind) L117-157 → 코드구분이 바뀔 때마다 조회 (codeKind가 null이면 조회하지 않는다)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (codeKind) retrieve(); else crud.clear(); }, [codeKind, pickedCompanyId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
        <Space>
          <Typography.Text strong>상세코드구분명</Typography.Text>
          {/* [E1] detailCodeKindName.KeyPress [Enter] (L55) → retrieve() */}
          <Input style={{ width: 150 }} value={detailCodeKindName} allowClear
            onChange={e => setDetailCodeKindName(e.target.value)} onPressEnter={retrieve} />
          {/* [E2] retrieveButton[조회].Select (L63) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E4] updateButton[저장].Select (L75) → update() */}
          <Button type="save" disabled={!editable} onClick={update}>저장</Button>
          {/* [E3] insertButton[등록].Select (L69) → insertRow() */}
          <Button type="register" disabled={!editable} onClick={insertRow}>등록</Button>
          {/* [E5] deleteButton[삭제].Select (L81) → deleteRow() */}
          <Button type="delete" disabled={!editable} onClick={deleteRow}>삭제</Button>
        </Space>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* 체크박스 없음(setChecked 없음) = 단일 선택, 삭제는 선택한 행 */}
        <CellEditGrid<CodeAdmin> crud={crud} columnDefs={columnDefs} sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }} />
      </div>
    </div>
  );
};
