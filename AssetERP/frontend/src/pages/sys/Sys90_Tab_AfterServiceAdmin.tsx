/**
 * [1121] 관리자 > 02. 시스템관리 > 개선사항 및 오류 통보 (A30)
 * AS-IS: myApp/client/vi/sys/Sys90_Tab_AfterServiceAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L62-117: center = 툴바(발생일 ~ · 회사명 · 구분 · 완료여부 · 검색어 · 미완료건만 보기 · 미확인건만 보기 · 조회) + 그리드(행번호, 체크박스 단일),
 *   south = Sys90_Edit_BoardAdmin (편집 폼)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AfterService } from '@/types/sys';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Sys90_Edit_BoardAdmin } from './Sys90_Edit_BoardAdmin';
import { CompanyPopupField } from '@/components/lookup/CompanyPopupField';

const gb = gbFor<AfterService>();
const ALL = '%';  // companyComboBox·typeNameComboBox·afterStateComboBox: "전체" 또는 "%"

/** AS-IS buildGrid() L155-171 */
const columnDefs = [
  gb.text('companyNm', 150, '회사명'),  // L160
  gb.date('happenDate', 100, '발생일'),  // L161
  gb.text('regEmpNm', 80, '요청자'),  // L162
  gb.text('afterServiceNm', 80, '구분'),  // L163
  gb.text('organizeHappenReason', 700, '개선 및 오류내용'),  // L164
  gb.text('afterStateNm', 80, '수행여부'),  // L165
  gb.text('worker', 120, '담당자'),  // L166
  gb.date('dueDate', 100, '완료예정일'),  // L167
  gb.booleanYn('confirmYn', 100, '고객사 확인'),  // L168
];

export const Sys90_Tab_AfterServiceAdmin: React.FC = () => {
  const gridRef = useRef<AgGridReact<AfterService>>(null);
  /** 조회 뒤 그리드가 행을 채우면 선택할 개선사항 */
  const keepId = useRef<number | null>(null);
  // settings() L119-153: 발생일 = 올해 1월 1일 ~ 오늘, 회사·구분·완료여부 = 전체, 미완료건만·미확인건만 = true
  const [happenStartDate, setHappenStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [happenEndDate, setHappenEndDate] = useState<Dayjs>(() => dayjs());
  const [companyCd, setCompanyCd] = useState(ALL);
  const [companyNm, setCompanyNm] = useState(ALL);
  const [typeYn, setTypeYn] = useState(ALL);
  const [stateCd, setStateCd] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [incompleteOnly, setIncompleteOnly] = useState(true);
  const [unconfirmedOnly, setUnconfirmedOnly] = useState(true);
  const [rows, setRows] = useState<AfterService[]>([]);
  const [selected, setSelected] = useState<AfterService | null>(null);
  /** 조회·행 선택마다 편집 폼을 다시 만든다 (AS-IS retrieveEditPage → editDriver.edit(model)) */
  const [formSeq, setFormSeq] = useState(0);


  // retrieveEditPage() L173-186: 선택 행이 있으면 editBoard.retrieve(model), 없으면 비운다
  const retrieveEditPage = (row: AfterService | null) => {
    setSelected(row);
    setFormSeq(n => n + 1);
  };

  // retrieve() L188-241: 서비스 sys.Sys90_AfterService.selectByAdmin / selectByIncomplete
  const retrieve = useCallback(async () => {
    const companyText = companyCd === ALL ? ALL : companyNm;
    try {
      const list = await sysApi.searchAfterServicesAdmin({
        happenStartDate: happenStartDate.format('YYYY-MM-DD'),
        happenEndDate: happenEndDate.format('YYYY-MM-DD'),
        companyText, typeYn, stateCd, unconfirmedOnly, incompleteOnly, searchText,
      });
      // 콜백 L227-237: 행이 있으면 선택이 있으면 그대로, 없으면 첫 행 선택 → 편집 폼 / 없으면 편집 폼 비활성
      const keep = list.find(r => r.afterServiceId === selected?.afterServiceId) ?? list[0] ?? null;
      keepId.current = keep?.afterServiceId ?? null;
      setRows(list);
      retrieveEditPage(keep);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [happenStartDate, happenEndDate, companyCd, companyNm, typeYn, stateCd, unconfirmedOnly, incompleteOnly, searchText, selected]);

  // [E0] 화면 열림 (생성자 L62-117) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // 저장·비고 저장 뒤 그리드 행을 바꾼다 (AS-IS grid.getStore().update(model))
  const onSaved = (row: AfterService) => {
    setRows(prev => prev.map(r => (r.afterServiceId === row.afterServiceId ? row : r)));
    setSelected(row);
  };


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '20px 20px 8px', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L147) → retrieve(). 초기화(UX-02)는 조건 7개가 한 줄을 넘겨 넣지 않는다 */}
        <SearchBar onSearch={retrieve}>
          <SearchBar.Field label="발생일">
            <DatePicker style={{ width: 140 }} allowClear={false} value={happenStartDate} onChange={setHappenStartDate} format="YYYY-MM-DD" />
            ~
            <DatePicker style={{ width: 140 }} allowClear={false} value={happenEndDate} onChange={setHappenEndDate} format="YYYY-MM-DD" />
          </SearchBar.Field>
          <SearchBar.Field label="회사명">
            <CompanyPopupField value={companyCd} onChange={(code, name) => { setCompanyCd(code); setCompanyNm(name); }} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            <SystemCodeComboBox kindCd="AfterServiceCode" altCode={[ALL, '전체']} style={{ width: 100 }} value={typeYn} onChange={c => setTypeYn(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="완료여부">
            <SystemCodeComboBox kindCd="AfterStateCode" altCode={[ALL, '전체']} style={{ width: 100 }} value={stateCd} onChange={c => setStateCd(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색어">
            {/* [E2] searchText.KeyPress [Enter] (L138) → retrieve() */}
            <SearchBar.Input style={{ width: 220 }} placeholder="요청자/개선 및 오류내용/담당자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={incompleteOnly} onChange={e => setIncompleteOnly(e.target.checked)}>미완료건만 보기</Checkbox>
          <Checkbox checked={unconfirmedOnly} onChange={e => setUnconfirmedOnly(e.target.checked)}>미확인건만 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E1] grid.RowClick (L110) → retrieveEditPage() */}
          <SingleGrid<AfterService>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.afterServiceId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowClicked={e => e.data && retrieveEditPage(e.data)}
            onRowDataUpdated={e => {
              if (keepId.current != null) e.api.getRowNode(String(keepId.current))?.setSelected(true, true);
            }}
          />
        </div>
      </div>
      <div style={{ flex: 'none', height: 400, borderTop: '1px solid #d9d9d9' }}>
        <Sys90_Edit_BoardAdmin key={`${selected?.afterServiceId ?? 'none'}-${formSeq}`} model={selected} onSaved={onSaved} />
      </div>
    </div>
  );
};
