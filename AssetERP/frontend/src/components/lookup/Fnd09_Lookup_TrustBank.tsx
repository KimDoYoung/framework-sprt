/**
 * 수탁은행 검색 조회창 (P05) — Fnd01_Edit_FundCode의 수탁은행 칸에서 연다 (openLookupTrustBank L356-366)
 * AS-IS: myApp/client/vi/fnd/Fnd09_Lookup_TrustBank.java (140줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L45-112: 모달 500×500 "수탁은행 검색", 위 = 툴바(검색 250 · [조회]), 아래 = 단일 체크 그리드(수탁은행 코드 120·수탁은행 명 300), 아래 가운데 [확인][취소]
 * 선택 없이 [확인]이면 원본은 callback에 null을 넘겨 예외가 나며 창이 열려 있다 → 아무 일 없이 둔다
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { TrustBank } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<TrustBank>();
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** [확인]·더블클릭: 고른 행 (callback.execute(선택 행)) */
  onResult: (row: TrustBank) => void;
  onClose: () => void;
}

export const Fnd09_Lookup_TrustBank: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<TrustBank>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TrustBank[]>([]);
  const [busy, setBusy] = useState(false);

  // retrieve() L122-135: fnd.Fnd09_TrustBank.selectByText (검색어 "%…%"는 서버가 감싼다)
  const load = async (text: string) => {
    setBusy(true);  // grid.mask("Loading")
    try {
      setRows(await fndApi.lookupTrustBanks(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E0] 열림 → open() L45-112: 모달 show() 뒤 retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] grid.CellDoubleClick (L80)·[E4] okButton[확인].Select (L91) → callback.execute(선택 행), hide()
  const confirm = (row?: TrustBank) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) return;
    onResult(target);
    onClose();
  };

  // buildGrid() L114-120: 행번호·단일 체크·수탁은행 코드 120·수탁은행 명 300
  const columnDefs = useMemo(() => [
    gb.text('trustBankCode', 120, '수탁은행 코드'),
    gb.text('trustBankName', 300, '수탁은행 명'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="수탁은행 검색"
      width={610}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E5] cancelButton[취소].Select (L101) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText[검색].KeyPress [Enter] (L60), [E2] retrieveButton[조회].Select (L69) → retrieve() */}
        <SearchBar onSearch={() => load(searchText)} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 220 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<TrustBank>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trustBankId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => confirm(e.data)}
          />
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
      </div>
    </LookupModal>
  );
};
