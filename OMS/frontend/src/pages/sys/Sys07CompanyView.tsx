import React, { useCallback, useRef, useState } from 'react';
import { Button, Modal, Space, Splitter, Typography, message } from 'antd';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { CompanyRoleMenuPanel, CompanyRoleMenuPanelHandle, CompanyRoleMenuSelection } from './sys07/CompanyRoleMenuPanel';

const empty: CompanyRoleMenuSelection = { checkedCompanies: [] };

/**
 * 권한그룹별 메뉴권한 복사 (AS-IS client/vi/sys/Sys07_Tab_Company). KFS 관리자 전용.
 * 위(출발지): 회사 → 권한그룹 → 메뉴. 아래(목적지): 회사를 체크한다.
 * 권한그룹복사: 원본 권한그룹을 이름 기준으로 대상 회사에 만든다(같은 이름이 있으면 건너뜀).
 * 매뉴권한복사: 원본 권한그룹의 그 메뉴(+상위 메뉴) 권한을 대상 회사의 같은 이름 권한그룹에 맞춘다.
 */
export const Sys07CompanyView: React.FC = () => {
  const [source, setSource] = useState<CompanyRoleMenuSelection>(empty);
  const [target, setTarget] = useState<CompanyRoleMenuSelection>(empty);
  const targetRef = useRef<CompanyRoleMenuPanelHandle>(null);

  const onSource = useCallback((s: CompanyRoleMenuSelection) => setSource(s), []);
  const onTarget = useCallback((s: CompanyRoleMenuSelection) => setTarget(s), []);

  const run = (title: string, content: string, call: () => Promise<number>, done: string) => {
    Modal.confirm({
      title, content, okText: '예', cancelText: '아니오', width: 560,
      onOk: async () => {
        try {
          const n = await call();
          message.success(`${done} (${n}개 회사)`);
          targetRef.current?.reload();
        } catch (err) {
          message.error(errorMessage(err, `${title} 실패`));
        }
      },
    });
  };

  const copyRole = () => {
    const { company, role } = source;
    const companies = target.checkedCompanies;
    if (!company || !role) { message.warning('복사할 권한그룹을 선택하세요.'); return; }
    if (companies.length === 0) { message.warning('복사할 목적지 회사를 선택해주세요'); return; }
    run('권한그룹복사', `[ 권한명 : ${role.roleNm} ]을 ${companies.length}개의 회사에 복사하시겠습니까?`,
      () => sysApi.copyRole(company.companyId, role.roleNm, companies.map(c => c.companyId)), '권한그룹복사가 완료되었습니다');
  };

  const copyMenu = () => {
    const { company, role, menu } = source;
    const companies = target.checkedCompanies;
    if (!company || !role) { message.warning('복사할 권한그룹을 선택하세요.'); return; }
    if (!menu) { message.warning('복사할 메뉴를 선택하세요.'); return; }
    if (companies.length === 0) { message.warning('복사할 목적지 회사를 선택해주세요'); return; }
    run('매뉴권한복사', `[ 권한명 : ${role.roleNm} ]의 [ 매뉴명 : ${menu.menuNoPlusNm} ]을 ${companies.length}개의 회사에 복사하시겠습니까?`,
      () => sysApi.copyRoleMenu(company.companyId, role.roleNm, menu.menuId, companies.map(c => c.companyId)), '매뉴권한복사가 완료되었습니다');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Space wrap style={{ padding: '8px 12px' }}>
        <Button type="primary" onClick={copyRole}>권한그룹복사</Button>
        <Button type="primary" onClick={copyMenu}>매뉴권한복사</Button>
        <Typography.Text style={{ color: '#4472C4' }}>※ 상단 : 출발지 회사 / 하단 : 목적지 회사</Typography.Text>
      </Space>
      <Splitter layout="vertical" style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel min="20%">
          <CompanyRoleMenuPanel title="출발지" onChange={onSource} />
        </Splitter.Panel>
        <Splitter.Panel min="20%">
          <CompanyRoleMenuPanel ref={targetRef} title="목적지" multiple onChange={onTarget} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
