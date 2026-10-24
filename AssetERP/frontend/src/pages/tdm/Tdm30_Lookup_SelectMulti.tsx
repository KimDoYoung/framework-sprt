/**
 * 임원선택 조회창 (N12) — 책무기술서 작성의 [등록]이 연다. 임원별 직책(책무배분)을 여러 건 고르고 생성사유를 일괄 지정한다.
 * AS-IS: myApp/client/vi/tdm/Tdm30_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L66-96: 창 950×500 "임원선택", 위 = 툴바(기준일 · 검색 250 "임원/직책/겸직사항" · [조회] · ※ 생성사유 일괄적용 콤보) + 체크박스 다중 그리드, 아래 = [저장][닫기]
 * 열 폭 합계 790+행번호·선택 60+여백 130 = 980이라 원본 950보다 넓게 잡는다(03 원칙 21)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRoleAllcPerson } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmRoleAllcPerson>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L152-161 (setChecked MULTI) */
const buildGrid = () => [
  gb.textCenter('personName', 100, '임원명'),  // L155
  gb.text('roleName', 250, '직책'),  // L156
  gb.text('addTitle', 350, '겸직사항'),  // L158
  gb.date('allcStdDate', 90, '최종<br>책무배분일'),  // L159
];

/** 고른 임원들과 일괄 적용할 생성사유 (AS-IS callback.execute(selectList, reasonCode·reasonName)) */
export interface RoleDescPick {
  rows: TdmRoleAllcPerson[];
  reasonCode: string | null;
  reasonName: string | null;
}

interface Props {
  open: boolean;
  onSelect: (pick: RoleDescPick) => void;
  onClose: () => void;
}

/** settings() L98-110: 기준일 — 2026-07-02 전까지는 2026-07-02, 그 뒤는 오늘 */
const defaultStdDate = () => {
  const floor = dayjs('2026-07-02');
  return floor.isAfter(dayjs(), 'day') ? floor : dayjs();
};

export const Tdm30_Lookup_SelectMulti: React.FC<Props> = ({ open, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmRoleAllcPerson>>(null);
  const [stdDate, setStdDate] = useState<Dayjs>(defaultStdDate());
  const [searchText, setSearchText] = useState('');
  const [reason, setReason] = useState<{ code: string | null; name: string | null }>({ code: null, name: null });
  const [rows, setRows] = useState<TdmRoleAllcPerson[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L163-176: tdm.Tdm30_RoleAllc.selectPerson(companyId, stdDate, '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = useCallback(async (date: Dayjs, text: string) => {
    try {
      setRows(await tdmApi.searchRoleAllcPersons(date.format(FORMAT), text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L66-96) → settings(), show() · open() L61-64: 열자마자 retrieve()
  useEffect(() => {
    if (!open) return;
    const date = defaultStdDate();
    setStdDate(date);
    setSearchText('');
    setReason({ code: null, name: null });
    setRows([]);
    void retrieve(date, '');
  }, [open, retrieve]);

  // confirm() L178-200: 선택이 없으면 "선택된 임원이 없습니다", 있으면 콤보에서 고른 생성사유(Collapse 때 잡은 코드)를 붙여 callback + hide()
  const confirm = (fallback?: TdmRoleAllcPerson) => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    const list = selected.length > 0 ? selected : fallback ? [fallback] : [];
    if (list.length === 0) {
      message.warning('선택된 임원이 없습니다');
      return;
    }
    onSelect({ rows: list, reasonCode: reason.code, reasonName: reason.name });
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="임원선택"
      width={980}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] updateButton[저장].Select (L138) → confirm() */}
            <Button type="save" onClick={() => confirm()}>저장</Button>
            {/* [E6] closeButton[닫기].Select (L144) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L132) → retrieve() */}
        <SearchBar onSearch={() => retrieve(stdDate, searchText)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L111) → retrieve() */}
            <SearchBar.Input style={{ width: 250 }} placeholder="임원/직책/겸직사항" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="※ 생성사유 일괄적용">
            {/* [E2] reasonName[TdmDescRegReason].Collapse (L120) → reasonCode = reasonName.getCode() */}
            <SystemCodeComboBox
              kindCd="TdmDescRegReason"
              style={{ width: 150 }}
              placeholder="선택하세요"
              onChange={(code, name) => setReason({ code: code || null, name: name || null })}
            />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E3] grid.CellDoubleClick (L126) → confirm() */}
          <MultiGrid<TdmRoleAllcPerson>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.roleAllcId}`}
            rowClick
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
