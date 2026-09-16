import React from 'react';
import { Input, Avatar, Dropdown, MenuProps, Tooltip } from 'antd';
import {
  SearchOutlined,
  BulbOutlined,
  UserOutlined,
  DownOutlined,
  RobotOutlined,
  MessageOutlined,
  SendOutlined,
  SoundOutlined,
  SettingOutlined,
  PoweroffOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

interface TopBarProps {
  onSearch?: (term: string) => void;
  sidebarPinned: boolean;
  onToggleSidebarPin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onSearch,
  sidebarPinned,
  onToggleSidebarPin,
}) => {
  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '내 정보 수정' },
    { key: 'setting', icon: <SettingOutlined />, label: '개인 환경설정' },
    { type: 'divider' },
    { key: 'logout', icon: <PoweroffOutlined />, label: '로그아웃', danger: true },
  ];

  return (
    <header
      style={{
        height: 50,
        background: 'linear-gradient(90deg, #1872b7 0%, #1782c5 45%, #009ab8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        position: 'relative',
      }}
    >
      {/* Left section: Logo, Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          onClick={onToggleSidebarPin}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            userSelect: 'none',
          }}
          title={sidebarPinned ? '메뉴 고정 해제' : '메뉴 고정'}
        >
          {sidebarPinned ? (
            <MenuFoldOutlined style={{ fontSize: 18, color: '#fff' }} />
          ) : (
            <MenuUnfoldOutlined style={{ fontSize: 18, color: '#fff' }} />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, userSelect: 'none' }}>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.5, color: '#fff' }}>
            Asset-ERP
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>
            All-in-One System
          </span>
          <UnorderedListOutlined style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginLeft: 2 }} />
        </div>

        {/* Rounded pill search bar matching main1.png */}
        <div style={{ marginLeft: 16 }}>
          <Input
            placeholder="화면번호/메뉴명/기능설명"
            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
            allowClear
            onChange={(e) => onSearch?.(e.target.value)}
            style={{
              width: 250,
              borderRadius: 20,
              fontSize: 12,
              background: '#fff',
              border: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
            }}
          />
        </div>
      </div>

      {/* Right section: Help, User, Messenger/Tool icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Tooltip title="온라인 도움말 / 아이디어 제안">
          <BulbOutlined
            style={{
              fontSize: 18,
              cursor: 'pointer',
              color: '#fff',
              transition: 'transform 0.2s',
            }}
          />
        </Tooltip>

        {/* User Profile dropdown */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              userSelect: 'none',
            }}
          >
            <Avatar
              size={26}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)', color: '#fff' }}
              icon={<UserOutlined />}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>IT개발실 김도영님</span>
            <DownOutlined style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }} />
          </div>
        </Dropdown>

        {/* Tool action icons from screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderLeft: '1px solid rgba(255,255,255,0.25)', paddingLeft: 14 }}>
          <Tooltip title="AI 어시스턴트 (Beta)">
            <RobotOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="사내 메신저">
            <MessageOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="업무 전송 / 쪽지">
            <SendOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="사내 공지사항">
            <SoundOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="사용자 정보">
            <UserOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="시스템 설정">
            <SettingOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="로그아웃">
            <PoweroffOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
