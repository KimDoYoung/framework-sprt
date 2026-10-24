/**
 * 직책선택 조회창 (N07) — 직책 연결창의 [행 추가]가 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm20_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1200×600(원본, 열 합계 1090+행번호·선택 60+여백 130 = 1280이라 원본 폭 유지): 검색줄(기준일 + 검색 + [조회]) + 체크박스 다중 그리드 + [확인][닫기]
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCouncilRoleLookup } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmCouncilRoleLookup>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L136-145 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('roleName', 200, '직책'),  // L139
  gb.text('roleTypeName', 120, '직책그룹'),  // L140
  gb.text('roleTypeEtcName', 170, '기타그룹명'),  // L141
  gb.textArea('overview', 600, '개요'),  // L142
];

interface Props {
  open: boolean;
  /** AS-IS open(stdDate, callback)의 기준일 — 없으면 오늘 */
  stdDate?: string | null;
  /** AS-IS callback.execute(고른 직책들) — 닫기는 onClose */
  onSelect: (roles: TdmCouncilRoleLookup[]) => void;
  onClose: () => void;
}

export const Tdm20_Lookup_SelectMulti: React.FC<Props> = ({ open, stdDate, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmCouncilRoleLookup>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmCouncilRoleLookup[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L147-160: tdm.Tdm20_Role.selectByDate (companyId, baseDate, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = useCallback(async (date: Dayjs, text: string) => {
    try {
      setRows(await tdmApi.searchCouncilRoleLookup({ baseDate: date.format(FORMAT), searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L53-58) → open() L65-92, settings() L94-134: 기준일 = stdDate, 열자마자 retrieve()
  useEffect(() => {
    if (!open) return;
    const date = stdDate ? dayjs(stdDate) : dayjs();
    setBaseDate(date);
    setSearchText('');
    setRows([]);
    void retrieve(date, '');
  }, [open, stdDate, retrieve]);

  // confirm() L162-170: 선택이 없으면 메시지, 있으면 callback(선택 목록) + hide()
  const confirm = (fallback?: TdmCouncilRoleLookup) => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    const list = selected.length > 0 ? selected : fallback ? [fallback] : [];
    if (list.length === 0) {
      message.warning('선택된 직책이 없습니다');
      return;
    }
    onSelect(list);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="직책선택"
      width={1200}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] updateButton[확인].Select (L122) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E5] closeButton[닫기].Select (L128) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 450, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L116) → retrieve() */}
        <SearchBar onSearch={() => retrieve(baseDate, searchText)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L102) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="직책/직책그룹/개요" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick (L110) → confirm() */}
          <MultiGrid<TdmCouncilRoleLookup>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.roleId)}
            rowClick
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
