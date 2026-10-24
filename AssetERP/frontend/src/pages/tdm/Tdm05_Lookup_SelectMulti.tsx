/**
 * 회의체선택 조회창 (N08) — 직책의 연결회의체 창 [행 추가]가 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm05_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 열 합계(250+100+450+행번호·선택 60+여백 130 = 990): 검색줄(기준일 + [조회]) + 체크박스 다중 그리드 + [확인][닫기]
 * 조회는 roleId를 넘긴다 — 기준일에 그 직책에 이미 연결된 회의체는 뺀다 (L125-138)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCouncil } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmCouncil>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L115-123 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('cnclName', 250, '회의체'),  // L118
  gb.textCenter('openCycleName', 100, '개최주기'),  // L119
  gb.textArea('mainDecision', 450, '주요의결사항'),  // L120
];

interface Props {
  /** 값이 있으면 열림 — AS-IS open(roleId, callback) */
  roleId: number | null;
  /** AS-IS callback.execute(고른 회의체들) — 닫기는 onClose */
  onSelect: (councils: TdmCouncil[]) => void;
  onClose: () => void;
}

export const Tdm05_Lookup_SelectMulti: React.FC<Props> = ({ roleId, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmCouncil>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [rows, setRows] = useState<TdmCouncil[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L125-138: tdm.Tdm05_Cncl.selectByDate (companyId는 서버, baseDate, roleId)
  const retrieve = useCallback(async (date: Dayjs) => {
    if (!roleId) return;
    try {
      setRows(await tdmApi.searchCouncils({ baseDate: date.format(FORMAT), allYn: false, roleId }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [roleId]);

  // [E0] 화면 열림 (생성자 L59-84) → settings(), show() / open() L49-57 → retrieve()
  useEffect(() => {
    if (!roleId) return;
    const today = dayjs();
    setBaseDate(today);
    setRows([]);
    void retrieve(today);
  }, [roleId, retrieve]);

  // confirm() L140-149: 선택이 없으면 "선택된 회의체가 없습니다", 있으면 callback(선택 목록) + hide()
  const confirm = (fallback?: TdmCouncil) => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    const list = selected.length > 0 ? selected : fallback ? [fallback] : [];
    if (list.length === 0) {
      message.warning('선택된 회의체가 없습니다');
      return;
    }
    onSelect(list);
    onClose();
  };

  return (
    <LookupModal
      open={!!roleId}
      title="회의체선택"
      width={990}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] updateButton[확인].Select (L101) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] closeButton[닫기].Select (L107) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L95) → retrieve() */}
        <SearchBar onSearch={() => retrieve(baseDate)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E1] grid.CellDoubleClick (L89) → confirm() */}
          <MultiGrid<TdmCouncil>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.cnclId)}
            rowClick
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
