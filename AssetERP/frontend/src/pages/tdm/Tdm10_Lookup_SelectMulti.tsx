/**
 * 책무선택 조회창 (N08) — 직책의 연결책무 창 [행 추가]가 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm10_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 열 합계(120+270+450+80+80+행번호·선택 60+여백 130 = 1190): 검색줄(기준일 · 책무구분 콤보 · 검색 · [조회]) + 체크박스 다중 그리드 + [확인][닫기]
 * 조회는 dedupYn=true — 기준일에 쓰이는 직책에 이미 연결된 책무(공통책무 제외)는 뺀다 (L162-177)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmTask } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmTask>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L150-160 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('taskClassName', 120, '책무구분'),  // L153
  gb.text('taskTypeName', 270, '책무유형'),  // L154
  gb.text('taskName', 450, '책무'),  // L155
  gb.booleanYn2('commonYn', 80, '공통책무'),  // L156
  gb.booleanYn2('ceoYn', 80, 'CEO책무'),  // L157
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(고른 책무들) — 닫기는 onClose */
  onSelect: (tasks: TdmTask[]) => void;
  onClose: () => void;
}

export const Tdm10_Lookup_SelectMulti: React.FC<Props> = ({ open, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmTask>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [taskClass, setTaskClass] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmTask[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L162-177: tdm.Tdm10_Task.selectByText (companyId는 서버, baseDate, taskClassCode, dedupYn=true, searchText = '%' + 글자 + '%')
  const retrieve = useCallback(async (date: Dayjs, cls: string, text: string) => {
    try {
      setRows(await tdmApi.searchTasks({ baseDate: date.format(FORMAT), taskClassCode: cls, allYn: false, searchText: text, dedupYn: true }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L67-98) → settings(), show() / open() L62-65 → retrieve()
  useEffect(() => {
    if (!open) return;
    const today = dayjs();
    setBaseDate(today);
    setTaskClass('%');
    setSearchText('');
    setRows([]);
    void retrieve(today, '%', '');
  }, [open, retrieve]);

  // confirm() L179-188: 선택이 없으면 메시지 없이 아무 일 없음이 아니라 callback(선택 목록) + hide() — 빈 목록이면 안내
  const confirm = (fallback?: TdmTask) => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    const list = selected.length > 0 ? selected : fallback ? [fallback] : [];
    if (list.length === 0) {
      message.warning('선택된 책무가 없습니다');
      return;
    }
    onSelect(list);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="책무선택"
      width={1190}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] updateButton[확인].Select (L136) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E6] closeButton[닫기].Select (L142) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 450, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L130) → retrieve() */}
        <SearchBar onSearch={() => retrieve(baseDate, taskClass, searchText)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="책무구분">
            {/* [E1] taskClassComboBox[TdmTaskClassCode].Collapse (L107) → retrieve() */}
            <SystemCodeComboBox
              kindCd="TdmTaskClassCode"
              altCode={['%', '전체']}
              style={{ width: 120 }}
              value={taskClass}
              onChange={code => { const v = code ?? '%'; setTaskClass(v); void retrieve(baseDate, v, searchText); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E2] searchText.KeyPress [Enter] (L116) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="책무유형/책무" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E3] grid.CellDoubleClick (L124) → confirm() */}
          <MultiGrid<TdmTask>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.taskId)}
            rowClick
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
