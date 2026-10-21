/**
 * 권리행사/기타입출고 (I07) — 준법감시 > 10. 임직원매매 > 권리행사/기타입출고 #1372
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_RightsExercise.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L68-104: vlc = 툴바(50: 거래기간 [시작] ~ [끝] · 거래구분(전체) · 계좌(전체) · 검색 · [조회][등록][삭제]) / 권리행사 체크박스 다중 그리드(읽기 전용, 앞쪽 "변경" 아이콘)
 * [등록]·변경 아이콘은 등록·변경 창(Flt10_Lookup_RightsExercise)을 연다. 매매구분은 FloorTrCode0002 그룹
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltRightsExercise, FltTrAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Flt03_Lookup_Account } from './Flt03_Lookup_Account';
import { RightsExerciseTarget, Flt10_Lookup_RightsExercise } from './Flt10_Lookup_RightsExercise';

const gb = gbFor<FltRightsExercise>();
const DATE_FORMAT = 'YYYY-MM-DD';

export const Flt10_Tab_RightsExercise: React.FC = () => {
  // setInitData() L290-297: 조회기간 = 오늘 − 1개월의 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [trType, setTrType] = useState('%');
  const [accountName, setAccountName] = useState('전체');
  const [accountId, setAccountId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltRightsExercise[]>([]);
  const [checked, setChecked] = useState<FltRightsExercise[]>([]);
  const [acctOpen, setAcctOpen] = useState(false);
  const [target, setTarget] = useState<RightsExerciseTarget | null>(null);
  const paramRef = useRef({ startDate, closeDate, trType, accountId, searchText });
  paramRef.current = { startDate, closeDate, trType, accountId, searchText };

  // retrieve() L216-235: 서비스 flt.Flt10_Tr.selectByTrType(companyId, personId, startDate, closeDate, accountId, trType, searchText "%…%", groupTrType "FloorTrCode0002")
  const retrieve = useCallback(async (override?: { trType?: string }) => {
    const p = { ...paramRef.current, ...override };
    try {
      setRows(await fltApi.searchRightsExercises({
        trType: p.trType, accountId: p.accountId, startDate: p.startDate.format(DATE_FORMAT), closeDate: p.closeDate.format(DATE_FORMAT), searchText: p.searchText,
      }));
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L68-104) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // buildGrid() L186-214 — setChecked(MULTI), 앞쪽 "변경" 아이콘(ImageCell "Edit") → Flt10_Lookup_RightsExercise.open(row, "MODI")
  const columnDefs = useMemo(() => [
    iconCell<FltRightsExercise>('edit', 'actionCell', 50, '변경', row => setTarget({ mode: 'MODI', row })),
    gb.date('regDate', 90, '거래일'),  // 원본 100 → UX-08
    gb.text('trTypeName', 150, '거래구분'),
    gb.text('accountInfo', 280, '계좌'),
    gb.text('trItemTypeName', 180, '종목유형'),
    gb.text('trItemName', 250, '종목명'),
    gb.text('trItemCode', 100, '종목코드'),
    gb.double('trQty', 100, '수량'),
    gb.long('trAmt', 120, '금액'),
    gb.textArea('trNote', 150, '비고'),
  ], []);

  // [E1] trTypeComboBox.Collapse (L125) → retrieve()
  const onTrTypeChange = (code: string | undefined) => {
    const v = code ?? '%';
    setTrType(v);
    void retrieve({ trType: v });
  };

  // [E2] accountName.TriggerClick (L135): Flt03_Lookup_Account.openNull(종료일) — [전체]는 null → "전체"
  const pickAccount = (acc: FltTrAccount | null) => {
    setAcctOpen(false);
    setAccountName(acc ? acc.accountName ?? '' : '전체');
    setAccountId(acc ? acc.accountId : null);
  };

  // [E6] deleteButton[삭제].Select (L178) → preDelete() L246-270
  const preDelete = () => {
    const cnt = checked.length;
    if (cnt === 0) {
      message.warning('삭제할 내역을 선택하세요');
      return;
    }
    // [E7] msgBox.DialogHide [YES] (L255) → delete()
    Modal.confirm({
      title: '삭제',
      content: `선택한 ${cnt}건을 삭제하시겠습니까?`,
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: () => remove(checked),
    });
  };

  // delete() L272-288: 서비스 flt.Flt10_Tr.delete2 → "삭제가 완료되었습니다."
  const remove = async (list: FltRightsExercise[]) => {
    try {
      await fltApi.deleteRightsExercises(list.map(r => r.trId));
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
        {/* [E4] retrieveButton[조회].Select (L166) → retrieve(). [E3] searchText.KeyPress [Enter] (L157) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={(
            <>
              {/* [E5] insertButton[등록].Select (L172) → insertRow() L237-244 */}
              <Button type="register" onClick={() => setTarget({ mode: 'NEW' })}>등록</Button>
              <Button type="delete" onClick={preDelete}>삭제</Button>
            </>
          )}
        >
          <SearchBar.Field label="거래기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={DATE_FORMAT} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={DATE_FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="거래구분">
            <SystemCodeComboBox kindGroupCd="FloorTrCode0002" altCode={['%', '전체']} style={{ width: 150 }} value={trType} onChange={onTrTypeChange} />
          </SearchBar.Field>
          <SearchBar.Field label="계좌">
            <LookupInput value={accountName} width={300} onOpen={() => setAcctOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="계좌/종목유형/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FltRightsExercise>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trId)}
            onCheckedChange={setChecked}
          />
        </div>
      </div>
      <Flt03_Lookup_Account open={acctOpen} baseDate={closeDate.format(DATE_FORMAT)} withNull onResult={pickAccount} onClose={() => setAcctOpen(false)} />
      <Flt10_Lookup_RightsExercise target={target} onSaved={() => void retrieve()} onClose={() => setTarget(null)} />
    </div>
  );
};
