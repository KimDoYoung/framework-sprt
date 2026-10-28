/**
 * 사원찾기(조직/직무/성명) 조회창 — 조회일자 기준, 체크 다중 (S16: Pay10_Lookup_Insert가 급여 생성 대상 사원을 고를 때 연다).
 * AS-IS: myApp/client/vi/emp/Emp01_Lookup_TransDate.java (162줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(isSeparateAddTitle, callback) L49-114: 500×500 모달, 위 툴바(조회일자 100 · 검색 100 · [조회]) + 체크 다중 그리드(조직 140 · 사번 80 · 성명 80 · 직책 100),
 *   아래 가운데 [확인][취소]. 열면서 바로 조회. Emp00_Lookup_SelectMulti(조직 200 · 직책 120 · 사번 · 성명 · 발령일)와 다른 창이다
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 행 클릭 선택(UX-06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransTarget } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<TransTarget>();

/** buildGrid() L116-126 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('orgNm', 140, '조직'),
  gb.text('empNo', 80, '사번'),
  gb.text('korNm', 80, '성명'),
  gb.text('titleNm', 100, '직책'),
];

interface Props {
  open: boolean;
  /** open(isSeparateAddTitle, …) L49 — true면 겸직·퇴직 제외, 기본 false(퇴직만 제외) */
  isSeparateAddTitle?: boolean;
  /** AS-IS callback.execute(transModelList): [확인]이면 고른 사원 목록 (뒤이어 창이 닫힌다) */
  onResult: (list: TransTarget[]) => void;
  onClose: () => void;
}

export const Emp01_Lookup_TransDate: React.FC<Props> = ({ open, isSeparateAddTitle = false, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<TransTarget>>(null);
  const [transDate, setTransDate] = useState<Dayjs>(dayjs());
  const [korName, setKorName] = useState('');
  const [rows, setRows] = useState<TransTarget[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L128-142 → emp.Emp03_Trans.selectByText ("%검색어%"는 서버가 감싼다)
  const retrieve = useCallback(async (date: Dayjs, text: string) => {
    try {
      setRows(await empApi.searchTransTargets(text, date.format('YYYY-MM-DD'), isSeparateAddTitle));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [isSeparateAddTitle]);

  // [E0] open() L54-114: 조회일자 = 오늘, 열면서 retrieve()
  useEffect(() => {
    if (!open) return;
    const today = dayjs();
    setTransDate(today);
    setKorName('');
    setRows([]);
    void retrieve(today, '');
  }, [open, retrieve]);

  // confirm() L144-153: 고른 사원이 없으면 안내, 있으면 callback(목록) 뒤 닫기
  const confirm = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length < 1) {
      message.warning('사원을 선택해주세요');
      return;
    }
    onResult(list);
  };

  return (
    <LookupModal
      open={open}
      title="사원찾기(조직/직무/성명)"
      width={620}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] oKButton[확인].Select (L81) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L87) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L75) → retrieve(). [E1] korName.KeyPress Enter (L67) → retrieve() */}
        <SearchBar onSearch={() => retrieve(transDate, korName)}>
          <SearchBar.Field label="조회일자">
            <DatePicker allowClear={false} style={{ width: 130 }} value={transDate} onChange={d => d && setTransDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 100 }} value={korName} onChange={e => setKorName(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TransTarget> rowClick
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.personId}-${p.data.transCd}`}
          />
        </div>
      </div>
    </LookupModal>
  );
};
