/**
 * [1295] 고유자산 > 20. 고유자산 거래처리 > 금융상품 시세관리 (W10)
 * AS-IS: myApp/client/vi/ast/Ast25_Tab_Price.java (385줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-120: BorderLayout 가운데(여백 20) = 툴바 50(조회기간 100 ~ 100(어제) · 종목유형 150 "전체" · 검색 250 "종목코드/종목명" · ☑보유종목만 보기 · [조회][등록][저장][삭제])
 *   + 셀 편집 그리드(행번호·체크 다중·8열) + 페이징 툴바(300건)
 * 스타일: CG (견본 — docs/page-style.md). 조건 입력이 있어 SearchBar에 [등록][저장][삭제]를 extra로 둔다
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n)(UX-03), 편집 날짜 열 120(UX-08), 변경 표시(UX-07)
 * 열 때 자동 조회는 없다(E0은 setting()만 — 생성자의 toolBar.refresh()는 조건 없이 불려 빈 목록)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { sysApi } from '@/api/sys';
import { AstPrc } from '@/types/ast';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { PagingToolBar } from '@/components/grid/PagingToolBar';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AstPrc>();
const FORMAT = 'YYYY-MM-DD';
const LIMIT = 300;   // gridToolBar.setToolBar(300)

interface Cond { startDate: string; closeDate: string; itemType: string; searchText: string; holdYn: boolean }

export const Ast25_Tab_Price: React.FC = () => {
  // setting() L122-197: 조회기간 = 어제 ~ 어제, 종목유형 "전체"(%), 보유종목만 보기 체크
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [itemType, setItemType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [holdYn, setHoldYn] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  /** 종목유형 선택지(ItemMClassCode001) — 그리드의 종목유형 셀 편집기 */
  const [types, setTypes] = useState<{ code: string; name: string }[]>([]);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다 */
  const paramRef = useRef<Cond | null>(null);
  const pageRef = useRef(1);

  // [E0] 화면 열림 (생성자 L77-120) → setting() L122-197 — 종목유형 선택지를 읽는다(조회는 하지 않는다)
  useEffect(() => {
    void sysApi.searchCodesByKindGroup('ItemMClassCode001').then(list => setTypes(list.map(c => ({ code: c.code, name: c.name })))).catch(() => setTypes([]));
  }, []);

  const crud = useGridCrud<AstPrc>({
    idField: 'priceId',
    search: useCallback(async () => {
      const c = paramRef.current;
      if (!c) return [];
      const res = await astApi.searchPrices({ ...c, limit: LIMIT, offset: (pageRef.current - 1) * LIMIT });
      setTotal(res.total);
      return res.rows;
    }, []),
    // update() L259-312: 기준일·종목유형·종목코드·종목명 필수 → ast.Ast25_Price.upsert. 공용 시세는 고객사 시세로 새로 만들어지고 그리드에서 사라진다(저장 뒤 다시 읽는다)
    save: useCallback(async (changed: AstPrc[]) => { await astApi.upsertPrices(changed); return changed; }, []),
    remove: astApi.deletePrices,
    reloadAfterSave: true,
    deleteConfirm: false,
    // insertRow() L315-321: 회사 ID는 서버, 공용 아님
    newRow: useCallback((): Partial<AstPrc> => ({ lockYn: false }), []),
    firstEditField: 'stdDate',
    validate: changed => {
      for (const m of changed) {
        if (!m.stdDate) return '기준일을 입력하세요';
        if (!m.itemType) return '종목유형을 선택하세요';
        if (!m.itemCode) return '종목코드를 입력하세요';
        if (!m.itemName) return '종목명을 입력하세요';
      }
      return undefined;
    },
  });

  const getPaging = async (p: number) => {
    pageRef.current = p;
    setPage(p);
    await crud.retrieve();
  };

  // retrieve() L232-256: 조건을 만들어 1페이지부터 읽고 첫 행을 선택한다
  const retrieve = async () => {
    paramRef.current = { startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), itemType, searchText: `%${searchText}%`, holdYn };
    await getPaging(1);
    setTimeout(() => crud.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
  };

  // [E6] deleteButton[삭제].Select (L178) → deleteRow() L324-357: 선택 없음 "삭제대상을 선택하세요" / 공용 시세 포함 "공용관리 시세정보가 선택되어 있습니다. 공용관리 대상은 삭제 불가합니다." / 확인(400) "N건의 시세를 삭제하시겠습니까?" → [E9] YES → ast.Ast25_Price.delete
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제대상을 선택하세요'); return; }
    if (selected.some(r => r.lockYn)) { message.warning('공용관리 시세정보가 선택되어 있습니다. 공용관리 대상은 삭제 불가합니다.'); return; }
    Modal.confirm({
      title: '확인', content: `${selected.length}건의 시세를 삭제하시겠습니까?`, width: 400, okText: '예', cancelText: '아니오',
      onOk: () => crud.deleteChecked(),
    });
  };

  // buildGrid() L199-229 (setChecked MULTI)
  const columnDefs = useMemo(() => [
    gb.booleanIcon('lockYn', 40, ''),                                                                           // L219 addBooleanIcon
    gb.date('stdDate', 120, '기준일', { editor: 'date' }),                                                      // L220 (UX-08: 편집 날짜 120)
    // [E8] itemTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L209) → 고른 코드를 itemType 변경으로 기록
    // L221 종목유형: 콤보 선택(Collapse L209-215)이 itemType을 바꾼다 — 이름을 고르면 코드도 같이 바꾼다
    gb.textCenter('itemTypeName', 150, '종목유형', {
      editor: 'select', values: types.map(t => t.name),
      valueSetter: (p: { data: AstPrc; newValue: string }) => {
        const c = types.find(t => t.name === p.newValue);
        p.data.itemTypeName = p.newValue;
        p.data.itemType = c ? c.code : null;
        return true;
      },
    }),
    gb.textCenter('itemCode', 150, '종목코드', { editor: 'text' }),                                             // L222
    gb.text('itemName', 350, '종목명', { editor: 'text' }),                                                     // L223
    gb.double('evalPrice', 150, '기준일 종가', { editor: 'number' }),                                           // L224
    gb.textArea('note', 300, '비고', { editor: 'largeText' }),                                                  // L225
    // [E7] grid.CellDoubleClick [colIndex == 9] (L185) → copyToClipboard(itemFullCode): 표준코드 칸을 더블클릭하면 복사
    gb.textCenter('itemFullCode', 150, '표준코드', { onCellDoubleClicked: (e: { data?: AstPrc }) => {
      if (e.data?.itemFullCode) { void navigator.clipboard?.writeText(e.data.itemFullCode); message.success(`복사완료 : ${e.data.itemFullCode}`); }
    } }),                                                                                                       // L226
  ], [types]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E3] retrieveButton[조회].Select (L160) → retrieve(), [E2] searchTextField.KeyPress [Enter] (L148) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        loading={crud.loading}
        extra={
          <>
            {/* [E4] insertRowButton[등록].Select (L166) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E5] updateButton[저장].Select (L172) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" disabled={!crud.hasChecked} onClick={deleteRow}>삭제</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            ~
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </span>
        </SearchBar.Field>
        <SearchBar.Field label="종목유형">
          {/* [E1] itemTypeComboBox.callbackOnCreate (L137) → "전체" */}
          <SystemCodeComboBox kindGroupCd="ItemMClassCode001" altCode={['%', '전체']} style={{ width: 150 }} value={itemType} onChange={c => setItemType(c ?? '%')} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="종목코드/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={holdYn} onChange={e => setHoldYn(e.target.checked)}>보유종목만 보기</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<AstPrc> crud={crud} columnDefs={columnDefs} />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={crud.loading} onChange={getPaging} />
    </div>
  );
};
