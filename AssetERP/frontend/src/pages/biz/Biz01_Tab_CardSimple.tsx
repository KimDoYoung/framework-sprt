/**
 * (s)이익제공입력(카드) (L09) — 준법감시 > 40. 이익제공(수령)현황 > (s)이익제공입력(카드) #1319
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_CardSimple.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L57-93: center = 툴바(승인기간 ~ · 검색 300 · [조회] · [일괄저장]) + 카드 사용내역 그리드(체크박스 다중), east 420 = `Biz01_Edit_CardSimple`(전체 높이)
 *   L02 `Biz01_Tab_Card`의 간이판 — 출력/다운로드·거래처 바로가기·문서분류·상신·인원 칸이 없고, 그리드에 카드명 대신 거래상대방이 있다.
 *   서버 조회(selectByCard)·마감 검사(closeCheck)·일괄 저장 창(Biz01_Lookup_CardManagement)은 L02와 같은 것을 menuName만 달리해 쓴다
 * 스타일: SGHF (docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04), 그리드 날짜 폭(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizPromoApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizPromoCard } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';
import { Biz01_Edit_CardSimple } from './Biz01_Edit_CardSimple';
import { Biz01_Lookup_CardManagement } from './Biz01_Lookup_CardManagement';

const gb = gbFor<BizPromoCard>();

const fmtDate = (d: Dayjs) => d.format('YYYY-MM-DD');

export const Biz01_Tab_CardSimple: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizPromoCard>>(null);
  // setting() L95-139: 승인기간 = 지난달 1일 ~ 지난달 말일
  const sp = useSearchParams(() => {
    const start = dayjs().subtract(1, 'month').startOf('month');
    return { startDate: start, closeDate: start.endOf('month'), searchText: '' };
  });
  const { startDate, closeDate, searchText } = sp.values;

  const [rows, setRows] = useState<BizPromoCard[]>([]);
  const [afterLoad, setAfterLoad] = useState(0);
  const [checked, setChecked] = useState<BizPromoCard[]>([]);
  const [current, setCurrent] = useState<BizPromoCard | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  // num: 마지막으로 클릭한 행 번호 (retrieve 뒤 선택 규칙에 쓴다)
  const num = useRef(0);

  // retrieve() L176-197: 서비스 biz.Biz01_Promo.selectByCard(companyId, personId, startDate, closeDate, searchText = '%…%') → 목록을 다시 읽으면 선택이 풀린다.
  //   첫 행이 있고 num == 0이면 첫 행을 고르고, 아니면 num 행에 포커스만 둔다
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      const list = await bizPromoApi.searchCards(fmtDate(v.startDate), fmtDate(v.closeDate), v.searchText);
      gridRef.current?.api?.deselectAll();
      setChecked([]);
      setRows(list);
      setAfterLoad(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp]);

  // 목록이 바뀐 뒤(afterLoad) 선택 규칙 적용
  useEffect(() => {
    if (afterLoad === 0) return;
    const api = gridRef.current?.api;
    if (!api || rows.length === 0) return;
    if (num.current === 0) {
      api.getRowNode(String(rows[0].promoId))?.setSelected(true);
    } else {
      const i = Math.min(num.current, rows.length - 1);
      api.ensureIndexVisible(i);
      api.setFocusedCell(i, 'closeName');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E0] 화면 열림 (생성자 L57-93) → setting(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] grid.RowClick (L112) → retrieveTabpage() L161-174: 편집 칸을 켜고 마감이면 콤보를 잠그고(setButtonVisible(!closeYn)) 고른 내역을 넘긴다. num = 그 행 번호
  const retrieveTabpage = useCallback((row: BizPromoCard) => {
    const i = rows.findIndex(r => r.promoId === row.promoId);
    num.current = i < 0 ? 0 : i;
    setCurrent(row);
  }, [rows]);

  // [E4] selectUpdateButton[일괄저장].Select (L132) → closeCheck() L211-238: 선택 없음 "선택된 내역이 없습니다." → 서비스 biz.Biz01_Promo.closeCheck(고른 내역들)
  //   마감이 있으면 "마감된 내역이 있습니다. 다시 확인바랍니다." → 없으면 openLookupAccount() L200-209
  const selectUpdate = async () => {
    if (checked.length === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    try {
      if (await bizPromoApi.hasClosed(checked.map(r => r.promoId))) {
        message.warning('마감된 내역이 있습니다. 다시 확인바랍니다.');
        return;
      }
      setAccountOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '마감 확인 실패'));
    }
  };

  // buildGrid() L141-159
  const columnDefs = useMemo(() => [
    gb.textCenter('closeName', 70, '마감구분'),  // L146
    gb.date('approvalDt', 90, '카드승인일'),  // L147 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.text('franchiseName', 200, '가맹점명'),  // L148
    gb.text('sectorName', 150, '업종'),  // L149
    gb.long('approvalAmount', 100, '승인금액'),  // L150
    gb.textCenter('providePurName', 100, '제공목적'),  // L151
    gb.textCenter('provideContentName', 100, '제공내역'),  // L152
    gb.text('provideCompany', 150, '거래상대방'),  // L153
    gb.longCenter('pepleCount', 70, '인원'),  // L154
    gb.long('averagePrice2', 100, '인당 경제적가치'),  // L155
    gb.text('note', 300, '비고'),  // L156
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel min={600}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ padding: '0 10px 10px 10px' }}>
              {/* [E2] retrieveButton[조회].Select (L118) → retrieve() · [E3] searchTextField.KeyPress [Enter] (L124) → retrieve() */}
              <SearchBar onSearch={retrieve} onReset={sp.reset} extra={<Button type="save" onClick={selectUpdate}>일괄저장</Button>}>
                <SearchBar.Field label="승인기간">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
                  <span>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 300 }} value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <MultiGrid<BizPromoCard>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.promoId)}
                onCheckedChange={setChecked}
                onRowClicked={e => { if (e.data) retrieveTabpage(e.data); }}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={420} min={300}>
          <Biz01_Edit_CardSimple promo={current} closed={!!current?.closeYn} onSaved={() => void retrieve()} />
        </Splitter.Panel>
      </Splitter>
      <Biz01_Lookup_CardManagement open={accountOpen} rows={checked} menuName="Biz01_Tab_CardSimple" onSaved={() => void retrieve()} onClose={() => setAccountOpen(false)} />
    </div>
  );
};
