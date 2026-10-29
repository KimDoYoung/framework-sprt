/**
 * [1279] 기초자료 > 30. 자산&경영 > 급여기초정보관리 (E22)
 * AS-IS: myApp/client/vi/pay/Pay20_Tab_DeductAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L20-72: 탭 9개(지급/공제 항목관리 · 임금계산방법 · 율관리 · 근로소득 간이세액표 · 근로소득 공제표 · 인적공제금액 · 과세표준 구간별 기본세율 · 근로소득 세액공제 · 기타설정), 여백 20.
 * 탭을 고를 때마다 그 탭의 retrieve()를 부른다(retrieveTabpage L74-77).
 * 1단계(E22): 탭 1~3(항목관리·임금계산방법·율관리), 2단계(E22-2): 탭 4~6(근로소득 간이세액표·근로소득 공제표·인적공제금액).
 * 3단계(E22-3): 탭 7~9(과세표준 구간별 기본세율·근로소득 세액공제·기타설정).
 * 스타일: TP (docs/page-style.md)
 */
import React, { useRef, useState } from 'react';
import { PageTabs } from '@/components/tabs';
import { Pay04_TabPage_Formula } from './Pay04_TabPage_Formula';
import { Pay20_TabPage_Item, PayTabPageHandle } from './Pay20_TabPage_Item';
import { Pay21_TabPage_Rate } from './Pay21_TabPage_Rate';
import { Pay23_TabPage_SimpleTaxTable } from './Pay23_TabPage_SimpleTaxTable';
import { Pay24_TabPage_DeductTable } from './Pay24_TabPage_DeductTable';
import { Pay25_TabPage_PersonDeduct } from './Pay25_TabPage_PersonDeduct';
import { Pay26_TabPage_TaxCalcTable } from './Pay26_TabPage_TaxCalcTable';
import { Pay27_TabPage_TaxDeductTable } from './Pay27_TabPage_TaxDeductTable';
import { Pay29_TabPage_OtherSetupDate } from './Pay29_TabPage_OtherSetupDate';

const TABS = [
  { key: 'item', label: '지급/공제 항목관리' },
  { key: 'formula', label: '임금계산방법' },
  { key: 'rate', label: '율관리' },
  { key: 'simpleTax', label: '근로소득 간이세액표' },
  { key: 'deduct', label: '근로소득 공제표' },
  { key: 'personDeduct', label: '인적공제금액' },
  { key: 'taxCalc', label: '과세표준 구간별 기본세율' },
  { key: 'taxDeduct', label: '근로소득 세액공제' },
  { key: 'otherSetup', label: '기타설정' },
];

// [E0] 화면 열림 (생성자 L20-72) → 탭 9개 추가
export const Pay20_Tab_DeductAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('item');
  // 한 번 연 탭은 그대로 두고(숨기기만) 입력·고른 고객사 같은 상태를 유지한다 — 원본은 탭 9개를 처음부터 모두 만들어 둔다
  const [opened, setOpened] = useState<string[]>(['item']);
  const refs = useRef<Record<string, PayTabPageHandle | null>>({});

  // [E1] tabPanel.Selection [arg0 != null] (L22) → retrieveTabpage() L74-77: 고른 탭의 retrieve(). 처음 여는 탭은 열 때(E0) 조회한다
  const onChange = (key: string) => {
    setActiveKey(key);
    if (opened.includes(key)) setTimeout(() => refs.current[key]?.retrieve());
    else setOpened(prev => [...prev, key]);
  };

  const bind = (key: string) => (h: PayTabPageHandle | null) => { refs.current[key] = h; };

  const page = (key: string): React.ReactNode => {
    switch (key) {
      case 'item': return <Pay20_TabPage_Item ref={bind(key)} />;
      case 'formula': return <Pay04_TabPage_Formula ref={bind(key)} />;
      case 'rate': return <Pay21_TabPage_Rate ref={bind(key)} />;
      case 'simpleTax': return <Pay23_TabPage_SimpleTaxTable ref={bind(key)} />;
      case 'deduct': return <Pay24_TabPage_DeductTable ref={bind(key)} />;
      case 'personDeduct': return <Pay25_TabPage_PersonDeduct ref={bind(key)} />;
      case 'taxCalc': return <Pay26_TabPage_TaxCalcTable ref={bind(key)} />;
      case 'taxDeduct': return <Pay27_TabPage_TaxDeductTable ref={bind(key)} />;
      case 'otherSetup': return <Pay29_TabPage_OtherSetupDate ref={bind(key)} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <PageTabs activeKey={activeKey} onChange={onChange} items={TABS.map(t => ({ key: t.key, label: t.label }))} style={{ flex: 'none', marginBottom: 0 }} />
      <div style={{ flex: 1, minHeight: 0, padding: 10, boxSizing: 'border-box' }}>
        {TABS.filter(t => opened.includes(t.key)).map(t => (
          <div key={t.key} className="pay20-pane" style={{ height: '100%', display: t.key === activeKey ? 'block' : 'none' }}>{page(t.key)}</div>
        ))}
      </div>
    </div>
  );
};
