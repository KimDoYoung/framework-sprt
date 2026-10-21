/**
 * 매수 사전신고 (I03) — 준법감시 > 10. 임직원매매 > 매수 사전신고 #1126
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_BuyReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L131-212: north(330) = 툴바(기준일자 · [조회][기간조회][보고주기 변경 및 서약서 서명]) + 안내 3줄(보고주기·서약서·연간 추가 투자한도)
 *                  + 계좌 그리드(750) | 투자한도 그리드(780) + 안내 한 줄, center = 툴바 + 사전신고 체크박스 다중 셀 편집 그리드(맨 아래 합계 행)
 * 1단계: [보고주기 변경 및 서약서 서명](Flt02_Lookup_Emp)은 다음 단계 (I02 E1·I01 link01·02와 같은 창)
 * UX보강(10): 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, DatePicker, Input, message, Modal, Space, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import type { CellClickedEvent, RowClickedEvent } from 'ag-grid-community';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltInvestLimit, FltItemTypeCode, FltTr, FltTrAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Com50_Lookup_StkItem } from '@/components/lookup/Com50_Lookup_StkItem';
import { Flt10_Lookup_ExpectTr } from './Flt10_Lookup_ExpectTr';
import { Flt10_Lookup_Item } from './Flt10_Lookup_Item';

const gb = gbFor<FltTr>();
const gbAccount = gbFor<FltTrAccount>();
const gbLimit = gbFor<FltInvestLimit>();

const BLUE = '#456EA6';
const RED = '#DD5E5E';
const DATE_FORMAT = 'YYYY-MM-DD';
const TR_TYPE = '10I';  // 매매구분 (10I 매수 / 20O 매도) - FloorTrCode

/** GXT TextField·TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);
const num = (v: number | null | undefined) => v ?? 0;

/** buildAccountGrid() — 행 하나 선택(setChecked 없음) */
const accountColumns = [
  gbAccount.textCenter('mainAccountYnStr', 60, '주계좌'),
  gbAccount.text('familyRelateName', 70, '관계'),
  gbAccount.text('corpName', 100, '개설기관'),
  gbAccount.text('accountNoDec', 200, '계좌번호'),
  gbAccount.text('accountName', 100, '계좌명'),
  gbAccount.text('itemTypeName', 130, '종목유형'),
];

/** buildLimitGrid() — 행번호 숨김 */
const limitColumns = [
  gbLimit.textCenter('checkTypeName', 200, '구분'),
  gbLimit.long('yearInvestLimit', 110, '연간 투자금액'),
  gbLimit.long('totalInvestAmt', 110, '총누적 투자금액'),
  gbLimit.double('turnoverRate', 110, '월매매회전율(%)'),
  gbLimit.long('monthBuyCount', 110, '월매수주문횟수'),
  gbLimit.long('dayBuyCount', 110, '일매수주문횟수'),
];

interface Enabled { upd: boolean; ins: boolean; del: boolean; fix: boolean; cancel: boolean }

export const Flt10_Tab_BuyReport: React.FC = () => {
  const [baseDate, setBaseDate] = useState<string>(dayjs().format(DATE_FORMAT));
  const [searchText, setSearchText] = useState('');
  // 처음 모양 = Quarterly·Finish·SalaryLimit·limitNotice1 (L106-122)
  const [checkCycle, setCheckCycle] = useState<string | null>('1');
  const [oathDone, setOathDone] = useState(true);
  const [yearLimit, setYearLimit] = useState<number | null>(null);
  const [calcTarget, setCalcTarget] = useState<string | null>(null);
  const [limitRows, setLimitRows] = useState<FltInvestLimit[]>([]);
  const [accounts, setAccounts] = useState<FltTrAccount[]>([]);
  const [itemTypes, setItemTypes] = useState<FltItemTypeCode[]>([]);
  const [en, setEn] = useState<Enabled>({ upd: true, ins: true, del: true, fix: true, cancel: true });
  const [periodOpen, setPeriodOpen] = useState(false);
  const [itemLookup, setItemLookup] = useState<{ row: FltTr; text: string | null } | null>(null);
  const [stkLookup, setStkLookup] = useState<{ row: FltTr; text: string | null } | null>(null);

  // 화면 필드 (AS-IS accountId·investAmtCalcTargetCode·investAmtOverCheckYn·previousModel) — 비동기 콜백이 최신 값을 읽도록 ref로 둔다
  const baseDateRef = useRef(baseDate);
  const searchRef = useRef(searchText);
  const todayRef = useRef(dayjs().format(DATE_FORMAT));
  const onlyCurrRef = useRef(false);
  const accountIdRef = useRef<number | null>(null);
  const selAccountRef = useRef<FltTrAccount | null>(null);
  const previousRef = useRef<FltTrAccount | null>(null);
  const accountsRef = useRef<FltTrAccount[]>([]);
  const limitRef = useRef<FltInvestLimit[]>([]);
  const calcTargetRef = useRef<string | null>(null);
  const overCheckRef = useRef<boolean | null>(null);
  const pendingSelectRef = useRef<number | null>(null);
  const accountGridRef = useRef<AgGridReact<FltTrAccount>>(null);
  searchRef.current = searchText;

  const crud = useGridCrud<FltTr>({
    idField: 'trId',
    // retrieve() L551-568: 서비스 flt.Flt10_Tr.selectByAccountId(companyId, personId, accountId, regDate=기준일자, trType "10I", searchText "%…%")
    search: useCallback(() => fltApi.searchTrs({
      trType: TR_TYPE, accountId: accountIdRef.current, regDate: baseDateRef.current, searchText: searchRef.current,
    }), []),
    // update() L689-703: GridUpdate → flt.Flt10_Tr.update (preUpdate()에서 검사한 뒤 부른다)
    save: rows => fltApi.updateTrs(rows.map(r => ({ ...r, itemCode: n(r.itemCode), trReason: n(r.trReason) }))),
    // 삭제는 deleteRow() → delete()로 따로 한다(체크 행 삭제 안 씀)
    remove: async () => 0,
    newRow: () => ({}),
    firstEditField: 'itemTypeName',
    reloadAfterSave: false,
  });
  const crudRef = useRef(crud);
  crudRef.current = crud;

  const retrieveTr = useCallback((accountId: number | null) => {
    accountIdRef.current = accountId;
    return crudRef.current.retrieve();
  }, []);

  // setButtonEnable() L873-881: 소급 미사용 회사이고 기준일이 오늘이 아니면 저장·등록·삭제를 막는다
  const setButtonEnable = useCallback((yn: boolean) => {
    const ok = onlyCurrRef.current && baseDateRef.current !== todayRef.current ? false : yn;
    setEn(prev => ({ ...prev, upd: ok, ins: ok, del: ok }));
  }, []);
  // setButtonEnable2() L883-889: 저장·등록·삭제·승인신청·신청취소
  const setButtonEnable2 = useCallback((yn: boolean) => {
    setEn({ upd: yn, ins: yn, del: yn, fix: yn, cancel: yn });
  }, []);
  // setOnlyCurr() L891-900: 소급 미사용 고객사는 당일에만 등록 가능
  const setOnlyCurr = useCallback(() => {
    if (onlyCurrRef.current) setButtonEnable2(baseDateRef.current === todayRef.current);
  }, [setButtonEnable2]);

  // retrieveLimit() L902-939: 서비스 flt.Flt10_Tr.selectInvestLimit(companyId, personId, stdDate=기준일자)
  const retrieveLimit = useCallback(async () => {
    let rows: FltInvestLimit[];
    try {
      rows = await fltApi.getInvestLimit(baseDateRef.current);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    limitRef.current = rows;
    setLimitRows(rows);
    // 투자금액 계산대상이 매매금액이면서 초과체크 대상인 경우..
    if (overCheckRef.current && calcTargetRef.current === '1' && rows.length >= 2) {
      const yearInvestLimit = rows[0].yearInvestLimit;
      const yearInvestAmt = rows[1].yearInvestLimit;
      if (!yearInvestLimit) {
        message.warning('연간 투자한도금액을 등록하세요');
        setButtonEnable(false);
      } else if (yearInvestLimit < num(yearInvestAmt)) {
        message.warning('연간 투자금액을 초과하였습니다');
        setButtonEnable(false);
      } else {
        const totalInvestLimit = rows[0].totalInvestAmt;
        const totalInvestAmt = rows[1].totalInvestAmt;
        if (!totalInvestLimit) {
          message.warning('총누적 투자한도금액이 등록되어 있지 않습니다');
          setButtonEnable(false);
        } else if (totalInvestLimit < num(totalInvestAmt)) {
          message.warning('총누적 투자금액을 초과하였습니다');
          setButtonEnable(false);
        }
      }
    }
  }, [setButtonEnable]);

  // retrieveAccount() L941-977: 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate=기준일자) → 주계좌를 고르고(없으면 첫 행) retrieve(accountId)
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

  // check() L790-871: 서비스 flt.Flt02_Emp.selectByDate(기준일자)·flt.Flt04_Oath.selectByDate(오늘) → 안내·버튼 상태, 이어서 retrieveLimit()·retrieveAccount()
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
      fltApi.searchItemTypeCodes(st.today).then(setItemTypes).catch(() => {});  // buildGrid() L394 종목유형 콤보(startDate = 오늘)
    }
    let cycle: string | null;
    if (!st.hasEmp) {
      message.warning("[보고주기 변경 및 서약서 서명] 버튼을 클릭하여 '2. 연간투자한도 및 보고주기 설정'을 등록해 주세요");
      setButtonEnable2(false);
      cycle = null;
    } else {
      setButtonEnable2(true);
      cycle = st.checkCycle;
    }
    setCheckCycle(cycle);
    setYearLimit(st.hasEmp ? st.yearInvestLimit : null);
    if (st.hasEmp && st.yearInvestLimit != null && cycle != null) setButtonEnable(true);
    setCalcTarget(st.investAmtCalcTargetCode);
    calcTargetRef.current = st.investAmtCalcTargetCode;
    overCheckRef.current = st.investAmtOverCheckYn;
    setOathDone(st.oathStatusCode === '30');
    await retrieveLimit();
    await retrieveAccount();
  }, [retrieveLimit, retrieveAccount, setButtonEnable, setButtonEnable2]);

  // [E0] 화면 열림 (생성자 L131-212) → settings(), check()
  useEffect(() => {
    void check(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] baseDate.ValueChange (L217) → setOnlyCurr()
  const changeBaseDate = (d: dayjs.Dayjs | null) => {
    if (!d) return;
    const v = d.format(DATE_FORMAT);
    baseDateRef.current = v;
    setBaseDate(v);
    setOnlyCurr();
  };

  // [E2] searchText.KeyPress [Enter] (L226) → retrieve()
  const retrieveByText = () => { void crud.retrieve(); };

  // [E5] periodRetrieveButton[기간조회].Select (L254) → lookupPeriod() L979-1009: Flt10_Lookup_ExpectTr(10I, 기준일자)
  const pickPeriod = (tr: FltTr) => {
    setPeriodOpen(false);
    if (tr.regDate) {  // 기준일자 Set
      baseDateRef.current = tr.regDate;
      setBaseDate(tr.regDate);
    }
    void retrieveLimit();
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

  // [E13] accountGrid.RowClick (L303-340): 주계좌가 있는데 주계좌가 아닌 계좌를 누르면 확인, NO면 이전 계좌로 되돌린다
  const onAccountRowClicked = (e: RowClickedEvent<FltTrAccount>) => {
    const row = e.data;
    if (!row) return;
    selAccountRef.current = row;
    const hasMain = accountsRef.current.some(a => a.mainAccountYn);
    if (hasMain && !row.mainAccountYn) {
      // [E14] msgBox.DialogHide [YES] (L318) → retrieve(selectModel.getAccountId())
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

  // [E6] insertButton[등록].Select (L260) → insertRow() L705-748: 서비스 flt.Flt01_CompanyStd.getExpectTrDate(companyId, toDay=기준일자)
  const insertRow = async () => {
    const account = selAccountRef.current;
    if (account == null || account.accountId == null) {
      message.warning('먼저 계좌를 선택해주세요');
      return;
    }
    let expectDate: string | null;
    try {
      expectDate = await fltApi.getExpectTrDate(baseDateRef.current);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    if (expectDate == null) {
      message.warning('임직원 자기매매 기준관리가 입력되어있지 않습니다. 관리자에게 문의해주세요');
      return;
    }
    // GridInsertRow.insertRow 뒤 addChange(expectTrAmt 0, expectTrQty 0.0) → 변경 행
    crud.addRows([{
      trType: TR_TYPE, trTypeName: '매수', regDate: baseDateRef.current, accountId: account.accountId,
      accountRelateCode: account.familyRelateCode, expectTrDate: expectDate, expectTrQty: 0, expectTrAmt: 0, unfillYn: false,
    }], true);
  };

  // [E7] updateButton[저장].Select (L266) → preUpdate() L570-687 → [E20][E21] msgBox.DialogHide (L656·669) → update()
  const preUpdate = () => {
    const changed = crud.getChanged();
    if (changed.length === 0) {
      message.warning('변경된 내역이 없습니다');
      return;
    }
    let validMsg: string | null = null;
    for (const m of changed) {
      if (m.statusCode) { validMsg = '승인신청 내역이 포함되어있습니다'; break; }
      if (m.itemType == null || m.itemType === '') { validMsg = '종목유형을 선택하세요'; break; }
      if (!m.itemName) { validMsg = '종목명을 입력하세요'; break; }
      if (m.stkPriceYn && !m.itemCode) { validMsg = '주식시세적용 종목유형인 경우 종목코드는 필수입니다'; break; }
      if (!m.expectTrQty) { validMsg = '주문수량을 입력하세요'; break; }
      if (m.expectTrQty < 0) { validMsg = '주문수량은 0보다 작을 수 없습니다'; break; }
      if (m.expectTrAmt == null) { validMsg = '주문총액을 입력하세요'; break; }
    }
    if (validMsg) {
      message.warning(validMsg);
      return;
    }
    const limit = limitRef.current;
    const yearInvestLimit = num(limit[0]?.yearInvestLimit);
    const yearInvestAmt = num(limit[1]?.yearInvestLimit);
    const totalInvestLimit = num(limit[0]?.totalInvestAmt);
    const totalInvestAmt = num(limit[1]?.totalInvestAmt);
    const save = () => { void crud.saveRows(); };
    const confirmSave = (content: string) => Modal.confirm({ title: '확인', content, width: 450, okText: '예', cancelText: '아니오', onOk: save });

    // 투자금액 계산대상코드가 '1:매매금액'이면서, 본인계좌인 경우
    if (calcTargetRef.current === '1' && selAccountRef.current?.familyRelateCode === '1') {
      let buyAmt = 0;
      for (const m of crud.rows) {
        // 종목유형이 신고대상이고, 승인신청전인 내역의 주문총액 합계
        if (m.checkTargetYn && m.statusCode == null) buyAmt += num(m.expectTrAmt);
      }
      if (yearInvestLimit < yearInvestAmt + buyAmt) confirmSave('연간 투자금액을 초과하였습니다. 계속 진행하시겠습니까?');
      else if (totalInvestLimit < totalInvestAmt + buyAmt) confirmSave('총누적 투자금액을 초과하였습니다. 계속 진행하시겠습니까?');
      else save();
    } else {
      save();
    }
  };

  const selected = () => (crud.gridRef.current?.api?.getSelectedRows() ?? []) as FltTr[];

  // [E8] deleteButton[삭제].Select (L272) → deleteRow() L750-768 → [E22] msgBox.DialogHide [YES] (L753) → delete() L770-788
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

  // [E9] fixButton[승인신청].Select (L278) → fix() L1011-1070 → [E23] msgBox.DialogHide [YES] (L1025) → retrieve(), retrieveLimit()
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
          await retrieveLimit();
        } catch (err) {
          message.warning(errorMessage(err, '신청 실패'));
        }
      },
    });
  };

  // [E10] cancelButton[신청취소].Select (L284) → fixCancel() L1072-1140 → [E24] msgBox.DialogHide [YES] (L1086) → retrieve(), retrieveLimit()
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
          await retrieveLimit();
        } catch (err) {
          message.warning(errorMessage(err, '신청취소 실패'));
        }
      },
    });
  };

  // [E11] unFillButton[미체결].Select (L290)·[E12] unFillCancelButton[미체결취소].Select (L296) → updateUnFill("P"/"C") L1142-1210 → [E25] messageBox.DialogHide (L1157)
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
          await retrieveLimit();
        } catch (err) {
          message.warning(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // [E16] ItemTypeComboBox[sys.Sys00_Common.selectByFltItemType].Collapse (L395-411)
  const pickItemType = useCallback((row: FltTr, name: string | null) => {
    const code = itemTypes.find(c => c.name === name);
    if (!code) return;
    crudRef.current.updateRow(row.trId, {
      itemType: code.code,
      stkPriceYn: code.stkPriceYn,
      checkTargetYn: code.targetYn,
      itemName: code.stkPriceYn ? '종목을 선택하세요' : null,
      itemCode: null,
    });
  }, [itemTypes]);

  // [E17] lookupItemInfo.TriggerClick (L415)·[E18] lookupItemInfo.KeyDown [Enter] (L421) → lookupItemMain() L452-473
  const lookupItemMain = useCallback((row: FltTr, text: string | null) => {
    if (row.stkPriceYn == null) {
      message.warning('종목유형 선택 후 종목 선택이 가능합니다');
      return;
    }
    if (row.stkPriceYn) setStkLookup({ row, text });  // 주식시세적용 종목유형인 경우 상장주식종목 팝업 OPEN
    else setItemLookup({ row, text });
  }, []);

  // lookupItem() L475-485: Flt10_Lookup_Item → 고른 종목명(종목코드는 비움)
  const pickItem = (itemName: string) => {
    if (itemLookup) crud.updateRow(itemLookup.row.trId, { itemName, itemCode: null });
    setItemLookup(null);
  };

  // [E19] lookupStkItem() L487-496 → checkLockup() L498-544: 서비스 flt.Flt08_BuyLockup.checkLockup(companyId, itemCode, stdDate=기준일자)
  const checkLockup = async (row: FltTr, itemCode: string, itemName: string) => {
    const apply = () => crud.updateRow(row.trId, { itemCode, itemName });
    try {
      const res = await fltApi.checkBuyLockup(itemCode, baseDateRef.current);
      if (res.status === 'OK') {
        apply();
      } else if (res.status === 'CONFIRM') {
        Modal.confirm({ title: '확인', content: `${res.message}. 계속 진행하시겠습니까?`, width: 370, okText: '예', cancelText: '아니오', onOk: apply });
      } else {
        message.warning(res.message ?? '');
        crud.updateRow(row.trId, { itemCode: null, itemName: null });
      }
    } catch (err) {
      message.warning(errorMessage(err, '조회 실패'));
    }
  };

  const itemTriggerCell = useCallback((p: CustomCellRendererProps<FltTr>) => (
    <Space size={4}>
      <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) lookupItemMain(p.data, null); }} />
      {p.value}
    </Space>
  ), [lookupItemMain]);

  // buildGrid() L387-450: setChecked(MULTI) + setSumGrid(7, 8)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '사전신고일'),  // 원본 100 → UX-08(읽기 전용 날짜 90)
    gb.textCenter('trTypeName', 80, '구분'),
    gb.text('itemTypeName', 200, '종목유형', {
      editor: 'select',
      values: itemTypes.map(c => c.name),
      onCellValueChanged: p => { if (p.data) pickItemType(p.data, p.newValue); },
    }),
    gb.text('itemName', 230, '종목명', {
      editor: 'text',
      cellStyle: { color: '#1677ff' },
      cellRenderer: itemTriggerCell,
      onCellValueChanged: p => { if (p.data) lookupItemMain(p.data, p.newValue); },
    }),
    gb.textCenter('itemCode', 110, '종목코드'),
    gb.double('expectTrQty', 100, '주문수량', { editor: 'number' }),
    gb.long('expectTrAmt', 150, '주문총액', { editor: 'number' }),
    gb.date('expectTrDate', 90, '주문유효일'),  // 원본 100 → UX-08
    gb.textCenter('checkBuyLockup', 80, '매수제한'),
    gb.textCenter('checkFundHold', 80, '펀드<br>보유종목'),
    gb.textArea('trReason', 150, '매매사유', { editor: 'largeText' }),
    // [E15] grid.CellClick (L344-357): 승인상태 열에서 승인(20)·반려(30)이면 사유를 보여 준다
    gb.textCenter('statusName', 65, '승인상태', {
      onCellClicked: (e: CellClickedEvent<FltTr>) => {
        const m = e.data;
        if (m && (m.statusCode === '20' || m.statusCode === '30')) {
          Modal.info({ title: '승인 및 반려사유', content: m.rejectReason ?? '', width: 500 });
        }
      },
    }),
    gb.booleanYn2('unfillYn', 60, '미체결'),
  ], [itemTypes, itemTriggerCell, pickItemType, lookupItemMain]);

  const cycleLabel = checkCycle === '1' ? { text: '분기별', color: BLUE }
    : checkCycle === '2' ? { text: '월별', color: BLUE }
    : { text: '미지정', color: RED };
  const toolbarStyle: React.CSSProperties = { height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={350} min={300}>
          <div style={{ height: '100%', padding: '20px 20px 0', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <div style={toolbarStyle}>
                <span style={{ fontWeight: 'bold' }}>기준일자</span>
                {/* [E1] baseDate.ValueChange (L217) → setOnlyCurr() */}
                <DatePicker style={{ width: 130 }} allowClear={false} value={dayjs(baseDate)} format={DATE_FORMAT} onChange={changeBaseDate} />
                <span style={{ width: 8 }} />
                {/* [E4] retrieveButton[조회].Select (L248) → check() */}
                <Button type="search" onClick={() => check()}>조회</Button>
                {/* [E5] periodRetrieveButton[기간조회].Select (L254) → lookupPeriod() */}
                <Button type="search" onClick={() => setPeriodOpen(true)}>기간조회</Button>
                {/* [E3] openButton[보고주기 변경 및 서약서 서명].Select (L236) → Flt02_Lookup_Emp.open(→ check()): [E3 다음 단계] */}
                <Button type="download" style={{ width: 250 }} onClick={() => message.info('임직원매매 설정(보고주기·서약서) 창은 다음 단계에서 연결합니다.')}>보고주기 변경 및 서약서 서명</Button>
              </div>
              <div style={{ padding: '10px 15px 5px', fontSize: 14, fontWeight: 'bold', lineHeight: '30px' }}>
                <div>* 보고주기 : <span style={{ color: cycleLabel.color }}>{cycleLabel.text}</span> (조사분석인력 및 투자운용인력은 월별점검 대상입니다)</div>
                <div>* 임직원 금융투자상품 매매 법규준수 서약서 : <span style={{ color: oathDone ? BLUE : RED }}>{oathDone ? '서명완료' : '미완료'}</span></div>
                <div>* 연간 추가 투자한도(연봉한도) : {yearLimit != null && <><span style={{ color: BLUE }}>{yearLimit.toLocaleString()}</span> 원</>}</div>
              </div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 10, padding: '0 10px 10px' }}>
                {/* buildAccountGrid() — 750 */}
                <div style={{ width: 750, flex: 'none', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
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
                {/* buildLimitGrid() — 780, 행번호 숨김 + 안내 한 줄 */}
                <div style={{ width: 780, flex: 'none', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <SingleGrid<FltInvestLimit>
                      rowNumber={false}
                      rowData={limitRows}
                      columnDefs={limitColumns}
                      getRowId={p => String(p.data.trId)}
                    />
                  </div>
                  <div style={{ height: 30, display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 'bold', color: BLUE }}>
                    &nbsp;{calcTarget === '2' ? '* 현재 투자금액은 순입출금액(= 입금액 - 출금액)입니다.' : '* 현재 투자금액은 순투자금액(= 매수금액 - 매도금액)입니다.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <div style={{ ...toolbarStyle, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* [E2] searchText.KeyPress [Enter] (L226) → retrieve() */}
                  <Input style={{ width: 200 }} allowClear placeholder="검색어 입력 (종목명/종목코드)" value={searchText}
                    onChange={e => setSearchText(e.target.value)} onPressEnter={retrieveByText} />
                  {/* [E6] insertButton[등록].Select (L260) → insertRow() */}
                  <Button type="register" disabled={!en.ins} onClick={insertRow}>등록</Button>
                  {/* [E7] updateButton[저장].Select (L266) → preUpdate() */}
                  <Button type="save" count={crud.changes} disabled={!en.upd} onClick={preUpdate}>저장</Button>
                  {/* [E8] deleteButton[삭제].Select (L272) → deleteRow() */}
                  <Button type="delete" disabled={!en.del} onClick={deleteRow}>삭제</Button>
                  <span style={{ width: 8 }} />
                  {/* [E9] fixButton[승인신청].Select (L278) → fix() */}
                  <Button type="register" disabled={!en.fix} onClick={fix}>승인신청</Button>
                  {/* [E10] cancelButton[신청취소].Select (L284) → fixCancel() */}
                  <Button type="cancel" disabled={!en.cancel} onClick={fixCancel}>신청취소</Button>
                  <span style={{ fontSize: 12, fontWeight: 'bold', color: BLUE }}>&nbsp;* 승인상태의 '승인', '반려' 글씨를 클릭하여 사유를 확인하세요</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* [E11] unFillButton[미체결].Select (L290) → updateUnFill("P") */}
                  <Button type="close" onClick={() => updateUnFill('P')}>미체결</Button>
                  {/* [E12] unFillCancelButton[미체결취소].Select (L296) → updateUnFill("C") */}
                  <Button type="close" onClick={() => updateUnFill('C')}>미체결취소</Button>
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CellEditGrid<FltTr>
                  crud={crud}
                  columnDefs={columnDefs}
                  sumRow={{ labelField: 'regDate', label: '계', sum: ['expectTrQty', 'expectTrAmt'] }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>

      <Flt10_Lookup_ExpectTr open={periodOpen} trType={TR_TYPE} stdDate={baseDate} onResult={pickPeriod} onClose={() => setPeriodOpen(false)} />
      <Flt10_Lookup_Item open={itemLookup != null} stdDate={baseDate} searchText={itemLookup?.text} onResult={pickItem} onClose={() => setItemLookup(null)} />
      <Com50_Lookup_StkItem
        mode={stkLookup != null ? 'VIEW' : null}
        initialSearchText={stkLookup?.text ?? undefined}
        onResult={item => {
          const row = stkLookup?.row;
          setStkLookup(null);
          if (row && item.itemCode) void checkLockup(row, item.itemCode, item.itemName ?? '');
        }}
        onClose={() => setStkLookup(null)}
      />
    </div>
  );
};
