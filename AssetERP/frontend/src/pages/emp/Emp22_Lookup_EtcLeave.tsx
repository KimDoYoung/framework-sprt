/**
 * 포상휴가 내역 조회창 — 휴가관리(Emp20_Tab_LeaveManager, S06)의 포상휴가 줄 오른쪽 안내 아이콘에서 연다 (AS-IS view(personId)).
 * AS-IS: myApp/client/vi/emp/Emp22_Lookup_EtcLeave.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L69-103: 모달 970×400 "포상휴가 내역", 툴바(기준연도 · [조회]), 체크 단일 그리드 7열, 아래 가운데 [닫기]
 * 열 때 오늘 연도로 조회하고 첫 행을 고른다. [선택]·더블클릭 선택(select() L175-192)은 open(personId, callback)으로 여는 쪽(다른 화면)이 생길 때 더한다 — S06은 view만 쓴다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { empLeaveApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EtcLeave } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<EtcLeave>();

/** 단일 체크 선택 (setChecked(SINGLE)) */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** buildGrid() L145-158 */
const columnDefs = [
  gb.text('reason', 250, '사유'),  // L149
  gb.date('startDate', 100, '사용시작일'),  // L150
  gb.date('closeDate', 100, '사용만료일'),  // L151
  gb.long('days', 60, '총일수'),  // L152
  gb.double('useDays', 60, '사용일수'),  // L153
  gb.double('remainDays', 60, '잔여일수'),  // L154
  gb.text('note', 250, '비고'),  // L155
];

interface Props {
  /** view(personId) L64-67 — 값이 있으면 열린다 */
  personId: number | null;
  onClose: () => void;
}

export const Emp22_Lookup_EtcLeave: React.FC<Props> = ({ personId, onClose }) => {
  const gridRef = useRef<AgGridReact<EtcLeave>>(null);
  const [year, setYear] = useState('');
  const [rows, setRows] = useState<EtcLeave[]>([]);

  // [E1] leaveYText.KeyPress [Enter] (L110) / [E2] retrieveButton[조회].Select (L118) → retrieve() L160-173: 서비스 emp.Emp22_EtcLeave.selectByPersonId(companyId, personId, stdYear) → 첫 행 선택
  const retrieve = useCallback(async (stdYear: string) => {
    if (personId == null) return;
    try {
      setRows(await empLeaveApi.searchEtcLeaves(personId, stdYear));
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [personId]);

  // [E0] 화면 열림 (open() L69-103, settings() L105-143) → 기준연도 = 오늘 연도, retrieve()
  useEffect(() => {
    if (personId == null) return;
    const y = dayjs().format('YYYY');
    setYear(y);
    setRows([]);
    void retrieve(y);
  }, [personId, retrieve]);

  // [E3 생략] selectButton[선택].Select (L124) → select() L175-192: 단추는 callback이 있을 때(open(personId, callback))만 붙는다 — S06은 view()라 없다
  // [E5 생략] grid.RowDoubleClick (L137) → select(): callback이 없으면 바로 return — view()에서는 더블클릭이 아무 일도 하지 않는다
  return (
    <LookupModal
      open={personId != null}
      title="포상휴가 내역"
      width={1070}
      maskClosable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}>{/* [E4] closeButton[닫기].Select (L130) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 300, gap: 8 }}>
        <SearchBar onSearch={() => retrieve(year)}>
          <SearchBar.Field label="기준연도">
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<EtcLeave>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={ROW_SELECTION}
            getRowId={p => String(p.data.etcLeaveId)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
