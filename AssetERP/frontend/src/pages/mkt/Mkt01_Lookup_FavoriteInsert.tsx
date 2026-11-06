/**
 * 업무활동처 및 이익제공처 (즐겨찾기 추가) 창 (Z05) — Mkt01_Lookup_Favorite의 [추가]에서 연다
 * AS-IS: myApp/client/vi/mkt/Mkt01_Lookup_FavoriteInsert.java (196줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L51-127: 모달 720×510, 위 = 검색(활동처/담당자 250)·[조회], 아래 = 체크 다중 그리드(활동처 250·담당자 100·직위 100·부서 200) + 페이징(100), 아래 가운데 [확인][취소]
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktTargetApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { MktSelect } from '@/types/mkt';
import { Button } from '@/components/button';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<MktSelect>();
const LIMIT = 100;
const keyOf = (r: MktSelect) => `${r.targetCompanyId}-${r.managerId ?? ''}`;

// buildGrid() L129-145
const columnDefs = [
  gb.text('targetCompanyName', 250, '활동처'),  // L139
  gb.text('managerName', 100, '담당자'),        // L140
  gb.text('managerPosName', 100, '직위'),       // L141
  gb.text('managerOrgName', 200, '부서'),       // L142
];

interface Props {
  open: boolean;
  /** confirm() L172-187: callback.execute(고른 행들) 뒤 hide() */
  onResult: (list: MktSelect[]) => void;
  onClose: () => void;
}

export const Mkt01_Lookup_FavoriteInsert: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<MktSelect>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<MktSelect[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  const lastText = useRef('');

  // retrieve() L147-170: mkt.Mkt01_TargetCompany.selectBySearchTextPaging(itemTypeCode "%", "%검색어%"). 읽은 뒤 첫 행 선택
  const load = async (toPage: number, text: string) => {
    lastText.current = text;
    setBusy(true);
    try {
      const res = await mktTargetApi.searchSelect({ searchText: text, favoriteYn: false, offset: (toPage - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      setAfterLoad(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E5] gridToolBar.callbackOnCreate (L101) → retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    setTotal(0);
    void load(1, '');
  }, [open]);

  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(keyOf(rows[0]))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E3] oKButton[확인].Select (L78) · [E6] grid.CellDoubleClick (L115) → confirm() L172-187
  const confirm = (row?: MktSelect) => {
    const list = row ? [row] : (gridRef.current?.api?.getSelectedRows() ?? []);
    if (list.length === 0) {
      message.warning('선택된 활동처가 없습니다');
      return;
    }
    for (const m of list) {
      if (m.managerId == null) {
        message.warning(`담당자만 선택 가능합니다. [${m.targetCompanyName ?? ''} 등록불가]`);
        return;
      }
    }
    onResult(list);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="업무활동처 및 이익제공처"
      width={760}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L84) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L62), [E2] retrieveButton[조회].Select (L72) → retrieve() */}
        <SearchBar onSearch={() => load(1, searchText)} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="활동처/담당자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <MultiGrid<MktSelect>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => keyOf(p.data)}
            rowClick
            onRowDoubleClicked={e => confirm(e.data)}
          />
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={busy} onChange={p => void load(p, lastText.current)} />
      </div>
    </LookupModal>
  );
};
