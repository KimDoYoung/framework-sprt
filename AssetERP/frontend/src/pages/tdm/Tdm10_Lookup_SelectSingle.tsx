/**
 * 책무선택 조회창 (N16) — 매뉴얼 부서지정(Tdm41_Tab_ManlDutyOrg)의 책무 칸이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm10_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 800×600(원본): 열 합계 670+행번호·선택 60+여백 130 = 860이라 860. 검색줄(기준일 · 책무구분 콤보 · 검색 · [조회]) + 단일 선택 그리드 + [확인][전체][닫기]
 * N08 Tdm10_Lookup_SelectMulti와 다른 AS-IS 클래스(단일 선택, dedupYn 없음, [전체])
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
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmTask>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L159-166 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('taskClassName', 120, '책무구분'),  // L162
  gb.text('taskName', 550, '책무'),  // L163
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(고른 책무). 닫기는 onClose */
  onSelect: (task: TdmTask) => void;
  /** [전체] — AS-IS allButton은 callback.execute(null) 뒤 hide() (L142-149). 호출 뒤 창이 닫힌다 */
  onAll: () => void;
  onClose: () => void;
}

export const Tdm10_Lookup_SelectSingle: React.FC<Props> = ({ open, onSelect, onAll, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmTask>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [taskClass, setTaskClass] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmTask[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L168-182: tdm.Tdm10_Task.selectByText (companyId는 서버, baseDate, taskClassCode, searchText = '%' + 글자 + '%')
  const retrieve = useCallback(async (date: Dayjs, cls: string, text: string) => {
    try {
      setRows(await tdmApi.searchTasks({ baseDate: date.format(FORMAT), taskClassCode: cls, allYn: false, searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L66-98) → settings(), show() / open() L61-64 → retrieve()
  useEffect(() => {
    if (!open) return;
    const today = dayjs();
    setBaseDate(today);
    setTaskClass('%');
    setSearchText('');
    setRows([]);
    void retrieve(today, '%', '');
  }, [open, retrieve]);

  // confirm() L184-194: 선택이 없으면 "선택된 책무가 없습니다", 있으면 callback + hide()
  const confirm = (fallback?: TdmTask) => {
    const selected = gridRef.current?.api.getSelectedRows()[0] ?? fallback;
    if (!selected) {
      message.warning('선택된 책무가 없습니다');
      return;
    }
    onSelect(selected);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="책무선택"
      width={860}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] confirmButton[확인].Select (L136) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E6] allButton[전체].Select [callback != null] (L142) → callback.execute(null), hide() */}
            <Button type="reset" onClick={() => { onAll(); onClose(); }}>전체</Button>
            {/* [E7] closeButton[닫기].Select (L151) → hide() */}
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
          <SingleGrid<TdmTask>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.taskId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
