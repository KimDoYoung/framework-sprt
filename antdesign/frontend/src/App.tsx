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
import { LeftSidebar } from './components/LeftSidebar';
import { RightSideBar } from './components/RightSideBar';
import { MyPageCalendar } from './components/MyPageCalendar';
import {
  ScheduleGridBox,
  DayListBox,
  ApprovalGridBox,
  ComplianceGridBox,
} from './components/MyPageGrids';
import { LargeDataView } from './components/LargeDataView';
import { MenuLevel_1, MenuLevel_3 } from './types';

// ── 기본 레이아웃 정의 (초기 상태: My Page 1개 탭) ──
const defaultLayoutJson: IJsonModel = {
  global: {
    tabEnableClose: true,
    tabSetEnableMaximize: true,
    tabSetEnableClose: true, // 탭셋 닫기/삭제 허용
    tabSetEnableCloseButton: false, // 탭셋 헤더 자체의 닫기 버튼은 미노출
    tabSetEnableDeleteWhenEmpty: true, // 탭이 0개가 되면 해당 분할 패널(탭셋) 자동 소멸
    tabEnableRename: false,
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
        children: [
          {
            type: 'tab',
            name: 'My Page',
            component: 'mypage',
            enableClose: false,
            id: 'tab-mypage',
          },
        ],
      },
    ],
  },
};

const STORAGE_KEY = 'asseterp_flexlayout_model';

// 로컬 스토리지에 저장된 레이아웃 정제 (0개 탭 자동 소멸 옵션 강제 적용)
function sanitizeLayoutJson(json: IJsonModel): IJsonModel {
  if (!json.global) {
    json.global = {};
  }
  json.global.tabSetEnableClose = true;
  json.global.tabSetEnableCloseButton = false;
  json.global.tabSetEnableDeleteWhenEmpty = true;

  const fixNode = (node: any) => {
    if (!node) return;
    if (node.type === 'tabset') {
      if (node.enableClose === false) delete node.enableClose;
      if (node.enableDeleteWhenEmpty === false) delete node.enableDeleteWhenEmpty;
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

// 로컬 스토리지에서 저장된 레이아웃 복원 또는 기본 레이아웃 로드
function getInitialModel(): Model {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const json = JSON.parse(saved);
      return Model.fromJson(sanitizeLayoutJson(json));
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
          },
          targetTabsetId,
          DockLocation.CENTER,
          -1,
          true // 바로 선택
        )
      );
    }
  };

  // ── 레이아웃 변경 시 자동 로컬 스토리지 저장 ──
  const handleModelChange = (newModel: Model) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel.toJson()));
    } catch (e) {
      console.error('레이아웃 저장 실패:', e);
    }
  };

  // ── 빠른 버튼: 현재 활성 탭을 우측으로 분할 ──
  const handleSplitRight = () => {
    const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
    const activeTab = activeTabset?.getSelectedNode();
    if (!activeTabset || !activeTab) {
      message.warning('분할할 활성 탭이 없습니다.');
      return;
    }
    if (activeTabset.getChildren().length <= 1) {
      message.info('현재 패널에 탭이 1개뿐입니다. 메뉴에서 새 화면을 열거나 다른 탭을 추가한 후 분할해 보세요.');
      return;
    }
    model.doAction(
      Actions.moveNode(
        activeTab.getId(),
        activeTabset.getId(),
        DockLocation.RIGHT,
        -1,
        true
      )
    );
  };

  // ── 빠른 버튼: 현재 활성 탭을 하단으로 분할 ──
  const handleSplitBottom = () => {
    const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
    const activeTab = activeTabset?.getSelectedNode();
    if (!activeTabset || !activeTab) {
      message.warning('분할할 활성 탭이 없습니다.');
      return;
    }
    if (activeTabset.getChildren().length <= 1) {
      message.info('현재 패널에 탭이 1개뿐입니다. 메뉴에서 새 화면을 열거나 다른 탭을 추가한 후 분할해 보세요.');
      return;
    }
    model.doAction(
      Actions.moveNode(
        activeTab.getId(),
        activeTabset.getId(),
        DockLocation.BOTTOM,
        -1,
        true
      )
    );
  };

  // ── 레이아웃 수동 저장 ──
  const handleSaveLayout = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(model.toJson()));
    message.success('현재 화면 분할 및 탭 레이아웃이 저장되었습니다.');
  };

  // ── 레이아웃 기본값으로 초기화 ──
  const handleResetLayout = () => {
    localStorage.removeItem(STORAGE_KEY);
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
          }}
        >
          {/* MyPage Grid/Calendar Container */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              padding: 8,
              gap: 8,
              overflowX: 'auto',
              overflowY: 'auto',
              minWidth: 0,
              height: '100%',
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
              }}
            >
              <DayListBox />
              <ApprovalGridBox />
              <ComplianceGridBox />
            </div>

            {/* Rightmost Column: 사원 조직도 / 우측 사이드바 */}
            <RightSideBar />
          </div>
        </div>
      );
    }

    // 기본 대용량 데이터 뷰 (AgGrid)
    return (
      <div style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
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

      {/* ── Body Container with LeftSidebar & FlexLayout ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: 'calc(100vh - 50px)', position: 'relative' }}>
        {/* ── 왼쪽 MenuLevel_1 아이콘 메뉴 및 MenuLevel_2/3 서브메뉴 ── */}
        <LeftSidebar
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
                탭을 잡고 화면 상/하/좌/우로 드래그하면 자유롭게 패널 분할 및 도킹이 가능합니다
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
    </div>
  );
}
