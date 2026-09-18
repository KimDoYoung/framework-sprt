import React, { useState } from 'react';
import { Checkbox, Tag } from 'antd';
import {
  FileTextOutlined,
  AuditOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  IdcardOutlined,
  FormOutlined,
  TeamOutlined,
  AppstoreOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { MenuLevel_1, MenuLevel_3 } from '../types';
import { menuLevel_1_List } from '../mock/data';

interface LeftMenuBarProps {
  activeMenuId: string | null;
  onSelectMenuLevel_1: (menuId: string | null) => void;
  onSelectMenuLevel_3: (item: MenuLevel_3, parentMenu: MenuLevel_1) => void;
  pinned: boolean;
  onTogglePin: (pinned: boolean) => void;
  selectedMenuLevel_3_Code?: string;
  // Backward compatibility props
  onSelectFirstLevel?: (menuId: string) => void;
  onSelectMenuItem?: (item: MenuLevel_3, parentMenu: MenuLevel_1) => void;
  selectedSubMenuCode?: string;
}

export const LeftMenuBar: React.FC<LeftMenuBarProps> = ({
  activeMenuId,
  onSelectMenuLevel_1,
  onSelectMenuLevel_3,
  pinned,
  onTogglePin,
  selectedMenuLevel_3_Code,
}) => {
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  // 1차 메뉴 아이콘 렌더링
  const renderIcon = (iconName: string, active: boolean) => {
    const style = { fontSize: 20, color: active ? '#1a1a1a' : '#abb4c4', marginBottom: 4 };
    switch (iconName) {
      case 'FileTextOutlined':
        return <FileTextOutlined style={style} />;
      case 'AuditOutlined':
        return <AuditOutlined style={style} />;
      case 'SafetyCertificateOutlined':
        return <SafetyCertificateOutlined style={style} />;
      case 'CalendarOutlined':
        return <CalendarOutlined style={style} />;
      case 'IdcardOutlined':
        return <IdcardOutlined style={style} />;
      case 'FormOutlined':
        return <FormOutlined style={style} />;
      case 'TeamOutlined':
        return <TeamOutlined style={style} />;
      case 'AppstoreOutlined':
        return <AppstoreOutlined style={style} />;
      default:
        return <AppstoreOutlined style={style} />;
    }
  };

  // 1차 메뉴(MenuLevel_1) 아이콘 클릭 핸들러
  // - 현재 펼쳐진 상태에서 동일한 아이콘을 다시 클릭하면 2,3차 메뉴 패널 닫힘 (토글)
  // - '고정'이 체크되어 있으면 토글로 닫히지 않고 열린 상태 유지
  // - 다른 1차 메뉴 아이콘이 클릭되면 무조건 해당 메뉴로 오픈
  const handleMenuLevel_1_Click = (menuId: string) => {
    if (activeMenuId === menuId) {
      if (!pinned) {
        onSelectMenuLevel_1(null);
      }
    } else {
      onSelectMenuLevel_1(menuId);
    }
  };

  const activeMenuObj = menuLevel_1_List.find((m) => m.id === activeMenuId);

  return (
    <div style={{ display: 'flex', height: '100%', zIndex: 900 }}>
      {/* ── MenuLevel_1: 1차 아이콘 바 (Dark Sidebar, 64px) ── */}
      <div
        style={{
          width: 64,
          backgroundColor: '#1f2430',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 8,
          borderRight: '1px solid #151a24',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {menuLevel_1_List.map((menu) => {
          const isActive = activeMenuId === menu.id;
          return (
            <div
              key={menu.id}
              onClick={() => handleMenuLevel_1_Click(menu.id)}
              style={{
                width: 54,
                height: 58,
                margin: '3px 0',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#1a1a1a' : '#a9b3c4',
                transition: 'all 0.15s ease',
              }}
              title={menu.title}
            >
              {renderIcon(menu.iconName, isActive)}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: -0.5,
                  color: isActive ? '#1a1a1a' : '#cbd3e0',
                }}
              >
                {menu.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── MenuLevel_2 / MenuLevel_3: 2단계 그룹 및 3단계 항목 패널 (230px, White & Clean) ── */}
      {activeMenuObj && (
        <div
          style={{
            width: 230,
            backgroundColor: '#ffffff',
            borderRight: '1px solid #d9dfe8',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: pinned ? 'none' : '4px 0 16px rgba(0,0,0,0.12)',
            flexShrink: 0,
            zIndex: 950,
          }}
        >
          {/* MenuLevel_2 & MenuLevel_3 List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 0',
            }}
          >
            {activeMenuObj.groups.map((group) => (
              <div key={group.groupCode} style={{ marginBottom: 12 }}>
                {/* MenuLevel_2 헤더 */}
                <div
                  style={{
                    backgroundColor: '#eef2f8',
                    color: '#2a3b5c',
                    fontWeight: 700,
                    fontSize: 12 + fontSizeOffset,
                    padding: '6px 14px',
                    borderTop: '1px solid #e1e7f0',
                    borderBottom: '1px solid #e1e7f0',
                  }}
                >
                  {group.groupTitle}
                </div>

                {/* MenuLevel_3 항목들 */}
                <div style={{ padding: '4px 0' }}>
                  {group.items.map((item) => {
                    const isItemSelected = selectedMenuLevel_3_Code === item.code;
                    return (
                      <div
                        key={item.code}
                        onClick={() => onSelectMenuLevel_3(item, activeMenuObj)}
                        style={{
                          padding: '6px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: 12 + fontSizeOffset,
                          color: isItemSelected ? '#1677ff' : '#4a5568',
                          fontWeight: isItemSelected ? 600 : 400,
                          backgroundColor: isItemSelected ? '#e6f4ff' : 'transparent',
                          transition: 'background-color 0.12s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isItemSelected) {
                            e.currentTarget.style.backgroundColor = '#f7fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isItemSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: '#8c9ba5', fontSize: 11, fontFamily: 'monospace' }}>
                            {item.code}
                          </span>
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Tag color="cyan" style={{ fontSize: 10, margin: 0, padding: '0 4px' }}>
                            {item.badge}
                          </Tag>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 컨트롤: 폰트 확대/축소 및 '고정' 체크박스 */}
          <div
            style={{
              height: 38,
              borderTop: '1px solid #e5e9f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: 12,
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.min(prev + 1, 3))}
                style={{
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  borderRadius: 3,
                  width: 22,
                  height: 22,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="글꼴 확대"
              >
                <PlusOutlined style={{ fontSize: 10 }} />
              </button>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.max(prev - 1, -2))}
                style={{
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  borderRadius: 3,
                  width: 22,
                  height: 22,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="글꼴 축소"
              >
                <MinusOutlined style={{ fontSize: 10 }} />
              </button>
            </div>

            <Checkbox
              checked={pinned}
              onChange={(e) => onTogglePin(e.target.checked)}
              style={{ fontSize: 12, fontWeight: 500, color: '#4b5563' }}
            >
              고정
            </Checkbox>
          </div>
        </div>
      )}
    </div>
  );
};
