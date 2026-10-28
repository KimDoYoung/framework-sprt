/**
 * 사원찾기(조직/직무/성명) 조회창 — 단일 선택 (A21: Sys27_Tab_LoginManage 사원명 돋보기에서 연다).
 * AS-IS: myApp/client/vi/emp/Emp00_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 옮긴 열기: open(companyId, transDate, callback) L124-137 (그 회사 사원, 겸직 포함, [전체] 단추가 있다). 나머지 open 변형(openAll·openNull·…)은 쓰는 화면이 생기면.
 * 그리드는 체크박스 단일(setChecked SINGLE). [전체] = callback.execute(null) 후 닫기, [확인]·더블클릭 = confirm() L353-365(고른 행).
 * 모달 700×500, UX보강(10): 검색 줄 = SearchBar(UX-01·02·04, 초기화는 열 때 값, 자동 조회 없음)
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
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<TransInfo>();

/** AS-IS buildGrid() L291-305 */
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L297
  gb.text('titleNm', 120, '직책'),  // L298
  gb.text('empNo', 80, '사번'),  // L299
  gb.text('korNm', 100, '성명'),  // L300
  gb.date('transDate', 100, '발령일'),  // L301
];

/** retrieve() L307-351: 재직구분 이름 → transCode (그 밖은 000) */
const TRANS_CODES: Record<string, string> = { 겸직: '800', 퇴직: '900', 재직: '100' };

interface Props {
  open: boolean;
  /** open(companyId, …): 그 회사 사원(sys admin만) */
  companyId?: number;
  /** open(transDate, isSeparateAddTitle, callback) L139: true면 재직구분에 "겸직"이 더해진다(로그인 회사). 회사를 준 열기는 늘 겸직 포함 */
  separateAddTitle?: boolean;
  /** 기준일 'yyyy-MM-dd' (open의 transDate) */
  transDate: string;
  /** open(…, searchText, …): 검색칸에 미리 넣고 그 글자로 조회한다(S13 — 입력칸에 이름을 치고 Enter했을 때). 없으면 빈 칸 */
  searchText?: string;
  /** 널 단추 문구. 기본 '전체'(AS-IS openAll), openNull은 '선택안함'(nullButton.setReText), null이면 단추 없음(callback만 있는 open) */
  noneLabel?: string | null;
  /** callback.execute(result): 확인이면 고른 사원, [전체]·[선택안함]이면 null */
  onResult: (row: TransInfo | null) => void;
  /** 취소: hide()만 */
  onClose: () => void;
}

export const Emp00_Lookup_SelectSingle: React.FC<Props> = ({ open, companyId, separateAddTitle = false, noneLabel = '전체', searchText = '', transDate, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  // L233-244: transName setText("재직"). 처음 값은 열 때마다 받은 transDate라 초기화는 openValues로 한다
  const openValues = useMemo(() => ({ baseDate: transDate, findText: searchText, transName: '재직' }), [transDate, searchText]);
  const sp = useSearchParams(() => openValues);
  const { baseDate, findText, transName } = sp.values;
  const [rows, setRows] = useState<TransInfo[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // 재직구분 항목 (L228-238): 전체·재직·겸직(isSeparateAddTitle)·퇴직 — 회사를 준 열기는 겸직 포함
  const transNames = companyId !== undefined || separateAddTitle ? ['전체', '재직', '겸직', '퇴직'] : ['전체', '재직', '퇴직'];

  // retrieve() L307-351: searchText '%' + 입력 + '%'(서버가 만든다), transDate, transCode → emp.Emp00_TransInfo.selectByText
  const retrieve = useCallback(async (date: string, text: string, name: string) => {
    const transCode = TRANS_CODES[name] ?? '000';
    try {
      setRows(companyId !== undefined
        ? await empApi.searchCompanyTransInfos(companyId, date, text, transCode)
        : await empApi.searchTransInfos(date, text, transCode, separateAddTitle));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyId, separateAddTitle]);

  // open() L165-289 끝: show() → retrieve()
  useEffect(() => {
    if (!open) return;
    sp.setValues(openValues);
    setRows([]);
    retrieve(transDate, searchText, '재직');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transDate, searchText, retrieve]);

  // [E6] oKButton[확인].Select (L202) / [E10] grid.CellDoubleClick (L268) → confirm() L353-365
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    onResult(row);
  };

  return (
    <LookupModal open={open} title="사원찾기(조직/직무/성명)" width={760} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E2]·[E7] nullButton[전체].Select [callback != null] (L127·L212) → callback.execute(null), hide() */}
            {noneLabel !== null && <Button type="select" onClick={() => onResult(null)}>{noneLabel}</Button>}
            {/* [E8] cancelButton[취소].Select (L221) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L196) → retrieve() */}
        <SearchBar onSearch={() => retrieve(baseDate, findText, transName)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 140 }} allowClear={false} format="YYYY-MM-DD" value={dayjs(baseDate)}
              onChange={d => d && sp.set('baseDate', d.format('YYYY-MM-DD'))} />
          </SearchBar.Field>
          <SearchBar.Field label="조직/직무/성명">
            {/* [E4] findTextField.KeyPress [Enter] (L187) → retrieve() */}
            <SearchBar.Input style={{ width: 100 }} value={findText} onChange={e => sp.set('findText', e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="재직구분">
            {/* [E9] transName[퇴직].Collapse (L244) → retrieve() */}
            <Select style={{ width: 100 }} value={transName} options={transNames.map(n => ({ value: n, label: n }))}
              onChange={v => { sp.set('transName', v); retrieve(baseDate, findText, v); }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<TransInfo>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.transId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
