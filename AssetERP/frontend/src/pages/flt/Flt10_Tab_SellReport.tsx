/**
 * 매도 사전신고 (I04) — 준법감시 > 10. 임직원매매 > 매도 사전신고 #1127
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_SellReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L108-172: north(290) = 툴바(기준일자 · [조회][기간조회][보고주기 변경 및 서약서 서명]) + 안내 2줄(보고주기·서약서) + 계좌 그리드(920),
 *                  center = 툴바 + 사전신고 체크박스 다중 그리드(주문수량·주문총액·매매사유만 편집, 맨 아래 합계 행)
 * [등록]은 보유내역 조회창(Flt11_Lookup_BookList)에서 고른 종목마다 매도 행을 만든다
 * 1단계: [보고주기 변경 및 서약서 서명](Flt02_Lookup_Emp)은 다음 단계 (I02 E1·I03 E3과 같은 창)
 * UX보강(10): 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import type { CellClickedEvent, RowClickedEvent } from 'ag-grid-community';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltBook, FltTr, FltTrAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Flt10_Lookup_ExpectTr } from './Flt10_Lookup_ExpectTr';
import { Flt11_Lookup_BookList } from './Flt11_Lookup_BookList';

const gb = gbFor<FltTr>();
const gbAccount = gbFor<FltTrAccount>();

const BLUE = '#456EA6';
const RED = '#DD5E5E';
const DATE_FORMAT = 'YYYY-MM-DD';
const TR_TYPE = '20O';  // 매매구분 (10I 매수 / 20O 매도) - FloorTrCode

/** GXT TextField·TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

/** buildAccountGrid() — 행 하나 선택(setChecked 없음) */
const accountColumns = [
  gbAccount.textCenter('mainAccountYnStr', 60, '주계좌'),
  gbAccount.text('familyRelateName', 80, '관계'),
  gbAccount.text('corpName', 150, '개설기관'),
  gbAccount.text('accountNoDec', 250, '계좌번호'),
  gbAccount.text('accountName', 150, '계좌명'),
  gbAccount.text('itemTypeName', 150, '종목유형'),
];

interface Enabled { upd: boolean; ins: boolean; del: boolean; fix: boolean; cancel: boolean }

export const Flt10_Tab_SellReport: React.FC = () => {
  const [baseDate, setBaseDate] = useState<string>(dayjs().format(DATE_FORMAT));
  const [searchText, setSearchText] = useState('');
  // 처음 모양 = Quarterly·Finish (L92-100)
  const [checkCycle, setCheckCycle] = useState<string | null>('1');
  const [oathDone, setOathDone] = useState(true);
  const [accounts, setAccounts] = useState<FltTrAccount[]>([]);
  const [en, setEn] = useState<Enabled>({ upd: true, ins: true, del: true, fix: true, cancel: true });
  const [periodOpen, setPeriodOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState<{ accountId: number; expectDate: string } | null>(null);

  // 화면 필드 (AS-IS accountId·previousModel) — 비동기 콜백이 최신 값을 읽도록 ref로 둔다
  const baseDateRef = useRef(baseDate);
  const searchRef = useRef(searchText);
  const todayRef = useRef(dayjs().format(DATE_FORMAT));
  const onlyCurrRef = useRef(false);
  const accountIdRef = useRef<number | null>(null);
  const selAccountRef = useRef<FltTrAccount | null>(null);
  const previousRef = useRef<FltTrAccount | null>(null);
  const accountsRef = useRef<FltTrAccount[]>([]);
  const pendingSelectRef = useRef<number | null>(null);
  const accountGridRef = useRef<AgGridReact<FltTrAccount>>(null);
  searchRef.current = searchText;

  const crud = useGridCrud<FltTr>({
    idField: 'trId',
    // retrieve() L369-386: 서비스 flt.Flt10_Tr.selectByAccountId(companyId, personId, accountId, regDate=기준일자, trType "20O", searchText "%…%")
    search: useCallback(() => fltApi.searchTrs({
      trType: TR_TYPE, accountId: accountIdRef.current, regDate: baseDateRef.current, searchText: searchRef.current,
    }), []),
    // update() L388-429: GridUpdate → flt.Flt10_Tr.update
    save: rows => fltApi.updateTrs(rows.map(r => ({ ...r, itemCode: n(r.itemCode), trReason: n(r.trReason) }))),
    // 삭제는 deleteRow() → delete()로 따로 한다(체크 행 삭제 안 씀)
    remove: async () => 0,
    newRow: () => ({}),
    firstEditField: 'expectTrQty',
    // update() L388-429: 바뀐 행마다 순서대로 검사 (승인신청 포함 → 주문수량 → 음수 → 주문총액)
    validate: changed => {
      for (const m of changed) {
        if (m.statusCode) return '승인신청 내역이 포함되어있습니다';
        if (!m.expectTrQty) return '주문수량을 입력하세요';
        if (m.expectTrQty < 0) return '주문수량은 0보다 작을 수 없습니다';
        if (m.expectTrAmt == null) return '주문총액을 입력하세요';
      }
      return undefined;
    },
    reloadAfterSave: false,
  });
  const crudRef = useRef(crud);
  crudRef.current = crud;

  const retrieveTr = useCallback((accountId: number | null) => {
    accountIdRef.current = accountId;
    return crudRef.current.retrieve();
  }, []);

  // setButtonEnable() L879-885: 저장·등록·삭제·승인신청·신청취소
  const setButtonEnable = useCallback((yn: boolean) => {
    setEn({ upd: yn, ins: yn, del: yn, fix: yn, cancel: yn });
  }, []);
  // setOnlyCurr() L868-877: 소급 미사용 고객사는 당일에만 등록 가능
  const setOnlyCurr = useCallback(() => {
    if (onlyCurrRef.current) setButtonEnable(baseDateRef.current === todayRef.current);
  }, [setButtonEnable]);

  // retrieveAccount() L601-637: 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate=기준일자) → 주계좌를 고르고(없으면 첫 행) retrieve(accountId)
  const retrieveAccount = useCallback(async () => {
    let list: FltTrAccount[];
    try {
      list = await fltApi.searchTrAccounts(baseDateRef.current);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    accountsRef.current = list;
    if (list.length === 0) {
      setAccounts(list);
      return;
    }
    const pick = list.find(a => a.mainAccountYn) ?? list[0];
    selAccountRef.current = pick;
    previousRef.current = pick;
    pendingSelectRef.current = pick.accountId;
    setAccounts(list);
    void retrieveTr(pick.accountId);
  }, [retrieveTr]);

  // check() L538-599: 서비스 flt.Flt02_Emp.selectByDate(기준일자)·flt.Flt04_Oath.selectByDate(오늘) → 안내·버튼 상태, 이어서 retrieveAccount()
  const check = useCallback(async (initial = false) => {
    let st;
    try {
      st = await fltApi.getTrCheck(initial ? undefined : baseDateRef.current);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    todayRef.current = st.today;
    onlyCurrRef.current = st.fltOnlyCurrYn;
    if (initial) {
      baseDateRef.current = st.today;  // LoginUser.getToday()
      setBaseDate(st.today);
    }
    if (!st.hasEmp) {
      message.warning("[보고주기 변경 및 서약서 서명] 버튼을 클릭하여 '2. 연간투자한도 및 보고주기 설정'을 등록해 주세요");
      setButtonEnable(false);
      setCheckCycle(null);
    } else {
      setButtonEnable(true);
      setCheckCycle(st.checkCycle);
    }
    setOathDone(st.oathStatusCode === '30');
    await retrieveAccount();
  }, [retrieveAccount, setButtonEnable]);

  // [E0] 화면 열림 (생성자 L108-172) → settings(), check()
  useEffect(() => {
    void check(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] baseDate.ValueChange (L177) → setOnlyCurr()
  const changeBaseDate = (d: dayjs.Dayjs | null) => {
    if (!d) return;
    const v = d.format(DATE_FORMAT);
    baseDateRef.current = v;
    setBaseDate(v);
    setOnlyCurr();
  };

  // [E2] searchText.KeyPress [Enter] (L186) → retrieve()
  const retrieveByText = () => { void crud.retrieve(); };

  // [E5] periodRetrieveButton[기간조회].Select (L214) → lookupPeriod() L639-668: Flt10_Lookup_ExpectTr(20O, 기준일자)
  const pickPeriod = (tr: FltTr) => {
    setPeriodOpen(false);
    if (tr.regDate) {  // 기준일자 Set
      baseDateRef.current = tr.regDate;
      setBaseDate(tr.regDate);
    }
    setOnlyCurr();
    // 계좌정보 Get → Set
    const account = accountsRef.current.find(a => a.accountId === tr.accountId);
    if (account) {
      selAccountRef.current = account;
      previousRef.current = account;
      accountGridRef.current?.api?.getRowNode(String(account.accountId))?.setSelected(true);
      void retrieveTr(account.accountId);
    }
  };

  // [E6] accountGrid.RowClick (L220-257): 주계좌가 있는데 주계좌가 아닌 계좌를 누르면 확인, NO면 이전 계좌로 되돌린다
  const onAccountRowClicked = (e: RowClickedEvent<FltTrAccount>) => {
    const row = e.data;
    if (!row) return;
    selAccountRef.current = row;
    const hasMain = accountsRef.current.some(a => a.mainAccountYn);
    if (hasMain && !row.mainAccountYn) {
      // [E7] msgBox.DialogHide [YES] (L235) → retrieve(selectModel.getAccountId())
      Modal.confirm({
        title: '',
        content: '주거래계좌가 아닙니다, 계속 진행하시겠습니까?',
        width: 370,
        okText: '예',
        cancelText: '아니오',
        onOk: () => { void retrieveTr(row.accountId); },
        onCancel: () => {
          const prev = previousRef.current;
          if (!prev) return;
          selAccountRef.current = prev;
          accountGridRef.current?.api?.getRowNode(String(prev.accountId))?.setSelected(true);
          void retrieveTr(prev.accountId);
        },
      });
    } else {
      void retrieveTr(row.accountId);
    }
  };

  // [E9] insertButton[등록].Select (L276) → insertRow() L431-496: 서비스 flt.Flt01_CompanyStd.getExpectTrDate → 보유내역 팝업(Flt11_Lookup_BookList)에서 종목 선택
  const insertRow = async () => {
    const account = selAccountRef.current;
    if (account == null || account.accountId == null) {
      message.warning('먼저 계좌를 선택해주세요');
      return;
    }
    try {
      const expectDate = await fltApi.getExpectTrDate(baseDateRef.current);
      // getExpectTrDate 결과가 없으면 원본은 아무 일도 하지 않는다
      if (expectDate != null) setBookOpen({ accountId: account.accountId, expectDate });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // 보유내역 팝업 callback (L450-490): 고른 종목마다 매도 행(GridInsertRow) + addChange(주문총액 0, 주문수량 0.0) → 변경 행
  const pickBooks = (list: FltBook[]) => {
    const target = bookOpen;
    setBookOpen(null);
    if (!target) return;
    if (list.length === 0) {
      message.warning('임직원 자기매매 기준관리가 입력되어있지 않습니다. 관리자에게 문의해주세요');
      return;
    }
    crud.addRows(list.map(b => ({
      trType: TR_TYPE, trTypeName: '매도', regDate: baseDateRef.current, accountId: target.accountId, expectTrDate: target.expectDate,
      itemType: b.itemType, itemTypeName: b.itemTypeName, itemName: b.itemName, itemCode: b.itemCode,
      bookAmt: b.bookAmt, bookQty: b.bookQty, bookDays: b.bookDays, checkFundHold: b.checkFundHoldYn ? '펀드종목' : '',
      expectTrQty: 0, expectTrAmt: 0, unfillYn: false,
    })), true);
  };

  const selected = () => (crud.gridRef.current?.api?.getSelectedRows() ?? []) as FltTr[];

  // [E11] deleteButton[삭제].Select (L288) → deleteRow() L498-516 → [E16] msgBox.DialogHide [YES] (L501) → delete() L518-536
  const deleteRow = () => {
    Modal.confirm({
      title: '삭제',
      content: `${selected().length}건의 정보를 삭제하시겠습니까?`,
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: () => remove(),
    });
  };

  const remove = async () => {
    const list = selected();
    if (list.some(m => m.statusCode)) {
      message.warning('승인신청 내역이 포함되어있습니다');
      return;
    }
    if (list.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    try {
      const saved = list.map(m => m.trId).filter(id => id > 0);
      if (saved.length > 0) await fltApi.deleteTrs(saved);  // flt.Flt10_Tr.delete
      crud.removeRows(list.map(m => m.trId));
      message.success(`${list.length}건 삭제되었습니다.`);
    } catch (err) {
      message.warning(errorMessage(err, '삭제 실패'));
    }
  };

  // [E12] fixButton[승인신청].Select (L294) → fix() L670-728 → [E17] msgBox.DialogHide [YES] (L684) → retrieve()
  const fix = () => {
    if (crud.hasChanges()) {
      message.warning('저장되지 않은 내역이 존재합니다. 저장한 후 신청하세요');
      return;
    }
    const list = selected();
    if (list.length === 0) {
      message.warning('신청내역을 선택하세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `선택한 ${list.length}건의 내역을 승인 신청하시겠습니까?`,
      width: 400,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        for (const m of list) {
          if (m.statusCode) {
            message.warning(list.length === 1 ? '이미 신청된 내역입니다.' : '이미 신청된 내역이 존재합니다.');
            return;
          }
        }
        try {
          await fltApi.updateTrStatus(list.map(m => m.trId), '10');  // flt.Flt10_Tr.updateStatusCode (10:신청)
          message.success('신청이 완료되었습니다.');
          await crud.retrieve();
        } catch (err) {
          message.warning(errorMessage(err, '신청 실패'));
        }
      },
    });
  };

  // [E13] cancelButton[신청취소].Select (L300) → fixCancel() L730-797 → [E18] msgBox.DialogHide [YES] (L744) → retrieve()
  const fixCancel = () => {
    if (crud.hasChanges()) {
      message.warning('저장되지 않은 내역이 존재합니다. 저장한 후 신청하세요');
      return;
    }
    const list = selected();
    if (list.length === 0) {
      message.warning('취소내역을 선택하세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `선택한 ${list.length}건의 신청내역을 취소하시겠습니까?`,
      width: 400,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        for (const m of list) {
          if (m.statusCode == null) {
            message.warning(list.length === 1 ? '신청전 내역입니다.' : '신청전 내역이 존재합니다.');
            return;
          }
          if (m.statusCode !== '10') {
            message.warning(list.length === 1 ? `${m.statusName}된 내역입니다.` : `${m.statusName}된 내역이 존재합니다.`);
            return;
          }
        }
        try {
          await fltApi.updateTrStatus(list.map(m => m.trId), null);
          message.success('신청취소가 완료되었습니다.');
          await crud.retrieve();
        } catch (err) {
          message.warning(errorMessage(err, '신청취소 실패'));
        }
      },
    });
  };

  // [E14] unFillButton[미체결].Select (L306)·[E15] unFillCancelButton[미체결취소].Select (L312) → updateUnFill("P"/"C") L799-866 → [E19] messageBox.DialogHide (L814) → retrieve()
  const updateUnFill = (actionType: 'P' | 'C') => {
    const list = selected();
    if (list.length === 0) {
      message.warning('선택한 사전신고 내역이 없습니다');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `${list.length}${actionType === 'P' ? '건을 미체결 처리하시겠습니까?' : '건의 미체결 내역을 취소하시겠습니까?'}`,
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        for (const m of list) {
          if (m.statusCode == null || m.statusCode === '10') {
            Modal.warning({
              title: '확인',
              width: 600,
              content: <>승인 전인 신고 내역이 존재합니다.<br />** 승인 전 신고 내역은 미체결 처리하지 않아도 되며, 삭제로 정리해 주세요</>,
            });
            return;
          }
          if (m.trDate != null) {
            message.warning(`'${m.itemName}' 종목은 실거래 등록이 진행된 신고내역입니다`);
            return;
          }
          if (actionType === 'P' && m.unfillYn) {
            message.warning(`'${m.itemName}'는 미체결 처리된 종목입니다`);
            return;
          }
          if (actionType === 'C' && !m.unfillYn) {
            message.warning(`'${m.itemName}' 종목은 미체결된 신고내역이 아닙니다`);
            return;
          }
        }
        try {
          await fltApi.updateTrUnfill(list.map(m => m.trId), actionType === 'P');  // flt.Flt10_Tr.updateUnFill
          message.success(actionType === 'P' ? '처리가 완료되었습니다' : '취소가 완료되었습니다');
          await crud.retrieve();
        } catch (err) {
          message.warning(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // buildGrid() L333-362: setChecked(MULTI) + setSumGrid(7, 8, 12, 13)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '사전신고일'),
    gb.textCenter('trTypeName', 40, '구분'),
    gb.text('itemTypeName', 180, '종목유형'),
    gb.text('itemName', 180, '종목명'),
    gb.textCenter('itemCode', 100, '종목코드'),
    gb.double('bookQty', 80, '보유수량'),
    gb.long('bookAmt', 120, '보유금액'),
    gb.textCenter('bookDays', 100, '보유기간'),
    gb.textCenter('checkFundHold', 75, '펀드<br>보유종목'),
    gb.date('expectTrDate', 90, '주문유효일'),
    gb.double('expectTrQty', 80, '주문수량', { editor: 'number' }),
    gb.long('expectTrAmt', 120, '주문총액', { editor: 'number' }),
    gb.textArea('trReason', 135, '매매사유', { editor: 'largeText' }),
    // [E8] grid.CellClick (L261-274): 승인상태 열에서 승인(20)·반려(30)이면 사유를 보여 준다
    gb.textCenter('statusName', 65, '승인상태', {
      onCellClicked: (e: CellClickedEvent<FltTr>) => {
        const m = e.data;
        if (m && (m.statusCode === '20' || m.statusCode === '30')) {
          Modal.info({ title: '승인 및 반려사유', content: m.rejectReason ?? '', width: 500 });
        }
      },
    }),
    gb.booleanYn2('unfillYn', 60, '미체결'),
  ], []);

  const cycleLabel = checkCycle === '1' ? { text: '분기별', color: BLUE }
    : checkCycle === '2' ? { text: '월별', color: BLUE }
    : { text: '미지정', color: RED };
  const toolbarStyle: React.CSSProperties = { height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={310} min={260}>
          <div style={{ height: '100%', padding: '20px 20px 0', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <div style={toolbarStyle}>
                <span style={{ fontWeight: 'bold' }}>기준일자</span>
                {/* [E1] baseDate.ValueChange (L177) → setOnlyCurr() */}
                <DatePicker style={{ width: 130 }} allowClear={false} value={dayjs(baseDate)} format={DATE_FORMAT} onChange={changeBaseDate} />
                <span style={{ width: 8 }} />
                {/* [E4] retrieveButton[조회].Select (L208) → check() */}
                <Button type="search" onClick={() => check()}>조회</Button>
                {/* [E5] periodRetrieveButton[기간조회].Select (L214) → lookupPeriod() */}
                <Button type="search" onClick={() => setPeriodOpen(true)}>기간조회</Button>
                {/* [E3] openButton[보고주기 변경 및 서약서 서명].Select (L196) → Flt02_Lookup_Emp.open(→ check()): [E3 다음 단계] */}
                <Button type="download" style={{ width: 250 }} onClick={() => message.info('임직원매매 설정(보고주기·서약서) 창은 다음 단계에서 연결합니다.')}>보고주기 변경 및 서약서 서명</Button>
              </div>
              <div style={{ padding: '15px 15px 0', fontSize: 14, fontWeight: 'bold', lineHeight: '40px' }}>
                <div>* 보고주기 : <span style={{ color: cycleLabel.color }}>{cycleLabel.text}</span> (조사분석인력 및 투자운용인력은 월별점검 대상입니다)</div>
                <div>* 임직원 금융투자상품 매매 법규준수 서약서 : <span style={{ color: oathDone ? BLUE : RED }}>{oathDone ? '서명완료' : '미완료'}</span></div>
              </div>
              {/* buildAccountGrid() — 920 */}
              <div style={{ flex: 1, minHeight: 100, width: 920, margin: '0 10px 10px', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
                <SingleGrid<FltTrAccount>
                  gridRef={accountGridRef}
                  rowData={accounts}
                  columnDefs={accountColumns}
                  getRowId={p => String(p.data.accountId)}
                  onRowClicked={onAccountRowClicked}
                  onRowDataUpdated={e => {
                    const id = pendingSelectRef.current;
                    if (id != null) {
                      pendingSelectRef.current = null;
                      e.api.getRowNode(String(id))?.setSelected(true);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <div style={{ ...toolbarStyle, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Input style={{ width: 200 }} allowClear placeholder="검색어 입력 (종목명/종목코드)" value={searchText}
                    onChange={e => setSearchText(e.target.value)} onPressEnter={retrieveByText} />
                  {/* [E9] insertButton[등록].Select (L276) → insertRow() */}
                  <Button type="register" disabled={!en.ins} onClick={insertRow}>등록</Button>
                  {/* [E10] updateButton[저장].Select (L282) → update() */}
                  <Button type="save" count={crud.changes} disabled={!en.upd} onClick={crud.saveRows}>저장</Button>
                  {/* [E11] deleteButton[삭제].Select (L288) → deleteRow() */}
                  <Button type="delete" disabled={!en.del} onClick={deleteRow}>삭제</Button>
                  <span style={{ width: 8 }} />
                  {/* [E12] fixButton[승인신청].Select (L294) → fix() */}
                  <Button type="register" disabled={!en.fix} onClick={fix}>승인신청</Button>
                  {/* [E13] cancelButton[신청취소].Select (L300) → fixCancel() */}
                  <Button type="cancel" disabled={!en.cancel} onClick={fixCancel}>신청취소</Button>
                  <span style={{ fontSize: 12, fontWeight: 'bold', color: BLUE }}>&nbsp;* 승인상태의 '승인', '반려' 글씨를 클릭하여 사유를 확인하세요</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* [E14] unFillButton[미체결].Select (L306) → updateUnFill("P") */}
                  <Button type="close" onClick={() => updateUnFill('P')}>미체결</Button>
                  {/* [E15] unFillCancelButton[미체결취소].Select (L312) → updateUnFill("C") */}
                  <Button type="close" onClick={() => updateUnFill('C')}>미체결취소</Button>
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CellEditGrid<FltTr>
                  crud={crud}
                  columnDefs={columnDefs}
                  sumRow={{ labelField: 'regDate', label: '계', sum: ['bookQty', 'bookAmt', 'expectTrQty', 'expectTrAmt'] }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>

      <Flt10_Lookup_ExpectTr open={periodOpen} trType={TR_TYPE} stdDate={baseDate} onResult={pickPeriod} onClose={() => setPeriodOpen(false)} />
      <Flt11_Lookup_BookList open={bookOpen != null} accountId={bookOpen?.accountId ?? null} stdDate={baseDate} onResult={pickBooks} onClose={() => setBookOpen(null)} />
    </div>
  );
};
