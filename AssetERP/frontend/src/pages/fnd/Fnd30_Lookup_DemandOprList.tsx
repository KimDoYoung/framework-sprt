/**
 * 수요예측 신청내역 조회창 (Q06) — 본 화면 Fnd30_Tab_Opr의 [등록(수요예측)]이 연다
 * AS-IS: myApp/client/vi/fnd/Fnd30_Lookup_DemandOprList.java (180줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L53: 모달 1270×400 "신청내역"(닫기(X) 없음) = 위 툴바 50(신청기간 [한 달 전 100 ~ 오늘 100] · 검색 250 "종목명" · [조회]) + 그리드(체크 단일) + 아래 가운데 [닫기]([닫기]를 누르면 부른 쪽 callback이 먼저 돈다 → 청약 목록 다시 조회)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { OprDemandOffer } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { AgGridReact } from 'ag-grid-react';
import { Fnd30_Edit_Opr, OprTarget } from './Fnd30_Edit_Opr';

const gb = gbFor<OprDemandOffer>();
const FORMAT = 'YYYY-MM-DD';
/** setChecked(SINGLE): 체크박스 단일 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** [닫기] — callback.execute() 뒤 hide() (부르는 쪽이 청약 목록을 다시 조회한다) */
  onClose: () => void;
}

export const Fnd30_Lookup_DemandOprList: React.FC<Props> = ({ open, onClose }) => {
  const gridRef = useRef<AgGridReact<OprDemandOffer>>(null);
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<OprDemandOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<OprTarget | null>(null);

  // retrieve() L155-171: fnd.Fnd30_Opr.selectByDemandOprCode(oprCode "02", 신청기간, 종목명 "%…%")
  const retrieve = useCallback(async (start: Dayjs, close: Dayjs, text: string) => {
    setLoading(true);
    try {
      setRows(await fndApi.searchDemandOffers({ startDate: start.format(FORMAT), closeDate: close.format(FORMAT), searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] open() L53-58: 열면 한 달 전 ~ 오늘로 곧바로 조회
  useEffect(() => {
    if (!open) return;
    const start = dayjs().subtract(1, 'month');
    const close = dayjs();
    setStartDate(start); setCloseDate(close); setSearchText(''); setRows([]);
    void retrieve(start, close, '');
  }, [open, retrieve]);

  // [E3] editCell (ImageCell) (L119): 결재완료(30)가 아니면 "결제완료가 안된 항목은 신청할 수 없습니다." 아니면 Fnd30_Edit_Opr.demandOprInsert(model, callback → retrieve())
  const editRow = (row: OprDemandOffer) => {
    if (row.apprStatusCode !== '30') { message.warning('결제완료가 안된 항목은 신청할 수 없습니다.'); return; }
    setTarget({ mode: 'demand', offer: row });
  };

  // buildGrid() L118-152 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.date('demandDate', 90, '신청일'),
    gb.text('itemName', 300, '종목명'),
    gb.textCenter('market', 80, '시장구분'),
    gb.text('leadManager', 180, '주간사'),
    gb.long('price', 100, '신청가격'),
    gb.text('lockPeriod', 80, '확약기간'),
    iconCell<OprDemandOffer>('edit', 'editAction', 80, '등록', editRow),
    gb.text('note', 300, '비고'),
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LookupModal
      open={open}
      title="신청내역"
      width={1270}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E4] cancleButton[닫기].Select (L82) → callback.execute(); hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10 }}>
        {/* [E1] retrieveButton[조회].Select (L76) → retrieve(), [E2] searchText.KeyPress [Enter] (L89) → retrieve() */}
        <SearchBar onSearch={() => void retrieve(startDate, closeDate, searchText)} loading={loading}>
          <SearchBar.Field label="신청기간">
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span> ~ </span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<OprDemandOffer> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.oprId)} rowSelection={SINGLE_CHECK} />
        </div>
      </div>
      <Fnd30_Edit_Opr target={target} onSaved={() => void retrieve(startDate, closeDate, searchText)} onClose={() => setTarget(null)} />
    </LookupModal>
  );
};
