/**
 * [1389] 펀드관리 > 03. 일임(자문)관리 > 일임계좌 권한설정 (Q02)
 * AS-IS: myApp/client/vi/adv/Adv05_Tab_OrgAuth.java (174줄) + Adv05_Page_OrgAuth.java (오른쪽 트리) + Adv05_Lookup_OrgAuth.java (334줄, components/lookup)
 *   + Adv02_Lookup_SelectMulti(components/lookup)·Org00_Lookup_SelectMulti — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L45-82: 위 툴바(50, 여백 20·20·-2·20, 테두리) / 왼쪽(0.5, 분할 가능, 최대 1000) = 일임계좌 그리드 + 페이징 툴바(500) / 가운데(0.5) = 조직 권한 트리(Adv05_Page_OrgAuth)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { advApi } from '@/api/adv';
import { errorMessage } from '@/api/client';
import { AdvAccount } from '@/types/adv';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Adv05_Lookup_OrgAuth } from '@/components/lookup/Adv05_Lookup_OrgAuth';
import { Adv05_Page_OrgAuth } from './Adv05_Page_OrgAuth';

const gb = gbFor<AdvAccount>();
/** setToolBar(500) — 한 페이지 행 수 */
const LIMIT = 500;
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Adv05_Tab_OrgAuth: React.FC = () => {
  const gridRef = useRef<AgGridReact<AdvAccount>>(null);
  // [E0] 화면 열림 (생성자 L45-82) → settings() L84-122, 열자마자 조회한다. 검색칸 400(빈칸 글자 "관리코드/계좌명")
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AdvAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  /** 목록에서 고른 일임계좌 → 오른쪽 트리(tabPage). 원본은 행이 없으면 트리를 그대로 둔다 */
  const [accountId, setAccountId] = useState<number | null>(null);
  const [authAllOpen, setAuthAllOpen] = useState(false);
  const retrieveSeq = useRef(0);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<string | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (paramRef.current === undefined) return;
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await advApi.searchAccounts({ searchText: paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      if (my !== retrieveSeq.current) return;
      setRows(res.rows);  // 조회가 끝나면 첫 행이 있으면 고르고 트리를 그 계좌로 다시 읽는다(onRowDataUpdated)
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };

  // [E1] searchText.KeyPress [Enter] (L89)·[E2] retrieveButton[조회].Select (L98) → retrieve() L148-169: 조건("%검색어%"는 서버가 만든다)을 정하고 1페이지부터
  const retrieve = () => {
    paramRef.current = searchText;
    void getPaging(1);
  };
  useEffect(retrieve, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] grid.RowClick (L116) → retrieveEditPage() L140-146: tabPage.retrieve(고른 계좌) / 선택이 없으면 tabPage.retrieve(null)
  const retrieveEditPage = (api: AgGridReact<AdvAccount>['api'], source: string) => {
    const row = api.getSelectedRows()[0];
    if (row) setAccountId(row.accountId);
    else if (source === 'rowClicked' || source === 'checkboxSelected') setAccountId(null);
  };

  // buildGrid() — 행번호·체크·관리코드 150(가운데)·계좌명 300·증권사코드 150·증권사명 150·계좌번호 300·최초설정일자 90·해지일자 90·작업일시 90·작업자 90
  const columnDefs = useMemo(() => [
    gb.textCenter('manageCode', 150, '관리코드'),
    gb.text('manageName', 300, '계좌명'),
    gb.text('trCorpCode', 150, '증권사코드'),
    gb.text('trCorpName', 150, '증권사명'),
    gb.text('accountNoDec', 300, '계좌번호'),
    gb.date('startDate', 90, '최초설정일자'),
    gb.date('closeDate', 90, '해지일자'),
    gb.date('workDate', 90, '작업일시'),
    gb.text('worker', 90, '작업자'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0 20px', flexShrink: 0 }}>
        <div>
          <SearchBar
            onSearch={retrieve}
            loading={loading}
            extra={
              /* [E3] authAllButton[일괄 권한설정].Select (L104) → Adv05_Lookup_OrgAuth.open(callback: retrieve()) */
              <Button type="save" onClick={() => setAuthAllOpen(true)}>일괄 권한설정</Button>
            }
          >
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 400 }} placeholder="관리코드/계좌명" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel defaultSize="50%" min={200} max={1000}>
            <div style={{ height: '100%', padding: '0 0 20px 20px', boxSizing: 'border-box' }}>
              <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <SingleGrid<AdvAccount>
                    gridRef={gridRef}
                    rowData={rows}
                    columnDefs={columnDefs}
                    getRowId={p => String(p.data.accountId)}
                    loading={loading}
                    rowSelection={SINGLE_CHECK}
                    onRowDataUpdated={e => {
                      // 조회가 끝나면 첫 행을 고르고 트리를 그 계좌로 읽는다(행이 없으면 아무것도 안 한다)
                      const node = e.api.getDisplayedRowAtIndex(0);
                      if (node) {
                        node.setSelected(true);
                        setAccountId(node.data?.accountId ?? null);
                      }
                    }}
                    onSelectionChanged={e => retrieveEditPage(e.api, e.source)}
                  />
                </div>
                <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void getPaging(p)} />
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel min={200}>
            <div style={{ height: '100%', padding: '0 20px 22px 0', boxSizing: 'border-box'}}>
              <Adv05_Page_OrgAuth accountId={accountId} />
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <Adv05_Lookup_OrgAuth open={authAllOpen} onDone={retrieve} onClose={() => setAuthAllOpen(false)} />
    </div>
  );
};
