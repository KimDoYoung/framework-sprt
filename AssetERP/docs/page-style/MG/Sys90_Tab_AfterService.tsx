/**
 * [1066] 개선사항 및 오류 통보 (A29)
 * AS-IS: myApp/client/vi/sys/Sys90_Tab_AfterService.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L61-112: center = 툴바(발생일 ~ · 구분 · 완료여부 · 검색어 · 미확인건만 보기 · 조회 · 등록) + 그리드(행번호, 체크박스 단일, 8열),
 *   south = Sys90_Edit_Board (편집 폼). 로그인한 회사의 것만 보인다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다
 * 스타일: MG (견본 — docs/page-style.md)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AfterService } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Sys90_Edit_Board } from './Sys90_Edit_Board';

const gb = gbFor<AfterService>();
const ALL = '%';  // typeNameComboBox·afterStateComboBox: "전체" 또는 "%"

/** AS-IS buildGrid() L152-167 */
const columnDefs = [
  gb.date('happenDate', 100, '발생일'),  // L157
  gb.text('regEmpNm', 120, '요청자'),  // L158
  gb.text('afterServiceNm', 60, '구분'),  // L159
  gb.text('organizeHappenReason', 900, '개선 및 오류내용'),  // L160
  gb.text('afterStateNm', 80, '수행여부'),  // L161
  gb.text('worker', 120, '담당자'),  // L162
  gb.date('dueDate', 100, '완료예정일'),  // L163
  gb.booleanYn('confirmYn', 100, '확인'),  // L164
];

export const Sys90_Tab_AfterService: React.FC = () => {
  const gridRef = useRef<AgGridReact<AfterService>>(null);
  /** 조회·등록 뒤 그리드가 행을 채우면 선택할 개선사항 */
  const keepId = useRef<number | null>(null);
  // settings() L114-150: 발생일 = 올해 1월 1일 ~ 오늘, 구분·완료여부 = 전체, 미확인건만 보기 = true
  const [happenStartDate, setHappenStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [happenEndDate, setHappenEndDate] = useState<Dayjs>(() => dayjs());
  const [typeYn, setTypeYn] = useState(ALL);
  const [stateCd, setStateCd] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [unconfirmedOnly, setUnconfirmedOnly] = useState(true);
  const [rows, setRows] = useState<AfterService[]>([]);
  const [selected, setSelected] = useState<AfterService | null>(null);
  /** 조회·행 선택마다 편집 폼을 다시 만든다 (AS-IS retrieveEditPage → editDriver.edit(model)) */
  const [formSeq, setFormSeq] = useState(0);

  // retrieveEditPage() L169-182: 선택 행이 있으면 editBoard.retrieve(model), 없으면 비활성 + init()
  const retrieveEditPage = (row: AfterService | null) => {
    setSelected(row);
    setFormSeq(n => n + 1);
  };

  // retrieve() L184-231: 서비스 sys.Sys90_AfterService.selectBySearchText
  const retrieve = useCallback(async () => {
    try {
      const list = await sysApi.searchAfterServices({
        happenStartDate: happenStartDate.format('YYYY-MM-DD'),
        happenEndDate: happenEndDate.format('YYYY-MM-DD'),
        typeYn, stateCd, unconfirmedOnly, searchText,
      });
      // 콜백 L217-227: 행이 있으면 선택이 있으면 그대로, 없으면 첫 행 선택 → 편집 폼 / 없으면 편집 폼 비활성
      const keep = list.find(r => r.afterServiceId === selected?.afterServiceId) ?? list[0] ?? null;
      keepId.current = keep?.afterServiceId ?? null;
      setRows(list);
      retrieveEditPage(keep);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [happenStartDate, happenEndDate, typeYn, stateCd, unconfirmedOnly, searchText, selected]);

  // [E0] 화면 열림 (생성자 L61-112) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E4] insertButton[등록].Select (L144) → insertRow() L233-251: 서버에서 ID만 받아 새 행을 그리드에 넣고 선택 → retrieveEditPage() (DB에는 저장하지 않는다)
  const insertRow = async () => {
    try {
      const row = await sysApi.newAfterServiceRow();
      keepId.current = row.afterServiceId;
      // GridInsertRow: 맨 아래(03 원칙 17)에 넣고 스크롤한다
      setRows(prev => [...prev, row]);
      retrieveEditPage(row);
      setTimeout(() => {
        const index = gridRef.current?.api?.getRowNode(String(row.afterServiceId))?.rowIndex;
        if (index != null) gridRef.current?.api.ensureIndexVisible(index);
      });
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // 저장 뒤 그리드 행을 바꾼다 (AS-IS updateEnd() grid.getStore().update(model))
  const onSaved = (row: AfterService) => {
    setRows(prev => prev.map(r => (r.afterServiceId === row.afterServiceId ? row : r)));
    setSelected(row);
  };

  // 삭제 뒤 그리드에서 뺀다 (AS-IS delete() 콜백 grid.getStore().remove(model)) → 남은 첫 행 선택, 없으면 편집 폼 비활성
  const onDeleted = (id: number) => {
    const rest = rows.filter(r => r.afterServiceId !== id);
    keepId.current = rest[0]?.afterServiceId ?? null;
    setRows(rest);
    retrieveEditPage(rest[0] ?? null);
  };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
      <Splitter.Panel min={200}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', padding: '20px 20px 8px', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L138) → retrieve() */}
        <SearchBar onSearch={retrieve} extra={<Button type="register" onClick={insertRow}>등록</Button>}>
          <SearchBar.Field label="발생일">
            <DatePicker style={{ width: 140 }} allowClear={false} value={happenStartDate} onChange={setHappenStartDate} format="YYYY-MM-DD" />
            ~
            <DatePicker style={{ width: 140 }} allowClear={false} value={happenEndDate} onChange={setHappenEndDate} format="YYYY-MM-DD" />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            <SystemCodeComboBox kindCd="AfterServiceCode" altCode={[ALL, '전체']} style={{ width: 100 }} value={typeYn} onChange={c => setTypeYn(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="완료여부">
            <SystemCodeComboBox kindCd="AfterStateCode" altCode={[ALL, '전체']} style={{ width: 100 }} value={stateCd} onChange={c => setStateCd(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색어">
            {/* [E2] searchText.KeyPress [Enter] (L129) → retrieve() */}
            <SearchBar.Input style={{ width: 220 }} placeholder="요청자/개선 및 오류내용" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={unconfirmedOnly} onChange={e => setUnconfirmedOnly(e.target.checked)}>미확인건만 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E1] grid.RowClick (L105) → retrieveEditPage() */}
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
      </Splitter.Panel>
      {/* 편집 폼 높이 = 위 줄 190 + 아래 줄 160 + 저장·삭제 줄 60 = 410 (Sys90_Edit_Board). 이보다 작으면 저장·삭제가 가려진다 */}
      <Splitter.Panel defaultSize={410} min={410}>
        <Sys90_Edit_Board key={`${selected?.afterServiceId ?? 'none'}-${formSeq}`} model={selected} onSaved={onSaved} onDeleted={onDeleted} />
      </Splitter.Panel>
      </Splitter>
    </div>
  );
};
