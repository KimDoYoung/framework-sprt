import { useState, useEffect, useRef } from 'react';
import { message, Dropdown, MenuProps } from 'antd';
import {
  Layout,
  Model,
  Actions,
  TabNode,
  TabSetNode,
  BorderNode,
  ITabSetRenderValues,
  IJsonModel,
  DockLocation,
} from 'flexlayout-react';
import './flexlayout-custom.css';

import { TopBar } from './components/TopBar';
import { LeftMenuBar } from './components/LeftMenuBar';
import { StatusBar } from './components/StatusBar';
import { MyPageView } from './components/mypage';
import { LargeDataView } from './components/LargeDataView';
import { MenuLevel_1, MenuLevel_3 } from './types';
import { appSettingsStorage, SavedLayoutItem } from './utils/storage';

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

  const fixNode = (node: any) => {
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

export default function App() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>('duty');
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(true);
  const [selectedMenuLevel_3_Code, setSelectedMenuLevel_3_Code] = useState<string>('1495');

  // ── FlexLayout 모델 상태 ──
  const [model, setModel] = useState<Model>(() => getInitialModel());

  // ── 저장된 명명 레이아웃 목록 상태 ──
  const [savedLayouts, setSavedLayouts] = useState<SavedLayoutItem[]>(() =>
    appSettingsStorage.getSavedLayouts()
  );

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
    const tabId = `tab-${item.code}`;

    const existingNode = model.getNodeById(tabId);
    if (existingNode) {
      // 이미 열려 있는 탭이면 해당 탭 선택
      model.doAction(Actions.selectTab(tabId));
    } else {
      // 현재 활성화된 탭셋(없으면 첫 번째 탭셋)에 탭 추가
      const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
      const targetTabsetId = activeTabset ? activeTabset.getId() : 'main-tabset';

      model.doAction(
        Actions.addTab(
          {
            type: 'tab',
            name: `${item.code} ${item.title}`,
            component: 'largedata',
            id: tabId,
            config: { code: item.code, title: item.title },
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

  // ── 단축키 F4: 최대화 및 복원 토글 ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault();
        const maxTs = model.getMaximizedTabset();
        if (maxTs) {
          model.doAction(Actions.maximizeToggle(maxTs.getId()));
        } else {
          const target = model.getActiveTabset() || model.getFirstTabSet();
          if (target) {
            model.doAction(Actions.maximizeToggle(target.getId()));
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [model]);

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
  const handleContextMenu = (node: any, event: React.MouseEvent<HTMLElement>) => {
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
        label: '이 탭 닫기',
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


  // ── 명명 레이아웃 저장/불러오기/삭제/초기화 핸들러 ──
  const handleSaveNamedLayout = (name: string) => {
    const item = appSettingsStorage.saveLayout(name, model.toJson());
    setSavedLayouts(appSettingsStorage.getSavedLayouts());
    message.success(`'${item.name}' 레이아웃이 저장되었습니다.`);
  };

  const handleLoadNamedLayout = (item: SavedLayoutItem) => {
    try {
      const sanitized = sanitizeLayoutJson(item.modelJson);
      const m = Model.fromJson(sanitized);
      setModel(m);
      appSettingsStorage.set('flexlayout_model', sanitized);
      message.success(`'${item.name}' 레이아웃을 불러왔습니다.`);
    } catch (e) {
      message.error('레이아웃 불러오기에 실패했습니다.');
      console.error(e);
    }
  };

  const handleDeleteNamedLayout = (id: string) => {
    appSettingsStorage.deleteSavedLayout(id);
    setSavedLayouts(appSettingsStorage.getSavedLayouts());
    message.info('레이아웃이 삭제되었습니다.');
  };

  const handleResetLayout = () => {
    appSettingsStorage.remove('flexlayout_model');
    setModel(Model.fromJson(defaultLayoutJson));
    message.info('기본 레이아웃으로 초기화되었습니다.');
  };

  // ── FlexLayout Tab 컴포넌트 렌더러 (factory) ──
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = (node.getConfig() as { code?: string; title?: string }) || {};

    if (component === 'mypage') {
      return <MyPageView />;
    }

    // 기본 대용량 데이터 뷰 (AgGrid: 외부 스크롤 없이 AgGrid 내부 가상 스크롤만 동작하도록 격리)
    return (
      <div style={{ flex: 1, overflow: 'hidden', height: '100%', minHeight: 0, boxSizing: 'border-box' }}>
        <LargeDataView
          title={config.title || node.getName()}
          menuCode={config.code || node.getId().replace('tab-', '')}
        />
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar
        sidebarPinned={sidebarPinned}
        onToggleSidebarPin={() => setSidebarPinned(!sidebarPinned)}
        onOpenScreen={handleSelectMenuLevel_3}
        savedLayouts={savedLayouts}
        onSaveNamedLayout={handleSaveNamedLayout}
        onLoadNamedLayout={handleLoadNamedLayout}
        onDeleteNamedLayout={handleDeleteNamedLayout}
        onResetLayout={handleResetLayout}
      />

      {/* ── Body Container with LeftMenuBar & FlexLayout ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
        {/* ── 왼쪽 MenuLevel_1 아이콘 메뉴 및 MenuLevel_2/3 서브메뉴 ── */}
        <LeftMenuBar
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
  );
}
