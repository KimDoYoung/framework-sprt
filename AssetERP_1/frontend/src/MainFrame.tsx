/** B05 임시 MainFrame: 로그인 결과만 보여 준다. B06에서 OMS MainFrame(TopBar·LeftMenuBar·탭·MyPage)으로 바꾼다 */
import React from 'react';
import { Button, Descriptions } from 'antd';
import { authApi } from './api/auth';
import { User } from './types/auth';

interface Props {
  user: User;
  onLogout: () => void;
}

const MainFrame: React.FC<Props> = ({ user, onLogout }) => (
  <div style={{ padding: 24 }}>
    <Descriptions title="로그인됨 (B05 임시 화면)" bordered column={1} size="small">
      <Descriptions.Item label="이름">{user.name}</Descriptions.Item>
      <Descriptions.Item label="회사">{user.companyName} ({user.companyCode})</Descriptions.Item>
      <Descriptions.Item label="테넌트">{user.tenant}</Descriptions.Item>
      <Descriptions.Item label="권한">{user.roles?.join(', ')}</Descriptions.Item>
    </Descriptions>
    <Button
      style={{ marginTop: 16 }}
      onClick={async () => {
        try {
          await authApi.logout();
        } finally {
          onLogout();
        }
      }}
    >
      로그아웃
    </Button>
  </div>
);

export default MainFrame;
