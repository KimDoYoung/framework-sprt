/**
 * 이익제공(수령)처 조회창 (L08) — Biz01_Tab_PriorApproval의 거래상대방 칸에서 연다
 * AS-IS: myApp/client/vi/mkt/Mkt01_Lookup_Select2.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L51-104: 모달 600×500, 위 = 툴바(검색 200 · [조회]), 아래 = 단일 체크 그리드 + 페이징 툴바(100건), 아래 가운데 [확인][전체][취소]
 *   type 'cmp'(회사별) = 회사명 500 한 열, 'emp'(직원별) = 회사명 250 · 담당자 100 · 부서 150 (setting() L106-117)
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktTargetApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { MktTarget } from '@/types/mkt';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<MktTarget>();
/** gridToolBar.setToolBar(100) L84 */
const LIMIT = 100;
/** setChecked(SINGLE) — 체크박스 한 행. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export type MktSelectType = 'cmp' | 'emp';

interface Props {
  /** open(type, callback) L59 — 값이 있으면 열린다. 'cmp' 회사별 / 'emp' 직원별 */
  type: MktSelectType | null;
  /** confirm() L201-213: 확인=고른 행, [전체]=null (callback.execute(null)) */
  onResult: (row: MktTarget | null) => void;
  onClose: () => void;
}

const keyOf = (r: MktTarget) => `${r.targetCompanyId}-${r.managerId ?? ''}`;

export const Mkt01_Lookup_Select2: React.FC<Props> = ({ type, onResult, onClose }) => {
  const open = type !== null;
  const gridRef = useRef<AgGridReact<MktTarget>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<MktTarget[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  /** gridToolBar.addParam(…) — 쪽을 넘길 때는 마지막으로 조회한 검색어를 쓴다(GridPagingLoader) */
  const lastText = useRef('');

  // retrieve() L176-199: 검색어 "%…%", 미사용 제외. 다른 쪽에 있으면 1쪽으로 가서 읽는다. 읽은 뒤 첫 행 선택
  const load = async (toPage: number, text: string) => {
    if (!type) return;
    lastText.current = text;
    setBusy(true);
    try {
      const res = await mktTargetApi.search(type, { searchText: text, offset: (toPage - 1) * LIMIT, limit: LIMIT });
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

  // [E0] 화면 열림 (생성자 L51-57) → open() L59-104: settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    setTotal(0);
    void load(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(keyOf(rows[0]))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E4] oKButton[확인].Select (L141) · [E2] grid.RowDoubleClick (L128) → confirm() L201-213
  const confirm = (row?: MktTarget) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    onResult(target);
    onClose();
  };

  // buildGrid() L164-174 + setting() L106-117: 회사별은 회사명 500 한 열
  const columnDefs = useMemo(() => (type === 'emp'
    ? [
      gb.text('targetCompanyName', 250, '회사명'),   // L169
      gb.text('managerName', 100, '담당자'),         // L170
      gb.text('managerOrgName', 150, '부서'),        // L171
    ]
    : [
      gb.text('targetCompanyName', 500, '회사명'),   // L169 (setColumnWidth(2, 500))
    ]), [type]);

  return (
    <LookupModal
      open={open}
      title="이익제공(수령)처"
      width={690}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E5] allButton[전체].Select [callback != null] (L147) → callback.execute(null) + hide() */}
            <Button onClick={() => { onResult(null); onClose(); }}>전체</Button>
            {/* [E6] cancelButton[취소].Select (L156) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L119), [E3] retrieveButton[조회].Select (L135) → retrieve() */}
        <SearchBar onSearch={() => load(1, searchText)} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<MktTarget>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => keyOf(p.data)}
            rowSelection={SINGLE_CHECK}
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
