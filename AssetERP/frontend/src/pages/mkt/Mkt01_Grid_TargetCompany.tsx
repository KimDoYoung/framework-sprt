/**
 * 업무활동처 목록 (Z05) — Mkt01_Tab_TargetCompany 가운데 칸
 * AS-IS: myApp/client/vi/mkt/Mkt01_Grid_TargetCompany.java (387줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L74-126: 위 툴바 50(검색 300 "활동처/주요사항" · □미사용 제외 · [조회][등록][삭제] · [즐겨찾기][출력/다운로드] · [데이터업로드]) + 단일 체크 그리드 + 페이징(100)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { mktTargetCompanyApi } from '@/api/mkt';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { MktTargetCompany } from '@/types/mkt';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Mkt01_Lookup_TargetCompany, MktTargetCompanyTarget } from './Mkt01_Lookup_TargetCompany';
import { Mkt01_Lookup_Favorite } from './Mkt01_Lookup_Favorite';
import { Mkt01_Lookup_ExcelUpload } from './Mkt01_Lookup_ExcelUpload';

const gb = gbFor<MktTargetCompany>();
const LIMIT = 100;
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** retrieve(itemTypeCode) L227-237 — 왼쪽에서 고른 구분 코드 (`%` 전체). 바뀌면 다시 읽는다 */
  itemTypeCode: string | null;
  /** SelectionChanged [선택>0] (L144) → retrieveHistory() — 고른 활동처(없으면 null) */
  onSelect: (row: MktTargetCompany | null) => void;
}

export const Mkt01_Grid_TargetCompany: React.FC<Props> = ({ itemTypeCode, onSelect }) => {
  const gridRef = useRef<AgGridReact<MktTargetCompany>>(null);
  const [searchText, setSearchText] = useState('');
  const [unUseYn, setUnUseYn] = useState(true);   // setting() L141: unUseCheckBox.setValue(true) "미사용 제외"
  const [rows, setRows] = useState<MktTargetCompany[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  const [lookup, setLookup] = useState<MktTargetCompanyTarget | null>(null);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [uploadType, setUploadType] = useState<string | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  /** 쪽을 넘길 때는 마지막으로 조회한 조건을 쓴다(GridPagingLoader.addParam) */
  const last = useRef({ searchText: '', unUseYn: true, itemTypeCode: '%' });

  // retrieve() L240-267: mkt.Mkt01_TargetCompany.selectByCompanyIdPaging(searchText "%…%", unUseYn, itemTypeCode) → 읽은 뒤 첫 행 선택, 비었으면 historyPage.retrieve()
  const load = useCallback(async (toPage: number, cond: { searchText: string; unUseYn: boolean; itemTypeCode: string }) => {
    last.current = cond;
    setLoading(true);
    try {
      const res = await mktTargetCompanyApi.search({ ...cond, offset: (toPage - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      setAfterLoad(n => n + 1);
      if (res.rows.length === 0) onSelect(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [onSelect]);

  const retrieve = () => load(1, { searchText, unUseYn, itemTypeCode: itemTypeCode ?? '%' });

  // [E0] 화면 열림 (생성자 L74-126) → setting(), retrieve() · retrieve(itemTypeCode) L227-237
  useEffect(() => {
    if (itemTypeCode == null) return;
    void load(1, { searchText, unUseYn, itemTypeCode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemTypeCode]);

  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(String(rows[0].targetCompanyId))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E5] insertButton[등록].Select (L159) → insertRow() L274-281: Mkt01_Lookup_TargetCompany.openNew()
  const insertRow = () => setLookup({ id: null });

  // [E6] deleteButton[삭제].Select (L165) → preDelete() L283-320: 업무활동내역이 있으면 안내, 없으면 "선택한 활동처를 삭제하시겠습니까?" → [E11] deleteRow() L323-337
  const preDelete = async () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제 대상을 선택하세요'); return; }
    const ids = selected.map(r => r.targetCompanyId);
    try {
      if (await mktTargetCompanyApi.checkHistories(ids) !== 0) { message.warning('업무활동내역이 있는 활동처입니다.'); return; }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    Modal.confirm({
      title: '삭제확인',
      content: '선택한 활동처를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await mktTargetCompanyApi.remove(ids);
          setRows(prev => prev.filter(r => !ids.includes(r.targetCompanyId)));
          setTotal(t => Math.max(0, t - ids.length));
          message.info('삭제가 완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E8] downLoadButton[출력/다운로드].Select (L177) → downLoad() L344-379: sys.Sys99_Print.insertRdTargetCompany → RDViewer(mrd Mkt01_Rd_TargetCompany, "/rhtmlimportopt [2]", rv rdGroupId)
  const downLoad = async () => {
    setLoading(true);
    try {
      const groupId = await mktTargetCompanyApi.rdDownload();
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Mkt01_Rd_TargetCompany', options: '/rhtmlimportopt [2]', rv: { rdGroupId: groupId } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // update(grid.getStore().update) / GridInsertRow — 저장한 활동처를 목록에 반영한다(새 행은 맨 아래)
  const onSaved = (saved: MktTargetCompany) => {
    setRows(prev => (prev.some(r => r.targetCompanyId === saved.targetCompanyId)
      ? prev.map(r => (r.targetCompanyId === saved.targetCompanyId ? saved : r))
      : [...prev, saved]));
    setTimeout(() => {
      const node = gridRef.current?.api?.getRowNode(String(saved.targetCompanyId));
      node?.setSelected(true);
      if (node?.rowIndex != null) gridRef.current?.api?.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // buildGrid() L197-221
  const columnDefs = useMemo(() => [
    // [E10] modiCell (ImageCell).callbackOnCreate (L203) → Mkt01_Lookup_TargetCompany.open(선택 행)
    iconCell<MktTargetCompany>('edit', 'modiCell', 40, '수정', row => setLookup({ id: row.targetCompanyId, row })),   // L213
    gb.text('targetCompanyName', 250, '회사명'),        // L214
    gb.text('managerInfo', 150, '담당자'),              // L215
    gb.text('itemTypeName', 150, '구분'),               // L216
    gb.text('note', 600, '주요사항'),                   // L217
    gb.booleanYn2('unuseYn', 70, '미사용'),             // L218
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* [E2] searchText.KeyPress [Enter] (L132), [E4] retrieveButton[조회].Select (L153) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        loading={loading}
        extra={
          <>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={preDelete}>삭제</Button>
            {/* [E7] favoriteButton[즐겨찾기].Select (L171) → favoriteSetting() L339-342 */}
            <Button type="bookmark" onClick={() => setFavoriteOpen(true)}>즐겨찾기</Button>
            <Button type="download" onClick={downLoad}>출력/다운로드</Button>
            {/* [E9] dataUploadButton[데이터업로드].Select (L183) → Mkt01_Lookup_ExcelUpload.open(itemTypeCode) → callback retrieve(). 구분이 전체(%)면 막는다(L228-232) */}
            <Button type="upload" disabled={itemTypeCode == null || itemTypeCode === '%'} onClick={() => setUploadType(itemTypeCode)}>데이터업로드</Button>
          </>
        }
      >
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="활동처/주요사항" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={unUseYn} onChange={e => setUnUseYn(e.target.checked)}>미사용 제외</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
        {/* [E3] grid.SelectionChanged [선택>0] (L144) → retrieveHistory() */}
        <SingleGrid<MktTargetCompany>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.targetCompanyId)}
          rowSelection={SINGLE_CHECK}
          onSelect={row => { if (row) onSelect(row); }}
        />
      </div>
      {/* [E1] gridToolBar (GridPagingLoader).callbackOnCreate (L96) → retrieve() */}
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void load(p, last.current)} />
      <Mkt01_Lookup_TargetCompany target={lookup} onSaved={onSaved} onClose={() => setLookup(null)} />
      <Mkt01_Lookup_Favorite open={favoriteOpen} onClose={() => setFavoriteOpen(false)} />
      <Mkt01_Lookup_ExcelUpload itemTypeCode={uploadType} onDone={() => void retrieve()} onClose={() => setUploadType(null)} />
      <RdViewer url={rdUrl} title="업무활동처" onClose={() => setRdUrl(null)} />
    </div>
  );
};
