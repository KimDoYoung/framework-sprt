import { useState } from 'react';
import { Tabs } from 'antd';
import { ProLayout } from '@ant-design/pro-components';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightMessengerSidebar } from './components/RightMessengerSidebar';
import { DashboardCalendar } from './components/DashboardCalendar';
import {
  ScheduleGridBox,
  DayListBox,
  ApprovalGridBox,
  ComplianceGridBox,
} from './components/DashboardGrids';
import { LargeDataView } from './components/LargeDataView';
import { MenuItem, FirstLevelMenu } from './types';

interface OpenTab {
  key: string;
  title: string;
  code?: string;
  closable: boolean;
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState<number>(16);
  // Default active 1st level menu to 'duty' ('책무') matching main2.png
  const [activeMenuId, setActiveMenuId] = useState<string | null>('duty');
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(true);
  const [selectedSubMenuCode, setSelectedSubMenuCode] = useState<string>('1495');

  // Multi-tab state: starts with "My Page"
  const [activeTabKey, setActiveTabKey] = useState<string>('mypage');
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { key: 'mypage', title: 'My Page', closable: false },
  ]);

  const handleSelectFirstLevel = (menuId: string) => {
    if (activeMenuId === menuId && !sidebarPinned) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(menuId);
    }
  };

  const handleSelectMenuItem = (item: MenuItem, _parent: FirstLevelMenu) => {
    setSelectedSubMenuCode(item.code);

    const existingTab = openTabs.find((t) => t.key === item.code);
    if (!existingTab) {
      setOpenTabs((prev) => [
        ...prev,
        {
          key: item.code,
          title: `[${item.code}] ${item.title}`,
          code: item.code,
          closable: true,
        },
      ]);
    }
    setActiveTabKey(item.code);
  };

  const handleCloseTab = (targetKey: string) => {
    const newTabs = openTabs.filter((t) => t.key !== targetKey);
    setOpenTabs(newTabs);
    if (activeTabKey === targetKey) {
      setActiveTabKey(newTabs[newTabs.length - 1]?.key || 'mypage');
    }
  };

  return (
    <ProLayout
      title="Asset-ERP"
      pure
      headerRender={() => (
        <TopBar
          sidebarPinned={sidebarPinned}
          onToggleSidebarPin={() => setSidebarPinned(!sidebarPinned)}
        />
      )}
      menuRender={false}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* ── Body Container with LeftSidebar, Main Content & Messenger ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: 'calc(100vh - 50px)', position: 'relative' }}>
        {/* ── 2. 왼쪽 1단계 아이콘 메뉴 및 2단계/3단계 서브메뉴 ── */}
        <LeftSidebar
          activeMenuId={activeMenuId}
          onSelectFirstLevel={handleSelectFirstLevel}
          onSelectMenuItem={handleSelectMenuItem}
          pinned={sidebarPinned}
          onTogglePin={setSidebarPinned}
          selectedSubMenuCode={selectedSubMenuCode}
        />

        {/* ── Main Content Area ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#eef2f6',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          {/* Breadcrumb / Tab Bar matching main1.png & main2.png */}
          <div
            style={{
              height: 34,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #d9dfe8',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              flexShrink: 0,
            }}
          >
            <Tabs
              activeKey={activeTabKey}
              onChange={setActiveTabKey}
              type="editable-card"
              hideAdd
              onEdit={(targetKey, action) => {
                if (action === 'remove' && typeof targetKey === 'string') {
                  handleCloseTab(targetKey);
                }
              }}
              size="small"
              tabBarStyle={{ margin: 0, height: 32 }}
              items={openTabs.map((tab) => ({
                key: tab.key,
                label: tab.title,
                closable: tab.closable,
              }))}
            />
          </div>

          {/* Tab View Switcher */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            {activeTabKey === 'mypage' ? (
              // ── My Page: AS-IS Dashboard matching main1.png & main2.png ──
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  overflow: 'hidden',
                }}
              >
                {/* Center Dashboard (Left & Center Columns) */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 8,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(420px, 48%) minmax(460px, 52%)',
                    gap: 8,
                    alignContent: 'start',
                  }}
                >
                  {/* Left Column: Calendar + Schedule Box */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <DashboardCalendar
                      selectedDate={selectedDay}
                      onSelectDate={setSelectedDay}
                    />
                    <ScheduleGridBox selectedDay={selectedDay} />
                  </div>

                  {/* Center Column: Day List + Approvals + Compliance */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <DayListBox />
                    <ApprovalGridBox />
                    <ComplianceGridBox />
                  </div>
                </div>

                {/* Rightmost Column: Employee Organization / Messenger Status */}
                <RightMessengerSidebar />
              </div>
            ) : (
              // ── 대용량 AgGrid View ──
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <LargeDataView
                  title={openTabs.find((t) => t.key === activeTabKey)?.title}
                  menuCode={activeTabKey}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ProLayout>
  );
}
