/**
 * 주소록 선택창 (개인·사내·공용 주소록 탭) — Emp57_TabPage_Insert의 [등록]이 연다 (G11)
 * AS-IS: myApp/client/vi/emp/Emp10_Lookup_List.java (282줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 makeLayout() L114-143: 모달 710×490 "주소록", 위 [검색어 칸 250][검색], 가운데 탭 3개(개인 주소록 · 사내 주소록 · 공용 주소록, 각각 체크박스 다중 그리드), 아래 가운데 [확인][닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empAddrBookApi, empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EmpAddrBook, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

/** insert(callbackResult) L54 — 고른 항목 하나. 외부(주소록)는 addrBookId, 사내(사원)는 사원 ID를 addrBookId에 담는다 (confirmButton L160-193) */
export interface AddrBookPick {
  addrBookId: number;
  contactName: string;
  emailAddress?: string | null;
  mobileTelNo?: string | null;
  /** 외부 / 사내 */
  note: '외부' | '사내';
}

interface Props {
  open: boolean;
  onResult: (list: AddrBookPick[]) => void;
  onClose: () => void;
}

const gbAddr = gbFor<EmpAddrBook>();
const gbPerson = gbFor<TransInfo>();

type TabKey = 'grid' | 'person' | 'public';

export const Emp10_Lookup_List: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [tab, setTab] = useState<TabKey>('grid');
  const [addrRows, setAddrRows] = useState<EmpAddrBook[]>([]);
  const [personRows, setPersonRows] = useState<TransInfo[]>([]);
  const [publicRows, setPublicRows] = useState<EmpAddrBook[]>([]);
  const addrRef = useRef<AgGridReact<EmpAddrBook>>(null);
  const personRef = useRef<AgGridReact<TransInfo>>(null);
  const publicRef = useRef<AgGridReact<EmpAddrBook>>(null);

  // buildGrid() L71-82 / buildPublicGrid() L96-107
  const addrCols = useMemo(() => [
    gbAddr.text('companyName', 120, '회사이름'),
    gbAddr.text('contactName', 120, '담당자명'),
    gbAddr.text('emailAddress', 120, '이메일'),
    gbAddr.text('mobileTelNo', 120, '핸드폰 번호'),
    gbAddr.text('officeTelNo', 120, '사무실 번호'),
  ], []);
  // buildEmpGrid() L84-94
  const personCols = useMemo(() => [
    gbPerson.text('parentFullNm', 200, '부서명'),
    gbPerson.text('korNm', 100, '성명'),
    gbPerson.text('posNm', 100, '직위'),
    gbPerson.text('emailAddr', 150, '이메일주소'),
  ], []);

  // retrieveAddressGrid() L215-233: 서비스 emp.Emp10_AddrBook.selectByText(personId, "%"+글자+"%")
  const retrieveAddressGrid = useCallback(async (text: string) => {
    try { setAddrRows(await empAddrBookApi.searchAddrBooks(text)); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);
  // retrievePersonGrid() L235-254: 서비스 emp.Emp00_TransInfo.selectByText(companyId, "100"=재직, 오늘, "%"+글자+"%")
  const retrievePersonGrid = useCallback(async (text: string) => {
    try { setPersonRows(await empApi.searchTransInfos(dayjs().format('YYYY-MM-DD'), text, '100')); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);
  // retrievePublicAddressGrid() L256-274: 서비스 emp.Emp10_AddrBook.selectByPublicText("%"+글자+"%", companyId)
  const retrievePublicAddressGrid = useCallback(async (text: string) => {
    try { setPublicRows(await empAddrBookApi.searchPublicAddrBooks(text)); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);

  // retrieve() L203-213: 지금 열린 탭만 다시 조회
  const retrieve = () => {
    if (tab === 'grid') void retrieveAddressGrid(searchText);
    if (tab === 'person') void retrievePersonGrid(searchText);
    if (tab === 'public') void retrievePublicAddressGrid(searchText);
  };

  // [E0] 화면 열림 (생성자 L62-64) → init() / insert() L54-60: show(), retrieve(), retrievePersonGrid(), retrievePublicAddressGrid()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setTab('grid');
    setAddrRows([]);
    setPersonRows([]);
    setPublicRows([]);
    void retrieveAddressGrid('');
    void retrievePersonGrid('');
    void retrievePublicAddressGrid('');
  }, [open, retrieveAddressGrid, retrievePersonGrid, retrievePublicAddressGrid]);

  // [E3] confirmButton[확인].Select (L160) → 세 그리드에서 체크한 행을 모아 callbackResult.execute(insertList), hide()
  const confirm = () => {
    const list: AddrBookPick[] = [];
    (addrRef.current?.api.getSelectedRows() ?? []).forEach(m => list.push({
      addrBookId: m.addrBookId,
      contactName: `${m.companyName ?? ''} ${m.contactName ?? ''} ${m.posName ?? ''}`,
      emailAddress: m.emailAddress,
      mobileTelNo: m.mobileTelNo,
      note: '외부',
    }));
    (personRef.current?.api.getSelectedRows() ?? []).forEach(p => list.push({
      addrBookId: p.personId,
      contactName: `${p.korNm ?? ''} (${p.orgKorNm ?? ''})`,
      emailAddress: p.emailAddr,
      mobileTelNo: p.mobileTelNo,
      note: '사내',
    }));
    (publicRef.current?.api.getSelectedRows() ?? []).forEach(m => list.push({
      addrBookId: m.addrBookId,
      contactName: `${m.companyName ?? ''} ${m.contactName ?? ''} ${m.posName ?? ''}`,
      emailAddress: m.emailAddress,
      mobileTelNo: m.mobileTelNo,
      note: '외부',
    }));
    onResult(list);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="주소록"
      width={710}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="save" onClick={confirm}>확인</Button>
          {/* [E2] closeButton[닫기].Select (L154) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L146) → retrieve(), [E4] retrieveButton[검색].Select (L195) → retrieve() */}
        <SearchBar onSearch={retrieve} searchText="검색">
          <SearchBar.Field label="검색어">
            <SearchBar.Input style={{ width: 250 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <Tabs
          style={{ flex: 1, minHeight: 0 }}
          className="addr-book-tabs"
          activeKey={tab}
          onChange={k => setTab(k as TabKey)}
          items={[
            { key: 'grid', label: '개인 주소록', forceRender: true, children: (
              <div style={{ height: 270 }}>
                <MultiGrid<EmpAddrBook> rowClick gridRef={addrRef} rowData={addrRows} columnDefs={addrCols} getRowId={p => String(p.data.addrBookId)} />
              </div>) },
            { key: 'person', label: '사내 주소록', forceRender: true, children: (
              <div style={{ height: 270 }}>
                <MultiGrid<TransInfo> rowClick gridRef={personRef} rowData={personRows} columnDefs={personCols} getRowId={p => String(p.data.personId)} />
              </div>) },
            { key: 'public', label: '공용 주소록', forceRender: true, children: (
              <div style={{ height: 270 }}>
                <MultiGrid<EmpAddrBook> rowClick gridRef={publicRef} rowData={publicRows} columnDefs={addrCols} getRowId={p => String(p.data.addrBookId)} />
              </div>) },
          ]}
        />
      </div>
    </LookupModal>
  );
};
