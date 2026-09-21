import { useState } from 'react';
import { Button, Tooltip, Tag, Popconfirm, message } from 'antd';
import {
  SplitCellsOutlined,
  InsertRowBelowOutlined,
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Model,
  Actions,
  TabNode,
  IJsonModel,
  DockLocation,
} from 'flexlayout-react';
import './flexlayout-custom.css';

import { TopBar } from './components/TopBar';
import { LeftMenuBar } from './components/LeftMenuBar';
import { EmployeePanel } from './components/EmployeePanel';
import { StatusBar } from './components/StatusBar';
import { MyPageCalendar } from './components/mypage/MyPageCalendar';
import {
  ScheduleGridBox,
  DayListBox,
  ApprovalGridBox,
  ComplianceGridBox,
} from './components/mypage/MyPageGrids';
import { LargeDataView } from './components/LargeDataView';
import { MenuLevel_1, MenuLevel_3 } from './types';
import { appSettingsStorage } from './utils/storage';

// ── 기본 레이아웃 정의 (초기 상태: My Page 1개 탭) ──
const defaultLayoutJson: IJsonModel = {
  global: {
    tabEnableClose: true,
    tabSetEnableMaximize: false, // 최대화로 인한 분할 차단 및 전체화면 고착 방지
    tabSetEnableClose: true, // 탭셋 닫기/삭제 허용
    tabSetEnableCloseButton: false, // 탭셋 헤더 자체의 닫기 버튼은 미노출
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
  json.global.tabSetEnableMaximize = false; // 최대화 고착 방지
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
      if (node.maximized) delete node.maximized; // 저장된 최대화 상태 강제 해제!
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
  const [selectedDay, setSelectedDay] = useState<number>(16);
  const [activeMenuId, setActiveMenuId] = useState<string | null>('duty');
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(true);
  const [selectedMenuLevel_3_Code, setSelectedMenuLevel_3_Code] = useState<string>('1495');

  // ── FlexLayout 모델 상태 ──
  const [model, setModel] = useState<Model>(() => getInitialModel());

  const handleSelectMenuLevel_1 = (menuId: string | null) => {
    setActiveMenuId(menuId);
  };

  // ── 메뉴 클릭 시: 활성화된 탭셋(TabSet)에 새 탭 추가 또는 기존 탭 활성화 ──
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
            name: `[${item.code}] ${item.title}`,
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

  // ── 레이아웃 변경 시 자동 로컬 스토리지(asseterp_settings) 저장 ──
  const handleModelChange = (newModel: Model) => {
    appSettingsStorage.set('flexlayout_model', newModel.toJson());
  };

  // ── 빠른 버튼: 현재 활성 탭을 우측으로 분할 ──
  const handleSplitRight = () => {
    // 혹시 최대화 상태인 경우 즉시 해제
    const maxTs = model.getMaximizedTabset();
    if (maxTs) {
      model.doAction(Actions.maximizeToggle(maxTs.getId()));
    }

    const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
    if (!activeTabset) {
      message.warning('분할할 패널이 없습니다.');
      return;
    }
    const activeTab = activeTabset.getSelectedNode();

    // 패널에 탭이 1개뿐일 때: 우측에 새 작업 화면([1495] 당직명령부)을 분할 생성하여 즉시 2개 패널 배치
    if (activeTabset.getChildren().length <= 1) {
      const splitTabId = 'tab-1495';
      const existing = model.getNodeById(splitTabId);
      if (existing) {
        model.doAction(
          Actions.moveNode(
            splitTabId,
            activeTabset.getId(),
            DockLocation.RIGHT,
            -1,
            true
          )
        );
      } else {
        model.doAction(
          Actions.addTab(
            {
              type: 'tab',
              name: '[1495] 당직명령부',
              component: 'largedata',
              id: splitTabId,
              config: { code: '1495', title: '당직명령부' },
              enableClose: true,
              enableScrollbars: false,
            },
            activeTabset.getId(),
            DockLocation.RIGHT,
            -1,
            true
          )
        );
      }
      message.success('우측으로 새 작업 패널이 분할 생성되었습니다.');
      return;
    }

    if (activeTab) {
      model.doAction(
        Actions.moveNode(
          activeTab.getId(),
          activeTabset.getId(),
          DockLocation.RIGHT,
          -1,
          true
        )
      );
      message.success('현재 탭이 우측 패널로 분할 이동되었습니다.');
    }
  };

  // ── 빠른 버튼: 현재 활성 탭을 하단으로 분할 ──
  const handleSplitBottom = () => {
    // 혹시 최대화 상태인 경우 즉시 해제
    const maxTs = model.getMaximizedTabset();
    if (maxTs) {
      model.doAction(Actions.maximizeToggle(maxTs.getId()));
    }

    const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
    if (!activeTabset) {
      message.warning('분할할 패널이 없습니다.');
      return;
    }
    const activeTab = activeTabset.getSelectedNode();

    // 패널에 탭이 1개뿐일 때: 하단에 새 작업 화면([1495] 당직명령부)을 분할 생성하여 즉시 2개 패널 배치
    if (activeTabset.getChildren().length <= 1) {
      const splitTabId = 'tab-1495';
      const existing = model.getNodeById(splitTabId);
      if (existing) {
        model.doAction(
          Actions.moveNode(
            splitTabId,
            activeTabset.getId(),
            DockLocation.BOTTOM,
            -1,
            true
          )
        );
      } else {
        model.doAction(
          Actions.addTab(
            {
              type: 'tab',
              name: '[1495] 당직명령부',
              component: 'largedata',
              id: splitTabId,
              config: { code: '1495', title: '당직명령부' },
              enableClose: true,
              enableScrollbars: false,
            },
            activeTabset.getId(),
            DockLocation.BOTTOM,
            -1,
            true
          )
        );
      }
      message.success('하단으로 새 작업 패널이 분할 생성되었습니다.');
      return;
    }

    if (activeTab) {
      model.doAction(
        Actions.moveNode(
          activeTab.getId(),
          activeTabset.getId(),
          DockLocation.BOTTOM,
          -1,
          true
        )
      );
      message.success('현재 탭이 하단 패널로 분할 이동되었습니다.');
    }
  };

  // ── 레이아웃 수동 저장 ──
  const handleSaveLayout = () => {
    appSettingsStorage.set('flexlayout_model', model.toJson());
    message.success('현재 화면 분할 및 탭 레이아웃이 저장되었습니다.');
  };

  // ── 레이아웃 기본값으로 초기화 ──
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
      return (
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            height: '100%',
            minHeight: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* MyPage Grid/Calendar Container (뷰포트 피팅 및 외부 스크롤바 방지) */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              padding: 8,
              gap: 8,
              overflow: 'hidden',
              minWidth: 0,
              minHeight: 0,
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Left Column: Calendar (상단) + Schedule Box (하단 채움) */}
            <div
              style={{
                width: 440,
                minWidth: 380,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                height: '100%',
                minHeight: 0,
                flexShrink: 0,
              }}
            >
              <MyPageCalendar
                selectedDate={selectedDay}
                onSelectDate={setSelectedDay}
              />
              <ScheduleGridBox selectedDay={selectedDay} />
            </div>

            {/* Center Column: Day List + Approvals + Compliance (높이 균등 분할) */}
            <div
              style={{
                flex: 1,
                minWidth: 420,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                height: '100%',
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              <DayListBox />
              <ApprovalGridBox />
              <ComplianceGridBox />
            </div>

            {/* Rightmost Column: 사원 조직도 / 우측 사이드바 */}
            <EmployeePanel />
          </div>
        </div>
      );
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
          {/* Layout Utility Toolbar */}
          <div
            style={{
              height: 32,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #d9dfe8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px',
              flexShrink: 0,
            }}
          >
            {/* Guide message */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag color="geekblue" icon={<InfoCircleOutlined />} style={{ fontSize: 11, margin: 0 }}>
                💡 탭이 2개 이상일 때 탭을 패널 우측/하단 가장자리로 드래그하거나, '우측/하단 분할' 버튼을 누르면 즉시 분할됩니다
              </Tag>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tooltip title="현재 선택된 탭을 오른쪽으로 분할">
                <Button
                  size="small"
                  icon={<SplitCellsOutlined style={{ color: '#1677ff' }} />}
                  onClick={handleSplitRight}
                  style={{ fontSize: 11, height: 24, padding: '0 8px' }}
                >
                  우측 분할
                </Button>
              </Tooltip>

              <Tooltip title="현재 선택된 탭을 아래쪽으로 분할">
                <Button
                  size="small"
                  icon={<InsertRowBelowOutlined style={{ color: '#1677ff' }} />}
                  onClick={handleSplitBottom}
                  style={{ fontSize: 11, height: 24, padding: '0 8px' }}
                >
                  하단 분할
                </Button>
              </Tooltip>

              <Tooltip title="현재 화면 배치(분할 크기, 열린 탭 위치)를 브라우저에 저장">
                <Button
                  size="small"
                  icon={<SaveOutlined style={{ color: '#52c41a' }} />}
                  onClick={handleSaveLayout}
                  style={{ fontSize: 11, height: 24, padding: '0 8px' }}
                >
                  레이아웃 저장
                </Button>
              </Tooltip>

              <Popconfirm
                title="레이아웃 초기화"
                description="모든 분할을 닫고 기본 단일 화면으로 초기화하시겠습니까?"
                onConfirm={handleResetLayout}
                okText="초기화"
                cancelText="취소"
              >
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  style={{ fontSize: 11, height: 24, padding: '0 8px' }}
                >
                  초기화
                </Button>
              </Popconfirm>
            </div>
          </div>

          {/* FlexLayout Viewport */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <Layout
              model={model}
              factory={factory}
              onModelChange={handleModelChange}
              realtimeResize
            />
          </div>
        </div>
      </div>

      {/* ── Status Bar (System Health, Message, Clock) ── */}
      <StatusBar />
    </div>
  );
}
