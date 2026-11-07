/**
 * 주소록 조회창 (EE35) — Dcr10_Lookup_MailSender의 수신·참조 [주소록]이 연다
 * AS-IS: myApp/client/vi/emp/Emp10_Lookup_MailAddress.java (299줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * makeLayout() L115-146: 모달 "주소록" 710×490, 위 [검색어][검색][그룹], 탭 3개(개인 주소록 · 사내 주소록 · 공용 주소록) 체크 다중 그리드, 아래 가운데 [확인][닫기].
 *   열면서 세 목록을 모두 조회(open L64-70). [확인]은 세 그리드에서 고른 사람의 `이름 <메일>;`을 이어 붙여 돌려준다
 * UX보강(10): 행 클릭 선택(UX-06)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empAddrBookApi, empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EmpAddrBook, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { PageTabs } from '@/components/tabs';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp57_Lookup_List } from './Emp57_Lookup_List';

const gbAddr = gbFor<EmpAddrBook>();
const gbEmp = gbFor<TransInfo>();

/** buildGrid()·buildPublicGrid() L72-83·L97-108 (setChecked MULTI) */
const buildAddrGrid = () => [
  gbAddr.text('companyName', 120, '회사이름'),
  gbAddr.text('contactName', 120, '담당자명'),
  gbAddr.text('emailAddress', 120, '이메일'),
  gbAddr.text('mobileTelNo', 120, '핸드폰 번호'),
  gbAddr.text('officeTelNo', 120, '사무실 번호'),
];

/** buildEmpGrid() L85-95 (setChecked MULTI) */
const buildEmpGrid = () => [
  gbEmp.text('parentFullNm', 200, '부서명'),
  gbEmp.text('korNm', 100, '성명'),
  gbEmp.text('posNm', 100, '직위'),
  gbEmp.text('emailAddr', 150, '이메일주소'),
];

type TabKey = 'addr' | 'person' | 'public';

interface Props {
  open: boolean;
  /** AS-IS callbackResult.execute(String): `이름 <메일>;`을 이어 붙인 글 ([확인]·[그룹]). 닫는 것은 부르는 쪽 */
  onResult: (text: string) => void;
  onClose: () => void;
}

export const Emp10_Lookup_MailAddress: React.FC<Props> = ({ open, onResult, onClose }) => {
  const addrRef = useRef<AgGridReact<EmpAddrBook>>(null);
  const personRef = useRef<AgGridReact<TransInfo>>(null);
  const publicRef = useRef<AgGridReact<EmpAddrBook>>(null);
  const [searchText, setSearchText] = useState('');
  const [tab, setTab] = useState<TabKey>('addr');
  const [addrRows, setAddrRows] = useState<EmpAddrBook[]>([]);
  const [personRows, setPersonRows] = useState<TransInfo[]>([]);
  const [publicRows, setPublicRows] = useState<EmpAddrBook[]>([]);
  const [groupOpen, setGroupOpen] = useState(false);
  const addrCols = useMemo(buildAddrGrid, []);
  const empCols = useMemo(buildEmpGrid, []);

  // retrieveAddressGrid() L232-250 → emp.Emp10_AddrBook.selectByText (개인 주소록, 검색어는 서버가 %…%로)
  const retrieveAddr = useCallback(async (text: string) => {
    try { setAddrRows(await empAddrBookApi.searchAddrBooks(text)); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);
  // retrievePersonGrid() L252-271 → emp.Emp00_TransInfo.selectByText (회사·재직 100·오늘)
  const retrievePerson = useCallback(async (text: string) => {
    try { setPersonRows(await empApi.searchTransInfos(dayjs().format('YYYY-MM-DD'), text, '100')); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);
  // retrievePublicAddressGrid() L273-291 → emp.Emp10_AddrBook.selectByPublicText
  const retrievePublic = useCallback(async (text: string) => {
    try { setPublicRows(await empAddrBookApi.searchPublicAddrBooks(text)); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);

  // retrieve() L220-230: 보고 있는 탭만 다시 조회
  const retrieve = (key: TabKey, text: string) => {
    if (key === 'addr') void retrieveAddr(text);
    else if (key === 'person') void retrievePerson(text);
    else void retrievePublic(text);
  };

  // [E0] open() L64-70: retrieve() + retrievePersonGrid() + retrievePublicAddressGrid()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setTab('addr');
    setAddrRows([]); setPersonRows([]); setPublicRows([]);
    void retrieveAddr('');
    void retrievePerson('');
    void retrievePublic('');
  }, [open, retrieveAddr, retrievePerson, retrievePublic]);

  // [E3] confirmButton[확인].Select (L163): 세 그리드의 고른 사람을 `이름 <메일>;`로 이어 붙인다(메일이 없는 사람은 건너뜀) → callback 뒤 hide()
  const confirm = () => {
    let text = '';
    for (const m of addrRef.current?.api.getSelectedRows() ?? []) {
      if (m.emailAddress != null) text += `${m.contactName ?? ''} <${m.emailAddress}>;`;
    }
    for (const m of personRef.current?.api.getSelectedRows() ?? []) {
      if (m.emailAddr != null) text += `${m.korNm ?? ''} <${m.emailAddr}>;`;
    }
    for (const m of publicRef.current?.api.getSelectedRows() ?? []) {
      if (m.emailAddress != null) text += `${m.contactName ?? ''} <${m.emailAddress}>;`;
    }
    onResult(text);
  };

  return (
    <LookupModal
      open={open}
      title="주소록"
      width={710}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E2] closeButton[닫기].Select (L157) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress Enter (L149) → retrieve(). [E4] retrieveButton[검색].Select (L197) → retrieve(). [E5] groupButton[그룹].Select (L203) → Emp57_Lookup_List("email") */}
        <SearchBar onSearch={() => retrieve(tab, searchText)} searchText="검색"
          extra={<Button type="group" onClick={() => setGroupOpen(true)}>그룹</Button>}>
          <SearchBar.Field label="검색어">
            <SearchBar.Input style={{ width: 250 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <PageTabs
            activeKey={tab}
            onChange={k => setTab(k as TabKey)}
            style={{ height: '100%' }}
            items={[
              { key: 'addr', label: '개인 주소록', forceRender: true,
                children: <div style={{ height: 250 }}><MultiGrid<EmpAddrBook> rowClick gridRef={addrRef} rowData={addrRows} columnDefs={addrCols} getRowId={p => String(p.data.addrBookId)} /></div> },
              { key: 'person', label: '사내 주소록', forceRender: true,
                children: <div style={{ height: 250 }}><MultiGrid<TransInfo> rowClick gridRef={personRef} rowData={personRows} columnDefs={empCols} getRowId={p => `${p.data.personId}-${p.data.transId}`} /></div> },
              { key: 'public', label: '공용 주소록', forceRender: true,
                children: <div style={{ height: 250 }}><MultiGrid<EmpAddrBook> rowClick gridRef={publicRef} rowData={publicRows} columnDefs={addrCols} getRowId={p => String(p.data.addrBookId)} /></div> },
            ]}
          />
        </div>
      </div>
      {/* [E5] 그룹 선택 결과는 있을 때만 callback 뒤 hide() (L206-215) */}
      <Emp57_Lookup_List open={groupOpen} actionCode="email"
        onSelect={result => { setGroupOpen(false); if (typeof result === 'string') onResult(result); }}
        onClose={() => setGroupOpen(false)} />
    </LookupModal>
  );
};
