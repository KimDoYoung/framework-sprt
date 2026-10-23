/**
 * (s)이익제공입력(현금,물품) (L10) — 준법감시 > 40. 이익제공(수령)현황 > (s)이익제공입력(현금,물품) #1320
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_OtherSimple.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-92: center = 툴바(조회기간 ~ · 제공/수령 · [조회][등록][삭제]) + 내역 그리드(단일 선택), east 420 = `Biz01_Edit_OtherSimple`(전체 높이)
 *   L03 `Biz01_Tab_Other`의 간이판 — 거래처 관리 바로가기·인원 칸이 없고, 그리드에 거래상대방·인원(직접 입력값)이 있다. 같은 서버 조회(selectByOther)·삭제(Biz01_Promo.delete)를 쓴다.
 * 아직 저장하지 않은 새 행은 promoId가 음수(임시)이고 서버에 없다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 그리드 날짜 폭(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizPromoApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizPromoOther } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Biz01_Edit_OtherSimple } from './Biz01_Edit_OtherSimple';

const gb = gbFor<BizPromoOther>();

export const Biz01_Tab_OtherSimple: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizPromoOther>>(null);
  // setting() L94-138: 조회기간 = 이번 달 1일 ~ 말일, 제공/수령 빈칸 = "전체"
  const sp = useSearchParams(() => {
    const start = dayjs().startOf('month');
    return { startDate: start, closeDate: start.add(1, 'month').subtract(1, 'day'), provideRcv: undefined as string | undefined };
  });
  const { startDate, closeDate, provideRcv } = sp.values;

  const [rows, setRows] = useState<BizPromoOther[]>([]);
  const [afterLoad, setAfterLoad] = useState(0);
  const [current, setCurrent] = useState<BizPromoOther | null>(null);
  // num: 마지막으로 고른 행 번호 (retrieve 뒤 선택 규칙에 쓴다)
  const num = useRef(0);
  // 새 행의 임시 번호 (서버 번호는 항상 양수)
  const tempId = useRef(0);

  // retrieve() L169-198: 서비스 biz.Biz01_Promo.selectByOther(companyId, personId, startDate, closeDate, provideRcvType = 구분 코드 또는 '%')
  //   목록을 다시 읽으면 선택이 풀린다(저장 전 새 행도 사라진다). 첫 행이 있고 num == 0이면 첫 행을 고르고, 아니면 num 행에 포커스만 둔다
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      const list = await bizPromoApi.searchOthers(v.startDate.format('YYYY-MM-DD'), v.closeDate.format('YYYY-MM-DD'), v.provideRcv ?? '%');
      gridRef.current?.api?.deselectAll();
      setCurrent(null);
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
      api.setFocusedCell(i, 'provideRcvTypeName');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E0] 화면 열림 (생성자 L55-92) → setting(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] grid.SelectionChanged [선택>0] (L112) → retrieveTabpage() L157-167: 편집 칸을 켜고 고른 내역을 넘긴다. num = 그 행 번호
  const onSelect = (row: BizPromoOther | undefined) => {
    if (!row) return;
    num.current = Math.max(0, rows.findIndex(r => r.promoId === row.promoId));
    setCurrent(row);
  };

  // [E3] insertButton[등록].Select (L126) → insertRow() L200-208: 정산구분 2·등록자·회사를 넣은 새 모델을 그리드 맨 아래에 넣고 고른다 (서버에는 [저장]에서)
  const insertRow = () => {
    const id = --tempId.current;
    const row: BizPromoOther = {
      promoId: id, provideRcvType: null, provideRcvTypeName: null, provideDate: null, providePurCode: null, providePurName: null,
      provideContentCode: null, provideContentName: null, provideAmt: null, totalPeple: null, averagePrice: null, note: null,
      provideCompany: null, pepleCount: null, averagePrice2: null,
    };
    setRows(prev => [...prev, row]);
    setTimeout(() => {
      const api = gridRef.current?.api;
      const node = api?.getRowNode(String(id));
      if (!api || !node) return;
      node.setSelected(true);
      if (node.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // [E4] deleteButton[삭제].Select (L132) → deleteRow() L210-231: "확인"/"해당 정보를 삭제하시겠습니까?"(폭 350)
  //   → [E5] msgBox.DialogHide [YES] (L213) → 서비스 biz.Biz01_Promo.delete (인원 삭제 → 내역 삭제)
  const deleteRow = () => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인',
      content: '해당 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          const ids = selected.map(r => r.promoId).filter(id => id > 0);
          if (ids.length > 0) {
            const n = await bizPromoApi.deleteOthers(ids);
            message.success(`${n}건 삭제되었습니다.`);
          }
          // 저장 전 새 행은 서버에 없으니 목록에서만 뺀다
          const gone = new Set(selected.map(r => r.promoId));
          setRows(prev => prev.filter(r => !gone.has(r.promoId)));
          setCurrent(null);
          num.current = 0;
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L140-155
  const columnDefs = useMemo(() => [
    gb.textCenter('provideRcvTypeName', 120, '제공/수령'),  // L144
    gb.date('provideDate', 90, '제공(수령)일자'),  // L145 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.textCenter('providePurName', 120, '목적'),  // L146
    gb.textCenter('provideContentName', 120, '내역'),  // L147
    gb.long('provideAmt', 100, '경제적가치'),  // L148
    gb.text('provideCompany', 150, '거래상대방'),  // L149
    gb.longCenter('pepleCount', 80, '인원'),  // L150
    gb.long('averagePrice2', 120, '인당 경제적가치'),  // L151
    gb.text('note', 300, '비고'),  // L152
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel min={600}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <div style={{ padding: 10 }}>
              {/* [E2] retrieveButton[조회].Select (L120) → retrieve() */}
              {/* UX-02 초기화는 뺀다: 조건 2개 뒤에 원본 버튼이 셋(조회·등록·삭제)이라 한 줄에 담기지 않을 수 있다(줄바꿈이면 넣지 않는 규칙, L03과 같음) */}
              <SearchBar
                onSearch={retrieve}
                extra={(
                  <>
                    <Button type="register" onClick={insertRow}>등록</Button>
                    <Button type="delete" onClick={deleteRow}>삭제</Button>
                  </>
                )}
              >
                <SearchBar.Field label="조회기간">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
                  <span>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
                </SearchBar.Field>
                <SearchBar.Field label="제공/수령">
                  <SystemCodeComboBox
                    kindCd="ProvideRcvType"
                    style={{ width: 100 }}
                    placeholder="전체"
                    value={provideRcv}
                    onChange={code => sp.set('provideRcv', code)}
                  />
                </SearchBar.Field>
              </SearchBar>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<BizPromoOther>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.promoId)}
                onSelect={onSelect}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={420} min={300}>
          <Biz01_Edit_OtherSimple promo={current} onSaved={() => void retrieve()} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
