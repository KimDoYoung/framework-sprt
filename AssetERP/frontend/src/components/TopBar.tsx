import React, { useState, useMemo, useRef } from 'react';
import { fileApi } from '../api/file';
import { useLoginUser } from '../hooks/useLoginUser';
import { Input, InputRef, Avatar, Dropdown, MenuProps, Tooltip, AutoComplete, Popover, ConfigProvider, message, Tag } from 'antd';
import {
  SearchOutlined,
  BulbOutlined,
  UserOutlined,
  DownOutlined,
  RobotOutlined,
  MessageOutlined,
  SendOutlined,
  ClockCircleOutlined,
  BellOutlined,
  SwapOutlined,
  SoundOutlined,
  SettingOutlined,
  PoweroffOutlined,
  LayoutOutlined,
} from '@ant-design/icons';
import type { IJsonModel } from 'flexlayout-react';
import { MenuLevel_1, MenuLevel_3 } from '../types';
import { MyScreenPreset } from '../api/userProps';
import { MyScreenPanel } from './MyScreenPanel';

interface TopBarProps {
  menus: MenuLevel_1[];
  sidebarPinned: boolean;
  onToggleSidebarPin: () => void;
  onOpenScreen?: (item: MenuLevel_3, parent: MenuLevel_1) => void;
  /** 나의 화면 패널 (재설계 03) — 열림 상태는 MainFrame 이 가진다(F9 와 같이 쓰려고) */
  myScreenOpen?: boolean;
  onMyScreenOpenChange?: (open: boolean) => void;
  getCurrentLayout?: () => { model: IJsonModel; defaultName: string };
  onApplyMyScreen?: (preset: MyScreenPreset) => void;
  /** 화면번호 입력칸 — Esc 로 포커스 (재설계 04) */
  searchInputRef?: React.Ref<InputRef>;
  userName?: string;
  onLogout?: () => void;
  /** AS-IS MainFrame.checkCommute() / JSCaller — 출퇴근 창 (EE50, 진입 아이콘은 TOBE 확인용 추가) */
  onOpenCommute?: () => void;
  /** AS-IS MainFrame webAlarmAnchor L605 — 알림발송(쪽지) 창 (EE51) */
  onOpenSendMessage?: () => void;
  /** AS-IS MainFrame addTitleAnchor L670 — 겸직전환 창 (EE52) */
  onOpenAddTitle?: () => void;
  /** AS-IS MainFrame warning 아이콘(E4 L294) — 알림 창 (EE53). alarmState: none 알림 없음 / normal 체크리스트 있음 / twinkle 미결재·매매승인 있음(깜빡임) */
  onOpenCheckList?: () => void;
  /** AS-IS MainFrame settingAnchor L746 — 기본설정(도움말) 창 (EE62·EE63) */
  onOpenSetting?: () => void;
  /** AS-IS MainFrame helpAnchor "?" L754-767 — 온라인 도움말 창 (user_manual.jsp) */
  onOpenHelp?: () => void;
  alarmState?: 'none' | 'normal' | 'twinkle';
}

interface ScreenSearchItem {
  code: string;
  title: string;
  categoryTitle: string;
  parentLevel1: MenuLevel_1;
  item: MenuLevel_3;
}

export const TopBar: React.FC<TopBarProps> = ({
  menus,
  sidebarPinned,
  onToggleSidebarPin,
  onOpenScreen,
  myScreenOpen,
  onMyScreenOpenChange,
  getCurrentLayout,
  onApplyMyScreen,
  searchInputRef,
  userName,
  onLogout,
  onOpenCommute,
  onOpenSendMessage,
  onOpenAddTitle,
  onOpenCheckList,
  onOpenSetting,
  onOpenHelp,
  alarmState = 'none',
}) => {
  const loginUser = useLoginUser();
  const photoUrl = useMemo(() => fileApi.monitoringUrl(loginUser.userId), [loginUser.userId]);
  const [photoOk, setPhotoOk] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  // 나의 화면 패널이 지금 열려 있는지 (패널의 키 처리기가 실시간으로 확인한다 — props 는 닫힐 때 갱신되지 않는다)
  const myScreenOpenRef = useRef(false);
  myScreenOpenRef.current = !!myScreenOpen;

  // ── 전체 메뉴 평탄화 (화면번호/메뉴명 검색용) ──
  const allScreens: ScreenSearchItem[] = useMemo(() => {
    const list: ScreenSearchItem[] = [];
    for (const m1 of menus) {
      for (const grp of m1.groups) {
        for (const item of grp.items) {
          list.push({
            code: item.menuNo || item.code,
            title: item.title,
            categoryTitle: m1.title,
            parentLevel1: m1,
            item,
          });
        }
      }
    }
    return list;
  }, [menus]);

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
  // 후보가 떠 있을 때 Enter 한 번에 onSelect와 onPressEnter가 함께 불린다 → 직후 두 번째 호출은 무시
  const lastOpenRef = useRef(0);
  const openFound = (found: ScreenSearchItem) => {
    const now = Date.now();
    if (now - lastOpenRef.current < 300) return;
    lastOpenRef.current = now;
    onOpenScreen?.(found.item, found.parentLevel1);
    setSearchValue('');
    // 목록에서 고르면 AutoComplete 가 onSelect 뒤에 고른 값(화면번호)을 다시 넣는다 → 그다음에 한 번 더 비운다
    window.setTimeout(() => setSearchValue(''), 0);
  };

  // Ctrl+Delete: 화면번호 칸 모두 지우기 (브라우저 기본은 커서 뒤 한 단어만 지운다)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && !e.altKey && !e.metaKey && e.code === 'Delete') {
      e.preventDefault();
      setSearchValue('');
    }
  };

  const handleSelectScreen = (code: string) => {
    const found = allScreens.find((s) => s.code === code);
    if (found && onOpenScreen) openFound(found);
  };

  const handleSearchEnter = () => {
    if (Date.now() - lastOpenRef.current < 300) return;
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
      openFound(found);
    } else {
      message.warning(`화면번호 또는 메뉴 '${searchValue}'을(를) 찾을 수 없습니다.`);
    }
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '내 정보 수정' },
    { key: 'setting', icon: <SettingOutlined />, label: '개인 환경설정' },
    { key: 'addTitle', icon: <SwapOutlined />, label: '겸직전환' },
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
            {/* favicon(종이비행기) 그대로 — 흰 면 + 회색 접힌 자국. 색 필터를 걸면 접힌 자국이 사라진다. 메뉴 고정 해제 상태는 흐리게 (2026-11-11 사용자) */}
            <img
              src={`${import.meta.env.BASE_URL}favicon.ico`}
              alt=""
              width={22}
              height={22}
              style={{ opacity: sidebarPinned ? 1 : 0.6, transition: 'opacity 0.15s ease' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, userSelect: 'none' }}>
            <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.5, color: '#fff' }}>
              Asset-ERP 2.0
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>
              All-in-One System
            </span>
            {/* <UnorderedListOutlined style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginLeft: 2 }} /> */}
          </div>

          {/* ── 화면번호/메뉴명 입력 AutoComplete 검색창 (Enter 호출 지원, Esc 로 이동 — 재설계 04)
                 맨 오른쪽 동그라미 아이콘 = 나의 화면 (재설계 03, F9) ── */}
          <div style={{ marginLeft: 12 }}>
            {/* 자동완성 목록에서 ↑↓로 고른 항목이 잘 보이게 파란 배경 (antd 기본은 거의 흰색, 2026-11-11) */}
            <ConfigProvider theme={{ components: { Select: { optionActiveBg: '#bae0ff', optionSelectedBg: '#91caff' } } }}>
            <AutoComplete
              value={searchValue}
              options={searchOptions}
              onSelect={handleSelectScreen}
              onChange={setSearchValue}
              style={{ width: 260 }}
            >
              <Input
                ref={searchInputRef}
                placeholder="화면번호/메뉴명 (Esc)"
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                suffix={
                  <Popover
                    open={myScreenOpen}
                    onOpenChange={(v) => onMyScreenOpenChange?.(v)}
                    trigger="click"
                    placement="bottomRight"
                    arrow={false}
                    // 닫힐 때 내용을 없앤다: antd 는 닫힐 때 내용을 마지막 모습(open=true)으로 붙잡아 두어
                    // 패널의 키 처리기가 남아 Esc·숫자키(숫자패드)를 가로챘다 (2026-11-11 사용자 신고)
                    destroyOnHidden
                    styles={{ body: { padding: 0 } }}
                    content={
                      getCurrentLayout && onApplyMyScreen ? (
                        <MyScreenPanel
                          open={!!myScreenOpen}
                          liveOpenRef={myScreenOpenRef}
                          onClose={() => onMyScreenOpenChange?.(false)}
                          getCurrentLayout={getCurrentLayout}
                          onApply={(preset) => { setSearchValue(''); onApplyMyScreen(preset); }}
                        />
                      ) : null
                    }
                  >
                    {/* 패널이 열려 있으면 툴팁이 [현재 배치 저장]을 덮으므로 숨긴다 */}
                    <Tooltip title="나의 화면 (F9)" placement="bottom" open={myScreenOpen ? false : undefined}>
                      <span
                        // 입력칸 포커스·자동완성 목록이 열리지 않게
                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 22,
                          height: 22,
                          marginRight: -6,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          background: myScreenOpen ? '#1677ff' : '#e6f4ff',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <LayoutOutlined style={{ fontSize: 12, color: myScreenOpen ? '#fff' : '#1677ff' }} />
                      </span>
                    </Tooltip>
                  </Popover>
                }
                onKeyDown={handleSearchKeyDown}
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
            </ConfigProvider>
          </div>

        </div>

        {/* Right section: Help, User, Messenger/Tool icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Tooltip title="온라인 도움말 / 아이디어 제안" placement="bottom">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }} onClick={() => onOpenHelp?.()}>
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
          <Dropdown menu={{ items: userMenuItems, onClick: ({ key }) => { if (key === 'logout') onLogout?.(); if (key === 'addTitle') onOpenAddTitle?.(); if (key === 'setting') onOpenSetting?.(); } }} trigger={['click']} placement="bottomRight">
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
              {/* AS-IS MainFrame.getNorthLayout() L538: FileDownload?fileType=monitoring&parentId=로그인 사원 — 35×35 원형, object-fit cover */}
              {photoOk ? (
                <img
                  src={photoUrl}
                  alt=""
                  onError={() => setPhotoOk(false)}
                  style={{ borderRadius: '70%', objectFit: 'cover', height: 35, width: 35 }}
                />
              ) : (
                <Avatar
                  size={26}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)', color: '#fff' }}
                  icon={<UserOutlined />}
                />
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{userName}</span>
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
            <Tooltip title="알림 (미결재·체크리스트·공지사항)" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }} onClick={() => onOpenCheckList?.()}>
                <style>{'@keyframes erp-alarm-blink{0%,100%{opacity:1}50%{opacity:.25}}'}</style>
                <BellOutlined style={{
                  fontSize: 18,
                  color: alarmState === 'twinkle' ? '#ff7875' : alarmState === 'normal' ? '#ffd666' : '#fff',
                  animation: alarmState === 'twinkle' ? 'erp-alarm-blink 1s infinite' : undefined,
                }} />
              </span>
            </Tooltip>
            <Tooltip title="출퇴근" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }} onClick={() => onOpenCommute?.()}>
                <ClockCircleOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
            <Tooltip title="업무 전송 / 쪽지" placement="bottom">
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }} onClick={() => onOpenSendMessage?.()}>
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
              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }} onClick={() => onLogout?.()}>
                <PoweroffOutlined style={{ fontSize: 17, color: '#fff' }} />
              </span>
            </Tooltip>
          </div>
        </div>
      </header>

    </>
  );
};
