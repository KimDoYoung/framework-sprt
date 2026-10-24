/**
 * [1495] 책무 > 00. 대시보드 > 책무점검 현황 (N01)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_TotalDashboard.java (50줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L18-25: center = tabPanel(여백 20, 테두리) — 총괄(Tdm50_Tab_Dashboard) · 임원별(Tdm50_Tab_DashboardExct) · 부서별(Tdm50_Tab_DashboardOrg)
 * 세 탭은 열 때 모두 만들어 두고(탭을 옮겨도 고른 임원·부서·기간이 남는다), 탭을 고를 때마다 그 탭이 다시 조회한다.
 * 1단계: [보기] 아이콘이 여는 점검 편집창(Tdm52_Edit_ChckManl, N22)·미흡 조치 상세(Tdm54_Lookup_ChckInsuffCmnt, N24)는 다음 단계
 */
import React, { useRef, useState } from 'react';
import { Tabs } from 'antd';
import { DashboardTabHandle, Tdm50_Tab_Dashboard } from './Tdm50_Tab_Dashboard';
import { Tdm50_Tab_DashboardExct } from './Tdm50_Tab_DashboardExct';
import { Tdm50_Tab_DashboardOrg } from './Tdm50_Tab_DashboardOrg';

type TabKey = 'total' | 'exct' | 'org';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'total', label: '총괄' },    // tabPanel.add(tapPage01, "총괄")
  { key: 'exct', label: '임원별' },   // tabPanel.add(tapPage02, "임원별")
  { key: 'org', label: '부서별' },    // tabPanel.add(tapPage03, "부서별")
];

export const Tdm50_Tab_TotalDashboard: React.FC = () => {
  // [E0] 화면 열림 (생성자 L18-25) → settings() L27-49: tabPanel에 총괄·임원별·부서별을 더하고 선택 핸들러를 연결
  const [active, setActive] = useState<TabKey>('total');
  const totalRef = useRef<DashboardTabHandle>(null);
  const exctRef = useRef<DashboardTabHandle>(null);
  const orgRef = useRef<DashboardTabHandle>(null);
  const refs: Record<TabKey, React.RefObject<DashboardTabHandle | null>> = { total: totalRef, exct: exctRef, org: orgRef };

  // [E1] tabPanel.Selection (L33) → 고른 탭의 retrieve()
  const onChange = (key: string) => {
    const k = key as TabKey;
    setActive(k);
    void refs[k].current?.retrieve();
  };

  const pane = (key: TabKey, node: React.ReactNode) => (
    <div key={key} style={{ flex: 1, minHeight: 0, display: active === key ? 'block' : 'none' }}>{node}</div>
  );

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <Tabs activeKey={active} onChange={onChange} items={TABS.map(t => ({ key: t.key, label: t.label }))} tabBarStyle={{ margin: 0, paddingLeft: 10 }} />
        {pane('total', <Tdm50_Tab_Dashboard ref={totalRef} />)}
        {pane('exct', <Tdm50_Tab_DashboardExct ref={exctRef} />)}
        {pane('org', <Tdm50_Tab_DashboardOrg ref={orgRef} />)}
      </div>
    </div>
  );
};
