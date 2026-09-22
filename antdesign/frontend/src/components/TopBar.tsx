import React, { useState, useMemo } from 'react';
import { Input, Avatar, Dropdown, MenuProps, Tooltip, AutoComplete, Modal, Popconfirm, message, Tag } from 'antd';
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
  AppstoreOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FontSizeOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { MenuLevel_1, MenuLevel_3 } from '../types';
import { menuLevel_1_List } from '../mock/data';
import { SavedLayoutItem } from '../utils/storage';
import { FontFamilyId, FONT_OPTIONS, getFontOption } from '../utils/font';

interface TopBarProps {
  sidebarPinned: boolean;
  onToggleSidebarPin: () => void;
  onOpenScreen?: (item: MenuLevel_3, parent: MenuLevel_1) => void;
  savedLayouts?: SavedLayoutItem[];
  onSaveNamedLayout?: (name: string) => void;
  onLoadNamedLayout?: (item: SavedLayoutItem) => void;
  onDeleteNamedLayout?: (id: string) => void;
  onResetLayout?: () => void;
  currentFontId?: FontFamilyId;
  onChangeFont?: (id: FontFamilyId) => void;
}

interface ScreenSearchItem {
  code: string;
  title: string;
  categoryTitle: string;
  parentLevel1: MenuLevel_1;
  item: MenuLevel_3;
}

export const TopBar: React.FC<TopBarProps> = ({
  sidebarPinned,
  onToggleSidebarPin,
  onOpenScreen,
  savedLayouts = [],
  onSaveNamedLayout,
  onLoadNamedLayout,
  onDeleteNamedLayout,
  onResetLayout,
  currentFontId = 'pretendard',
  onChangeFont,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');

  // ── 전체 메뉴 평탄화 (화면번호/메뉴명 검색용) ──
  const allScreens: ScreenSearchItem[] = useMemo(() => {
    const list: ScreenSearchItem[] = [];
    for (const m1 of menuLevel_1_List) {
      for (const grp of m1.groups) {
        for (const item of grp.items) {
          list.push({
            code: item.code,
            title: item.title,
            categoryTitle: m1.title,
            parentLevel1: m1,
            item,
          });
        }
      }
    }
    return list;
  }, []);

  // ── 화면번호/메뉴명 자동완성 옵션 목록 ──
  const searchOptions = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return [];
    return allScreens
      .filter((s) => s.code.toLowerCase().includes(term) || s.title.toLowerCase().includes(term))
      .slice(0, 10)
      .map((s) => ({
        value: s.code,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <Tag color="blue" style={{ marginRight: 6, fontSize: 11, padding: '0 4px' }}>
                {s.code}
              </Tag>
              <span style={{ fontWeight: 500, fontSize: 12 }}>{s.title}</span>
            </span>
            <span style={{ fontSize: 11, color: '#8c8c8c' }}>{s.categoryTitle}</span>
          </div>
        ),
        screen: s,
      }));
  }, [searchValue, allScreens]);

  // ── 검색어 입력 후 Enter 또는 선택 시 화면 열기 ──
  const handleSelectScreen = (code: string) => {
    const found = allScreens.find((s) => s.code === code);
    if (found && onOpenScreen) {
      onOpenScreen(found.item, found.parentLevel1);
      message.success(`[${found.code}] ${found.title} 화면을 열었습니다.`);
      setSearchValue('');
    }
  };

  const handleSearchEnter = () => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return;

    // 1. 코드 완전 일치 검색
    let found = allScreens.find((s) => s.code.toLowerCase() === term);
    // 2. 제목 완전 일치 검색
    if (!found) {
      found = allScreens.find((s) => s.title.toLowerCase() === term);
    }
    // 3. 코드 또는 제목 부분 일치 검색
    if (!found) {
      found = allScreens.find(
        (s) => s.code.toLowerCase().includes(term) || s.title.toLowerCase().includes(term)
      );
    }

    if (found && onOpenScreen) {
      onOpenScreen(found.item, found.parentLevel1);
      message.success(`[${found.code}] ${found.title} 화면을 열었습니다.`);
      setSearchValue('');
    } else {
      message.warning(`화면번호 또는 메뉴 '${searchValue}'을(를) 찾을 수 없습니다.`);
    }
  };

  // ── 레이아웃 저장 확인 ──
  const handleSaveLayoutConfirm = () => {
    if (!newLayoutName.trim()) {
      message.warning('레이아웃 이름을 입력해 주세요.');
      return;
    }
    onSaveNamedLayout?.(newLayoutName.trim());
    setNewLayoutName('');
    setIsSaveModalOpen(false);
  };

  // ── 화면 레이아웃 드롭다운 메뉴 아이템 ──
  const layoutMenuItems: MenuProps['items'] = [
    {
      key: 'save-current',
      icon: <PlusOutlined style={{ color: '#1677ff' }} />,
      label: '현재 레이아웃 이름 지정 저장...',
      onClick: () => {
        setNewLayoutName(`화면배치 ${savedLayouts.length + 1}`);
        setIsSaveModalOpen(true);
      },
    },
    { type: 'divider' },
    {
      key: 'saved-group',
      type: 'group',
      label: `저장된 레이아웃 목록 (${savedLayouts.length})`,
      children:
        savedLayouts.length > 0
          ? savedLayouts.map((item) => ({
              key: item.id,
              label: (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: 220,
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                    onClick={() => onLoadNamedLayout?.(item)}
                  >
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</span>
                    <span style={{ fontSize: 11, color: '#8c8c8c', marginLeft: 8 }}>
                      {item.createdAt}
                    </span>
                  </div>
                  <Popconfirm
                    title="레이아웃 삭제"
                    description={`'${item.name}'을(를) 삭제하시겠습니까?`}
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      onDeleteNamedLayout?.(item.id);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="삭제"
                    cancelText="취소"
                  >
                    <DeleteOutlined
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: '#ff4d4f', fontSize: 12, padding: '2px 4px', cursor: 'pointer' }}
                    />
                  </Popconfirm>
                </div>
              ),
            }))
          : [
              {
                key: 'no-layouts',
                disabled: true,
                label: <span style={{ color: '#8c8c8c', fontSize: 12 }}>저장된 레이아웃이 없습니다</span>,
              },
            ],
    },
    { type: 'divider' },
    {
      key: 'reset-default',
      icon: <ReloadOutlined />,
      label: '기본 레이아웃으로 초기화',
      onClick: () => onResetLayout?.(),
    },
  ];

  const currentFontOpt = getFontOption(currentFontId);

  // ── 폰트 선택 드롭다운 메뉴 아이템 (Pretendard vs 나눔폰트 비교) ──
  const fontMenuItems: MenuProps['items'] = [
    {
      key: 'font-group-header',
      type: 'group',
      label: (
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
          한글 폰트 비교 / 선택 (ERP 환경)
        </span>
      ),
      children: FONT_OPTIONS.map((opt) => ({
        key: opt.id,
        label: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: 280,
              gap: 12,
              padding: '4px 0',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontWeight: currentFontId === opt.id ? 700 : 500,
                    fontSize: 13,
                    color: currentFontId === opt.id ? '#1677ff' : '#1e293b',
                  }}
                >
                  {opt.name}
                </span>
                {opt.badge && (
                  <Tag
                    color={
                      opt.id === 'pretendard'
                        ? 'blue'
                        : opt.id === 'nanum-square-neo'
                        ? 'green'
                        : opt.id === 'nanum-gothic'
                        ? 'orange'
                        : 'default'
                    }
                    style={{ margin: 0, fontSize: 10, padding: '0 4px', lineHeight: '16px' }}
                  >
                    {opt.badge}
                  </Tag>
                )}
              </div>
              <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{opt.description}</span>
            </div>
            {currentFontId === opt.id && (
              <CheckOutlined style={{ color: '#1677ff', fontSize: 13, flexShrink: 0 }} />
            )}
          </div>
        ),
        onClick: () => {
          onChangeFont?.(opt.id);
          message.info(`글꼴이 '${opt.name}'(으)로 적용되었습니다.`);
        },
      })),
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '내 정보 수정' },
    { key: 'setting', icon: <SettingOutlined />, label: '개인 환경설정' },
    { type: 'divider' },
    { key: 'logout', icon: <PoweroffOutlined />, label: '로그아웃', danger: true },
  ];

  return (
    <>
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
        {/* Left section: Logo, Search, Layout Management */}
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

          {/* ── 화면번호/메뉴명 입력 AutoComplete 검색창 (Enter 호출 지원) ── */}
          <div style={{ marginLeft: 12 }}>
            <AutoComplete
              value={searchValue}
              options={searchOptions}
              onSelect={handleSelectScreen}
              onChange={setSearchValue}
              style={{ width: 240 }}
            >
              <Input
                placeholder="화면번호/메뉴명 (Enter)"
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                onPressEnter={handleSearchEnter}
                allowClear
                style={{
                  borderRadius: 20,
                  fontSize: 12,
                  background: '#fff',
                  border: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
                }}
              />
            </AutoComplete>
          </div>

          {/* ── 화면 레이아웃 관리 드롭다운 (저장/불러오기) ── */}
          <Dropdown menu={{ items: layoutMenuItems }} trigger={['click']} placement="bottomLeft">
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                fontSize: 12,
                fontWeight: 500,
                userSelect: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                transition: 'all 0.15s ease',
              }}
              title="화면 레이아웃 저장 및 불러오기"
            >
              <AppstoreOutlined style={{ fontSize: 13 }} />
              <span>화면 레이아웃</span>
              <DownOutlined style={{ fontSize: 9, opacity: 0.8 }} />
            </div>
          </Dropdown>

          {/* ── 폰트 선택 드롭다운 (Pretendard vs 나눔폰트 비교) ── */}
          <Dropdown menu={{ items: fontMenuItems }} trigger={['click']} placement="bottomLeft">
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                fontSize: 12,
                fontWeight: 500,
                userSelect: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                transition: 'all 0.15s ease',
              }}
              title="글꼴 실시간 비교 및 전환 (Pretendard vs 나눔폰트)"
            >
              <FontSizeOutlined style={{ fontSize: 13 }} />
              <span>글꼴: {currentFontOpt.name}</span>
              <DownOutlined style={{ fontSize: 9, opacity: 0.8 }} />
            </div>
          </Dropdown>
        </div>

        {/* Right section: Help, User, Messenger/Tool icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Tooltip title="온라인 도움말 / 아이디어 제안" placement="bottom">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
              <BulbOutlined
                style={{
                  fontSize: 18,
                  color: '#fff',
                  transition: 'transform 0.2s',
                }}
              />
            </span>
          </Tooltip>

          {/* User Profile dropdown */}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
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

          {/* Tool action icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              borderLeft: '1px solid rgba(255,255,255,0.25)',
              paddingLeft: 14,
            }}
          >
            <Tooltip title="AI 어시스턴트 (Beta)" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
                <RobotOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
            <Tooltip title="사내 메신저" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
                <MessageOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
            <Tooltip title="업무 전송 / 쪽지" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
                <SendOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
            <Tooltip title="사내 공지사항" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
                <SoundOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
            <Tooltip title="사용자 정보" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
                <UserOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
            <Tooltip title="시스템 설정" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
                <SettingOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
            <Tooltip title="로그아웃" placement="bottomRight">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
                <PoweroffOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* ── 화면 레이아웃 이름 지정 저장 모달 ── */}
      <Modal
        title="현재 화면 레이아웃 저장"
        open={isSaveModalOpen}
        onOk={handleSaveLayoutConfirm}
        onCancel={() => setIsSaveModalOpen(false)}
        okText="저장"
        cancelText="취소"
        destroyOnClose
      >
        <div style={{ marginBottom: 12, color: '#595959', fontSize: 13 }}>
          현재 분할된 화면과 열려 있는 탭들의 배치를 이름으로 저장합니다.
        </div>
        <Input
          placeholder="레이아웃 이름 (예: 기본 업무 3분할, 당직점검 배치)"
          value={newLayoutName}
          onChange={(e) => setNewLayoutName(e.target.value)}
          onPressEnter={handleSaveLayoutConfirm}
          autoFocus
        />
      </Modal>
    </>
  );
};
