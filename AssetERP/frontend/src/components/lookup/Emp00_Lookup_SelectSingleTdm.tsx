/**
 * 책무 대상 사원찾기 조회창 — 단일 선택 (N21: 업무점검자 지정에서 연다).
 * AS-IS: myApp/client/vi/emp/Emp00_Lookup_SelectSingleTdm.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(stdDate, orgId, callback) L59-62·L64-103: 기준일(없으면 오늘)·검색(조직/사번/성명) → emp.Emp03_Trans.selectByTdmYn, orgId가 있으면 그 조직의 사원만.
 * 그리드는 체크박스 단일(setChecked SINGLE). [확인]·더블클릭 = confirm() L169-181(고른 행, 없으면 "선택된 사원이 없습니다"), [닫기] = hide().
 * 모달 700×500, UX보강(10): 검색 줄 = SearchBar(UX-01·02·04, 초기화는 열 때 값, 자동 조회 없음), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransTdm } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<TransTdm>();

/** AS-IS buildGrid() L138-150 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('orgNm', 200, '조직'),  // L143
  gb.text('titleNm', 120, '직책'),  // L144
  gb.text('empNo', 80, '사번'),  // L145
  gb.text('korNm', 100, '성명'),  // L146
  gb.date('transDate', 100, '발령일'),  // L147
];

interface Props {
  open: boolean;
  /** 기준일 'yyyy-MM-dd' (open의 stdDate, 없으면 오늘 — L68-72) */
  stdDate?: string | null;
  /** open(stdDate, orgId, …) L59: 있으면 그 조직(과 책무 대상이 아닌 하위 조직)의 사원만 */
  orgId?: number | null;
  /** callback.execute(empPersonModel): 확인이면 고른 사원 */
  onResult: (row: TransTdm) => void;
  /** [닫기]: hide()만 */
  onClose: () => void;
}

export const Emp00_Lookup_SelectSingleTdm: React.FC<Props> = ({ open, stdDate, orgId, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<TransTdm>>(null);
  const openDate = stdDate ?? dayjs().format('YYYY-MM-DD');
  const openValues = useMemo(() => ({ baseDate: openDate, searchText: '' }), [openDate]);
  const sp = useSearchParams(() => openValues);
  const { baseDate, searchText } = sp.values;
  const [rows, setRows] = useState<TransTdm[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L152-167: companyId는 서버, stdDate·orgId·searchText("%…%"는 서버) → emp.Emp03_Trans.selectByTdmYn
  const retrieve = useCallback(async (date: string, text: string) => {
    try {
      setRows(await empApi.searchTransTdm(date, orgId, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [orgId]);

  // [E0] 화면 열림 (생성자 L50-57) → open() L64-103 끝: show() → retrieve()
  useEffect(() => {
    if (!open) return;
    sp.setValues(openValues);
    setRows([]);
    void retrieve(openDate, '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, openDate, retrieve]);

  // [E4] oKButton[확인].Select (L124) / [E1] grid.CellDoubleClick (L90) → confirm() L169-181
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    onResult(row);
  };

  return (
    <LookupModal open={open} title="사원찾기" width={790} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E5] cancelButton[닫기].Select (L130) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L117) → retrieve() */}
        <SearchBar onSearch={() => retrieve(baseDate, searchText)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 140 }} allowClear={false} format="YYYY-MM-DD" value={dayjs(baseDate)}
              onChange={d => d && sp.set('baseDate', d.format('YYYY-MM-DD'))} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E2] searchText.KeyPress [Enter] (L108) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="조직/사번/성명" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<TransTdm>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.personId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
