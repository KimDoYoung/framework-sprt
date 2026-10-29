/**
 * 예금잔고조회 (U02) — 자금관리 > 10. 자금관리 > 예금잔고조회 #1238 (같은 클래스: 고유자산 > 40. 예금관리 > 예금잔고조회 #1471)
 * AS-IS: myApp/client/vi/ast/Ast09_Tab_DepositBookPeriod.java (275줄) + Ast01_Lookup_CorpAccount.java (224줄, 계좌선택 창) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-98: BorderLayout 가운데(여백 20, 테두리) = 툴바 50(조회일자 100 ~ 100 · 계좌 250 "전체" · 검색 200 "구분/계좌" · [조회] · [예금잔고정리]) + 예금잔고 그리드(행번호, 단일 선택)
 * 계정별원장 아이콘(L168-180)은 메뉴 1150(Act02_Tab_JournalSub, 다른 도메인 act)을 열고 고른 행을 넘긴다 — 받는 화면이 아직 없어 열기와 값 보내기까지만(다음 단계).
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04), 날짜 열 폭(UX-08)
 * 스타일: SG (견본 — docs/page-style.md)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstBookPeriod, AstCorpAccount } from '@/types/ast';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { openMenuByNo, TempData } from '@/utils/tempData';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';

const gb = gbFor<AstBookPeriod>();
const FORMAT = 'YYYY-MM-DD';
const ALL = '전체';
/** 계정별원장 메뉴 화면번호 (Act02_Tab_JournalSub) */
const JOURNAL_SUB_MENU_NO = '1150';

export const Ast09_Tab_DepositBookPeriod: React.FC = () => {
  // settings() L100-165: 조회일자 = 오늘 ~ 오늘(100), 계좌 250 "전체", 검색 200 "구분/계좌"
  const sp = useSearchParams(() => ({ startDate: dayjs(), closeDate: dayjs(), depositId: null as number | null, depositName: ALL, searchText: '' }));
  const { startDate, closeDate, depositName, searchText } = sp.values;
  const [rows, setRows] = useState<AstBookPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // retrieve() L198-226: ast.Ast09_Book.selectByHoldDatePeriod(companyId, personId, windowClassName, startDate, closeDate, depositIdStr = 계좌 ID 또는 "%", astType "1", searchText = "%글자%")
  //   → 서버가 내 sys99_print 자료를 다시 만들고 읽는다. 첫 행이 있으면 첫 행 선택(AS-IS select(0)) — 선택은 화면에 보이기만 하고 동작은 없다
  const retrieve = async () => {
    const v = sp.current.current;
    setLoading(true);
    try {
      setRows(await astApi.searchDepositsPeriod(v.startDate.format(FORMAT), v.closeDate.format(FORMAT), v.depositId, v.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L64-98) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] depositName.TriggerClick (L122) → Ast01_Lookup_CorpAccount.open(조회일자 시작, callback): 고른 계좌가 있으면 계좌 ID·이름, 없으면(전체) ID 비우고 "전체"
  const onAccountResult = (r: AstCorpAccount | null) => {
    setAccountOpen(false);
    if (r) {
      sp.set('depositId', r.classTreeId);
      sp.set('depositName', r.corpAccountName ?? '');
    } else {
      sp.set('depositId', null);
      sp.set('depositName', ALL);
    }
  };

  // [E4] depositButton[예금잔고정리].Select (L159) → depositUpdate() L228-269: 확인(400폭) "잔고정리를 시작하시겠습니까? (정리기간 : 조회일자 시작 ~ 오늘)"
  //   → [E5] msgBox.DialogHide [YES] (L234) → ast.Ast09_Book.createDepositBook(companyId, stdDate = 조회일자 시작) → 성공이면 "예금잔고정리가 정상적으로 처리되었습니다." 뒤 retrieve(), 실패면 서버 메시지
  const depositUpdate = () => {
    const std = sp.current.current.startDate;
    Modal.confirm({
      title: '확인',
      content: <>잔고정리를 시작하시겠습니까? <br />(정리기간 : {std.format(FORMAT)} ~ {dayjs().format(FORMAT)})</>,
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        setLoading(true);
        try {
          await astApi.cleanDepositBook(std.format(FORMAT));
          message.info('예금잔고정리가 정상적으로 처리되었습니다.');
          await retrieve();
        } catch (err) {
          setLoading(false);
          Modal.info({ title: '알림', content: errorMessage(err, '예금잔고정리 실패'), okText: '확인' });
        }
      },
    });
  };

  // buildGrid() L167-196: actionCell [계정별원장] L168-180 → MenuOpener.openTabCallback(MenuGrid.tabPanel, "1150", result → Act02_Tab_JournalSub.retrieveCall(고른 행))
  const openJournalSub = (row: AstBookPeriod) => {
    if (!openMenuByNo(JOURNAL_SUB_MENU_NO)) {
      message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.');
      return;
    }
    TempData.publish('act.journalSub', row);
  };

  const columnDefs = useMemo(() => [
    gb.date('holdDate', 90, '보유일자'),  // L185 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.textCenter('astSClassName', 180, '구분'),  // L186
    gb.text('keepCorpAccountName', 300, '계좌'),  // L187
    gb.textCenter('curCode', 70, '통화'),  // L188
    gb.double('forBookAmt', 150, '통화기준 잔액'),  // L189
    gb.double('forDiffAmt', 150, '통화기준 증감액'),  // L190
    gb.long('bookAmt', 150, '원화 잔액'),  // L191
    gb.double('diffAmt', 150, '원화 증감액'),  // L192
    iconCell<AstBookPeriod>('view', 'actionCell', 60, '계정별원장', openJournalSub),  // L193
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L153) → retrieve(), [E2] searchText.KeyPress [Enter] (L144) → retrieve() */}
        <SearchBar onSearch={retrieve} onReset={sp.reset} loading={loading} extra={<Button type="view" onClick={depositUpdate}>예금잔고정리</Button>}>
          <SearchBar.Field label="조회일자">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && sp.set('startDate', d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && sp.set('closeDate', d)} />
          </SearchBar.Field>
          <SearchBar.Field label="계좌">
            <LookupInput value={depositName} empty={[ALL]} width={250} onOpen={() => setAccountOpen(true)}
              onClear={() => { sp.set('depositId', null); sp.set('depositName', ALL); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="구분/계좌" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstBookPeriod> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.bookId)} loading={loading} />
        </div>
      </div>
      <Ast01_Lookup_CorpAccount open={accountOpen} stdDate={startDate} onResult={onAccountResult} onClose={() => setAccountOpen(false)} />
    </div>
  );
};
