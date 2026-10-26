/**
 * 용역(수수료) 조회창 (Q09) — Est02_Edit_PfContract의 용역(수수료)명 돋보기에서 연다.
 * AS-IS: myApp/client/vi/est/Est01_Lookup_PfFeeType.java (142줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L44-68: 모달 900×500 "용역(수수료)" = 툴바 50(검색 300 "부동산PF 수수료 항목/정의" · [조회]) + 단일 체크 그리드(수수료 항목 250 · 정의 550) + [확인]. 열자마자 조회(오늘 사용 중인 항목)
 * UX보강(10): 조회창 UX-05(첫 입력칸 포커스)·UX-06(행 클릭 선택)은 LookupModal·rowSelection으로
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { estApi } from '@/api/est';
import { errorMessage } from '@/api/client';
import { PfFeeType } from '@/types/est';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<PfFeeType>();
/** setChecked(SINGLE): 체크박스 단일 선택 + 행 클릭 선택(UX-06). 상수로 둬야 부모가 다시 그려도 선택이 풀리지 않는다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** callback.execute(selectModel) — 고른 용역(수수료). 창은 스스로 닫는다(hide()) */
  onResult: (row: PfFeeType) => void;
  onClose: () => void;
}

export const Est01_Lookup_PfFeeType: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<PfFeeType>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PfFeeType[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L106-119: est.Est01_PfFeeType.selectByText(companyId, startDate = 오늘, searchText "%…%")
  const retrieve = useCallback(async (text: string = searchText) => {
    setLoading(true);
    try {
      setRows(await estApi.lookupPfFeeTypes({ startDate: dayjs().format('YYYY-MM-DD'), searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  // [E0] 화면 열림 (open L44-68, settings L74-95): 열 때 곧바로 조회
  useEffect(() => {
    if (open) { setSearchText(''); setRows([]); void retrieve(''); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] confirmButton[확인].Select (L83) → confirm() L121-133, [E3] grid.CellDoubleClick (L89) → confirm()
  const confirm = (picked?: PfFeeType) => {
    const selected = picked ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!selected) { message.warning('선택된 용역(수수료)가 없습니다'); return; }
    onResult(selected);
    onClose();
  };

  // buildGrid() L97-104
  const columnDefs = useMemo(() => [
    gb.text('feeName', 250, '부동산PF 수수료 항목'),  // L100
    gb.text('feeDesc', 550, '정의'),                  // L101
  ], []);

  return (
    <LookupModal
      open={open}
      title="용역(수수료)"
      width={990}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L77) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="부동산PF 수수료 항목/정의" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PfFeeType>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.pfFeeTypeId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
