/**
 * 사원찾기(조직/직무/성명) 조회창 — 체크 다중 (A15-4: Sys51_Lookup_SpecificMenuPerson [등록]에서 연다).
 * AS-IS: myApp/client/vi/emp/Emp00_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(companyId, transDate, callback) L57-61: companyId를 주면 그 회사 사원(sys admin만, isSeparateAddTitle=true → 겸직 항목도 있다).
 * 아직 없는 것: open(transDate, isSeparateAddTitle=false, …) — 회사를 안 주면 로그인 회사(C01 목록과 같은 API, 서버가 늘 겸직 포함)
 * UX보강(10) B12-3: 검색 줄 = SearchBar(UX-01·02·04, 조건 3개 → 초기화는 열 때 값: 받은 기준일·''·재직, 자동 조회 없음)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Select, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<TransInfo>();

/** AS-IS buildGrid() L166-179 */
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L172
  gb.text('titleNm', 120, '직책'),  // L173
  gb.text('empNo', 80, '사번'),  // L174
  gb.text('korNm', 100, '성명'),  // L175
  gb.date('transDate', 100, '발령일'),  // L176
];

/** retrieve() L181-216: 재직구분 이름 → transCode (그 밖은 000) */
const TRANS_CODES: Record<string, string> = { 겸직: '800', 퇴직: '900', 재직: '100' };

interface Props {
  open: boolean;
  /** open(companyId, …): 고른 회사. 없으면 로그인 회사 */
  companyId?: number;
  /** 기준일 'yyyy-MM-dd' (open의 transDate) */
  transDate: string;
  /** AS-IS callback.execute(list): 확인이면 고른 사원 목록 */
  onResult: (list: TransInfo[]) => void;
  /** 취소: hide()만 (callback 없음) */
  onClose: () => void;
}

export const Emp00_Lookup_SelectMulti: React.FC<Props> = ({ open, companyId, transDate, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  // L125: transName setText("재직"). 처음 값은 열 때마다 받은 transDate라 초기화는 openValues로 한다
  const openValues = useMemo(() => ({ baseDate: transDate, findText: '', transName: '재직' }), [transDate]);
  const sp = useSearchParams(() => openValues);
  const { baseDate, findText, transName } = sp.values;
  const [rows, setRows] = useState<TransInfo[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // 재직구분 항목 (L117-125): 전체·재직·겸직(isSeparateAddTitle일 때)·퇴직 — 회사를 준 열기만 true
  const transNames = companyId !== undefined ? ['전체', '재직', '겸직', '퇴직'] : ['전체', '재직', '퇴직'];

  // retrieve() L181-216: searchText '%' + 입력 + '%'(서버가 만든다), transDate, transCode → emp.Emp00_TransInfo.selectByText
  const retrieve = useCallback(async (date: string, text: string, name: string) => {
    const transCode = TRANS_CODES[name] ?? '000';
    try {
      setRows(companyId !== undefined
        ? await empApi.searchCompanyTransInfos(companyId, date, text, transCode)
        : await empApi.searchTransInfos(date, text, transCode));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyId]);

  // open() L68-164: 원본은 열 때마다 새 창 → 입력을 정하고 바로 retrieve()
  useEffect(() => {
    if (!open) return;
    sp.setValues(openValues);
    setRows([]);
    retrieve(transDate, '', '재직');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transDate, retrieve]);

  // [E3] oKButton[확인].Select (L104) / [E6] grid.CellDoubleClick (L151) → confirm() L218-227
  const confirm = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    onResult(list);
  };

  return (
    <LookupModal open={open} title="사원찾기(조직/직무/성명)" width={700} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L110) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L98) → retrieve(). 초기화는 UX-02 */}
        <SearchBar onSearch={() => retrieve(baseDate, findText, transName)} onReset={() => sp.setValues(openValues)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 140 }} allowClear={false} format="YYYY-MM-DD" value={dayjs(baseDate)}
              onChange={d => d && sp.set('baseDate', d.format('YYYY-MM-DD'))} />
          </SearchBar.Field>
          <SearchBar.Field label="조직/직무/성명">
            {/* [E1] findTextField.KeyPress [Enter] (L89) → retrieve() */}
            <SearchBar.Input style={{ width: 100 }} value={findText} onChange={e => sp.set('findText', e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="재직구분">
            {/* [E5] transName[재직].Collapse (L127) → retrieve() */}
            <Select style={{ width: 100 }} value={transName} options={transNames.map(n => ({ value: n, label: n }))}
              onChange={v => { sp.set('transName', v); retrieve(baseDate, findText, v); }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TransInfo> rowClick
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.transId)}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
