/**
 * [1274] 경영관리 > 04. 급여관리 > 퇴직정산 (S22) — 스타일: STP
 * AS-IS: myApp/client/vi/pay/Pay10_Tab_Retire.java (370줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L78-152: BorderLayout — 위 툴바 50(성명 {personName 150} · [조회][생성][삭제][문서분류지정] · ">> 잔여연차 미리보기" 링크) /
 *   가운데 탭 4개(퇴직정산서 · 4대보험 정산 · 소득세 정산 · 연차수당 정산, 여백 10, 테두리). 바깥 여백 20.
 * 1단계: 첫 탭의 [상신]·[문서보기](결재문서 Apr01_Edit_ApprDoc, 다른 도메인 apr)는 다음 단계 — 상신 검사까지만 하고 안내한다
 * [E1]·[E9] tabPanel.Selection (L107·L244) → retrieveTabpage() L252-264: 고른 탭의 retrieve({personId, year = 발령일 연도})
 * [E2] personName.TriggerClick (L157) → lookupPerson() L266-285: 이름·ID를 비우고 Emp00_Lookup_SelectSingle(퇴직, 콜백만) → 고르면 이름·ID·발령일 + retrieveTabpage()
 * [E3] personName.Change (L165): 비우면 이름·ID를 비움, 아니면 emp.Emp00_TransInfo.selectRetireEmpList('%글자%') — 있으면 첫 사원으로 이름·ID·발령일 + retrieveTabpage(), 없으면 lookupPerson()
 * [E4] retrieveButton[조회].Select (L196) → retrieveTabpage()
 * [E5] insertButton[생성].Select (L202) → checkRetire("insert") L287-321: 사원이 없으면 "사원을 선택하여 주십시오." → 확인(550) "퇴직정산서가 존재할 경우 삭제 후 재생성됩니다. 진행하시겠습니까?"
 *   → Pay12_Lookup_RetireCreate.open(personId, "insert", callback = retrieveTabpage())
 * [E6] deleteButton[삭제].Select (L208) → checkRetire("delete"): 확인(550) "퇴직정산서를 삭제하시겠습니까?" [YES] → delete() L323-365 (E10)
 * [E7] dcrLinkButton[문서분류지정].Select (L221) → Dcr30_Lookup_Link.open("A05", callback{}) — AS-IS는 LoginUser.getIsUserManager()일 때만 보인다(TOBE에 대응 정보 없음 → 늘 보인다, 작업기록)
 * [E8] calcRetireLeaveDaysLink.Click (L233) → 사원이 없으면 "사원을 선택하여 주십시오." 아니면 Pay10_Lookup_RemLeaveDays.open(personId)
 */
import React, { useRef, useState } from 'react';
import { Input, Modal, Tabs, Tooltip, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { empApi } from '@/api/emp';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Pay10_Lookup_RemLeaveDays } from './Pay10_Lookup_RemLeaveDays';
import { Pay10_TabPage_Retire } from './Pay10_TabPage_Retire';
import { Pay12_Lookup_RetireCreate } from './Pay12_Lookup_RetireCreate';
import { Pay12_TabPage_RetireInsure } from './Pay12_TabPage_RetireInsure';
import { Pay13_TabPage_RetireTax } from './Pay13_TabPage_RetireTax';
import { Pay15_TabPage_RetireLeave } from './Pay15_TabPage_RetireLeave';
import { RETIRE_NO_MONTH, RetireTabHandle } from './payRetireTab';

const TABS = [
  { key: 'retire', label: '퇴직정산서' },
  { key: 'insure', label: '4대보험 정산' },
  { key: 'tax', label: '소득세 정산' },
  { key: 'leave', label: '연차수당 정산' },
];

const today = () => new Date().toISOString().slice(0, 10);

// [E0] 화면 열림 (생성자 L78-152) → settings(): 툴바(성명·조회·생성·삭제·문서분류지정·잔여연차 미리보기) + 탭 4개
export const Pay10_Tab_Retire: React.FC = () => {
  const [personName, setPersonName] = useState('');
  const [personId, setPersonId] = useState<number | null>(null);
  const [transDate, setTransDate] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState('retire');
  const [opened, setOpened] = useState<string[]>(['retire']);
  const [personLookup, setPersonLookup] = useState<{ searchText: string } | null>(null);
  const [createTarget, setCreateTarget] = useState<number | null>(null);
  const [remLeaveTarget, setRemLeaveTarget] = useState<number | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const refs = useRef<Record<string, RetireTabHandle | null>>({});
  const committedRef = useRef('');
  const bind = (key: string) => (h: RetireTabHandle | null) => { refs.current[key] = h; };

  // retrieveTabpage() L252-264: 고른 탭의 retrieve(param) — param.year는 발령일(transDate)의 연도
  const retrieveTabpage = (key = activeKey, pid = personId, td = transDate) => {
    void refs.current[key]?.retrieve({ personId: pid, year: td ? td.slice(0, 4) : null });
  };

  // [E1]·[E9] tabPanel.Selection (L107·L244) → retrieveTabpage(). 처음 여는 탭은 마운트한 뒤 조회한다
  const onTabChange = (key: string) => {
    setActiveKey(key);
    if (opened.includes(key)) retrieveTabpage(key);
    else {
      setOpened(prev => [...prev, key]);
      setTimeout(() => retrieveTabpage(key));
    }
  };

  const pick = (row: TransInfo) => {
    const td = row.transDate ? row.transDate.slice(0, 10) : null;
    committedRef.current = row.korNm ?? '';
    setPersonName(row.korNm ?? '');
    setPersonId(row.personId);
    setTransDate(td);
    retrieveTabpage(activeKey, row.personId, td);
  };

  // [E2] personName.TriggerClick (L157) → 이름·ID를 비우고 lookupPerson() L266-285
  const lookupPerson = (text = '') => {
    committedRef.current = '';
    setPersonName('');
    setPersonId(null);
    setPersonLookup({ searchText: text });
  };
  // lookupEmpTransInfo 콜백 L270-284: 사원이 없으면(personId null) 비우고, 있으면 채운 뒤 retrieveTabpage()
  const onPersonPicked = (row: TransInfo | null) => {
    setPersonLookup(null);
    if (!row || row.personId == null) {
      committedRef.current = '';
      setPersonName('');
      setPersonId(null);
      setTransDate(null);
      retrieveTabpage(activeKey, null, null);
      return;
    }
    pick(row);
  };

  // [E3] personName.Change (L165): 비우면 비움, 아니면 selectRetireEmpList('%글자%') — 있으면 첫 사원, 없으면 lookupPerson()
  const onPersonCommit = async (text: string) => {
    if (text === committedRef.current) return;
    committedRef.current = text;
    if (text === '') {
      setPersonName('');
      setPersonId(null);
      return;
    }
    try {
      const list = await empApi.searchRetireTransInfos(today(), text);
      if (list.length > 0) pick(list[0]);
      else lookupPerson(text);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E5]·[E6] insertButton[생성]·deleteButton[삭제].Select (L202·L208) → checkRetire(actionCode) L287-321
  const checkRetire = (actionCode: 'insert' | 'delete') => {
    if (personId == null) {
      message.warning('사원을 선택하여 주십시오.');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: actionCode === 'insert' ? '퇴직정산서가 존재할 경우 삭제 후 재생성됩니다. 진행하시겠습니까?' : '퇴직정산서를 삭제하시겠습니까?',
      width: 550,
      okText: '예',
      cancelText: '아니오',
      // [E10] messageBox.DialogHide [YES] (L301) → insert면 Pay12_Lookup_RetireCreate.open(...), delete면 delete()
      onOk: async () => {
        if (actionCode === 'insert') setCreateTarget(personId);
        else await deleteRetire();
      },
    });
  };

  // delete() L323-365: pay.Pay10_Month.selectByPersonId(03)가 비면 안내, 아니면 getInsureRetire(C) → retrieveTabpage() + "삭제가 완료되었습니다"
  const deleteRetire = async () => {
    if (personId == null) return;
    try {
      const done = await payApi.deleteRetire(personId);
      if (!done) {
        message.warning(RETIRE_NO_MONTH);
        return;
      }
      retrieveTabpage();
      message.success('삭제가 완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
      retrieveTabpage();
    }
  };

  // [E8] calcRetireLeaveDaysLink.Click (L233)
  const openRemLeave = () => {
    if (personId == null) {
      message.warning('사원을 선택하여 주십시오.');
      return;
    }
    setRemLeaveTarget(personId);
  };

  const page = (key: string): React.ReactNode => {
    switch (key) {
      case 'retire': return <Pay10_TabPage_Retire ref={bind(key)} />;
      case 'insure': return <Pay12_TabPage_RetireInsure ref={bind(key)} />;
      case 'tax': return <Pay13_TabPage_RetireTax ref={bind(key)} />;
      case 'leave': return <Pay15_TabPage_RetireLeave ref={bind(key)} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, flex: 'none' }}>
        {/* [E4] retrieveButton[조회].Select (L196) → retrieveTabpage() */}
        <SearchBar
          onSearch={() => retrieveTabpage()}
          extra={<>
            {/* [E5] insertButton[생성].Select (L202) */}
            <Button type="generate" onClick={() => checkRetire('insert')}>생성</Button>
            {/* [E6] deleteButton[삭제].Select (L208) */}
            <Button type="delete" onClick={() => checkRetire('delete')}>삭제</Button>
            {/* [E7] dcrLinkButton[문서분류지정].Select (L221) → Dcr30_Lookup_Link.open("A05", callback{}) */}
            <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>
            {/* [E8] calcRetireLeaveDaysLink.Click (L233) */}
            <Tooltip title="퇴직정보 입력 전 미리 잔여일수 확인이 가능합니다.">
              <a style={{ fontSize: 12, fontWeight: 'bold', color: '#0078D7', marginLeft: 8 }} onClick={openRemLeave}> &gt;&gt; 잔여연차 미리보기</a>
            </Tooltip>
          </>}
        >
          <SearchBar.Field label="성명">
            <Input
              style={{ width: 150 }}
              placeholder="선택하여 주세요"
              value={personName}
              suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => lookupPerson()} />}
              onChange={e => setPersonName(e.target.value)}
              onPressEnter={e => void onPersonCommit((e.target as HTMLInputElement).value.trim())}
              onBlur={e => void onPersonCommit(e.target.value.trim())}
            />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0, boxSizing: 'border-box', border: '1px solid #d9d9d9', borderTop: 0, padding: 10, display: 'flex', flexDirection: 'column' }}>
        <Tabs
          type="card"
          activeKey={activeKey}
          onChange={onTabChange}
          items={TABS.map(t => ({ key: t.key, label: t.label }))}
          style={{ flex: 'none' }}
          tabBarStyle={{ marginBottom: 0 }}
        />
        <div style={{ flex: 1, minHeight: 0, border: '1px solid #d9d9d9', borderTop: 0 }}>
          {TABS.map(t => (opened.includes(t.key) || t.key === activeKey) && (
            <div key={t.key} style={{ height: '100%', display: t.key === activeKey ? 'block' : 'none' }}>{page(t.key)}</div>
          ))}
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={personLookup != null} retire noneLabel={null} searchText={personLookup?.searchText ?? ''}
        transDate={today()} onResult={onPersonPicked} onClose={() => setPersonLookup(null)} />
      <Pay12_Lookup_RetireCreate personId={createTarget} onCreated={() => retrieveTabpage()} onClose={() => setCreateTarget(null)} />
      <Pay10_Lookup_RemLeaveDays personId={remLeaveTarget} onClose={() => setRemLeaveTarget(null)} />
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="A05" onClose={() => setLinkOpen(false)} />
    </div>
  );
};
