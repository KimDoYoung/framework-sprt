/**
 * 업무활동처 및 이익제공처 조회창 (Y12) — 화환신청 등록 창의 [불러오기 > 거래처]에서 연다
 * AS-IS: myApp/client/vi/mkt/Mkt01_Lookup_Select.java (240줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L59-158: 모달 930×510 "업무활동처 및 이익제공처", 위 = 툴바(검색 250 "활동처/담당자" · ☐즐겨찾기만 조회 · [조회][활동처 추가]),
 *   아래 = 체크 그리드(MULTI면 다중, 아니면 단일) + 페이징 툴바(100건), 아래 가운데 [확인][취소]. 그리드 5열: 활동처 250 · 담당자 120 · 직위 120 · 부서 200 · 담당자 추가(아이콘 100)
 * 1단계: [활동처 추가]·[담당자 추가] 아이콘이 여는 `Mkt01_Lookup_TargetCompany`(470줄, 활동처·담당자 등록)는 다음 단계 — 안내만 띄운다
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktTargetApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { MktSelect } from '@/types/mkt';
import { Button } from '@/components/button';
import { MultiGrid, PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';

const gb = gbFor<MktSelect>();
/** gridToolBar.setToolBar(100) L138 */
const LIMIT = 100;
/** setChecked(SINGLE)·행 클릭 선택(UX-06). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
const MULTI_CHECK = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: true } as const;

interface Props {
  /** open(type, callback) L59 — 값이 있으면 열린다. 'SINGLE' / 'MULTI' */
  type: 'SINGLE' | 'MULTI' | null;
  /** confirm() L219-228: 고른 행들 (callback.execute(list)) */
  onResult: (rows: MktSelect[]) => void;
  onClose: () => void;
}

const keyOf = (r: MktSelect) => `${r.targetCompanyId}-${r.managerId ?? ''}`;

export const Mkt01_Lookup_Select: React.FC<Props> = ({ type, onResult, onClose }) => {
  const open = type !== null;
  const gridRef = useRef<AgGridReact<MktSelect>>(null);
  const [searchText, setSearchText] = useState('');
  const [favoriteYn, setFavoriteYn] = useState(false);
  const [rows, setRows] = useState<MktSelect[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  /** gridToolBar.addParam(…) — 쪽을 넘길 때는 마지막으로 조회한 조건을 쓴다(GridPagingLoader) */
  const last = useRef({ text: '', fav: false });

  // retrieve() L193-217: 검색어 "%…%"·즐겨찾기 조건. 다른 쪽에 있으면 1쪽으로 가서 읽는다. 읽은 뒤 첫 행 선택
  const load = async (toPage: number, text: string, fav: boolean) => {
    if (!type) return;
    last.current = { text, fav };
    setBusy(true);
    try {
      const res = await mktTargetApi.searchSelect({ searchText: text, favoriteYn: fav, offset: (toPage - 1) * LIMIT, limit: LIMIT });
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

  // [E0] 화면 열림 → open() L59-158: buildGrid(type), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setFavoriteYn(false);
    setRows([]);
    setTotal(0);
    void load(1, '', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(keyOf(rows[0]))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E4] oKButton[확인].Select (L98) · [E8] grid.CellDoubleClick (L146) → confirm() L219-228: 고른 게 없으면 "선택된 활동처가 없습니다"
  // [E7] gridToolBar (GridPagingLoader).callbackOnCreate (L132) → 쪽을 넘기면 retrieve() — PagingToolBar onChange
  const confirm = (row?: MktSelect) => {
    const list = row ? [row] : gridRef.current?.api?.getSelectedRows() ?? [];
    if (list.length === 0) {
      message.warning('선택된 활동처가 없습니다');
      return;
    }
    onResult(list);
    onClose();
  };

  // [E3] insertButton[활동처 추가].Select (L86) → Mkt01_Lookup_TargetCompany.openNew(callback → retrieve()) — 다음 단계
  // [E9] actionCell (ImageCell).callbackOnCreate (L166) → Mkt01_Lookup_TargetCompany.open2(realKeyId, callback → retrieve()) — 다음 단계(아래 담당자 추가 열)
  const insertTarget = () => message.info('활동처 추가(Mkt01_Lookup_TargetCompany)는 다음 단계에서 제공됩니다');

  // buildGrid(type) L160-191
  const columnDefs = useMemo(() => [
    gb.text('targetCompanyName', 250, '활동처'),  // L184
    gb.text('managerName', 120, '담당자'),  // L185
    gb.text('managerPosName', 120, '직위'),  // L186
    gb.text('managerOrgName', 200, '부서'),  // L187
    // L188 addCell(ImageCell("Add")) → Mkt01_Lookup_TargetCompany.open2(realKeyId, callback → retrieve()) — 다음 단계
    iconCell<MktSelect>('add', 'actionCell', 100, '담당자 추가', () => message.info('담당자 추가(Mkt01_Lookup_TargetCompany)는 다음 단계에서 제공됩니다')),
  ], []);

  const gridProps = {
    gridRef,
    rowData: rows,
    columnDefs,
    getRowId: (p: { data: MktSelect }) => keyOf(p.data),
    onRowDoubleClicked: (e: { data?: MktSelect }) => e.data && confirm(e.data),
  };

  return (
    <LookupModal
      open={open}
      title="업무활동처 및 이익제공처"
      width={930}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => confirm()}>확인</Button>
            {/* [E5] cancelButton[취소].Select (L104) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L70), [E2] retrieveButton[조회].Select (L80) → retrieve() */}
        <SearchBar onSearch={() => load(1, searchText, favoriteYn)} loading={busy} extra={<Button type="register" onClick={insertTarget}>활동처 추가</Button>}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="활동처/담당자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          {/* [E6] favoriteCheckBox[즐겨찾기만 조회].ValueChange (L113) → retrieve() */}
          <Checkbox checked={favoriteYn} onChange={e => { setFavoriteYn(e.target.checked); void load(1, searchText, e.target.checked); }}>즐겨찾기만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          {type === 'MULTI'
            ? <MultiGrid<MktSelect> {...gridProps} rowSelection={MULTI_CHECK} />
            : <SingleGrid<MktSelect> {...gridProps} rowSelection={SINGLE_CHECK} />}
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={busy} onChange={p => void load(p, last.current.text, last.current.fav)} />
      </div>
    </LookupModal>
  );
};
