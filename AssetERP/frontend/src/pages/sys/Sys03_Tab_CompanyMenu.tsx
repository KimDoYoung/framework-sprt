/**
 * [1076] 관리자 > 01. 고객관리 > 회사별 메뉴맵핑  (A10)  — 메뉴 키 `Sys03_Tab_ComapnyMenu`(DB 오타 그대로)
 * AS-IS: myApp/client/vi/sys/Sys03_Tab_CompanyMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L36-88): 왼쪽(폭 480, 최대 1000, 분할) = 고객명 조회 + 고객 그리드, 가운데 = 고객별 매뉴 트리
 * UX보강(10) B12-1: 고객명 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 1개라 없음
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Splitter } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Sys03_Tree_CompanyMenu } from './Sys03_Tree_CompanyMenu';

const gb = gbFor<Company>();

/** AS-IS buildGrid() L90-101 */
const buildGrid = () => [
  gb.text('companyNm', 200, '고객명'),  // L96
  gb.text('locNm', 100, '고객코드'),  // L97
];

export const Sys03_Tab_CompanyMenu: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [rows, setRows] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<number>();
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L103-109: 서비스 sys.Sys01_Company.selectByName(companyName, useYn = 'true')
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchCompanies(companyName, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyName]);

  // [E0] 화면 열림 (생성자 L36-88) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={480} max={1000} min={200}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 4px 0 12px', boxSizing: 'border-box' }}>
          {/* [E2] retrieveButton[조회].Select (L55) → retrieve() */}
          <SearchBar onSearch={retrieve}>
            <SearchBar.Field label="고객명">
              {/* [E1] companyName.KeyDown [Enter] (L46) → retrieve() — SearchBar.Input의 Enter */}
              <SearchBar.Input style={{ width: 100 }} value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E3] companyGrid.SelectionChanged (L67-73) → treeMenu.retrieve(companyId) */}
            <SingleGrid<Company>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.companyId)}
              onSelect={r => r && setCompanyId(r.companyId)}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel>
        <Sys03_Tree_CompanyMenu companyId={companyId} />
      </Splitter.Panel>
    </Splitter>
  );
};
