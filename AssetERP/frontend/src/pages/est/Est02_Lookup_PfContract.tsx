/**
 * 체결용역 조회창 (Q10) — Est03_Tab_PfHistory의 "체결용역" 칸에서 연다.
 * AS-IS: myApp/client/vi/est/Est02_Lookup_PfContract.java (164줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L49-76: 모달 900×500 "체결용역" = 툴바 50(조회기준일 100 · 검색 300 "차주명/사업자명/수수료명" · [조회]) + 단일 체크 그리드(차주명 250 · 사업자명 300 · 사업장 주소지 300 · 용역(수수료)명 250 · 수행시작일 100 · 수행종료일 100) + [확인][닫기]. 열자마자 조회
 * UX보강(10): 조회창 UX-05(첫 입력칸 포커스)·UX-06(행 클릭 선택)은 LookupModal·rowSelection으로. 열 폭 합계(1360)가 커서 가로 스크롤(03 원칙 21)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { estApi } from '@/api/est';
import { errorMessage } from '@/api/client';
import { PfContract } from '@/types/est';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<PfContract>();
const FORMAT = 'YYYY-MM-DD';
/** setChecked(SINGLE): 체크박스 단일 선택 + 행 클릭 선택(UX-06). 상수로 둬야 부모가 다시 그려도 선택이 풀리지 않는다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** callback.execute(selectModel) — 고른 체결용역. 창은 스스로 닫는다(hide()) */
  onResult: (row: PfContract) => void;
  onClose: () => void;
}

export const Est02_Lookup_PfContract: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<PfContract>>(null);
  // settings() L82-113: 조회기준일 100(오늘), 검색칸 300
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PfContract[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L128-141: est.Est02_PfContract.selectByText(companyId, startDate, "%검색어%")
  const retrieve = useCallback(async (date: Dayjs = startDate, text: string = searchText) => {
    setLoading(true);
    try {
      setRows(await estApi.searchPfContracts({ startDate: date.format(FORMAT), searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, searchText]);

  // [E0] 화면 열림 (open L49-76 → retrieve()): 열 때마다 오늘로 곧바로 조회
  useEffect(() => {
    if (open) {
      const today = dayjs();
      setStartDate(today); setSearchText(''); setRows([]);
      void retrieve(today, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] confirmButton[확인].Select (L95) → confirm() L143-155, [E4] grid.CellDoubleClick (L107) → confirm()
  const confirm = (picked?: PfContract) => {
    const selected = picked ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!selected) { message.warning('선택된 체결용역이 없습니다'); return; }
    onResult(selected);
    onClose();
  };

  // buildGrid() L157-164
  const columnDefs = useMemo(() => [
    gb.text('borrower', 250, '차주명'),
    gb.text('projectSiteName', 300, '사업자명'),
    gb.text('projectSiteAddr', 300, '사업장 주소지'),
    gb.text('feeName', 250, '용역(수수료)명'),
    gb.date('startDate', 100, '수행시작일'),
    gb.date('closeDate', 100, '수행종료일'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="체결용역"
      width={1250}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E3] closeButton[닫기].Select (L101) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L87) → retrieve(), retrieveButton[조회] → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading}>
          <SearchBar.Field label="조회기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="차주명/사업자명/수수료명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PfContract>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.pfContractId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
