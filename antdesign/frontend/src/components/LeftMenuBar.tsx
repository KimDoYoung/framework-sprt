import React, { useState, useEffect } from 'react';
import { Tag, Tooltip, Button } from 'antd';
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
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { MenuLevel_1, MenuLevel_3 } from '../types';
import { menuLevel_1_List } from '../mock/data';
import { useAppSetting } from '../hooks/useAppSetting';

// ── 설계 문서(설계-layout.md)에 제시된 Lucide 규격 아이콘 컴포넌트 ──
const ChevronsDownIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 13, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="m7 6 5 5 5-5" />
    <path d="m7 13 5 5 5-5" />
  </svg>
);

const ChevronsUpIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 13, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="m17 11-5-5-5 5" />
    <path d="m17 18-5-5-5 5" />
  </svg>
);

const PinIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 13, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <line x1="12" y1="17" x2="12" y2="22" />
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
  </svg>
);

const PinOffIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 13, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M12 17v5" />
    <path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" />
    <path d="m2 2 20 20" />
    <path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" />
  </svg>
);

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
  const [fontSizeOffset, setFontSizeOffset] = useAppSetting('menu23_font_size', 0);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [isPanelHovered, setIsPanelHovered] = useState<boolean>(false);

  // 1차 메뉴 변경 시 서브 메뉴 그룹 접힘 상태 초기화 (모두 펼침)
  useEffect(() => {
    setCollapsedGroups(new Set());
  }, [activeMenuId]);

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
  // - 다른 1차 메뉴 아이콘이 클릭되면 무조건 해당 메뉴로 오픈
  const handleMenuLevel_1_Click = (menuId: string) => {
    if (activeMenuId === menuId) {
      onSelectMenuLevel_1(null);
    } else {
      onSelectMenuLevel_1(menuId);
    }
  };

  const activeMenuObj = menuLevel_1_List.find((m) => m.id === activeMenuId);

  // 3차 메뉴(MenuLevel_3) 항목 클릭 핸들러
  // - 선택된 메뉴 항목을 상위로 전달하여 탭 열기/활성화
  // - '고정(pinned)' 상태가 아니면 3차 메뉴 선택 시 메뉴23 패널을 자동으로 숨김 (설계-layout.md 규칙)
  const handleSelectMenuLevel_3_Item = (item: MenuLevel_3) => {
    if (activeMenuObj) {
      onSelectMenuLevel_3(item, activeMenuObj);
    }
    if (!pinned) {
      onSelectMenuLevel_1(null);
    }
  };

  // 개별 2차 메뉴 그룹 접기/펼치기 토글
  const handleToggleGroup = (groupCode: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupCode)) {
        next.delete(groupCode);
      } else {
        next.add(groupCode);
      }
      return next;
    });
  };

  // 모두 펼치기
  const handleExpandAll = () => {
    setCollapsedGroups(new Set());
  };

  // 모두 접기
  const handleCollapseAll = () => {
    if (activeMenuObj) {
      const allCodes = activeMenuObj.groups.map((g) => g.groupCode);
      setCollapsedGroups(new Set(allCodes));
    }
  };

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
          onMouseEnter={() => setIsPanelHovered(true)}
          onMouseLeave={() => setIsPanelHovered(false)}
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
              padding: '6px 0',
            }}
          >
            {activeMenuObj.groups.map((group, groupIndex) => {
              const isCollapsed = collapsedGroups.has(group.groupCode);
              const isFirstGroup = groupIndex === 0;

              return (
                <div key={group.groupCode} style={{ marginBottom: isCollapsed ? 4 : 8 }}>
                  {/* MenuLevel_2 헤더 */}
                  <div
                    onClick={() => handleToggleGroup(group.groupCode)}
                    style={{
                      backgroundColor: '#eef2f8',
                      color: '#2a3b5c',
                      fontWeight: 700,
                      fontSize: 12 + fontSizeOffset,
                      padding: '4px 8px 4px 10px',
                      borderTop: '1px solid #e1e7f0',
                      borderBottom: '1px solid #e1e7f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e4ecf7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#eef2f8';
                    }}
                  >
                    {/* 좌측: 펼침/접힘 화살표 및 그룹 제목 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        minWidth: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {isCollapsed ? (
                        <CaretRightOutlined style={{ fontSize: 10, color: '#627d98', flexShrink: 0 }} />
                      ) : (
                        <CaretDownOutlined style={{ fontSize: 10, color: '#627d98', flexShrink: 0 }} />
                      )}
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {group.groupTitle}
                      </span>
                    </div>

                    {/* 첫 번째 메뉴레벨2 우측: '모두펼치기', '모두접기', '고정' 3개 아이콘 */}
                    {isFirstGroup && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          flexShrink: 0,
                          marginLeft: 4,
                        }}
                      >
                        <Tooltip title="모두 펼치기" placement="top">
                          <Button
                            type="text"
                            size="small"
                            onClick={handleExpandAll}
                            style={{
                              width: 20,
                              height: 20,
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#627d98',
                            }}
                            icon={<ChevronsDownIcon size={13} />}
                          />
                        </Tooltip>

                        <Tooltip title="모두 접기" placement="top">
                          <Button
                            type="text"
                            size="small"
                            onClick={handleCollapseAll}
                            style={{
                              width: 20,
                              height: 20,
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#627d98',
                            }}
                            icon={<ChevronsUpIcon size={13} />}
                          />
                        </Tooltip>

                        <Tooltip
                          title={pinned ? '메뉴 고정 해제' : '메뉴 고정'}
                          placement="top"
                        >
                          <Button
                            type="text"
                            size="small"
                            onClick={() => onTogglePin(!pinned)}
                            style={{
                              width: 20,
                              height: 20,
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: pinned ? '#1677ff' : '#627d98',
                              backgroundColor: pinned ? '#e6f4ff' : 'transparent',
                              border: pinned ? '1px solid #91caff' : '1px solid transparent',
                              borderRadius: 3,
                            }}
                            icon={
                              pinned ? (
                                <PinIcon size={13} style={{ color: '#1677ff' }} />
                              ) : (
                                <PinOffIcon size={13} style={{ color: '#627d98' }} />
                              )
                            }
                          />
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  {/* MenuLevel_3 항목들 (펼쳐진 상태에서만 렌더링) */}
                  {!isCollapsed && (
                    <div style={{ padding: '2px 0' }}>
                      {group.items.map((item) => {
                        const isItemSelected = selectedMenuLevel_3_Code === item.code;
                        return (
                          <div
                            key={item.code}
                            onClick={() => handleSelectMenuLevel_3_Item(item)}
                            style={{
                              padding: '5px 12px 5px 18px',
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
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 컨트롤: 마우스 호버 시에만 나타나는 폰트 확대/축소 및 크기 초기화 */}
          <div
            style={{
              height: isPanelHovered ? 32 : 0,
              minHeight: isPanelHovered ? 32 : 0,
              opacity: isPanelHovered ? 1 : 0,
              overflow: 'hidden',
              borderTop: isPanelHovered ? '1px solid #e5e9f0' : '1px solid transparent',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isPanelHovered ? '0 10px' : '0 10px',
              fontSize: 11,
              color: '#6b7280',
              userSelect: 'none',
              flexShrink: 0,
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <span style={{ fontSize: 11 }}>글꼴 크기</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.min(prev + 1, 3))}
                style={{
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  borderRadius: 3,
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4b5563',
                }}
                title="글꼴 확대"
              >
                <PlusOutlined style={{ fontSize: 9 }} />
              </button>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.max(prev - 1, -2))}
                style={{
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  borderRadius: 3,
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4b5563',
                }}
                title="글꼴 축소"
              >
                <MinusOutlined style={{ fontSize: 9 }} />
              </button>
              {fontSizeOffset !== 0 && (
                <button
                  onClick={() => setFontSizeOffset(0)}
                  style={{
                    border: '1px solid #d1d5db',
                    background: '#fff',
                    borderRadius: 3,
                    padding: '0 4px',
                    height: 20,
                    cursor: 'pointer',
                    fontSize: 10,
                    color: '#6b7280',
                  }}
                  title="글꼴 기본 크기로 초기화"
                >
                  기본
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
