/**
 * [1275] 경영관리 > 04. 급여관리 > 4대보험신고(EDI) (S26) — 스타일: STP (SearchBar+TabPanel — 탭만 있고 툴바는 각 탭 안에 있다)
 * AS-IS: myApp/client/vi/pay/Pay31_Tab_InsureApply.java (63줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L20-57: BorderLayout 가운데 TabPanel(테두리) 4개 — 자격취득 신고 · 보수변동/착오정정 신고 · 전년도분 보수총액 신고 · 납부방법 변경, 바깥 여백 20.
 * 탭을 고를 때마다 그 탭의 retrieve(null)을 부른다(retrieveTabpage L59-62). 처음 여는 탭은 열 때 조회한다.
 */
import React, { useRef, useState } from 'react';
import { Tabs } from 'antd';
import { PayInsureApplyTabHandle } from './payInsureApplyTab';
import { Pay31_TabPage_InsureApply1 } from './Pay31_TabPage_InsureApply1';
import { Pay31_TabPage_InsureApply2 } from './Pay31_TabPage_InsureApply2';
import { Pay31_TabPage_InsureApply3 } from './Pay31_TabPage_InsureApply3';
import { Pay31_TabPage_InsureApply4 } from './Pay31_TabPage_InsureApply4';

const TABS = [
  { key: '1', label: '자격취득 신고' },
  { key: '2', label: '보수변동/착오정정 신고' },
  { key: '3', label: '전년도분 보수총액 신고' },
  { key: '4', label: '납부방법 변경' },
];

// [E0] 화면 열림 (생성자 L20-57) → 탭 4개 추가
export const Pay31_Tab_InsureApply: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1');
  // 한 번 연 탭은 그대로 두고(숨기기만) 입력한 조건을 유지한다 — 원본은 탭 4개를 처음부터 모두 만들어 둔다
  const [opened, setOpened] = useState<string[]>(['1']);
  const refs = useRef<Record<string, PayInsureApplyTabHandle | null>>({});

  // [E1] tabPanel.Selection [arg0 != null] (L22) → retrieveTabpage() L59-62: 고른 탭의 retrieve(null). 처음 여는 탭은 열 때 조회한다
  const onChange = (key: string) => {
    setActiveKey(key);
    if (opened.includes(key)) setTimeout(() => refs.current[key]?.retrieve());
    else setOpened(prev => [...prev, key]);
  };

  const bind = (key: string) => (h: PayInsureApplyTabHandle | null) => { refs.current[key] = h; };

  const page = (key: string): React.ReactNode => {
    switch (key) {
      case '1': return <Pay31_TabPage_InsureApply1 ref={bind(key)} />;
      case '2': return <Pay31_TabPage_InsureApply2 ref={bind(key)} />;
      case '3': return <Pay31_TabPage_InsureApply3 ref={bind(key)} />;
      case '4': return <Pay31_TabPage_InsureApply4 ref={bind(key)} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        type="card"
        activeKey={activeKey}
        onChange={onChange}
        items={TABS.map(t => ({ key: t.key, label: t.label }))}
        style={{ flex: 'none', marginBottom: 0 }}
      />
      <div style={{ flex: 1, minHeight: 0, border: '1px solid #f0f0f0', padding: 10, boxSizing: 'border-box' }}>
        {TABS.filter(t => opened.includes(t.key)).map(t => (
          <div key={t.key} style={{ height: '100%', display: t.key === activeKey ? 'block' : 'none' }}>{page(t.key)}</div>
        ))}
      </div>
    </div>
  );
};
