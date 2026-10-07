/**
 * 고객별 관리자 탭 (A15) — Sys01_Tab_Company 아래 탭 5번째.
 * AS-IS: myApp/client/vi/sys/Sys02_Tab_User.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 회사의 관리자 계정(sys02_user). 셀 편집 + 단일 선택(체크박스 없음). 비밀번호는 저장 시 to_encrypts.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space, Button as AntButton } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { AdminUser } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import type { CompanyTabProps } from './Sys01_Tab_Company';
import { Sys82_Lookup_UserMenu } from './Sys82_Lookup_UserMenu';

const gb = gbFor<AdminUser>();

/** AS-IS buildGrid() L87-113 */
const buildGrid = (openMenu: (r: AdminUser) => void) => [
  gb.text('korNm', 120, '사용자명', { editor: 'text' }),  // L102
  gb.textCenter('loginId', 120, 'ID', { editor: 'text' }),  // L103
  gb.textCenter('decPasswd', 120, 'PW', { editor: 'text' }),  // L104 PasswordField (보기는 AS-IS처럼 글자 그대로)
  gb.text('email', 240, '이메일', { editor: 'text' }),  // L105
  gb.textCenter('tel1', 140, '휴대폰번호', { editor: 'text' }),  // L106
  gb.textCenter('tel2', 140, '사무실번호', { editor: 'text' }),  // L107
  gb.text('note', 480, '기타정보', { editor: 'text' }),  // L108
  gb.boolean('adminYn', 100, '전체권한', { editable: true }),  // L109
  {  // L110 actionCell(ImageCell "Edit") → 권한설정
    colId: 'actionMenu',
    headerName: '권한설정',
    width: 100,
    cellStyle: { padding: 0, textAlign: 'center' as const },
    cellRenderer: (p: CustomCellRendererProps<AdminUser>) =>
      p.data ? <AntButton type="text" size="small" icon={<EditOutlined />} onClick={e => { e.stopPropagation(); openMenu(p.data!); }} /> : null,
  },
];

export const Sys02_Tab_User: React.FC<CompanyTabProps> = ({ companyId }) => {
  const [menuUserId, setMenuUserId] = useState<number>();

  const crud = useGridCrud<AdminUser>({
    idField: 'userId',
    // retrieve() L121-125: 서비스 sys.Sys02_User.selectByName(companyId)
    search: useCallback(() => (companyId ? sysApi.searchAdminUsers(companyId) : Promise.resolve([])), [companyId]),
    // update() L128-131: GridUpdate → sys.Sys02_User.update
    save: useCallback((rows: AdminUser[]) => sysApi.updateAdminUsers(companyId!, rows), [companyId]),
    // deleteRow() L148-152: GridDeleteData(선택 행) — 확인 창 없음
    remove: useCallback((ids: number[]) => sysApi.deleteAdminUsers(companyId!, ids), [companyId]),
    deleteConfirm: false,
    // insertRow() L134-145: 회사 = 선택한 회사, 전체권한 = true
    newRow: useCallback(() => ({ companyId, adminYn: 'true' }), [companyId]),
    firstEditField: 'korNm',
  });

  // actionCell L88-98: 전체권한이면 막고, 아니면 매뉴권한 조회창
  const openMenu = useCallback((r: AdminUser) => {
    if (r.adminYn === true || r.adminYn === 'true') {
      message.warning('전체권한을 가진 관리자는 별도의 권한설정을 지원하지않습니다');
      return;
    }
    if (r.userId <= 0) {
      message.warning('저장 후 시도해주세요'); // TOBE: 저장 전 행은 서버에 관리자가 없다
      return;
    }
    setMenuUserId(r.userId);
  }, []);
  const columnDefs = useMemo(() => buildGrid(openMenu), [openMenu]);

  const retrieve = crud.retrieve;
  const update = crud.saveRows;
  const insertRow = () => {
    if (!companyId) {
      message.warning('회사를 선택해주세요');
      return;
    }
    crud.addRow();
  };
  const deleteRow = crud.deleteChecked;

  // retrieve(companyId) L115-118 ← Sys01_Tab_Company.retrieveTabpage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId) retrieve(); else crud.clear(); }, [companyId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
      <Space>
        {/* [E1] retrieveButton[조회].Select (L50) */}
        <Button type="search" onClick={retrieve}>조회</Button>
        {/* [E2] updateButton[저장].Select (L56) */}
        <Button type="save" onClick={update}>저장</Button>
        {/* [E3] insertButton[등록].Select (L62) */}
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E4] deleteButton[삭제].Select (L68) */}
        <Button type="delete" onClick={deleteRow}>삭제</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<AdminUser>
          crud={crud}
          columnDefs={columnDefs}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
        />
      </div>
      <Sys82_Lookup_UserMenu userId={menuUserId} onClose={() => setMenuUserId(undefined)} />
    </div>
  );
};
