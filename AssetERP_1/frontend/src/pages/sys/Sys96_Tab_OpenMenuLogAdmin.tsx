/**
 * [1429] 관리자 > 01. 고객관리 > 고객별 매뉴사용기록 (A35)
 * AS-IS: myApp/client/vi/sys/Sys96_Tab_OpenMenuLogAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-94: 툴바(고객사·사원명 검색·매뉴명 찾기·실사용 건만 조회·조회) + 단순 그리드 + 페이징 툴바(100)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Select, Typography } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, MenuLookup, OpenMenuLog } from '@/types/sys';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { Sys06_Lookup_SelectMulti } from './Sys06_Lookup_SelectMulti';

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
  const [companies, setCompanies] = useState<Code[]>([]);
  const [companyCd, setCompanyCd] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState(false);          // settings() L97: "실사용 건만 조회" 처음엔 해제
  const [menuLabel, setMenuLabel] = useState('전체');   // lookupMenuInfo
  const [className, setClassName] = useState(ALL);
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
    sysApi.searchCompanyNames().then(setCompanies).catch(err => message.error(errorMessage(err, '조회 실패')));
    retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // openLookupMenuInfo() L136-155: 고른 첫 매뉴의 이름·클래스명을 담고, 닫기면 "전체"·"%"
  const openLookupMenuInfo = (menus: MenuLookup[] | null) => {
    setLookupOpen(false);
    if (menus && menus.length > 0) {
      setMenuLabel(menus[0].menuNm);
      setClassName(menus[0].className ?? ALL);
    } else {
      setMenuLabel('전체');
      setClassName(ALL);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ flex: 'none', minHeight: 50, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Typography.Text strong>고객사</Typography.Text>
        {/* [E1] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L115) → retrieve() */}
        <Select style={{ width: 200 }} value={companyCd}
          options={[{ value: ALL, label: '전체' }, ...companies.map(c => ({ value: c.code, label: c.name }))]}
          onChange={code => { setCompanyCd(code); retrieve(code); }} />
        {/* [E2] searchText.KeyDown [Enter] (L123) → retrieve() */}
        <Input style={{ width: 100 }} placeholder="사원명" value={searchText}
          onChange={e => setSearchText(e.target.value)} onPressEnter={() => retrieve()} />
        <Typography.Text strong>매뉴명</Typography.Text>
        {/* [E3] lookupMenuInfo[전체].TriggerClick (L134) → openLookupMenuInfo() */}
        <Input style={{ width: 200, cursor: 'pointer' }} readOnly value={menuLabel}
          onClick={() => setLookupOpen(true)} />
        <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>실사용 건만 조회</Checkbox>
        {/* [E4] retrieveButton[조회].Select (L140) → retrieve() */}
        <Button type="search" onClick={() => retrieve()}>조회</Button>
      </div>
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
