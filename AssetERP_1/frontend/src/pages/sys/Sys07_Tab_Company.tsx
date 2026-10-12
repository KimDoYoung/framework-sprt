/**
 * [1247] 기초자료 > 50. 권한 > 권한그룹별 메뉴권한 복사  (A08) — admin 회사 메뉴: 출발지 회사의 권한그룹·메뉴권한을 목적지 회사들로 복사한다
 * AS-IS: myApp/client/vi/sys/Sys07_Tab_Company.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L38-68, BorderLayout): north = 툴바(50), center = 출발지 Sys07_Tab_InCompany(0.55, 분할), south = 목적지 Sys07_Tab_OutCompany(0.45, 분할)
 */
import React, { useRef } from 'react';
import { message, Modal, Space, Splitter, Typography } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company, Role, RoleMenuNode } from '@/types/sys';
import { Button } from '@/components/button';
import { Sys07_Tab_InCompany, Sys07_Tab_InCompanyHandle } from './Sys07_Tab_InCompany';
import { Sys07_Tab_OutCompany, Sys07_Tab_OutCompanyHandle } from './Sys07_Tab_OutCompany';

export const Sys07_Tab_Company: React.FC = () => {
  const tapInCompany = useRef<Sys07_Tab_InCompanyHandle>(null);
  const tapOutCompany = useRef<Sys07_Tab_OutCompanyHandle>(null);

  /**
   * 원본 순서: 목적지 0개 검사 → 확인 창. 출발지 권한(·메뉴)을 안 고르면 원본은 확인 창을 만들다 NPE로 멈춘다(아무 반응 없음)
   * → 경고만 띄운다(05 §8 ② 결정과 같은 취지, A08 작업기록 결정)
   */
  const sources = (withMenu: boolean) => {
    const companyList = tapOutCompany.current?.getModels() ?? [];
    if (companyList.length === 0) {
      message.warning('복사할 목적지 회사를 선택해주세요');
      return null;
    }
    const companyModel = tapInCompany.current?.getCompanyModel();
    const roleModel = tapInCompany.current?.getRoleModel();
    if (!companyModel || !roleModel) {
      message.warning('복사할 권한그룹을 선택해주세요');
      return null;
    }
    const menuModel = tapInCompany.current?.getMenuModel();
    if (withMenu && !menuModel) {
      message.warning('복사할 매뉴를 선택해주세요');
      return null;
    }
    return { companyModel, roleModel, menuModel, companyList };
  };

  // updateRole() L140-161: sys.Sys07_RoleMenu.updateRole(inCompanyId, roleName, 목적지 목록) → 완료 메시지 + 목적지 다시 조회
  const updateRole = async (inCompanyModel: Company, roleModel: Role, companyList: Company[]) => {
    try {
      await sysApi.copyRole({ inCompanyId: inCompanyModel.companyId, roleName: roleModel.roleNm, companyIds: companyList.map(c => c.companyId) });
      message.success('권한그룹복사가 완료되었습니다');
      tapOutCompany.current?.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '권한그룹복사 실패'));
    }
  };

  // updateMenu() L164-186: sys.Sys07_RoleMenu.updateMenu(inCompanyId, roleName, menuId, 목적지 목록) → 완료 메시지 + 목적지 다시 조회
  const updateMenu = async (inCompanyModel: Company, roleModel: Role, menuModel: RoleMenuNode, companyList: Company[]) => {
    try {
      await sysApi.copyMenu({
        inCompanyId: inCompanyModel.companyId, roleName: roleModel.roleNm, menuId: menuModel.menuId, companyIds: companyList.map(c => c.companyId),
      });
      message.success('매뉴권한복사가 완료되었습니다');
      tapOutCompany.current?.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '매뉴권한복사 실패'));
    }
  };

  // [E1] copyRoleButton[권한그룹복사].Select (L71) → 확인 → [E2] msgBox.DialogHide [YES] (L86) → updateRole()
  const copyRole = () => {
    const s = sources(false);
    if (!s) return;
    Modal.confirm({
      title: '권한그룹복사',
      width: 500,
      content: `[ 권한명 : ${s.roleModel.roleNm} ]을 ${s.companyList.length}개의 회사에 복사하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      onOk: () => updateRole(s.companyModel, s.roleModel, s.companyList),
    });
  };

  // [E3] copyMenuButton[매뉴권한복사].Select (L104) → 확인 → [E4] msgBox.DialogHide [YES] (L120) → updateMenu()
  const copyMenu = () => {
    const s = sources(true);
    if (!s || !s.menuModel) return;
    const menuModel = s.menuModel;
    Modal.confirm({
      title: '매뉴권한복사',
      width: 700,
      content: `[ 권한명 : ${s.roleModel.roleNm} ]의 [ 매뉴명 : ${menuModel.menuNoPlusNm} ]을 ${s.companyList.length}개의 회사에 복사하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      onOk: () => updateMenu(s.companyModel, s.roleModel, menuModel, s.companyList),
    });
  };

  // [E0] 화면 열림 (생성자 L38-68) → settings()
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space style={{ height: 50, padding: '0 8px', border: '1px solid #d9d9d9', flex: 'none' }}>
        <Button type="change" onClick={copyRole}>권한그룹복사</Button>
        <Button type="change" onClick={copyMenu}>매뉴권한복사</Button>
        <Typography.Text strong style={{ color: '#4472C4' }}>※ 상단 : 출발지 회사 / 하단 : 목적지 회사</Typography.Text>
      </Space>
      <Splitter layout="vertical" style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="55%" min={150}>
          <Sys07_Tab_InCompany ref={tapInCompany} />
        </Splitter.Panel>
        <Splitter.Panel min={150}>
          <Sys07_Tab_OutCompany ref={tapOutCompany} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
