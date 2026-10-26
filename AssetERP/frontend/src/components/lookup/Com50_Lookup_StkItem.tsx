/**
 * 종목(주식/ETF) 찾기 · 상장주식 종목 등록 창 (E20) — Sch10_Tab_IpoAdmin의 [주식등록]에서 연다(EDIT)
 * AS-IS: myApp/client/vi/com/Com50_Lookup_StkItem.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L66-136: 모달 550×500, 위 = 툴바(검색 150 "종목코드/명" · [조회] · EDIT면 [등록][저장][삭제]), 아래 = 그리드(행번호) + 페이징 툴바(300건),
 *   아래 가운데 [선택][닫기]. VIEW("종목(주식/ETF) 찾기")는 읽기 전용 열(종목코드 120 · 종목명 350), EDIT("상장주식 종목 등록")는 셀 편집 열(같은 폭)
 * EDIT는 Sch10_Tab_IpoAdmin, VIEW는 Flt10_Tab_BuyReport(I03, 매수 종목 선택)가 쓴다 — 두 도메인이 쓰게 되어 pages/com에서 components/lookup/으로 옮겼다(IM-02, I03)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { comApi } from '@/api/com';
import { Com50Item } from '@/types/com';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { PagingToolBar } from '@/components/grid/PagingToolBar';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Com50Item>();
const ITEM_TYPE = '2010';                       // gridToolBar.addParam("itemType", "2010") (2010:주식)
const LIMIT = 300;                              // gridToolBar.setToolBar(300)
/** 한 행 선택(체크박스 없음 — setChecked 없음). 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_ROW = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export type StkItemMode = 'VIEW' | 'EDIT';

interface Props {
  /** view()/edit() L73-92 — 값이 있으면 열린다 (VIEW "종목(주식/ETF) 찾기", EDIT "상장주식 종목 등록") */
  mode: StkItemMode | null;
  /** view(searchText, callback) L73-78: 검색 칸의 처음 값 */
  initialSearchText?: string;
  /** confirm() L308-319: 고른 종목 */
  onResult?: (item: Com50Item) => void;
  onClose: () => void;
}

export const Com50_Lookup_StkItem: React.FC<Props> = ({ mode, initialSearchText, onResult, onClose }) => {
  const open = mode !== null;
  const edit = mode === 'EDIT';
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef({ searchText: '' });
  const pageRef = useRef(1);

  const crud = useGridCrud<Com50Item>({
    idField: 'itemId',
    // retrieve() L223-242 → GridPagingLoader.getPaging(): com.Com50_Item.selectByTextPaging(+Total), itemType 2010, searchText "%검색어%"
    search: useCallback(async () => {
      const res = await comApi.searchItems(ITEM_TYPE, paramRef.current.searchText, LIMIT, (pageRef.current - 1) * LIMIT);
      setTotal(res.total);
      return res.rows;
    }, []),
    // update() L252-281: GridUpdate → com.Com50_Item.update
    save: comApi.updateItems,
    // delete() L283-306 → [E9] msgBox.DialogHide [YES] (L290) → com.Com50_Item.delete
    remove: comApi.deleteItems,
    deleteConfirm: false,
    // insertRow() L244-250: 종목구분 2010
    newRow: useCallback(() => ({ itemType: ITEM_TYPE }), []),
    firstEditField: 'itemCode',
    // update() L259-277: 수정한 행마다 종목코드 없음 / 12자리 아님 / 종목명 없음이면 알리고 저장하지 않는다
    validate: changed => {
      for (const m of changed) {
        if (!m.itemCode) return '종목코드를 입력하세요';
        if (m.itemCode.length !== 12) return '종목코드는 반드시 12자리 표준코드를 입력하세요';
        if (!m.itemName) return '종목명를 입력하세요';
      }
      return undefined;
    },
  });

  const getPaging = async (p: number) => {
    pageRef.current = p;
    setPage(p);
    await crud.retrieve();
  };

  // [E1] searchText.KeyPress [Enter] (L141), [E3] retrieveButton[조회].Select (L159) → retrieve() L223-242: 조건을 만들어 1페이지부터 다시 읽는다
  const retrieve = () => {
    paramRef.current = { searchText: `%${searchText}%` };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L66-71) → view()/edit() → open() L94-136: settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    const text = initialSearchText ?? '';
    setSearchText(text);
    paramRef.current = { searchText: `%${text}%` };
    void getPaging(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E7] oKButton[선택].Select (L183) → confirm() L308-319: 고른 종목이 없으면 "선택된 종목이 없습니다", 있으면 callback.execute(고른 종목) 후 hide()
  const confirm = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('선택된 종목이 없습니다');
      return;
    }
    onResult?.(selected[0]);
    onClose();
  };

  // [E6] deleteButton[삭제].Select (L177) → delete() L283-306: "삭제"/"[코드]종목명' 종목을 삭제하시겠습니까?"(폭 450) → YES → deleteRow
  const deleteItem = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    const target = selected[0];
    Modal.confirm({
      title: '삭제',
      content: `[${target.itemCode ?? ''}]${target.itemName ?? ''}' 종목을 삭제하시겠습니까?`,
      width: 450,
      okText: '예',
      cancelText: '아니오',
      onOk: () => crud.deleteChecked(),
    });
  };

  // buildGrid() L211-221 + setGridColumnHidden() L197-209: VIEW는 읽기 전용 열(인덱스 1·2), EDIT는 편집 열(3·4)
  const columnDefs = useMemo(() => (edit
    ? [
      gb.textCenter('itemCode', 120, '종목코드', { editor: 'text' }),   // L217
      gb.text('itemName', 350, '종목명', { editor: 'text' }),           // L218
    ]
    : [
      gb.textCenter('itemCode', 120, '종목코드'),                        // L215
      gb.text('itemName', 350, '종목명'),                                // L216
    ]), [edit]);

  return (
    <LookupModal
      open={open}
      title={edit ? '상장주식 종목 등록' : '종목(주식/ETF) 찾기'}
      width={720}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={confirm}>선택</Button>
            {/* [E8] cancelButton[닫기].Select (L189) → hide() */}
            <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={retrieve} loading={crud.loading} extra={edit ? <>
          {/* [E4] insertButton[등록].Select (L165) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E5] updateButton[저장].Select (L171) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={deleteItem}>삭제</Button>
        </> : undefined}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="종목코드/명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick (L152) → confirm(). 원본은 EDIT에서도 묶지만 셀 편집(더블클릭)과 겹쳐 창이 닫혀 버리므로 VIEW에서만 묶는다 (결과확인에 사용자 확인 요청) */}
          <CellEditGrid<Com50Item> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_ROW} onRowDoubleClicked={edit ? undefined : confirm} />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={crud.loading} onChange={getPaging} />
      </div>
    </LookupModal>
  );
};
