import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Input, Modal, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../../api/sys';
import { errorMessage } from '../../../api/client';
import { MenuCopy, SysCompany } from '../../../types/sys';

interface MenuCopyModalProps {
  open: boolean;
  /** 닫을 때 (AS-IS: 닫으면 메뉴 트리를 다시 조회) */
  onClose: () => void;
}

/**
 * 메뉴 일괄복사 (AS-IS Sys06_Lookup_CopyMulti): 왼쪽 메뉴·오른쪽 고객사를 체크해 권한부여/권한삭제.
 * AS-IS의 '적용상품' 콤보는 조회 SQL이 쓰지 않아 뺐다.
 */
export const MenuCopyModal: React.FC<MenuCopyModalProps> = ({ open, onClose }) => {
  const menuGrid = useRef<AgGridReact<MenuCopy>>(null);
  const companyGrid = useRef<AgGridReact<SysCompany>>(null);
  const [menuText, setMenuText] = useState('');
  const [menuNameYn, setMenuNameYn] = useState(false);
  const [companyText, setCompanyText] = useState('');
  const [menus, setMenus] = useState<MenuCopy[]>([]);
  const [companies, setCompanies] = useState<SysCompany[]>([]);

  const retrieveMenus = useCallback(async () => {
    try {
      setMenus(await sysApi.searchCopyMenus(menuText, menuNameYn));
    } catch (err) {
      message.error(errorMessage(err, '메뉴 조회 실패'));
    }
  }, [menuText, menuNameYn]);

  const retrieveCompanies = useCallback(async () => {
    try {
      setCompanies(await sysApi.searchCopyCompanies(companyText));
    } catch (err) {
      message.error(errorMessage(err, '고객사 조회 실패'));
    }
  }, [companyText]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) { retrieveMenus(); retrieveCompanies(); } }, [open]);

  const confirm = (useYn: boolean) => {
    const menuIds = (menuGrid.current?.api?.getSelectedRows() ?? []).map(m => m.menuId);
    const companyIds = (companyGrid.current?.api?.getSelectedRows() ?? []).map(c => c.companyId);
    if (menuIds.length === 0) {
      message.warning('메뉴를 선택해주세요');
      return;
    }
    if (companyIds.length === 0) {
      message.warning('고객사를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: useYn ? '일괄 권한부여를 진행하시겠습니까?' : '일괄 권한삭제를 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await sysApi.updateCompanyMenusBulk(menuIds, companyIds, useYn);
          message.success(useYn ? '일괄 권한부여가 완료되었습니다' : '일괄 권한삭제가 완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  const menuCols = useMemo<ColDef<MenuCopy>[]>(() => [
    { field: 'parentPathNm', headerName: '경로', width: 300 },
    { field: 'menuNoPlusNm', headerName: '메뉴명', flex: 1 },
  ], []);
  const companyCols = useMemo<ColDef<SysCompany>[]>(() => [
    { field: 'companyNm', headerName: '고객명', flex: 1 },
    { field: 'useYn', headerName: '사용여부', width: 90, cellDataType: 'boolean' },
    { field: 'icamCompanyCd', headerName: 'ICAM코드', width: 90, cellStyle: { textAlign: 'center' } },
  ], []);

  return (
    <Modal open={open} title="메뉴 일괄복사" width={1200} onCancel={onClose} maskClosable={false} destroyOnClose
      footer={
        <Space>
          <Button type="primary" onClick={() => confirm(true)}>권한부여</Button>
          <Button danger onClick={() => confirm(false)}>권한삭제</Button>
          <Button onClick={onClose}>닫기</Button>
        </Space>
      }>
      <div style={{ display: 'flex', gap: 12, height: 480 }}>
        <div style={{ flex: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space>
            <Typography.Text strong>검색</Typography.Text>
            <Input style={{ width: 200 }} value={menuText} onChange={e => setMenuText(e.target.value)} onPressEnter={retrieveMenus} />
            <Button type="primary" onClick={retrieveMenus}>조회</Button>
            <Checkbox checked={menuNameYn} onChange={e => setMenuNameYn(e.target.checked)}>메뉴명만 검색</Checkbox>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <AgGridReact<MenuCopy> ref={menuGrid} rowData={menus} columnDefs={menuCols} getRowId={p => String(p.data.menuId)}
              rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true }} />
          </div>
        </div>
        <div style={{ flex: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space>
            <Typography.Text strong>검색</Typography.Text>
            <Input style={{ width: 200 }} value={companyText} onChange={e => setCompanyText(e.target.value)} onPressEnter={retrieveCompanies} />
            <Button type="primary" onClick={retrieveCompanies}>조회</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <AgGridReact<SysCompany> ref={companyGrid} rowData={companies} columnDefs={companyCols} getRowId={p => String(p.data.companyId)}
              rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true }} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
