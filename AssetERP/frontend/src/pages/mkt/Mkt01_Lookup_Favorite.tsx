/**
 * 즐겨찾기 창 (Z05) — Mkt01_Grid_TargetCompany의 [즐겨찾기]에서 연다
 * AS-IS: myApp/client/vi/mkt/Mkt01_Lookup_Favorite.java (230줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L58-131: 모달 "즐겨찾기" 930×510, 위 = 검색(활동처/담당자 250)·[조회][추가][제거], 아래 = 체크 다중 그리드(활동처 300·담당자 140·직위 140·부서 290) + 페이징(100), 아래 가운데 [닫기]
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Modal, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktFavoriteApi, mktTargetCompanyApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { MktFavorite, MktSelect } from '@/types/mkt';
import { Button } from '@/components/button';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Mkt01_Lookup_FavoriteInsert } from './Mkt01_Lookup_FavoriteInsert';

const gb = gbFor<MktFavorite>();
const LIMIT = 100;

// buildGrid() L133-144
const columnDefs = [
  gb.text('targetCompanyName', 300, '활동처'),  // L138
  gb.text('managerName', 140, '담당자'),        // L139
  gb.text('managerPosName', 140, '직위'),       // L140
  gb.text('managerOrgName', 290, '부서'),       // L141
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Mkt01_Lookup_Favorite: React.FC<Props> = ({ open, onClose }) => {
  const gridRef = useRef<AgGridReact<MktFavorite>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<MktFavorite[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  const [insertOpen, setInsertOpen] = useState(false);
  const lastText = useRef('');

  // retrieve() L146-169: mkt.Mkt01_TargetCompany.selectFavoritePaging(personId, "%검색어%"). 읽은 뒤 첫 행 선택
  const load = async (toPage: number, text: string) => {
    lastText.current = text;
    setBusy(true);
    try {
      const res = await mktTargetCompanyApi.searchFavorites({ searchText: text, offset: (toPage - 1) * LIMIT, limit: LIMIT });
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

  // [E6] gridToolBar.callbackOnCreate (L113) → retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    setTotal(0);
    void load(1, '');
  }, [open]);

  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(String(rows[0].favoriteId))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E3] insertButton[추가].Select (L82) → insert() L171-199: Mkt01_Lookup_FavoriteInsert("MULTI") → 고른 행마다 mkt.Mkt06_Favorite.modelUpdate(personId, realKeyId, managerId) → retrieve()
  const insert = async (list: MktSelect[]) => {
    try {
      await mktFavoriteApi.add(list.map(m => ({ targetCompanyId: m.targetCompanyId, managerId: m.managerId! })));
    } catch (err) {
      message.error(errorMessage(err, '추가 실패'));
    }
    await load(page, lastText.current);
  };

  // [E4] deleteButton[제거].Select (L88) → delete() L201-221: "삭제하시겠습니까?"(확인, 300폭) [YES] [E7] → mkt.Mkt06_Favorite.deleteList → retrieve()
  const remove = () => {
    Modal.confirm({
      title: '확인',
      content: '삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        const checked = gridRef.current?.api?.getSelectedRows() ?? [];
        try {
          await mktFavoriteApi.remove(checked.map(r => r.favoriteId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await load(page, lastText.current);
      },
    });
  };

  return (
    <LookupModal
      open={open}
      title="즐겨찾기"
      width={1010}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] closeButton[닫기].Select (L94) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L66), [E2] retrieveButton[조회].Select (L76) → retrieve() */}
        <SearchBar
          onSearch={() => load(1, searchText)}
          loading={busy}
          extra={
            <>
              <Button type="register" onClick={() => setInsertOpen(true)}>추가</Button>
              <Button type="delete" onClick={remove}>제거</Button>
            </>
          }
        >
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="활동처/담당자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <MultiGrid<MktFavorite> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.favoriteId)} rowClick />
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={busy} onChange={p => void load(p, lastText.current)} />
      </div>
      <Mkt01_Lookup_FavoriteInsert open={insertOpen} onResult={list => void insert(list)} onClose={() => setInsertOpen(false)} />
    </LookupModal>
  );
};
