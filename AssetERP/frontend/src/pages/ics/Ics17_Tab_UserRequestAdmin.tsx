/**
 * [1339] 기초자료 > 00. 내부통제 > 법규등록신청확인 (E09)
 * AS-IS: myApp/client/vi/ics/Ics17_Tab_UserRequestAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L58-118: 위 38%(분할, 최대 1000) = 툴바(발생일 ~ · 회사명 · 완료여부 · 검색어 · 미완료건만 보기 · 미확인건만 보기 · 조회) + 법규등록요청 그리드(행번호, 체크박스 단일),
 *   아래 62%(분할, 최대 1100) = 편집 영역 Ics17_Edit_UserRequestAdmin
 * UX보강(10): 툴바 = SearchBar(UX-01 조회 로딩·Enter). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsUserRequest } from '@/types/ics';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { CompanyPopupField } from '@/components/lookup/CompanyPopupField';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ics17_Edit_UserRequestAdmin } from './Ics17_Edit_UserRequestAdmin';

const gb = gbFor<IcsUserRequest>();

/** AS-IS buildGrid() */
const buildGrid = () => [
  gb.date('regDate', 100, '요청일'),
  gb.text('companyName', 150, '회사명'),
  gb.text('personName', 80, '요청자'),
  gb.text('lawTitle', 800, '법규명'),
  gb.text('stateName', 80, '진행상태'),
  gb.date('closeDate', 100, '완료일'),
  gb.booleanYn('confirmYn', 100, '확인'),
];

export const Ics17_Tab_UserRequestAdmin: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  const gridRef = useRef<AgGridReact<IcsUserRequest>>(null);
  const [rows, setRows] = useState<IcsUserRequest[]>([]);
  const [selected, setSelected] = useState<IcsUserRequest | null>(null);
  const [loading, setLoading] = useState(false);
  // settings() L120-152: 발생일 = 올해 1월 1일 ~ 오늘, 회사명·완료여부 = 전체, 두 체크박스 모두 켜짐
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [companyId, setCompanyId] = useState('%');
  const [companyName, setCompanyName] = useState('전체');
  const [stateCode, setStateCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [incompleteOnly, setIncompleteOnly] = useState(true);
  const [unconfirmedOnly, setUnconfirmedOnly] = useState(true);
  const selectedId = useRef<number | null>(null);

  // AS-IS retrieve() L185-249 — 끝나면 고른 행(없으면 첫 행)을 고르고 retrieveEditPage()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await icsApi.searchUserRequestsAdmin({
        startDate: startDate.format('YYYY-MM-DD'), closeDate: closeDate.format('YYYY-MM-DD'),
        companyText: companyId === '%' ? '%' : companyName, stateCode, unconfirmedOnly, incompleteOnly, searchText,
      });
      setRows(list);
      const keep = list.find(r => r.userRequestId === selectedId.current) ?? list[0] ?? null;
      selectedId.current = keep?.userRequestId ?? null;
      setSelected(keep);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, companyId, companyName, stateCode, unconfirmedOnly, incompleteOnly, searchText]);

  // [E0] 화면 열림 (생성자 L58-118) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // 조회 뒤 행 고르기를 그리드에도 반영
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.forEachNode(n => { if (n.data && n.data.userRequestId === selected?.userRequestId && !n.isSelected()) n.setSelected(true); });
  }, [rows, selected]);

  // Edit.updateRow → grid.getStore().update(model): 저장한 행을 그 자리에서 바꾼다
  const onSaved = (row: IcsUserRequest) => {
    setRows(prev => prev.map(r => (r.userRequestId === row.userRequestId ? row : r)));
    setSelected(row);
  };

  return (
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="38%" max={1000} min={150}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 4px', boxSizing: 'border-box' }}>
          {/* [E3] retrieveButton[조회].Select (L146) → retrieve(), [E2] searchText.KeyPress [Enter] (L137) → retrieve() */}
          <div style={{ overflowX: 'auto' }}>
            <SearchBar onSearch={retrieve} loading={loading} style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
              <SearchBar.Field label="발생일">
                <DatePicker allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
                <span style={{ margin: '0 4px' }}>~</span>
                <DatePicker allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
              </SearchBar.Field>
              <SearchBar.Field label="회사명">
                <CompanyPopupField value={companyId} label={companyName} onChange={(code, name) => { setCompanyId(code); setCompanyName(name); }} />
              </SearchBar.Field>
              <SearchBar.Field label="완료여부">
                <SystemCodeComboBox kindCd="AfterStateCode" altCode={['%', '전체']} style={{ width: 100 }} value={stateCode}
                  onChange={code => setStateCode(code ?? '%')} />
              </SearchBar.Field>
              <SearchBar.Field label="검색어">
                <SearchBar.Input style={{ width: 200 }} placeholder="요청자/법규명/법규내용" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
              <Checkbox checked={incompleteOnly} onChange={e => setIncompleteOnly(e.target.checked)}>미완료건만 보기</Checkbox>
              <Checkbox checked={unconfirmedOnly} onChange={e => setUnconfirmedOnly(e.target.checked)}>미확인건만 보기</Checkbox>
            </SearchBar>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E1] grid.RowClick (L111) → retrieveEditPage() L170-183: 고른 행을 편집 영역에 채운다 */}
            <SingleGrid<IcsUserRequest>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.userRequestId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onSelect={r => { if (r) { selectedId.current = r.userRequestId; setSelected(r); } }}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel max={1100} min={200}>
        <Ics17_Edit_UserRequestAdmin model={selected} onSaved={onSaved} />
      </Splitter.Panel>
    </Splitter>
  );
};
