/**
 * [1283] 관리자 > 01. 화면권한관리 > 사원별 메뉴권한(View)  (C04)
 * AS-IS: myApp/client/vi/emp/Emp00_Tab_RoleMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * UX보강(10) B12-3: 툴바 = SearchBar(UX-01·02·04, 조건 2개: 기준일·조직/직무/성명 → 초기화는 오늘·'', 자동 조회 없음)
 * 레이아웃(생성자 L44-80): west(55%, 분할, 최대 1000) = 툴바(높이 50) + 사원 그리드, center(45%) = 사원 메뉴 트리(Sys07_Tree_PersonRoleMenu)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Splitter } from 'antd';
import dayjs from 'dayjs';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { SearchBar, useSearchParams } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Sys05_Lookup_PersonRole } from '@/components/lookup/Sys05_Lookup_PersonRole';
import { Sys07_Tree_PersonRoleMenu } from '@/pages/sys/Sys07_Tree_PersonRoleMenu';

const gb = gbFor<TransInfo>();

const selectOne = { mode: 'singleRow' as const, checkboxes: true, enableClickSelection: true };

export const Emp00_Tab_RoleMenu: React.FC = () => {
  const sp = useSearchParams(() => ({ baseDate: dayjs().format('YYYY-MM-DD'), findText: '' })); // settings() L82-102: LoginUser.getToday()
  const { baseDate, findText } = sp.values;
  const [rows, setRows] = useState<TransInfo[]>([]);
  const [personId, setPersonId] = useState<number>();
  const [lookupPersonId, setLookupPersonId] = useState<number>();

  // buildGrid() L104-122 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.text('parentFullNm', 350, '조직'),  // L115
    gb.text('titleNm', 120, '직책'),  // L116
    gb.textCenter('empNo', 100, '사번'),  // L117
    gb.textCenter('korNm', 100, '성명'),  // L118
    // L119 actionCell: ImageCell("View") → Sys05_Lookup_PersonRole.open(personId)
    iconCell<TransInfo>('view', 'actionCell', 60, '그룹', row => setLookupPersonId(row.personId)),
  ], []);

  // retrieve() L124-139: 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate=기준일, transCode '100')
  // searchText의 '%…%'는 서버가 만든다. isSeparateAddTitle은 안 보낸다 → 서버가 false(겸직도 재직으로)
  const retrieve = useCallback(async () => {
    try {
      setRows(await empApi.searchTransInfos(baseDate, findText, '100', false));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [baseDate, findText]);

  // [E0] 화면 열림 (생성자 L44-80) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <>
      <Splitter style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel defaultSize="55%" max={1000} min={200}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0', boxSizing: 'border-box' }}>
            {/* [E1] retrieveButton[조회].Select (L89) → retrieve(). 초기화는 UX-02 */}
            <SearchBar onSearch={retrieve} onReset={sp.reset}>
              <SearchBar.Field label="기준일">
                <DatePicker style={{ width: 140 }} allowClear={false} format="YYYY-MM-DD" value={dayjs(baseDate)}
                  onChange={d => d && sp.set('baseDate', d.format('YYYY-MM-DD'))} />
              </SearchBar.Field>
              <SearchBar.Field label="조직/직무/성명">
                <SearchBar.Input style={{ width: 200 }} value={findText} onChange={e => sp.set('findText', e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E2] grid.SelectionChanged (L95-101) → meneTree.retrieve(선택 사원 personId) */}
              <SingleGrid<TransInfo>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.transId)}
                rowSelection={selectOne}
                onSelect={r => r && setPersonId(r.personId)}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <Sys07_Tree_PersonRoleMenu personId={personId} />
        </Splitter.Panel>
      </Splitter>
      <Sys05_Lookup_PersonRole open={lookupPersonId !== undefined} personId={lookupPersonId} onClose={() => setLookupPersonId(undefined)} />
    </>
  );
};
