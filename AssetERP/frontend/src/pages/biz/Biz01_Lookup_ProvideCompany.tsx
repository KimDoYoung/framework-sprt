/**
 * 거래상대방 조회창 (L09) — Biz01_Edit_CardSimple의 거래상대방 칸에서 연다
 * AS-IS: myApp/client/vi/biz/Biz01_Lookup_ProvideCompany.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L51-77: 모달 330×500, 위 = 툴바(검색 · [조회]), 아래 = 거래상대방 한 열(270) 단일 그리드, 아래 가운데 [선택][닫기]
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizPromoApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizProvideCompany } from '@/types/biz';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<BizProvideCompany>();
/** 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CLICK = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** callback.execute(companyName) — [선택]·더블클릭 */
  onResult: (company: string) => void;
  onClose: () => void;
}

export const Biz01_Lookup_ProvideCompany: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<BizProvideCompany>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BizProvideCompany[]>([]);
  const [busy, setBusy] = useState(false);

  // retrieve() L125-137: 서비스 biz.Biz01_Promo.selectByProvideCompany(companyId, searchText = "%…%")
  const retrieve = async (text: string) => {
    setBusy(true);
    try {
      setRows(await bizPromoApi.searchProvideCompanies(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // open() L51-77: settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] oKButton[선택].Select (L95) · [E5] grid.CellDoubleClick (L108) → confirm() L139-150: 없으면 "선택된 내역이 없습니다" → callback.execute(거래상대방), hide()
  const confirm = (row?: BizProvideCompany) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    onResult(target.provideCompany);
    onClose();
  };

  // buildGrid() L116-123
  const columnDefs = useMemo(() => [
    gb.text('provideCompany', 270, '거래상대방'),  // L120
  ], []);

  return (
    <LookupModal
      open={open}
      title={<span style={{ color: '#0069B4', fontWeight: 'bold' }}>거래상대방</span>}
      width={460}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => confirm()}>선택</Button>
            {/* [E4] cancelButton[닫기].Select (L101) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 390, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L80), [E2] retrieveButton[조회].Select (L89) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BizProvideCompany>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.rowId)}
            rowSelection={SINGLE_CLICK}
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
