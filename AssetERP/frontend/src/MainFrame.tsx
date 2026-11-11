import { useState, useEffect, useRef, useCallback } from 'react';
import { message, Dropdown, MenuProps, ConfigProvider, Tooltip, Modal, InputRef } from 'antd';
import koKR from 'antd/locale/ko_KR';
import dayjs from 'dayjs';
import {
  Layout,
  Model,
  Actions,
  TabNode,
  TabSetNode,
  BorderNode,
  ITabSetRenderValues,
  ITabRenderValues,
  IJsonModel,
  DockLocation,
} from 'flexlayout-react';
import './flexlayout-custom.css';

/** 저장된 레이아웃 JSON 의 노드(fixNode 가 읽고 고치는 부분만) */
type LayoutJsonNode = {
  type?: string; enableClose?: boolean; enableDeleteWhenEmpty?: boolean; maximized?: boolean;
  enableMaximize?: boolean; enableDivide?: boolean; enableDrop?: boolean; enableScrollbars?: boolean;
  children?: LayoutJsonNode[];
};

import { TopBar } from './components/TopBar';
import { LeftMenuBar } from './components/LeftMenuBar';
import { StatusBar } from './components/StatusBar';
import { MyPageView } from './components/mypage';
import { PendingScreenView } from './components/PendingScreenView';
import { SCREENS } from './pages/screens';
import { MenuLevel_1, MenuLevel_3 } from './types';
import { registerMenuOpener } from './utils/tempData';
import { appSettingsStorage } from './utils/storage';
import { useAppSetting } from './hooks/useAppSetting';
import { useGlobalHotkeys } from './hooks/useGlobalHotkeys';
import { MyScreenPreset } from './api/userProps';
import { getFontOption, applyGlobalFont } from './utils/font';
import { authApi } from './api/auth';
import { sysApi } from './api/sys';
import { User } from './types/auth';
import { LoginUserContext } from './hooks/useLoginUser';
import { realtime } from './ws/stompClient';
import { attApi } from './api/att';
import { Att02_Lookup_Commute } from './pages/att/Att02_Lookup_Commute';
import { Emp00_Lookup_SendMessage } from './pages/emp/Emp00_Lookup_SendMessage';
import { Emp04_Lookup_AddTitleList } from './pages/emp/Emp04_Lookup_AddTitleList';
import { loginGates } from './utils/loginGates';
import { UserManual } from './components/UserManual';
import { Frm01_Lookup_CheckList } from './pages/frm/Frm01_Lookup_CheckList';
import { MySetting } from './pages/frm/MySetting';
import { frmApi } from './api/frm';
import { FrmNoticeCnt } from './types/frm';

/** 탭 헤더 hover 툴팁 내용. 지금(개발 중)은 클래스명. 끝나면 undefined(없음) 또는 `${menuNo} ${title}` 등으로 바꾼다 */
const tabTooltip = (config: { classNm?: string; title?: string; menuNo?: string }): string | undefined => config.classNm;

// ── 기본 레이아웃 정의 (초기 상태: My Page 1개 탭) ──
const defaultLayoutJson: IJsonModel = {
  global: {
    tabEnableClose: true,
    tabSetEnableMaximize: false, // FlexLayout 기본 최대화 버튼 미노출 (onRenderTabSet에서 커스텀 버튼 렌더)
    tabSetEnableClose: true, // 탭셋 닫기/삭제 허용
    tabSetEnableCloseButton: false, // FlexLayout 기본 닫기 버튼 미노출 (onRenderTabSet에서 커스텀 버튼 렌더)
    tabSetEnableDeleteWhenEmpty: true, // 탭이 0개가 되면 해당 분할 패널(탭셋) 자동 소멸
    tabEnableRename: false,
    tabEnableScrollbars: false, // 탭 외곽 스크롤바 방지 (뷰포트 피팅 및 내부 가상 스크롤 격리)
    tabSetEnableDivide: true, // 패널 드래그 분할 허용
    tabSetEnableDrop: true, // 드롭 허용
    tabSetEnableDrag: true,
    tabEnableDrag: true,
    enableEdgeDock: true,
    enableEdgeDockIndicators: true,
    tabSetMinWidth: 240,
    tabSetMinHeight: 160,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 100,
        id: 'main-tabset',
        enableDivide: true,
        enableDrop: true,
        children: [
          {
            type: 'tab',
            name: 'My Page',
            component: 'mypage',
            enableClose: false,
            enableScrollbars: false,
            id: 'tab-mypage',
          },
        ],
      },
    ],
  },
};

// 로컬 스토리지에 저장된 레이아웃 정제 (0개 탭 자동 소멸, 최대화 해제, 분할 허용 강제 적용)
function sanitizeLayoutJson(json: IJsonModel): IJsonModel {
  if (!json.global) {
    json.global = {};
  }
  json.global.tabSetEnableClose = true;
  json.global.tabSetEnableCloseButton = false;
  json.global.tabSetEnableDeleteWhenEmpty = true;
  json.global.tabEnableScrollbars = false; // 외곽 스크롤 방지
  json.global.tabSetEnableMaximize = false; // FlexLayout 기본 최대화 버튼 방지
  json.global.tabSetEnableDivide = true; // 패널 드래그 분할 보장
  json.global.tabSetEnableDrop = true;
  json.global.tabSetEnableDrag = true;
  json.global.tabEnableDrag = true;
  json.global.enableEdgeDock = true;
  json.global.enableEdgeDockIndicators = true;

  const fixNode = (node?: LayoutJsonNode) => {
    if (!node) return;
    if (node.type === 'tabset') {
      if (node.enableClose === false) delete node.enableClose;
      if (node.enableDeleteWhenEmpty === false) delete node.enableDeleteWhenEmpty;
      if (node.maximized) delete node.maximized; // 저장된 최대화 상태 초기 해제
      node.enableMaximize = false;
      node.enableDivide = true;
      node.enableDrop = true;
    }
    if (node.type === 'tab') {
      node.enableScrollbars = false;
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(fixNode);
    }
  };

  if (json.layout) {
    fixNode(json.layout);
  }
  return json;
}

// 로컬 스토리지(asseterp_settings)에서 저장된 레이아웃 복원 또는 기본 레이아웃 로드
function getInitialModel(): Model {
  const savedLayout = appSettingsStorage.get('flexlayout_model');
  if (savedLayout) {
    try {
      const m = Model.fromJson(sanitizeLayoutJson(savedLayout));
      const maxTs = m.getMaximizedTabset();
      if (maxTs) {
        m.doAction(Actions.maximizeToggle(maxTs.getId()));
      }
      return m;
    } catch (e) {
      console.warn('저장된 레이아웃 복원 실패, 기본값 사용:', e);
    }
  }
  return Model.fromJson(defaultLayoutJson);
}

interface MainFrameProps {
  user: User;
  onLogout: () => void;
}

export default function MainFrame({ user, onLogout }: MainFrameProps) {
  const handleLogout = async () => {
    // 로그아웃 알림(LOGOUT)은 다른 탭용이므로, 이 탭은 먼저 연결을 끊어 자기 알림을 받지 않는다
    await realtime.disconnect();
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    } finally {
      onLogout();
    }
  };

  // ── 출퇴근 창 (AS-IS MainFrame.checkCommute() L336-374, 생성자 L307: 회사 commutePopupYn일 때만 로그인 직후 한 번) ──
  const [commuteOpen, setCommuteOpen] = useState(false);
  useEffect(() => {
    let alive = true;
    attApi.getMyCommuteLast().then(res => {
      if (!alive || !res.popupYn) return;
      let pass = false;
      const last = res.last;
      if (last) {
        if (res.lockYn) pass = last.statusCode !== '99';
        if (dayjs().format('YYYY-MM-DD') === last.workDate) {
          if (last.checkInTime == null) pass = true;
        } else {
          pass = true;
        }
      } else {
        pass = true;
      }
      if (pass) setCommuteOpen(true);
    }).catch(err => console.error(err));
    return () => { alive = false; };
  }, [user.userId, user.companyId]);

  // ── 알림발송 창 (AS-IS MainFrame webAlarmAnchor E8 L605: 관리자는 "관리자는 해당기능을 제공하지않습니다") ──
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const openSendMessage = () => {
    if (user.userId < 0) { message.info('관리자는 해당기능을 제공하지않습니다'); return; }
    setSendMessageOpen(true);
  };

  // ── 겸직전환 창 (AS-IS MainFrame addTitleAnchor E11 L670 → Emp04_Lookup_AddTitleList.open(callback)) ──
  const [addTitleOpen, setAddTitleOpen] = useState(false);

  // ── 메뉴 (GET /api/v1/sys/menus, 로그인 사용자 권한 기준) ──
  const [menus, setMenus] = useState<MenuLevel_1[]>([]);
  useEffect(() => {
    sysApi
      .getMenus()
      .then(setMenus)
      .catch((err) => {
        console.error(err);
        message.error('메뉴를 불러오지 못했습니다.');
      });
  }, [user.userId, user.companyId]);

  // ── 알림 창 (AS-IS MainFrame warning E4 L294 → Frm01_Lookup_CheckList.open()) + 알림 아이콘 상태(checkActive() L382-471, 주기 조회) ──
  const [checkListOpen, setCheckListOpen] = useState(false);
  // ── 기본설정(도움말) 창 (AS-IS MainFrame settingAnchor L746 → MySetting.open(), EE62·EE63) ──
  const [settingOpen, setSettingOpen] = useState(false);
  // ── 온라인 도움말 창 (AS-IS MainFrame helpAnchor "?" L754-767 → user_manual.jsp) ──
  const [helpOpen, setHelpOpen] = useState(false);
  const [alarmState, setAlarmState] = useState<'none' | 'normal' | 'twinkle'>('none');
  const hasMenu1128 = menus.some(m1 => m1.groups.some(g => g.items.some(i => i.menuNo === '1128')));
  const applyCount = useCallback((c: FrmNoticeCnt) => {
    if (c.cnt1 + c.cnt2 > 0) setAlarmState(c.cnt1 > 0 ? 'twinkle' : 'normal');
    else if (hasMenu1128 && c.cnt5 > 0) setAlarmState('twinkle');
    else setAlarmState('none');
  }, [hasMenu1128]);
  useEffect(() => {
    if (user.userId < 0) return; // 회사관리자는 알림 건수가 없다
    let alive = true;
    const tick = () => frmApi.getNoticeCnt().then(c => { if (alive) applyCount(c); }).catch(() => undefined);
    tick();
    const timer = window.setInterval(tick, 60000);
    return () => { alive = false; window.clearInterval(timer); };
  }, [user.userId, user.companyId, applyCount]);

  // ── 실시간 접속 기록 (AS-IS LoginPage.openFrame2 L678-731 로그인 직후 + MainFrame update 타이머 L426-444 2분마다, 회사관리자 제외) ──
  useEffect(() => {
    if (user.userId < 0) return;
    const tick = () => { frmApi.updateLoginRealTime().catch(() => undefined); };
    tick();
    const timer = window.setInterval(tick, 120000); // updateTime = 120000 (L380)
    return () => window.clearInterval(timer);
  }, [user.userId]);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(true);
  const [selectedMenuLevel_3_Code, setSelectedMenuLevel_3_Code] = useState<string>('');

  // ── 글꼴 설정 상태 (asseterp_settings 단일 저장소 연동) ──
  // TopBar 글꼴 버튼은 지웠다(2026-11-11) — 고르는 곳은 사용자 설정 탭(재설계 2, sys90_props)에서 다시 만든다
  const [fontFamily] = useAppSetting('font_family', 'pretendard');
  const currentFontOpt = getFontOption(fontFamily);

  useEffect(() => {
    applyGlobalFont(fontFamily);
  }, [fontFamily]);

  // ── FlexLayout 모델 상태 ──
  const [model, setModel] = useState<Model>(() => getInitialModel());

  // ── 첫 탭 (AS-IS MainFrame 생성자 L237-252): admin 회사 로그인이면 My Page 대신
  //    관리자 → "고객별 시스템정보 관리"(Sys01_Tab_Company), 그 밖 → "초기화면" 환영. 서버가 판정한다.
  useEffect(() => {
    let alive = true;
    frmApi.getInitialScreen().then(res => {
      if (!alive) return;
      const node = model.getNodeById('tab-mypage');
      if (!node) return;
      const attrs =
        res.screen === 'COMPANY' ? { name: '고객별 시스템정보 관리', component: 'initial-company' }
        : res.screen === 'WELCOME' ? { name: '초기화면', component: 'initial-welcome' }
        : { name: 'My Page', component: 'mypage' };
      if ((node as TabNode).getComponent() !== attrs.component) {
        model.doAction(Actions.updateNodeAttributes('tab-mypage', attrs));
      }
    }).catch(() => { /* 판정 실패 시 My Page 그대로 */ });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userId]);

  // ── 탭 헤더 컨텍스트 메뉴 상태 ──
  const [contextMenu, setContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    tabNode: TabNode | null;
  }>({ open: false, x: 0, y: 0, tabNode: null });

  const handleSelectMenuLevel_1 = (menuId: string | null) => {
    setActiveMenuId(menuId);
  };

  // ── 메뉴 클릭 및 화면번호 검색 시: 활성화된 탭셋(TabSet)에 새 탭 추가 또는 기존 탭 활성화 ──
  const handleSelectMenuLevel_3 = (item: MenuLevel_3, _parent: MenuLevel_1) => {
    setSelectedMenuLevel_3_Code(item.code);
    // admin 회사의 고정 첫 탭(initial-company)이 이미 같은 화면이면 새 탭을 열지 않고 그 탭을 고른다 (#1075 중복 탭 방지, 2026-11-10)
    const homeNode = model.getNodeById('tab-mypage') as TabNode | undefined;
    if (item.classNm === 'Sys01_Tab_Company' && homeNode?.getComponent() === 'initial-company') {
      model.doAction(Actions.selectTab('tab-mypage'));
      return;
    }
    const tabId = `tab-${item.code}`;

    const existingNode = model.getNodeById(tabId);
    if (existingNode) {
      // 이미 열려 있는 탭이면 해당 탭 선택
      model.doAction(Actions.selectTab(tabId));
    } else {
      // 현재 활성화된 탭셋(없으면 첫 번째 탭셋)에 탭 추가
      const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
      const targetTabsetId = activeTabset ? activeTabset.getId() : 'main-tabset';

      const componentType = 'screen';

      model.doAction(
        Actions.addTab(
          {
            type: 'tab',
            name: `${item.menuNo ?? item.code} ${item.title}`,
            component: componentType,
            id: tabId,
            config: { code: item.code, title: item.title, menuNo: item.menuNo, classNm: item.classNm },
            enableClose: true,
            enableScrollbars: false,
          },
          targetTabsetId,
          DockLocation.CENTER,
          -1,
          true // 바로 선택
        )
      );
    }
  };

  // ── 화면에서 다른 메뉴 탭 열기 (AS-IS MenuOpener.openTabCallback, utils/tempData.ts) ──
  const openMenuRef = useRef<(menuNo: string) => boolean>(() => false);
  openMenuRef.current = (menuNo: string) => {
    for (const level1 of menus) {
      for (const group of level1.groups) {
        const item = group.items.find(i => i.menuNo === menuNo);
        if (item) {
          handleSelectMenuLevel_3(item, level1);
          return true;
        }
      }
    }
    return false;
  };
  useEffect(() => registerMenuOpener(menuNo => openMenuRef.current(menuNo)), []);

  // ── 레이아웃 변경 시 자동 로컬 스토리지(asseterp_settings) 디바운스 비동기 저장 ──
  const saveLayoutTimerRef = useRef<number | null>(null);
  const handleModelChange = (newModel: Model) => {
    if (saveLayoutTimerRef.current) {
      window.clearTimeout(saveLayoutTimerRef.current);
    }
    saveLayoutTimerRef.current = window.setTimeout(() => {
      appSettingsStorage.set('flexlayout_model', newModel.toJson());
    }, 200);
  };

  // ── 전역 단축키 (재설계 04): Alt+X 탭 닫기, Alt+Shift+X 모든 탭 닫기, Esc 화면번호 칸, F4 최대화, F9 나의 화면 ──
  const toggleMaximize = () => {
    const maxTs = model.getMaximizedTabset();
    if (maxTs) {
      model.doAction(Actions.maximizeToggle(maxTs.getId()));
    } else {
      const target = model.getActiveTabset() || model.getFirstTabSet();
      if (target) {
        model.doAction(Actions.maximizeToggle(target.getId()));
      }
    }
  };

  const closeCurrentTab = () => {
    const ts = model.getActiveTabset() || model.getFirstTabSet();
    const node = ts?.getSelectedNode();
    if (node instanceof TabNode && node.isCloseable()) {
      model.doAction(Actions.deleteTab(node.getId()));
    }
  };

  // 전체 레이아웃(분할된 탭셋 모두)의 닫을 수 있는 탭. My Page(첫 탭)는 닫을 수 없어 남는다
  const closeAllConfirmingRef = useRef(false);
  const closeAllTabs = () => {
    if (closeAllConfirmingRef.current) return;
    const tabs: TabNode[] = [];
    model.visitNodes(n => { if (n instanceof TabNode && n.isCloseable()) tabs.push(n); });
    if (tabs.length === 0) {
      message.info('닫을 화면이 없습니다.');
      return;
    }
    closeAllConfirmingRef.current = true;
    Modal.confirm({
      title: `열린 화면 ${tabs.length}개를 모두 닫을까요?`,
      okText: '모두 닫기',
      cancelText: '취소',
      onOk: () => { tabs.forEach(t => model.doAction(Actions.deleteTab(t.getId()))); },
      afterClose: () => { closeAllConfirmingRef.current = false; },
    });
  };

  const searchInputRef = useRef<InputRef>(null);
  const [myScreenOpen, setMyScreenOpen] = useState(false);

  useGlobalHotkeys({
    closeCurrentTab,
    closeAllTabs,
    focusScreenSearch: () => searchInputRef.current?.focus({ cursor: 'all' }),
    toggleMaximize,
    toggleMyScreen: () => setMyScreenOpen(o => !o),
  });

  // ── 컨텍스트 메뉴 외부 클릭 시 닫기 ──
  useEffect(() => {
    if (!contextMenu.open) return;
    const handleOutsideClick = () => {
      setContextMenu((prev) => ({ ...prev, open: false }));
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [contextMenu.open]);

  // ── 탭셋 내부의 모든 닫기 가능 탭 일괄 닫기 ──
  const handleCloseAllInTabSet = (tabset: TabSetNode) => {
    const children = tabset.getChildren().filter((c): c is TabNode => c instanceof TabNode);
    const closeableTabs = children.filter((t) => t.isCloseable());
    if (closeableTabs.length === 0) {
      message.info('닫을 수 있는 탭이 없습니다.');
      return;
    }
    closeableTabs.forEach((tab) => {
      model.doAction(Actions.deleteTab(tab.getId()));
    });
  };

  // ── 탭 헤더 hover 툴팁 (내용은 tabTooltip). 복원된 탭도 config.classNm이 있으므로 같이 적용된다 ──
  const onRenderTab = (node: TabNode, renderValues: ITabRenderValues) => {
    const tip = tabTooltip((node.getConfig() as { classNm?: string; title?: string; menuNo?: string }) || {});
    if (tip) {
      renderValues.content = (
        <Tooltip title={tip} mouseEnterDelay={0.3}>
          <span>{renderValues.content}</span>
        </Tooltip>
      );
    }
  };

  // ── TabSet 우측 툴바 버튼 커스텀 렌더: '모든 탭 닫기' & '최대화/복원(F4)' ──
  const onRenderTabSet = (tabSetNode: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
    if (!(tabSetNode instanceof TabSetNode)) return;
    const isMax = tabSetNode.isMaximized();

    renderValues.buttons.push(
      <button
        key="close-all"
        type="button"
        title="모든 탭 닫기"
        className="flexlayout-toolbar-custom-btn"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          handleCloseAllInTabSet(tabSetNode);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x"
          aria-hidden="true"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>,
      <button
        key="max-toggle"
        type="button"
        title={isMax ? '복원(F4)' : '최대화(F4)'}
        className="flexlayout-toolbar-custom-btn"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          model.doAction(Actions.maximizeToggle(tabSetNode.getId()));
        }}
      >
        {isMax ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: 14, height: 14, strokeWidth: 2.5 }}
          >
            <path
              stroke="var(--color-icon)"
              d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: 14, height: 14, strokeWidth: 2.5 }}
          >
            <path
              stroke="var(--color-icon)"
              d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
            ></path>
          </svg>
        )}
      </button>
    );
  };

  // ── 탭 헤더 우클릭 시 컨텍스트 메뉴 표시 ──
  const handleContextMenu = (node: unknown, event: React.MouseEvent<HTMLElement>) => {
    if (node instanceof TabNode) {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({
        open: true,
        x: event.clientX,
        y: event.clientY,
        tabNode: node,
      });
    }
  };

  // ── 컨텍스트 메뉴 아이템 목록 생성 ──
  const getContextMenuItems = (): MenuProps['items'] => {
    const targetTab = contextMenu.tabNode;
    if (!targetTab) return [];

    const parent = targetTab.getParent();
    const siblings = parent
      ? parent.getChildren().filter((c): c is TabNode => c instanceof TabNode)
      : [];
    const currentIndex = siblings.findIndex((s) => s.getId() === targetTab.getId());

    const rightSiblings = currentIndex >= 0 ? siblings.slice(currentIndex + 1) : [];
    const otherSiblings = currentIndex >= 0 ? siblings.filter((_, i) => i !== currentIndex) : [];

    const canCloseCurrent = targetTab.isCloseable();
    const canCloseRight = rightSiblings.some((s) => s.isCloseable());
    const canCloseOthers = otherSiblings.some((s) => s.isCloseable());
    const canCloseAll = siblings.some((s) => s.isCloseable());

    return [
      {
        key: 'close-current',
        label: '이 탭 닫기 (Alt+X)',
        disabled: !canCloseCurrent,
        onClick: () => {
          if (canCloseCurrent) {
            model.doAction(Actions.deleteTab(targetTab.getId()));
          }
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        key: 'close-right',
        label: '오른쪽 모든 탭 닫기',
        disabled: !canCloseRight,
        onClick: () => {
          rightSiblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        key: 'close-others',
        label: '다른 탭 모두 닫기',
        disabled: !canCloseOthers,
        onClick: () => {
          otherSiblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        type: 'divider',
      },
      {
        key: 'close-all',
        label: '전체 탭 닫기',
        disabled: !canCloseAll,
        danger: true,
        onClick: () => {
          siblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
    ];
  };


  // ── 나의 화면 저장 (재설계 03): 지금 배치 읽기 / 저장된 배치로 복원 ──
  const getCurrentLayout = () => {
    const ts = model.getActiveTabset() || model.getFirstTabSet();
    const node = ts?.getSelectedNode();
    const cfg = node instanceof TabNode ? ((node.getConfig() as { title?: string }) || {}) : {};
    const defaultName = cfg.title || (node instanceof TabNode ? node.getName() : '') || '나의 화면';
    return { model: model.toJson(), defaultName };
  };

  const applyMyScreen = (preset: MyScreenPreset) => {
    // 지금 사용자 메뉴에 있는 화면만 연다 (저장 뒤 권한이 빠졌거나 화면이 없어졌을 수 있다)
    const allowed = new Set<string>();
    menus.forEach(m1 => m1.groups.forEach(g => g.items.forEach(i => allowed.add(i.code))));
    let dropped = 0;
    type JNode = { type?: string; component?: string; config?: { code?: string }; selected?: number; children?: JNode[] };
    const prune = (node: JNode): JNode | null => {
      if (node.type === 'tab') {
        if (node.component === 'screen' && !allowed.has(node.config?.code ?? '')) { dropped++; return null; }
        return node;
      }
      if (!Array.isArray(node.children)) return node;
      const kids = node.children.map(prune).filter((c): c is JNode => c !== null);
      if (node.type === 'tabset') {
        node.children = kids;
        if ((node.selected ?? 0) >= kids.length) node.selected = 0;
        return kids.length === 0 ? null : node; // 빈 탭셋은 뺀다
      }
      node.children = kids;
      return kids.length === 0 ? null : node; // 빈 행은 뺀다
    };
    try {
      const json = JSON.parse(JSON.stringify(preset.model)) as IJsonModel;
      const root = prune(json.layout as unknown as JNode);
      if (!root) {
        message.warning(`'${preset.name}'에는 지금 열 수 있는 화면이 없습니다.`);
        return;
      }
      json.layout = root as unknown as IJsonModel['layout'];
      const sanitized = sanitizeLayoutJson(json);
      const m = Model.fromJson(sanitized);
      if (!m.getNodeById('tab-mypage')) {
        // 첫 탭(My Page)은 늘 있어야 한다 — 없으면 첫 탭셋 맨 앞에 지금 것을 넣는다
        const home = model.getNodeById('tab-mypage') as TabNode | undefined;
        const first = m.getFirstTabSet();
        if (home && first) m.doAction(Actions.addTab(home.toJson(), first.getId(), DockLocation.CENTER, 0, false));
      }
      setModel(m);
      appSettingsStorage.set('flexlayout_model', m.toJson());
      // 화면이 바뀌는 것으로 충분하다 — 빠진 화면이 있을 때만 알린다 (2026-11-11 사용자)
      if (dropped > 0) message.info(`열 수 없는 화면 ${dropped}개는 빠졌습니다.`);
    } catch (e) {
      console.error(e);
      message.error('화면 배치를 불러오지 못했습니다.');
    }
  };

  // ── FlexLayout Tab 컴포넌트 렌더러 (factory) ──
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = (node.getConfig() as { code?: string; title?: string; menuNo?: string; classNm?: string }) || {};

    if (component === 'mypage') {
      return <MyPageView />;
    }

    // admin 회사 로그인의 첫 탭 (AS-IS MainFrame 생성자)
    if (component === 'initial-company') {
      const Company = SCREENS['Sys01_Tab_Company'];
      return Company ? <Company /> : null;
    }
    if (component === 'initial-welcome') {
      return (
        <div style={{ margin: 20, padding: '40px 40px 10px', border: '1px solid #d9d9d9', height: 'calc(100% - 40px)', color: '#262d3f', fontSize: 14, fontWeight: 'bold' }}>
          <div>&nbsp;환영합니다. {user.companyName} {user.name}.</div>
          <div style={{ marginTop: 20 }}>&nbsp;좌측의 매뉴를 이용하여, Asset-ERP 관리를 시작하세요.</div>
          <div style={{ marginTop: 200, color: '#E1E5EE' }}>&nbsp;Asset-ERP</div>
        </div>
      );
    }

    // 변환한 화면 (화면 등록표)
    const Screen = config.classNm ? SCREENS[config.classNm] : undefined;
    if (Screen) {
      return <Screen />;
    }

    // 아직 변환하지 않은 화면 (메뉴는 실제 sys06_menu)
    return (
      <PendingScreenView
        title={config.title || node.getName()}
        menuNo={config.menuNo}
        classNm={config.classNm}
      />
    );
  };

  return (
    <LoginUserContext.Provider value={user}>
    <ConfigProvider
      locale={koKR}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          fontFamily: currentFontOpt.cssFamily,
        },
        components: {
          // 분할선(Splitter) 색 — antd 기본(평상시 ≈ #f5f5f5)은 거의 안 보여 파랑 계열로. 평상시 blue-3 → hover blue-4 → 드래그 blue-5 (2026-11-10)
          Splitter: { controlItemBgHover: '#91caff', controlItemBgActive: '#69b1ff', controlItemBgActiveHover: '#4096ff' },
        },
      }}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          menus={menus}
          sidebarPinned={sidebarPinned}
          onToggleSidebarPin={() => setSidebarPinned(!sidebarPinned)}
          onOpenScreen={handleSelectMenuLevel_3}
          myScreenOpen={myScreenOpen}
          onMyScreenOpenChange={setMyScreenOpen}
          getCurrentLayout={getCurrentLayout}
          onApplyMyScreen={applyMyScreen}
          searchInputRef={searchInputRef}
          userName={`${user.companyName} ${user.name}님`}
          onLogout={handleLogout}
          onOpenCommute={() => setCommuteOpen(true)}
          onOpenSendMessage={openSendMessage}
          onOpenAddTitle={() => setAddTitleOpen(true)}
          onOpenCheckList={() => setCheckListOpen(true)}
          onOpenSetting={() => setSettingOpen(true)}
          onOpenHelp={() => setHelpOpen(true)}
          alarmState={alarmState}
        />
        <MySetting open={settingOpen} isManager={user.userId < 0} onClose={() => setSettingOpen(false)} />
        <UserManual open={helpOpen} menus={menus} onClose={() => setHelpOpen(false)} />
        <Frm01_Lookup_CheckList open={checkListOpen} hasMenu1128={hasMenu1128} onCount={applyCount} onClose={() => setCheckListOpen(false)} />
        {/* callback "change": AS-IS는 상단·MyPage·메뉴를 다시 만든다 → TOBE는 새 토큰 쿠키로 화면을 다시 연다 */}
        <Emp04_Lookup_AddTitleList open={addTitleOpen} onClose={() => setAddTitleOpen(false)}
          onChanged={(switched) => { if (switched) loginGates.passAll(switched.jti); setAddTitleOpen(false); window.setTimeout(() => window.location.reload(), 700); }} />
        <Emp00_Lookup_SendMessage open={sendMessageOpen} onClose={() => setSendMessageOpen(false)} />
        <Att02_Lookup_Commute open={commuteOpen} onClose={() => setCommuteOpen(false)} />

        {/* ── Body Container with LeftMenuBar & FlexLayout ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
          {/* ── 왼쪽 MenuLevel_1 아이콘 메뉴 및 MenuLevel_2/3 서브메뉴 ── */}
          <LeftMenuBar
            menus={menus}
            activeMenuId={activeMenuId}
            onSelectMenuLevel_1={handleSelectMenuLevel_1}
            onSelectMenuLevel_3={handleSelectMenuLevel_3}
            pinned={sidebarPinned}
            onTogglePin={setSidebarPinned}
            selectedMenuLevel_3_Code={selectedMenuLevel_3_Code}
          />

          {/* ── Main Content Area: FlexLayout Multi-Split & Docking ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, backgroundColor: '#eef2f6' }}>
            {/* FlexLayout Viewport */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Layout
                model={model}
                factory={factory}
                onModelChange={handleModelChange}
                onRenderTab={onRenderTab}
                onRenderTabSet={onRenderTabSet}
                onContextMenu={handleContextMenu}
                realtimeResize
              />

              {/* 탭 헤더 우클릭 컨텍스트 메뉴 */}
              <Dropdown
                menu={{ items: getContextMenuItems() }}
                open={contextMenu.open}
                onOpenChange={(open) => !open && setContextMenu((prev) => ({ ...prev, open: false }))}
                trigger={['contextMenu']}
              >
                <div
                  style={{
                    position: 'fixed',
                    left: contextMenu.x,
                    top: contextMenu.y,
                    width: 1,
                    height: 1,
                    pointerEvents: 'none',
                    zIndex: 9999,
                  }}
                />
              </Dropdown>
            </div>
          </div>
        </div>

        {/* ── Status Bar (System Health, Message, Clock) ── */}
        <StatusBar />
      </div>
    </ConfigProvider>
    </LoginUserContext.Provider>
  );
}
