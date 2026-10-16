/**
 * 테스트매뉴 > 공통 컴포넌트 테스트 (B11) — AS-IS 원본 없음. 공통 부품을 mock 데이터로 시험하는 화면이다.
 * 위: SearchBar(UX-01 조회 로딩·UX-02 초기화·UX-04 입력 x) + SingleGrid + PagingToolBar
 * 아래: CellEditGrid + useGridCrud + 저장(n)(UX-03)
 * 데이터: mock/reactComponents.ts (조회·저장 600ms 지연)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Button } from '@/components/button';
import { CellEditGrid, PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import {
  MOCK_COMPANIES, MOCK_STATES, deleteMockMemos, saveMockMemos, searchMockMemos, searchMockPeople,
  type MockMemo, type MockPerson, type MockSearch,
} from '@/mock/reactComponents';

const LIMIT = 20;
const gb = gbFor<MockPerson>();
const gm = gbFor<MockMemo>();

const PERSON_COLUMNS = [
  gb.text('companyNm', 160, '고객사'),
  gb.text('orgNm', 130, '부서'),
  gb.textCenter('empNo', 90, '사번'),
  gb.textCenter('korName', 80, '성명'),
  gb.textCenter('posNm', 70, '직위'),
  gb.date('hireDate', 100, '입사일'),
  { ...gb.textCenter('stateCd', 70, '상태'), valueFormatter: (p: { value?: string }) => MOCK_STATES.find(s => s.value === p.value)?.label ?? '' },
  gb.booleanYn2('useYn', 70, '사용'),
  gb.text('note', 160, '비고'),
];

const MEMO_COLUMNS = [
  gm.text('title', 240, '*제목', { editor: 'text' }),
  gm.textCenter('owner', 100, '담당', { editor: 'text' }),
  gm.boolean('useYn', 60, '사용', { editable: true }),
];

export const Test_Tab_ReactComponents: React.FC = () => {
  const loginUser = useLoginUser();
  // 처음 연 값 = 초기화(UX-02) 값: 로그인 회사(mock 목록에 있으면), 오늘, 상태 전체, 사용만
  const sp = useSearchParams<MockSearch>(() => ({
    companyNm: MOCK_COMPANIES.includes(loginUser.companyName) ? loginUser.companyName : '',
    baseDate: dayjs().format('YYYY-MM-DD'),
    stateCd: '',
    searchText: '',
    useOnly: true,
  }));
  const [rows, setRows] = useState<MockPerson[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  /** 페이지를 넘길 때는 마지막 조회 조건 (GridPagingLoader, Emp01_Tab_UserInfo와 같은 방식) */
  const paramRef = useRef<MockSearch | undefined>(undefined);

  const getPaging = useCallback(async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await searchMockPeople({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, []);

  // 조회: Promise를 돌려줘야 SearchBar가 끝날 때까지 로딩을 보여준다(UX-01)
  const retrieve = () => {
    paramRef.current = { ...sp.current.current };
    return getPaging(1);
  };

  const crud = useGridCrud<MockMemo>({
    idField: 'memoId',
    search: searchMockMemos,
    save: saveMockMemos,
    remove: deleteMockMemos,
    newRow: () => ({ title: '', owner: '', useYn: 'true' }),
    firstEditField: 'title',
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
  });

  useEffect(() => {
    void retrieve();
    void crud.retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const v = sp.values;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Typography.Text type="secondary">
        UX보강 부품 시험 (mock 데이터, 조회·저장 0.6초 지연) — 조회 연타·Enter, 초기화, 입력 x, 페이지 이동, 셀 수정 후 저장(n)
      </Typography.Text>
      <SearchBar onSearch={retrieve} onReset={sp.reset} loading={loading}>
        <SearchBar.Field label="고객사">
          <Select style={{ width: 180 }} value={v.companyNm}
            options={[{ value: '', label: '전체' }, ...MOCK_COMPANIES.map(c => ({ value: c, label: c }))]}
            onChange={val => sp.set('companyNm', val)} />
        </SearchBar.Field>
        <SearchBar.Field label="기준일">
          <DatePicker style={{ width: 130 }} value={v.baseDate ? dayjs(v.baseDate) : null}
            onChange={d => sp.set('baseDate', d ? d.format('YYYY-MM-DD') : '')} />
        </SearchBar.Field>
        <SearchBar.Field label="상태">
          <Select style={{ width: 90 }} value={v.stateCd} options={[{ value: '', label: '전체' }, ...MOCK_STATES]}
            onChange={val => sp.set('stateCd', val)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 220 }} placeholder="성명/사번/부서/비고" value={v.searchText}
            onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={v.useOnly} onChange={e => sp.set('useOnly', e.target.checked)}>사용만 보기</Checkbox>
      </SearchBar>
      <div style={{ flex: 3, minHeight: 0, display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
        <SingleGrid<MockPerson> rowData={rows} columnDefs={PERSON_COLUMNS} loading={loading}
          getRowId={p => String(p.data.personId)} />
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Typography.Text strong>셀 편집 CRUD</Typography.Text>
        <Button type="search" onClick={crud.retrieve}>조회</Button>
        <Button type="register" onClick={crud.addRow}>등록</Button>
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </div>
      <div style={{ flex: 2, minHeight: 0 }}>
        <CellEditGrid<MockMemo> crud={crud} columnDefs={MEMO_COLUMNS} />
      </div>
    </div>
  );
};
