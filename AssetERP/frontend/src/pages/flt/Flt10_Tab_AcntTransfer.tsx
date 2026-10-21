/**
 * 계좌대체 (I06) — 준법감시 > 10. 임직원매매 > 계좌대체 #1371
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_AcntTransfer.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L62-95: vlc = 툴바(50: 조회기간 [시작] ~ [끝] · 계좌(전체) · 검색 · [조회][등록][삭제]) / 계좌대체 체크박스 다중 그리드(읽기 전용, 맨 끝 "변경" 아이콘)
 * [등록]·변경 아이콘은 등록·변경 창(Flt10_Lookup_AcntTransfer)을 연다. 매매구분은 FloorTrCode0003(30N)
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltAcntTransfer, FltTrAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Flt03_Lookup_Account } from './Flt03_Lookup_Account';
import { AcntTransferTarget, Flt10_Lookup_AcntTransfer } from './Flt10_Lookup_AcntTransfer';

const gb = gbFor<FltAcntTransfer>();
const DATE_FORMAT = 'YYYY-MM-DD';

export const Flt10_Tab_AcntTransfer: React.FC = () => {
  // setInitData() L257-264: 조회기간 = 오늘 − 1개월의 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [accountName, setAccountName] = useState('전체');
  const [accountId, setAccountId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltAcntTransfer[]>([]);
  const [checked, setChecked] = useState<FltAcntTransfer[]>([]);
  const [acctOpen, setAcctOpen] = useState(false);
  const [target, setTarget] = useState<AcntTransferTarget | null>(null);
  const paramRef = useRef({ startDate, closeDate, accountId, searchText });
  paramRef.current = { startDate, closeDate, accountId, searchText };

  // retrieve() L185-203: 서비스 flt.Flt10_Tr.selectByTrType(companyId, personId, startDate, closeDate, accountId, searchText "%…%", groupTrType "FloorTrCode0003")
  const retrieve = useCallback(async () => {
    const p = paramRef.current;
    try {
      setRows(await fltApi.searchAcntTransfers({
        accountId: p.accountId, startDate: p.startDate.format(DATE_FORMAT), closeDate: p.closeDate.format(DATE_FORMAT), searchText: p.searchText,
      }));
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L62-95) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // buildGrid() L157-183 — setChecked(MULTI), 맨 끝 "변경" 아이콘(ImageCell "Edit") → Flt10_Lookup_AcntTransfer.open(row, "MODI")
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '대체일'),  // 원본 100 → UX-08
    gb.text('trItemTypeName', 150, '종목유형'),
    gb.text('trItemName', 200, '종목명'),
    gb.double('trQty', 80, '수량'),
    gb.long('trAmt', 120, '금액'),
    gb.text('outAccountInfo', 300, '출고계좌'),
    gb.text('accountInfo', 300, '입고계좌'),
    iconCell<FltAcntTransfer>('edit', 'actionCell', 50, '변경', row => setTarget({ mode: 'MODI', row })),
  ], []);

  // [E1] accountName.TriggerClick (L106): Flt03_Lookup_Account.openNull(종료일) — [전체]는 null → "전체"
  const pickAccount = (acc: FltTrAccount | null) => {
    setAcctOpen(false);
    setAccountName(acc ? acc.accountName ?? '' : '전체');
    setAccountId(acc ? acc.accountId : null);
  };

  // [E5] deleteButton[삭제].Select (L149) → preDelete() L215-239
  const preDelete = () => {
    const cnt = checked.length;
    if (cnt === 0) {
      message.warning('삭제할 내역을 선택하세요');
      return;
    }
    // [E6] msgBox.DialogHide [YES] (L224) → delete()
    Modal.confirm({
      title: '삭제',
      content: `선택한 ${cnt}건을 삭제하시겠습니까?`,
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: () => remove(checked),
    });
  };

  // delete() L241-255: 서비스 flt.Flt10_Tr.delete2 → "삭제가 완료되었습니다."
  const remove = async (list: FltAcntTransfer[]) => {
    try {
      await fltApi.deleteAcntTransfers(list.map(r => r.trId));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
      return;
    }
    message.success('삭제가 완료되었습니다.');
    await retrieve();
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L137) → retrieve(). [E2] searchText.KeyPress [Enter] (L128) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          extra={(
            <>
              {/* [E4] insertButton[등록].Select (L143) → insertLookup() L205 */}
              <Button type="register" onClick={() => setTarget({ mode: 'NEW' })}>등록</Button>
              <Button type="delete" onClick={preDelete}>삭제</Button>
            </>
          )}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={DATE_FORMAT} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={DATE_FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="계좌">
            <LookupInput value={accountName} width={350} onOpen={() => setAcctOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="계좌/종목유형/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FltAcntTransfer>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trId)}
            onCheckedChange={setChecked}
          />
        </div>
      </div>
      <Flt03_Lookup_Account open={acctOpen} baseDate={closeDate.format(DATE_FORMAT)} withNull onResult={pickAccount} onClose={() => setAcctOpen(false)} />
      <Flt10_Lookup_AcntTransfer target={target} onSaved={() => void retrieve()} onClose={() => setTarget(null)} />
    </div>
  );
};
