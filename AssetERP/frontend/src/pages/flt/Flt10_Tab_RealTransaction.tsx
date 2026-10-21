/**
 * 정기보고 (I05) — 준법감시 > 10. 임직원매매 > 정기보고 #1142
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_RealTransaction.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L187-278: north(65%) = 툴바 2줄(보고구분 · 년도 · 월별/분기별 · 검색 · 본인계좌만 조회 · [조회][보유원장 정리] / 계좌선택 · 사전신고 포함 · 상신상태 ·
 *                  [정기보고서 작성][문서보기] · 안내) + 툴바(▶ 보고기간 매매내역 · [등록][저장][삭제] · [템플릿][엑셀업로드][종목유형코드]) + 매매내역 체크박스 다중 셀 편집 그리드(합계 행 "계"),
 *                  center(35%) = 툴바(▶ 월말 평가금액 · [저장][상장주식 평가처리][평가금액을 취득금액으로 저장] · 안내) + 월말 평가금액 셀 편집 그리드
 * 1단계: [정기보고서 작성]은 상신 창(Apr01_Edit_ApprDoc, 문서분류 Dcr01_Lookup_Class)을 열기 직전까지(월말 평가금액·전/후 보고·선택 검사),
 *        [문서보기]·상세보기 셀(Flt14_Lookup_RelateAppr·Apr01_Edit_ApprDoc)은 다음 단계
 * UX보강(10): 저장 = 저장(n)(UX-03), 조회창 UX-05·06
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Checkbox, Input, message, Modal, Radio, Select, Space, Spin, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { CellClickedEvent } from 'ag-grid-community';
import { fltApi } from '@/api/flt';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { FltBook, FltBookMonth, FltItemTypeCode, FltRealTr, FltRelateAppr, FltTrAccount } from '@/types/flt';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Com50_Lookup_StkItem } from '@/components/lookup/Com50_Lookup_StkItem';
import { Flt03_Lookup_Account, accountLabel } from './Flt03_Lookup_Account';
import { Flt05_Lookup_ItemTypeConfirm } from './Flt05_Lookup_ItemTypeConfirm';
import { Flt10_Lookup_Item } from './Flt10_Lookup_Item';
import { Flt11_Lookup_BookList } from './Flt11_Lookup_BookList';

const gb = gbFor<FltRealTr>();
const gbBook = gbFor<FltBookMonth>();

const DATE_FORMAT = 'YYYY-MM-DD';
const BLUE = '#4472C4';
const DEPOSIT_TYPES = ['50I', '51O', '55I'];  // 입금·출금·배당금 → 종목유형 예치금(99)
const NO_AMT_TYPES = ['50I', '51O', '55I', '55N'];  // 입출금 등은 매매총액이 없어도 된다
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const QUARTERS = ['1', '2', '3', '4'];
const QUARTER_MONTHS: Record<string, [string, string]> = { '1': ['01', '03'], '2': ['04', '06'], '3': ['07', '09'], '4': ['10', '12'] };

/** GXT TextField·TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);
const num = (v: number | null | undefined) => v ?? 0;
/** 메시지의 `<br>`을 줄바꿈으로 */
const br = (text: string) => text.split('<br>').map((t, i) => <React.Fragment key={i}>{i > 0 && <br />}{t}</React.Fragment>);

interface Period { year: string; monthMode: boolean; month: string; quarter: string }
interface Enabled { retrieve: boolean; book: boolean; ins: boolean; excel: boolean; del: boolean; upd10: boolean; appr: boolean; apprView: boolean; upd12: boolean; stk: boolean; pur: boolean }
interface Limits { yearInvestLimit: number; yearInvestAmt: number; totalInvestLimit: number; totalInvestAmt: number }

/** 렌더 사이에도 최신 값을 읽는 상태 — GXT 필드처럼 핸들러가 바로 읽는다 */
function useStateRef<T>(init: T): [T, (v: T) => void, React.MutableRefObject<T>] {
  const [value, setValue] = useState<T>(init);
  const ref = useRef<T>(init);
  const set = useCallback((v: T) => { ref.current = v; setValue(v); }, []);
  return [value, set, ref];
}

/** 처음 보고구분 = 지난달 말일의 년·월(분기) (settings L412-446) */
const initialPeriod = (): Period => {
  const d = dayjs().startOf('month').subtract(1, 'day');
  return { year: d.format('YYYY'), monthMode: false, month: d.format('MM'), quarter: String(Math.floor(d.month() / 3) + 1) };
};

export const Flt10_Tab_RealTransaction: React.FC = () => {
  const user = useLoginUser();
  const [period, setPeriod, periodRef] = useStateRef<Period>(initialPeriod());
  const [searchText, setSearchText, searchRef] = useStateRef('');
  const [myAccount, setMyAccount, myAccountRef] = useStateRef(false);
  const [preTr, setPreTr, preTrRef] = useStateRef(true);
  const [accountName, setAccountName] = useState('전체');
  const [apprStepName, setApprStepName] = useState('');
  const [noCycle, setNoCycle] = useState(false);
  const [calcTarget, setCalcTarget] = useState<string | null>(null);
  const [en, setEn] = useState<Enabled>({ retrieve: true, book: true, ins: true, excel: true, del: true, upd10: true, appr: true, apprView: true, upd12: true, stk: true, pur: true });
  const [busy, setBusy] = useState<string | null>(null);
  const [trTypes, setTrTypes] = useState<Code[]>([]);
  const [itemTypes, setItemTypes] = useState<FltItemTypeCode[]>([]);
  const [acctLookup, setAcctLookup] = useState<{ row: FltRealTr | null } | null>(null);
  const [itemLookup, setItemLookup] = useState<{ row: FltRealTr; text: string | null } | null>(null);
  const [stkLookup, setStkLookup] = useState<{ row: FltRealTr; text: string | null } | null>(null);
  const [bookLookup, setBookLookup] = useState<{ row: FltRealTr; text: string | null } | null>(null);
  const [typeConfirmGroup, setTypeConfirmGroup] = useState<string | null>(null);

  // 화면 필드 (AS-IS accountId·checkCycle·startDate·closeDate·investAmt*·apprId·accountSetupDate)
  const accountIdRef = useRef<number | null>(null);
  const checkCycleRef = useRef<string | null>(null);
  const startDateRef = useRef('');
  const closeDateRef = useRef('');
  const calcTargetRef = useRef<string | null>(null);
  const overCheckRef = useRef<boolean>(false);
  const limitRef = useRef<Limits>({ yearInvestLimit: 0, yearInvestAmt: 0, totalInvestLimit: 0, totalInvestAmt: 0 });
  const apprIdRef = useRef<number | null>(null);
  const accountSetupDateRef = useRef<string | null>(null);
  const pendingApprRef = useRef<number[] | null>(null);
  const todayRef = useRef(dayjs().format(DATE_FORMAT));
  const excelForm = useRef<FileUpdownFormHandle>(null);

  const crud = useGridCrud<FltRealTr>({
    idField: 'trId',
    // retrieve() L1771-1806: 서비스 flt.Flt10_Tr.selectByPeriod(companyId, personId, accountId, trType "%", startDate, closeDate, searchText "%…%", myAccountYn, preTrYn)
    search: useCallback(() => fltApi.searchRealTrs({
      accountId: accountIdRef.current, startDate: startDateRef.current, closeDate: closeDateRef.current,
      searchText: searchRef.current, myAccountYn: myAccountRef.current, preTrYn: preTrRef.current,
    }), [searchRef, myAccountRef, preTrRef]),
    // update10() L1568-1602: GridUpdate → flt.Flt10_Tr.update (updateCheck10()에서 검사한 뒤 부른다)
    save: rows => fltApi.updateRealTrs(rows.map(r => ({ ...r, trItemName: n(r.trItemName), trItemCode: n(r.trItemCode), trNote: n(r.trNote) }))),
    // 삭제는 deleteCheck() → delete()로 따로 한다(체크 행 삭제 안 씀)
    remove: async () => 0,
    newRow: () => ({}),
    reloadAfterSave: false,
    onChanged: () => { void afterSaveRef.current(); },
  });
  const crudRef = useRef(crud);
  crudRef.current = crud;

  const bookCrud = useGridCrud<FltBookMonth>({
    idField: 'bookMonthId',
    // bookRetrieve() L1808-1826: 서비스 flt.Flt12_BookMonth.selectByBookDate(companyId, personId, accountId, startDate, closeDate, searchText "%…%", myAccountYn)
    search: useCallback(() => fltApi.searchBookMonths({
      accountId: accountIdRef.current, startDate: startDateRef.current, closeDate: closeDateRef.current,
      searchText: searchRef.current, myAccountYn: myAccountRef.current,
    }), [searchRef, myAccountRef]),
    // update12() L1323-1336: GridUpdate → flt.Flt12_BookMonth.update 뒤 bookRetrieve()
    save: rows => fltApi.updateBookMonths(rows),
    remove: async () => 0,
    newRow: () => ({}),
    reloadAfterSave: true,
  });
  const bookCrudRef = useRef(bookCrud);
  bookCrudRef.current = bookCrud;

  const afterSaveRef = useRef<() => Promise<void>>(async () => {});

  // getDate() L1828-1891: 월별이면 그 달, 분기별이면 그 분기의 시작일·말일 → 말일은 영업일로(flt.Flt10_Tr.getBizDate)
  const getDate = useCallback(async (): Promise<boolean> => {
    const p = periodRef.current;
    const [fromMonth, toMonth] = p.monthMode ? [p.month, p.month] : (QUARTER_MONTHS[p.quarter] ?? QUARTER_MONTHS['4']);
    const start = dayjs(`${p.year}-${fromMonth}-01`);
    const close = dayjs(`${p.year}-${toMonth}-01`).add(1, 'month').subtract(1, 'day');
    if (!start.isValid() || !close.isValid()) {
      message.warning('보고구분의 년도를 확인하세요');
      return false;
    }
    try {
      startDateRef.current = start.format(DATE_FORMAT);
      closeDateRef.current = await fltApi.getBizDate(close.format(DATE_FORMAT));
      return true;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return false;
    }
  }, [periodRef]);

  // getInvestLimit() L733-774: 서비스 flt.Flt02_Emp.selectInvestLimit(companyId, personId, stdDate=closeDate) — 못 읽으면 뒤 처리를 하지 않는다
  const getInvestLimit = useCallback(async (): Promise<boolean> => {
    let limit;
    try {
      limit = await fltApi.getEmpLimit(closeDateRef.current);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return false;
    }
    if (limit == null) {
      message.warning('연간투자한도 및 보고주기를 설정해주세요. 설정되어 있다면 적용시작일자를 확인해주세요');
      return false;
    }
    overCheckRef.current = !!limit.investAmtOverCheckYn;
    limitRef.current = {
      yearInvestLimit: num(limit.yearInvestLimit), yearInvestAmt: num(limit.yearInvestAmt),
      totalInvestLimit: num(limit.totalInvestLimit), totalInvestAmt: num(limit.totalInvestAmt),
    };
    // 투자금액초과 매수제한 고객사인 경우
    if (limit.investAmtOverCheckYn) {
      if (!limit.yearInvestLimit) {
        Modal.warning({ title: '확인', width: 500, content: br('연간 투자한도금액을 등록하세요<br>** 1125 계좌신고 > [보고주기 변경 및 서약서 서명] 버튼 클릭 **') });
        return false;
      }
      if (!limit.totalInvestLimit) {
        message.warning('총누적 투자한도금액이 등록되어 있지 않습니다');
        return false;
      }
    }
    return true;
  }, []);

  // setEnableFalse() L776-797: 보고주기 미설정
  const setEnableFalse = useCallback(() => {
    message.warning('보고주기 미설정!! 계좌신고 화면에서 보고주기를 설정하세요');
    setNoCycle(true);
    setEn(prev => ({ ...prev, retrieve: false, book: false, ins: false, excel: false, del: false, upd10: false, appr: false }));
  }, []);

  // apprChk() L1083-1216: 서비스 flt.Flt14_RelateAppr.selectByStdDate(personId, stdDate) → 상신상태·버튼 사용 여부
  const apprChk = useCallback(async () => {
    const cycle = checkCycleRef.current;
    if (cycle == null) return;
    const closeDate = dayjs(closeDateRef.current);
    const mm = closeDate.month() + 1;
    let stdDate: string;
    if (cycle === '1') {
      const quarterMonths = mm <= 3 ? 3 : mm <= 6 ? 6 : mm <= 9 ? 9 : 12;
      stdDate = dayjs(`${periodRef.current.year}-01-01`).add(quarterMonths, 'month').subtract(1, 'day').format(DATE_FORMAT);
    } else {
      stdDate = closeDateRef.current;
    }
    let list: FltRelateAppr[];
    try {
      list = await fltApi.searchRelateApprs(stdDate);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    const monthMode = periodRef.current.monthMode;
    // 보고주기와 보고구분이 서로 다르면 정기보고서 작성을 막는다
    const apprEnabled = !((cycle === '1' && monthMode) || (cycle === '2' && !monthMode));
    const allOn = { upd10: true, ins: true, excel: true, book: true, del: true, upd12: true, stk: true, pur: true };
    const allOff = { upd10: false, ins: false, excel: false, book: false, del: false, upd12: false, stk: false, pur: false };
    const unsubmitted = () => {
      setApprStepName('미상신');
      apprIdRef.current = null;
      setEn(prev => ({ ...prev, ...allOn, appr: apprEnabled, apprView: false }));
    };
    if (list.length >= 1) {
      let selectModel: FltRelateAppr | null = null;
      let found = false;
      for (const rel of list) {
        if (rel.apprStatusCode == null) {
          unsubmitted();
        } else if (['10', '20', '30', '99'].includes(rel.apprStatusCode)) {
          setApprStepName(rel.apprStatusName ?? '');
          apprIdRef.current = rel.apprId;
          setEn(prev => ({ ...prev, ...allOff, appr: false, apprView: true }));
          found = true;
          break;
        } else {
          selectModel = rel;
          found = false;
        }
      }
      if (!found) {  // 반려인 경우
        setApprStepName(selectModel?.apprStatusName ?? '');
        apprIdRef.current = selectModel?.apprId ?? null;
        setEn(prev => ({ ...prev, ...allOn, appr: apprEnabled, apprView: true }));
      }
    } else {
      unsubmitted();
    }
  }, [periodRef]);

  // retrieve() L1771-1806: getDate() → getInvestLimit() → 매매내역 조회(+ bookRetrieve()) → apprChk()
  const retrieve = useCallback(async () => {
    if (!(await getDate())) return;
    if (!(await getInvestLimit())) return;
    await Promise.all([crudRef.current.retrieve(), bookCrudRef.current.retrieve()]);
    await apprChk();
  }, [getDate, getInvestLimit, apprChk]);

  // insertFloorTrBook() L1604-1629: 서비스 flt.Flt10_Tr.insertFloorTrBook(companyId, personId, "%", "%", "%", "%", startDate) → 저장이 완료되었습니다 → retrieve()
  const insertFloorTrBook = useCallback(async () => {
    setBusy('원장반영 중입니다');
    try {
      await fltApi.insertFloorTrBook(startDateRef.current);
    } catch (err) {
      setBusy(null);
      message.warning(errorMessage(err, '원장반영 실패'));
      return;
    }
    setBusy(null);
    message.success('저장이 완료되었습니다');
    await retrieve();
  }, [retrieve]);

  // update10() 뒤: 상신문서 폐기(flt.Flt10_Tr.deleteApprList) → insertFloorTrBook()
  afterSaveRef.current = async () => {
    const apprList = pendingApprRef.current;
    pendingApprRef.current = null;
    if (apprList) {
      try {
        await fltApi.discardApprs(apprList);
      } catch (err) {
        message.warning(errorMessage(err, '상신문서 폐기 실패'));
        return;
      }
    }
    await insertFloorTrBook();
  };

  // [E0] 화면 열림 (생성자 L187-278) → settings() L280-702: 서비스 flt.Flt02_Emp.selectByDate(companyId, personId, toDay) → 보고주기·구분 코드 → 조회
  useEffect(() => {
    let alive = true;
    (async () => {
      let st;
      try {
        st = await fltApi.getTrCheck();
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        return;
      }
      if (!alive) return;
      todayRef.current = st.today;
      fltApi.searchItemTypeCodes(st.today).then(setItemTypes).catch(() => {});  // buildGrid() L894 종목유형 콤보(startDate = 오늘)
      setCalcTarget(st.investAmtCalcTargetCode);
      calcTargetRef.current = st.investAmtCalcTargetCode;
      if (!st.hasEmp || st.checkCycle == null) {
        setEnableFalse();
        return;
      }
      checkCycleRef.current = st.checkCycle;
      setPeriod({ ...periodRef.current, monthMode: st.checkCycle !== '1' });
      // 구분 콤보: investAmtCalcTargetCode "2"(입출금액)이면 FloorTrCode0001, 아니면 FloorTrCode0004
      sysApi.searchCodesByKindGroup(st.investAmtCalcTargetCode === '2' ? 'FloorTrCode0001' : 'FloorTrCode0004').then(setTrTypes).catch(() => {});
      await retrieve();
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] dataYearText.ValueChange (L287)·[E3] toggleGroup.ValueChange (L403)·[E4] yearComboBox.Collapse (L464)·[E5] monthComboBox.Collapse (L476) → retrieve()
  const changePeriod = (patch: Partial<Period>) => {
    setPeriod({ ...periodRef.current, ...patch });
    void retrieve();
  };

  // [E7] preTrYnCheckBox[사전신고 포함].ValueChange (L499) → setPreTrColumn(), retrieve()
  const changePreTr = (v: boolean) => {
    setPreTr(v);
    void retrieve();
  };

  // [E8] retrieveButton[조회].Select (L508) → retrieve()
  // [E6] searchText.KeyPress [Enter] (L485) → retrieve()

  // [E9] bookButton[보유원장 정리].Select (L514) → 확인 → [E10] messageBox.DialogHide (L518) → insertFloorTrBook()
  const clickBook = () => {
    Modal.confirm({
      title: '확인',
      content: `보유원장을 정리하시겠습니까? (정리기간 : ${startDateRef.current}~오늘)`,
      width: 450,
      okText: '예',
      cancelText: '아니오',
      onOk: () => insertFloorTrBook(),
    });
  };

  const selected = () => (crud.gridRef.current?.api?.getSelectedRows() ?? []) as FltRealTr[];

  // [E11] insertButton[등록].Select (L530) → insertRow() L1307-1321: GridInsertRow + addChange(trQty 0.0) → 변경 행. 회사·사원·승인여부 false는 서버가 채운다
  const insertRow = () => {
    crud.addRows([{ trQty: 0 }], true);
  };

  // [E15] updateButton10[저장].Select (L554) → updateCheck10() L1382-1534 → checkInvestLimit() L1536-1566 → [E33] msgBox.DialogHide [YES] (L1513) → update10()
  const updateCheck10 = () => {
    const list = crud.getChanged();
    if (list.length === 0) {
      message.warning('저장할 내역이 없습니다.');
      return;
    }
    const apprList: number[] = [];
    let investAmt = 0;
    let validMsg: string | null = null;
    const today = dayjs().format(DATE_FORMAT);
    for (const m of list) {
      if (m.accountId == null) { validMsg = '계좌정보를 선택해주세요'; break; }
      if (m.trType == null) { validMsg = '구분을 선택해주세요'; break; }
      if (m.trItemTypeName == null) { validMsg = '실거래내역의 종목유형을 선택해주세요'; break; }
      if (m.trType === '55I' && m.trItemType !== '99') { validMsg = "배당금의 종목유형은 반드시 '예치금'이어야 합니다."; break; }
      if (!m.trItemName) { validMsg = '실거래내역의 종목명을 입력해주세요'; break; }
      if (m.stkPriceYn === 'true' && !m.trItemCode) { validMsg = '주식시세적용 종목유형인 경우 종목코드는 필수입니다'; break; }
      if (m.trDate == null) { validMsg = '실거래내역의 거래일을 선택해주세요'; break; }
      if (m.trDate > today) { validMsg = '실거래내역의 거래일은 현재날짜보다 작아야합니다'; break; }
      if (!m.trQty) {
        if (m.trType !== '55N') { validMsg = '실거래내역의 매매수량을 입력해주세요 (예치금인 경우 입/출금액 입력)'; break; }
      } else if (m.trQty < 0) {
        validMsg = '실거래내역의 매매수량은 0보다 작을 수 없습니다';
        break;
      }
      if (m.trAmt == null && !NO_AMT_TYPES.includes(m.trType)) { validMsg = '실거래내역의 매매총액을 입력해주세요'; break; }
      // 상신된 매매내역
      if (m.apprId != null) apprList.push(m.apprId);
      // 투자금액 변동분 계산 (본인계좌만 대상)
      if (m.accountRelateCode === '1') {
        const befTrAmt = num(m.befTrAmt);
        if (calcTargetRef.current === '2') {  // (2:입출금액)
          const trQty = Math.trunc(num(m.trQty));
          if (m.trType === '50I' || m.trType === '55I') investAmt = investAmt - befTrAmt + trQty;  // 입금, 배당금(원장생성)
          else if (m.trType === '51O') investAmt = investAmt + befTrAmt - trQty;  // 출금
        } else if (m.checkTargetYn === 'true') {  // (1:매매금액) 신고대상인 종목유형만
          const trAmt = num(m.trAmt);
          if (m.trType === '10I') investAmt = investAmt - befTrAmt + trAmt;  // 매수
          else if (m.trType === '20O') investAmt = investAmt + befTrAmt - trAmt;  // 매도
        }
      }
    }
    if (validMsg) {
      message.warning(validMsg);
      return;
    }
    const update10 = () => {
      pendingApprRef.current = apprList.length > 0 ? apprList : null;
      void crud.saveRows();
    };
    const afterLimit = () => {
      if (apprList.length > 0) {
        Modal.confirm({
          title: '확인',
          icon: undefined,
          content: '결재 중이거나 완료된 문서가 포함되어있는 매매내역이 존재합니다. 기존문서는 폐기되며 재상신이 필요합니다',
          width: 750,
          okText: '예',
          cancelText: '아니오',
          onOk: update10,
        });
      } else {
        update10();
      }
    };
    const confirmLimit = (content: string) => Modal.confirm({ title: '확인', content, width: 450, okText: '예', cancelText: '아니오', onOk: afterLimit });
    const lim = limitRef.current;
    // [E34] messageBox.DialogHide (L1539) → callback.execute() — 연간 투자금액 초과 확인
    if (lim.yearInvestLimit < lim.yearInvestAmt + investAmt) confirmLimit('연간 투자금액을 초과하였습니다. 계속 진행하시겠습니까?');
    // [E35] messageBox.DialogHide (L1552) → callback.execute() — 총누적 투자금액 초과 확인
    else if (lim.totalInvestLimit < lim.totalInvestAmt + investAmt) confirmLimit('총누적 투자금액을 초과하였습니다. 계속 진행하시겠습니까?');
    else afterLimit();
  };

  // delete() L1714-1752: GridDeleteData → flt.Flt10_Tr.delete → (상신문서 폐기 flt.Flt10_Tr.deleteApprList) → insertFloorTrBook()
  const deleteRows = async (apprList: number[] | null) => {
    const list = selected();
    setBusy('삭제 중입니다');
    try {
      const saved = list.map(m => m.trId).filter(id => id > 0);
      if (saved.length > 0) await fltApi.deleteRealTrs(saved);
      crud.removeRows(list.map(m => m.trId));
      if (apprList) await fltApi.discardApprs(apprList);
    } catch (err) {
      setBusy(null);
      message.warning(errorMessage(err, '삭제 실패'));
      return;
    }
    setBusy(null);
    await insertFloorTrBook();
  };

  // deleteUpdate() L1754-1769: 서비스 flt.Flt10_Tr.deleteUpdate(deleteList) → insertFloorTrBook(), retrieve()
  const deleteUpdate = async () => {
    const ids = selected().map(m => m.trId).filter(id => id > 0);
    setBusy('삭제 중입니다');
    try {
      if (ids.length > 0) await fltApi.clearRealTrs(ids);
    } catch (err) {
      setBusy(null);
      message.warning(errorMessage(err, '삭제 실패'));
      return;
    }
    setBusy(null);
    await insertFloorTrBook();
  };

  // [E16] deleteButton[삭제].Select (L560) → deleteCheck() L1631-1712 → [E36] msgBox.DialogHide [YES] (L1656) → deleteUpdate(), [E37]·[E38] (L1675·L1695) → delete()
  const deleteCheck = () => {
    const list = selected();
    if (list.length === 0) {
      message.warning('삭제할 내용을 선택해주세요');
      return;
    }
    const apprList: number[] = [];
    let validMsg: string | null = null;
    for (const m of list) {
      if (m.apprId != null) apprList.push(m.apprId);
      if (m.expectTrAmt != null && m.expectTrAmt !== 0) {
        validMsg = '사전승인내역이 존재하는 경우 실거래내역만 삭제됩니다. 삭제하시겠습니까?';
        break;
      }
    }
    const confirm = (title: string, content: string, width: number, onOk: () => void) =>
      Modal.confirm({ title, content: br(content), width, okText: '예', cancelText: '아니오', onOk });
    if (validMsg) {
      confirm('삭제', validMsg, 550, () => { void deleteUpdate(); });
    } else if (apprList.length > 0) {
      confirm('확인', '결재 중이거나 완료된 문서가 포함되어있는 매매내역이 존재합니다.<br>기존문서는 폐기되며 재상신이 필요합니다. 삭제하시겠습니까?', 500, () => { void deleteRows(apprList); });
    } else {
      confirm('삭제', `${list.length}건의 정보를 삭제하시겠습니까? <br> 현재 화면의 저장되지 않은 내용은 모두 삭제됩니다.`, 430, () => { void deleteRows(null); });
    }
  };

  // [E12] updateButton12[저장].Select (L536) → update12() L1323-1336 (저장(n) — 변경이 없으면 눌리지 않는다, UX-03)
  // [E13] stkEvalButton[상장주식 평가처리] (L542)·[E14] updatePurAmtButton[평가금액을 취득금액으로 저장] (L548) → updateEvalAmt(type) L1338-1380 → [E32] msgBox.DialogHide [YES] (L1348) → bookRetrieve()
  const updateEvalAmt = (type: '1' | '2') => {
    Modal.confirm({
      title: '확인',
      content: type === '1' ? '미입력된 종목의 평가금액을 취득금액으로 저장하시겠습니까?' : '미입력된 상장주식의 평가금액을 계산하여 저장하시겠습니까?',
      width: 500,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        setBusy('평가처리 중입니다');
        try {
          await fltApi.evaluateBookMonths({
            accountId: accountIdRef.current, startDate: startDateRef.current, closeDate: closeDateRef.current,
            searchText: searchRef.current, type,
          });
        } catch (err) {
          setBusy(null);
          message.warning(errorMessage(err, '평가처리 실패'));
          return;
        }
        setBusy(null);
        await bookCrudRef.current.retrieve();
      },
    });
  };

  // [E17] apprButton[정기보고서 작성].Select (L566) → getDate(), getInvestLimit(), [E18]·[E19] messageBox.DialogHide (L582·L595) → checkEval() L704-731 → openCheck() L1893-1928 → open() L1967-2079
  const clickAppr = async () => {
    if (bookCrud.hasChanges()) {
      message.warning('저장하지 않은 월말 평가금액이 존재합니다');
      return;
    }
    if (!(await getDate())) return;
    if (!(await getInvestLimit())) return;
    const lim = limitRef.current;
    if (lim.yearInvestLimit < lim.yearInvestAmt) {
      Modal.confirm({ title: '확인', content: '연간 투자금액을 초과하였습니다. 계속 진행하시겠습니까?', width: 450, okText: '예', cancelText: '아니오', onOk: checkEval });
    } else if (lim.totalInvestLimit < lim.totalInvestAmt) {
      Modal.confirm({ title: '확인', content: '총누적 투자금액을 초과하였습니다. 계속 진행하시겠습니까?', width: 450, okText: '예', cancelText: '아니오', onOk: checkEval });
    } else {
      await checkEval();
    }
  };

  // checkEval() L704-731: 서비스 flt.Flt12_BookMonth.checkBookMonth(companyId, personId, startDate, closeDate, myAccountYn) — 월말 평가금액이 비었으면 막는다
  const checkEval = async () => {
    setBusy('월말 평가금액 체크중');
    try {
      await fltApi.checkBookMonth(startDateRef.current, closeDateRef.current, myAccountRef.current);
    } catch (err) {
      setBusy(null);
      message.warning(errorMessage(err, '월말 평가금액 체크 실패'));
      return;
    }
    setBusy(null);
    await openCheck();
  };

  // openCheck() L1893-1928 → checkAppr() L1930-1965: 서비스 flt.Flt10_Tr.checkPreAppr·checkNextAppr(companyId, personId, stdDate=closeDate)
  const openCheck = async () => {
    try {
      const res = await fltApi.checkReport(closeDateRef.current);
      if (!res.ok) {
        message.warning(res.message ?? '');
        return;
      }
    } catch (err) {
      message.warning(errorMessage(err, '점검 실패'));
      return;
    }
    if (crud.rows.length !== 0 && selected().length === 0) {
      // [E39] msgBox.DialogHide [YES] (L1905) → open()
      Modal.confirm({ title: '상신', content: '선택된 매매내역이 없습니다. 매매내역 없이 진행하시겠습니까?', width: 500, okText: '예', cancelText: '아니오', onOk: open });
    } else {
      open();
    }
  };

  // open() L1967-2079: 저장·선택 검사 뒤 서비스 dcr.Dcr30_Link.selectByLinkCode("A09") → 문서분류 Dcr01_Lookup_Class → familyAccountYn() → Apr01_Edit_ApprDoc (다음 단계)
  const open = () => {
    if (crud.hasChanges()) {
      message.warning('저장되지 않은 매매내역이 존재합니다.');
      return;
    }
    for (const m of selected()) {
      if (m.trItemTypeName == null || m.trItemName == null || m.trDate == null || m.trQty == null || m.trAmt == null) {
        message.warning('매매내역에서 실거래내역을 먼저 입력해주세요');
        return;
      }
      if (m.apprStatusCode === '10') {
        message.warning('결재 중인 문서가 포함되어있습니다. 상신취소 후 다시 시도해주세요');
        return;
      }
      if (m.apprStatusCode === '20') {
        message.warning('결재 중인 문서가 포함되어있습니다. 결재완료(반려) 후 다시 시도해주세요');
        return;
      }
    }
    // [E39 다음 단계] 전자결재 상신 창(Apr01_Edit_ApprDoc)은 아직 없다
    message.info('전자결재 상신 창은 다음 단계에서 연결합니다.');
  };

  // [E20] apprViewButton[문서보기].Select (L616) → apprView() L2168-2238: 서비스 flt.Flt14_RelateAppr.selectByStdDate → 2건 이상 Flt14_Lookup_RelateAppr, 1건 Apr01_Edit_ApprDoc (다음 단계)
  const apprView = async () => {
    const cycle = checkCycleRef.current;
    const mm = dayjs(closeDateRef.current).month() + 1;
    let stdDate: string;
    if (cycle === '1') {
      const quarterMonths = mm <= 3 ? 3 : mm <= 6 ? 6 : mm <= 9 ? 9 : 12;
      stdDate = dayjs(`${periodRef.current.year}-01-01`).add(quarterMonths, 'month').subtract(1, 'day').format(DATE_FORMAT);
    } else {
      stdDate = closeDateRef.current;
    }
    try {
      const list = await fltApi.searchRelateApprs(stdDate);
      if (list.length === 0) message.warning('문서가 조회되지 않습니다.');
      else message.info('전자결재 문서 창은 다음 단계에서 연결합니다.');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E21] itemTypeButton[종목유형코드].Select (L622): 서비스 flt.Flt02_Emp.selectByDate → 보고주기가 없으면 setEnableFalse(), 있으면 Flt05_Lookup_ItemTypeConfirm.openGroup(FloorTrCode0001|0004)
  const clickItemType = async () => {
    try {
      const st = await fltApi.getTrCheck();
      if (!st.hasEmp || st.checkCycle == null) setEnableFalse();
      else setTypeConfirmGroup(st.investAmtCalcTargetCode === '2' ? 'FloorTrCode0001' : 'FloorTrCode0004');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E23] excelUploadButton[엑셀업로드].Select (L662) → excelUpload() L2240-2257 → [E40] fileUploadField.Change (L2249) → 업로드 → [E24] uploadExcelForm.SubmitComplete (L675) → insertFloorTrBook()
  const onExcelFile = async (file?: File) => {
    if (!file) return;
    setBusy('엑셀 업로드 중입니다');
    try {
      await fltApi.uploadRealTrsExcel(file);
    } catch (err) {
      setBusy(null);
      message.warning(errorMessage(err, '엑셀 업로드 실패'));
      return;
    }
    setBusy(null);
    await insertFloorTrBook();
  };

  // [E2] accountField.TriggerClick (L372): Flt03_Lookup_Account.openNull(오늘) — [전체]는 null → "전체"
  const pickFieldAccount = (acc: FltTrAccount | null) => {
    setAcctLookup(null);
    if (acc == null) {
      setAccountName('전체');
      accountIdRef.current = null;
    } else {
      setAccountName(accountLabel(acc));
      accountIdRef.current = acc.accountId;
    }
  };

  // [E26] lookupAccount.TriggerClick (L824-842): Flt03_Lookup_Account.open(오늘) → 계좌정보·관계 칸을 바꾸고 계좌개설일을 기억한다
  const pickCellAccount = (row: FltRealTr, acc: FltTrAccount | null) => {
    setAcctLookup(null);
    if (!acc) return;
    crud.updateRow(row.trId, {
      accountInfo: accountLabel(acc), accountId: acc.accountId, accountRelateName: acc.familyRelateName, accountRelateCode: acc.familyRelateCode,
    });
    accountSetupDateRef.current = acc.setupDate;
  };

  // [E28] TrTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L859-882)
  const pickTrType = useCallback((row: FltRealTr, name: string | null) => {
    const code = trTypes.find(c => c.name === name);
    if (!code) return;
    if (DEPOSIT_TYPES.includes(code.code)) {
      crudRef.current.updateRow(row.trId, {
        trType: code.code, trTypeName: code.name, trItemType: '99', trItemTypeName: '예치금', stkPriceYn: 'false', checkTargetYn: 'false',
        trItemName: '예치금', trItemCode: null,
      });
    } else {
      crudRef.current.updateRow(row.trId, {
        trType: code.code, trTypeName: code.name, trItemType: null, trItemTypeName: null, stkPriceYn: null, checkTargetYn: null,
        trItemName: null, trItemCode: null,
      });
    }
  }, [trTypes]);

  // [E29] itemTypeComboBox[sys.Sys00_Common.selectByFltItemType].Collapse (L889-910)
  const pickItemType = useCallback((row: FltRealTr, name: string | null) => {
    const code = itemTypes.find(c => c.name === name);
    if (!code) return;
    crudRef.current.updateRow(row.trId, {
      trItemType: code.code, stkPriceYn: String(code.stkPriceYn), checkTargetYn: String(code.targetYn),
      trItemName: code.stkPriceYn ? '종목을 선택하세요' : code.code === '99' ? '예치금' : null,
      trItemCode: null,
    });
  }, [itemTypes]);

  // [E27] trDateField.ValueChange (L846) → checkTrDate() L1031-1081: 서비스 sys.Sys12_Calendar.selectByDay → 계좌개설일·영업일·보고기간 점검
  const checkTrDate = useCallback(async (row: FltRealTr, date: string | null) => {
    if (!date) return;
    const clear = (msg: string) => {
      message.warning(msg);
      crudRef.current.updateRow(row.trId, { trDate: null });
    };
    let working: boolean | null;
    try {
      working = await fltApi.getWorkingDay(date);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    const setup = accountSetupDateRef.current;
    if (setup != null && date < setup) return clear('계좌개설일보다 빠를 수 없습니다.');
    if (working == null) return clear('영업일 정보가 존재하지 않습니다. 관리자에게 문의하세요');
    if (!working) return clear('영업일이 아닙니다. 실거래일을 확인해주세요');
    if (!(await getDate())) return;  // 보고기간체크
    if (!(date >= startDateRef.current && date <= closeDateRef.current)) {
      Modal.info({ title: '확인', width: 400, content: br(`현재 보고기간은 '${startDateRef.current} ~ ${closeDateRef.current}' 입니다.<br>보고구분 년/월(분기) 을 확인하세요`) });
      crudRef.current.updateRow(row.trId, { trDate: null });
    }
  }, [getDate]);

  // [E30] lookupItemInfo.TriggerClick (L931)·[E31] lookupItemInfo.KeyDown [Enter] (L937) → lookupItemMain() L1218-1258
  const lookupItemMain = useCallback((row: FltRealTr, text: string | null) => {
    if (row.accountId == null) { message.warning('계좌 선택 후 종목 선택이 가능합니다'); return; }
    if (row.trType == null) { message.warning('구분(매수/매도) 선택 후 종목 선택이 가능합니다'); return; }
    if (row.trDate == null) { message.warning('실거래일 선택 후 종목 선택이 가능합니다'); return; }
    const buy = row.trType === '10I' || row.trType === '55N';
    if (buy && row.stkPriceYn == null) { message.warning('종목유형 선택 후 종목 선택이 가능합니다'); return; }
    if (buy) {
      if (row.stkPriceYn === 'true') setStkLookup({ row, text });  // 주식시세적용 종목유형인 경우 상장주식종목 팝업 OPEN (lookupStkItem L1272)
      else setItemLookup({ row, text });  // lookupItem L1260
    } else {
      setBookLookup({ row, text });  // 매도: lookupHoldItem L1286
    }
  }, []);

  // lookupItem() L1260-1270: Flt10_Lookup_Item(closeDate) → 고른 종목명(종목코드는 비움)
  const pickItem = (itemName: string) => {
    if (itemLookup) crud.updateRow(itemLookup.row.trId, { trItemName: itemName, trItemCode: null });
    setItemLookup(null);
  };

  // lookupHoldItem() L1286-1305: Flt11_Lookup_BookList(accountId, userId, trDate, expectYn true, itemName) → 첫 종목
  const pickHoldItem = (books: FltBook[]) => {
    const row = bookLookup?.row;
    setBookLookup(null);
    if (!row || books.length === 0) return;
    const book = books[0];
    crud.updateRow(row.trId, {
      trItemType: book.itemType, trItemTypeName: book.itemTypeName,
      stkPriceYn: String(itemTypes.find(c => c.code === book.itemType)?.stkPriceYn ?? false),
      trItemName: book.itemName, trItemCode: book.itemCode,
    });
  };

  const triggerCell = useCallback((onOpen: (row: FltRealTr) => void) => (p: CustomCellRendererProps<FltRealTr>) => (
    <Space size={4}>
      <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) onOpen(p.data); }} />
      {p.value}
    </Space>
  ), []);
  const accountTriggerCell = useMemo(() => triggerCell(row => setAcctLookup({ row })), [triggerCell]);
  const itemTriggerCell = useMemo(() => triggerCell(row => lookupItemMain(row, null)), [triggerCell, lookupItemMain]);

  // 사전신고 Copy L895-906: 사전신고 내용을 실거래 칸으로 옮긴다
  const copyRow = (row: FltRealTr) => {
    crud.updateRow(row.trId, {
      trDate: row.regDate, trItemTypeName: row.itemTypeName, trItemType: row.itemType, trItemName: row.itemName, trItemCode: row.itemCode,
      trQty: row.expectTrQty, trAmt: row.expectTrAmt, trNote: row.trReason,
    });
  };

  // buildGrid() L814-1011: setChecked(MULTI) + setSumGrid(9, 10, 16, 17), [사전신고 포함]이 아니면 6~11번 열을 감춘다 (setPreTrColumn L1013-1029)
  const columnDefs = useMemo(() => [
    gb.text('accountInfo', 230, '계좌정보', { cellStyle: { color: '#1677ff' }, cellRenderer: accountTriggerCell }),
    gb.textCenter('accountRelateName', 100, '관계'),
    gb.textCenter('trTypeName', 70, '구분', {
      editor: 'select',
      values: trTypes.map(c => c.name),
      onCellValueChanged: p => { if (p.data) pickTrType(p.data, p.newValue); },
    }),
    gb.group('사전승인', [
      gb.textCenter('statusName', 70, '상태'),
      // [E25] grid.CellClick [event.getCellIndex() == 6] (L687-699): 위반사항 열을 누르면 내용을 보여 준다
      gb.textCenter('checkPeriod', 100, '위반사항', {
        hide: !preTr,
        cellStyle: { cursor: 'pointer', textAlign: 'center' },
        onCellClicked: (e: CellClickedEvent<FltRealTr>) => {
          if (e.data?.checkPeriod) Modal.info({ title: '위반사항', content: e.data.checkPeriod, width: 400 });
        },
      }),
      gb.date('regDate', 90, '사전신고일', { hide: !preTr }),
      gb.text('itemName', 150, '종목명', { hide: !preTr }),
      gb.double('expectTrQty', 80, '신고수량', { hide: !preTr }),
      gb.long('expectTrAmt', 120, '신고총액', { hide: !preTr }),
    ]),
    { ...iconCell<FltRealTr>('move', 'copyCell', 60, 'Copy', copyRow), hide: !preTr },
    gb.date('trDate', 90, '실거래일', {
      editor: 'date',
      onCellValueChanged: p => { if (p.data) void checkTrDate(p.data, p.newValue); },
    }),
    gb.text('trItemTypeName', 150, '종목유형', {
      editor: 'select',
      values: itemTypes.map(c => c.name),
      onCellValueChanged: p => { if (p.data) pickItemType(p.data, p.newValue); },
    }),
    gb.textArea('trItemName', 180, '종목명', {
      editor: 'text',
      cellStyle: { color: '#1677ff' },
      cellRenderer: itemTriggerCell,
      onCellValueChanged: p => { if (p.data) lookupItemMain(p.data, p.newValue); },
    }),
    gb.textCenter('trItemCode', 110, '종목코드'),
    gb.double('trQty', 80, calcTarget === '1' || calcTarget == null ? '매매수량' : '매매수량<br>(입출금액)', { editor: 'number' }),
    gb.long('trAmt', 120, '매매총액', { editor: 'number' }),
    gb.textArea('trNote', 150, '비고', { editor: 'largeText' }),
    gb.date('apprRegDate', 90, '상신일'),
    gb.textCenter('apprStatusName', 100, '상신상태'),
    // 상세보기 L920-948: 상신문서 보기(Apr01_Edit_ApprDoc, 다음 단계)
    iconCell<FltRealTr>('view', 'detailCell', 60, '상세보기', row => {
      if (row.apprId == null) message.warning('상신문서가 없습니다. 먼저 상신을 진행해주세요');
      else message.info('전자결재 문서 창은 다음 단계에서 연결합니다.');
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [preTr, trTypes, itemTypes, calcTarget, accountTriggerCell, itemTriggerCell, pickTrType, pickItemType, checkTrDate, lookupItemMain]);

  // bookBuildGrid() L799-812 — bookAmt만 편집
  const bookColumns = useMemo(() => [
    gbBook.text('accountNo', 250, '계좌'),
    gbBook.date('bookDate', 120, '보유일자'),
    gbBook.text('itemTypeName', 150, '종목유형'),
    gbBook.text('itemName', 250, '종목명'),
    gbBook.textCenter('itemCode', 110, '종목코드'),
    gbBook.double('bookQty', 100, '보유수량'),
    gbBook.long('bookAmt', 150, '평가금액', { editor: 'number' }),
  ], []);

  const barStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', minHeight: 40, flexWrap: 'wrap' };
  const labelStyle: React.CSSProperties = { fontWeight: 'bold' };
  const noticeStyle: React.CSSProperties = { fontSize: 12, fontWeight: 'bold', color: BLUE };

  return (
    <div style={{ height: '100%', background: '#fff', position: 'relative' }}>
      {busy && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin tip={busy}><div style={{ padding: 30 }} /></Spin>
        </div>
      )}
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="65%" min={330}>
          <div style={{ height: '100%', padding: '20px 20px 0', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <div style={{ borderBottom: '1px solid #d9d9d9', padding: '4px 0' }}>
                <div style={barStyle}>
                  <span style={labelStyle}>보고구분</span>
                  {/* [E1] dataYearText.ValueChange (L287) → retrieve() */}
                  <Input style={{ width: 55 }} maxLength={4} disabled={noCycle} value={period.year}
                    onChange={e => setPeriod({ ...periodRef.current, year: e.target.value })}
                    onBlur={() => void retrieve()} onPressEnter={() => void retrieve()} />
                  <span>년도</span>
                  {/* [E3] toggleGroup.ValueChange (L403) → retrieve(): 월별이면 월 콤보, 분기별이면 분기 콤보를 쓴다 */}
                  <Radio checked={period.monthMode} disabled={noCycle} onChange={() => changePeriod({ monthMode: true })}>월별</Radio>
                  {/* [E5] monthComboBox.Collapse (L476) → retrieve() */}
                  <Select style={{ width: 70 }} disabled={noCycle || !period.monthMode} value={period.month}
                    options={MONTHS.map(v => ({ value: v, label: v }))} onChange={v => changePeriod({ month: v })} />
                  <Radio checked={!period.monthMode} disabled={noCycle} onChange={() => changePeriod({ monthMode: false })}>분기별</Radio>
                  {/* [E4] yearComboBox[1].Collapse (L464) → retrieve() */}
                  <Select style={{ width: 70 }} disabled={noCycle || period.monthMode} value={period.quarter}
                    options={QUARTERS.map(v => ({ value: v, label: v }))} onChange={v => changePeriod({ quarter: v })} />
                  <span style={labelStyle}>검색</span>
                  {/* [E6] searchText.KeyPress [Enter] (L485) → retrieve() */}
                  <Input style={{ width: 250 }} allowClear placeholder="종목유형/종목명/종목코드" value={searchText}
                    onChange={e => setSearchText(e.target.value)} onPressEnter={() => void retrieve()} />
                  <Checkbox checked={myAccount} onChange={e => setMyAccount(e.target.checked)}>본인계좌만 조회</Checkbox>
                  {/* [E8] retrieveButton[조회].Select (L508) → retrieve() */}
                  <Button type="search" disabled={!en.retrieve} onClick={retrieve}>조회</Button>
                  {/* [E9] bookButton[보유원장 정리].Select (L514) → 확인 → insertFloorTrBook() */}
                  <Button type="view" disabled={!en.book} onClick={clickBook}>보유원장 정리</Button>
                </div>
                <div style={barStyle}>
                  <span style={labelStyle}>계좌선택</span>
                  {/* [E2] accountField.TriggerClick (L372) → Flt03_Lookup_Account.openNull */}
                  <LookupInput value={accountName} width={300} disabled={noCycle} onOpen={() => setAcctLookup({ row: null })} />
                  {/* [E7] preTrYnCheckBox[사전신고 포함].ValueChange (L499) → setPreTrColumn(), retrieve() */}
                  <Checkbox checked={preTr} disabled={noCycle} onChange={e => changePreTr(e.target.checked)}>사전신고 포함</Checkbox>
                  <span style={labelStyle}>상신상태</span>
                  <Input style={{ width: 80 }} readOnly value={apprStepName} />
                  {/* [E17] apprButton[정기보고서 작성].Select (L566) → getDate(), getInvestLimit(), checkEval() */}
                  <Button type="register" disabled={!en.appr} onClick={clickAppr}>정기보고서 작성</Button>
                  {/* [E20] apprViewButton[문서보기].Select (L616) → apprView() */}
                  <Button type="search" disabled={!en.apprView} onClick={apprView}>문서보기</Button>
                  <span style={noticeStyle}>※ 매매내역을 선택한 후 '정기보고서 작성' 버튼을 클릭하세요.</span>
                </div>
              </div>
              <div style={barStyle}>
                <span style={{ fontSize: 14, fontWeight: 'bold' }}>▶ 보고기간 매매내역</span>
                {/* [E11] insertButton[등록].Select (L530) → insertRow() */}
                <Button type="register" disabled={!en.ins} onClick={insertRow}>등록</Button>
                {/* [E15] updateButton10[저장].Select (L554) → updateCheck10() */}
                <Button type="save" count={crud.changes} disabled={!en.upd10} onClick={updateCheck10}>저장</Button>
                {/* [E16] deleteButton[삭제].Select (L560) → deleteCheck() */}
                <Button type="delete" disabled={!en.del} onClick={deleteCheck}>삭제</Button>
                <span style={{ width: 8 }} />
                {/* [E22] tempDownloadButton[템플릿].Select (L656) → downloadForm.submit() */}
                <Button type="download" onClick={() => fltApi.downloadRealTrTemplate().catch(err => message.error(errorMessage(err, '템플릿을 받을 수 없습니다')))}>템플릿</Button>
                {/* [E23] excelUploadButton[엑셀업로드].Select (L662) → excelUpload() */}
                <Button type="upload" disabled={!en.excel} onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
                {/* [E21] itemTypeButton[종목유형코드].Select (L622) → setEnableFalse() / Flt05_Lookup_ItemTypeConfirm.openGroup */}
                <Button type="view" onClick={clickItemType}>종목유형코드</Button>
                <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CellEditGrid<FltRealTr>
                  crud={crud}
                  columnDefs={columnDefs}
                  sumRow={{ labelField: 'accountInfo', label: '계', sum: ['expectTrQty', 'expectTrAmt', 'trQty', 'trAmt'] }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={180}>
          <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <div style={barStyle}>
                <span style={{ fontSize: 14, fontWeight: 'bold' }}>▶ 월말 평가금액</span>
                {/* [E12] updateButton12[저장].Select (L536) → update12() */}
                <Button type="save" count={bookCrud.changes} disabled={!en.upd12} onClick={bookCrud.saveRows}>저장</Button>
                {/* [E13] stkEvalButton[상장주식 평가처리].Select (L542) → updateEvalAmt("2") */}
                <Button type="save" disabled={!en.stk} onClick={() => updateEvalAmt('2')}>상장주식 평가처리</Button>
                {/* [E14] updatePurAmtButton[평가금액을 취득금액으로 저장].Select (L548) → updateEvalAmt("1") — 한채투(10489)·28000만 보인다 (2024.04.15 CYY) */}
                {(user.companyId === 10489 || user.companyId === 28000) && (
                  <Button type="save" disabled={!en.pur} onClick={() => updateEvalAmt('1')}>평가금액을 취득금액으로 저장</Button>
                )}
                <span style={noticeStyle}>* 월 매매회전율 계산 시 월말 평가금액이 필요합니다 / * 평가단가: 코스콤 종가 기준 (NXT 종가 기준 평가를 원하실 경우 평가금액 직접 입력)</span>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CellEditGrid<FltBookMonth> crud={bookCrud} columnDefs={bookColumns} />
              </div>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>

      <Flt03_Lookup_Account
        open={acctLookup != null}
        baseDate={todayRef.current}
        withNull={acctLookup?.row == null}
        onResult={acc => (acctLookup?.row ? pickCellAccount(acctLookup.row, acc) : pickFieldAccount(acc))}
        onClose={() => setAcctLookup(null)}
      />
      <Flt05_Lookup_ItemTypeConfirm open={typeConfirmGroup != null} groupCode={typeConfirmGroup} onClose={() => setTypeConfirmGroup(null)} />
      <Flt10_Lookup_Item open={itemLookup != null} stdDate={closeDateRef.current} searchText={itemLookup?.text} onResult={pickItem} onClose={() => setItemLookup(null)} />
      <Com50_Lookup_StkItem
        mode={stkLookup != null ? 'VIEW' : null}
        initialSearchText={stkLookup?.text ?? undefined}
        onResult={item => {
          const row = stkLookup?.row;
          setStkLookup(null);
          if (row) crud.updateRow(row.trId, { trItemName: item.itemName, trItemCode: item.itemCode });  // lookupStkItem L1272-1284
        }}
        onClose={() => setStkLookup(null)}
      />
      <Flt11_Lookup_BookList
        open={bookLookup != null}
        accountId={bookLookup?.row.accountId ?? null}
        stdDate={bookLookup?.row.trDate ?? todayRef.current}
        searchText={bookLookup?.text}
        onResult={pickHoldItem}
        onClose={() => setBookLookup(null)}
      />
    </div>
  );
};
