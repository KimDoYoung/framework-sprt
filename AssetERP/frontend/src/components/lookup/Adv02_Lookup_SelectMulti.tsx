/**
 * 일임계좌 목록 조회창 — 여러 계좌 선택 (Q02 Adv05_Lookup_OrgAuth의 [행 추가]가 연다). 내 조직이 권한을 가진 계좌만 나온다
 * AS-IS: myApp/client/vi/adv/Adv02_Lookup_SelectMulti.java (193줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L55-91: 모달 700×700 "일임계좌 목록", 위 툴바(검색 300 · [조회]), 체크박스 다중 그리드(관리코드 100 · 계좌명 150 · 증권사코드 100 · 증권사명 100 · 계좌번호 150)
 *   + 페이징 툴바(500), 아래 가운데 [확인][취소]
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { advApi } from '@/api/adv';
import { errorMessage } from '@/api/client';
import { AdvAccount } from '@/types/adv';
import { Button } from '@/components/button';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AdvAccount>();
/** setToolBar(500) — 한 페이지 행 수 */
const LIMIT = 500;

interface Props {
  open: boolean;
  /** confirm() L162-173: 고른 계좌가 있으면 callback.execute(고른 계좌들) 뒤 hide() — 없으면 "일임계좌를 선택해주세요" */
  onSelect: (accounts: AdvAccount[]) => void;
  onClose: () => void;
}

export const Adv02_Lookup_SelectMulti: React.FC<Props> = ({ open, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<AdvAccount>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AdvAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const paramRef = useRef<string | undefined>(undefined);
  const seq = useRef(0);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (paramRef.current === undefined) return;
    const my = ++seq.current;
    setBusy(true);  // grid.mask("Loading")
    try {
      const res = await advApi.searchOrgAuthAccounts({ searchText: paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      if (my !== seq.current) return;
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setBusy(false);  // grid.unmask()
    }
  };

  // [E1] searchText.KeyPress [Enter] (L95), [E2] retrieveButton[조회].Select (L104) → retrieve() L142-160: 조건("%검색어%"는 서버가 만든다)을 정하고 1페이지부터
  const retrieve = (text = searchText) => {
    paramRef.current = text;
    void getPaging(1);
  };

  // 화면 열림 → open() L55-91: show(), retrieve() (원본 이벤트 아님)
  useEffect(() => {
    if (!open) return;
    setSearchText(''); setRows([]); setTotal(0); setPage(1);
    retrieve('');
  }, [open]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] oKButton[확인].Select (L110)·[E5] grid.CellDoubleClick (L122) → confirm() L162-173
  const confirm = (picked?: AdvAccount[]) => {
    const list = picked ?? gridRef.current?.api?.getSelectedRows() ?? [];
    if (list.length === 0) {
      message.warning('일임계좌를 선택해주세요');
      return;
    }
    onSelect(list);
    onClose();
  };

  // buildGrid() L127-141
  const columnDefs = useMemo(() => [
    gb.textCenter('manageCode', 100, '관리코드'),
    gb.text('manageName', 150, '계좌명'),
    gb.text('trCorpCode', 100, '증권사코드'),
    gb.text('trCorpName', 100, '증권사명'),
    gb.text('accountNoDec', 150, '계좌번호'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="일임계좌 목록"
      width={790}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L116) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => retrieve()} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative', border: '1px solid #d9d9d9', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<AdvAccount>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.accountId)}
              loading={busy}
              rowClick
              onRowDoubleClicked={e => {
                const picked = gridRef.current?.api?.getSelectedRows() ?? [];
                confirm(picked.length > 0 ? picked : e.data ? [e.data] : []);
              }}
            />
          </div>
          <PagingToolBar page={page} limit={LIMIT} total={total} loading={busy} onChange={p => void getPaging(p)} />
        </div>
      </div>
    </LookupModal>
  );
};
