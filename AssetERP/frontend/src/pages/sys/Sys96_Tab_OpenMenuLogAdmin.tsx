/**
 * [1429] 관리자 > 01. 고객관리 > 고객별 매뉴사용기록 (A35)
 * AS-IS: myApp/client/vi/sys/Sys96_Tab_OpenMenuLogAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-94: 툴바(고객사·사원명 검색·매뉴명 찾기·실사용 건만 조회·조회) + 단순 그리드 + 페이징 툴바(100)
 * UX보강(10) B12-2: 툴바 = SearchBar(UX-01·02, 조건 5개 → 초기화는 전체·빈 사원명·전체 매뉴·체크 해제, 자동 조회 없음). 사원명은 SearchBar.Input(Enter = 조회, x)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MenuLookup, OpenMenuLog } from '@/types/sys';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Sys06_Lookup_SelectMulti } from './Sys06_Lookup_SelectMulti';
import { CompanyPopupField } from '@/components/lookup/CompanyPopupField';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const ALL = '%';     // companyName "전체" / className "%"

const gb = gbFor<OpenMenuLog>();

/** AS-IS buildGrid() L157-168 */
const columnDefs = [
  gb.text('companyNm', 200, '고객사명'),
  gb.text('personInfo', 200, '사원정보'),
  gb.text('menuNm', 200, '매뉴명'),
  gb.text('className', 200, '클래스명'),
  gb.textCenter('dateStr', 150, '열람일시'),
  gb.longSecond('second', 80, '사용(초)', '#456EA6'),
  gb.text('loginInfo', 500, '접속정보'),
];

export const Sys96_Tab_OpenMenuLogAdmin: React.FC = () => {
  // useYn: settings() L97 "실사용 건만 조회" 처음엔 해제, menuLabel·className: lookupMenuInfo 처음 "전체"·"%"
  const sp = useSearchParams(() => ({ companyCd: ALL, searchText: '', useYn: false, menuLabel: '전체', className: ALL }));
  const { companyCd, searchText, useYn, menuLabel, className } = sp.values;
  const [lookupOpen, setLookupOpen] = useState(false);
  const [rows, setRows] = useState<OpenMenuLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ companyId: number | null; searchText: string; className: string; useYn: boolean } | undefined>(undefined);
  const columns = useMemo(() => columnDefs, []);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await sysApi.searchOpenMenuLogs({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // retrieve() L170-194: 조건을 만들어 1페이지부터 다시 읽는다
  const retrieve = (code: string = companyCd, clazz: string = className) => {
    paramRef.current = {
      companyId: code === ALL ? null : Number(code),  // "전체" 또는 "%"이면 null
      searchText,                                     // 원본은 "%" + 검색어 + "%" — 서버가 만든다(05 §6)
      className: clazz,
      useYn,
    };
    void getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L55-94) → settings(), retrieve()
  useEffect(() => {
    retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // openLookupMenuInfo() L136-155: 고른 첫 매뉴의 이름·클래스명을 담고, 닫기면 "전체"·"%"
  const openLookupMenuInfo = (menus: MenuLookup[] | null) => {
    setLookupOpen(false);
    if (menus && menus.length > 0) {
      sp.setValues(v => ({ ...v, menuLabel: menus[0].menuNm, className: menus[0].className ?? ALL }));
    } else {
      sp.setValues(v => ({ ...v, menuLabel: '전체', className: ALL }));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E4] retrieveButton[조회].Select (L140) → retrieve(). 초기화는 UX-02 */}
      <SearchBar style={{ minHeight: 50 }} onSearch={() => retrieve()} onReset={sp.reset} loading={loading}>
        <SearchBar.Field label="고객사">
          {/* [E1] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L115) → retrieve() */}
          <CompanyPopupField value={companyCd} onChange={code => { sp.set('companyCd', code); retrieve(code); }} />
        </SearchBar.Field>
        {/* [E2] searchText.KeyDown [Enter] (L123) → retrieve() */}
        <SearchBar.Input style={{ width: 100 }} placeholder="사원명" value={searchText}
          onChange={e => sp.set('searchText', e.target.value)} />
        <SearchBar.Field label="매뉴명">
          {/* [E3] lookupMenuInfo[전체].TriggerClick (L134) → openLookupMenuInfo() */}
          <Input style={{ width: 200, cursor: 'pointer' }} readOnly value={menuLabel}
            onClick={() => setLookupOpen(true)} />
        </SearchBar.Field>
        <Checkbox checked={useYn} onChange={e => sp.set('useYn', e.target.checked)}>실사용 건만 조회</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<OpenMenuLog>
          rowData={rows}
          loading={loading}
          columnDefs={columns}
          getRowId={p => p.data.openMenuLogId}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      <Sys06_Lookup_SelectMulti open={lookupOpen} onResult={openLookupMenuInfo} />
    </div>
  );
};
