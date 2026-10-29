/**
 * [1289] 경영관리 > 20. 대외보고서 > 업무보고서 (T17)
 * AS-IS: myApp/client/vi/rpt/Rpt10_Tab_FssOrg.java (75줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L26-69: 탭 6개(GA140 조직기구현황 · GA141 점포현황 · GA142 일반현황 · GA143 임원현황 · GA144 전문인력현황 · GA402 투자운용인력현황), 여백 20.
 * 탭 페이지 6개는 RD 보고서 페이지(Org02_Rd_OrgState·Sys01_Rd_CompanyState·Emp01_Rd_* 4개, 공통 처리 useRdStatePage.tsx). 스타일: TP (견본 — docs/page-style.md)
 */
import React, { useRef, useState } from 'react';
import { PageTabs } from '@/components/tabs';
import { Emp01_Rd_FinanceProState } from '../emp/Emp01_Rd_FinanceProState';
import { Emp01_Rd_OfficerState } from '../emp/Emp01_Rd_OfficerState';
import { Emp01_Rd_PersonState } from '../emp/Emp01_Rd_PersonState';
import { Emp01_Rd_ProPersonState } from '../emp/Emp01_Rd_ProPersonState';
import { Org02_Rd_OrgState } from '../org/Org02_Rd_OrgState';
import { Sys01_Rd_CompanyState } from '../sys/Sys01_Rd_CompanyState';
import { RdStatePageHandle } from './useRdStatePage';

const TABS: { key: string; label: string; Page: React.ForwardRefExoticComponent<React.RefAttributes<RdStatePageHandle>> }[] = [
  { key: 'GA140', label: 'GA140', Page: Org02_Rd_OrgState },
  { key: 'GA141', label: 'GA141', Page: Sys01_Rd_CompanyState },
  { key: 'GA142', label: 'GA142', Page: Emp01_Rd_PersonState },
  { key: 'GA143', label: 'GA143', Page: Emp01_Rd_OfficerState },
  { key: 'GA144', label: 'GA144', Page: Emp01_Rd_ProPersonState },
  { key: 'GA402', label: 'GA402', Page: Emp01_Rd_FinanceProState },
];

// [E0] 화면 열림 (생성자 L26-69) → 탭 6개 추가
export const Rpt10_Tab_FssOrg: React.FC = () => {
  const [activeKey, setActiveKey] = useState(TABS[0].key);
  // 한 번 연 탭은 그대로 두고(숨기기만) 기준년월·RD 화면을 유지한다 — 원본은 탭을 처음부터 모두 만들어 둔다
  const [opened, setOpened] = useState<string[]>([TABS[0].key]);
  const refs = useRef<Record<string, RdStatePageHandle | null>>({});

  // [E1] tabPanel.Selection [arg0 != null] (L28) → retrieveTabpage() L71-74: 고른 탭 페이지의 retrieve(null)
  const onChange = (key: string) => {
    setActiveKey(key);
    if (opened.includes(key)) setTimeout(() => refs.current[key]?.retrieve());
    else {
      setOpened(prev => [...prev, key]);
      setTimeout(() => refs.current[key]?.retrieve());
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <PageTabs activeKey={activeKey} onChange={onChange} items={TABS.map(t => ({ key: t.key, label: t.label }))} style={{ flex: 'none', marginBottom: 0 }} />
      <div style={{ flex: 1, minHeight: 0, padding: 10, boxSizing: 'border-box' }}>
        {TABS.filter(t => opened.includes(t.key)).map(t => (
          <div key={t.key} style={{ height: '100%', display: t.key === activeKey ? 'block' : 'none' }}>
            <t.Page ref={h => { refs.current[t.key] = h; }} />
          </div>
        ))}
      </div>
    </div>
  );
};
