/** flt(임직원매매) 화면 타입 (E08~) — API 응답 record와 같은 필드 */

/** 종목유형 (flt05_item_type) — 체크 칸은 DB 형태('true'/'false' 문자열) 그대로 */
export interface FltItemType {
  itemTypeId: number;
  companyId: number;
  companyName: string;
  itemTypeCode: string;
  itemTypeName: string;
  seq: number;
  /** YYYY-MM-DD */
  startDate: string;
  targetYn: string;
  sellPreApprYn: string;
  lockUpCheckYn: string;
  stkPriceYn: string;
  listStkYn: string;
}

/** 임직원 계좌 (I02 Flt03_Tab_AccountReport, flt03_account) — 날짜는 YYYY-MM-DD, 계좌번호는 복호화한 값 */
export interface FltAccount {
  accountId: number;
  companyId: number;
  personId: number;
  setupDate: string | null;
  regReason: string | null;
  regReasonName: string | null;
  familyRelateCode: string | null;
  familyRelateName: string | null;
  mainAccountYn: boolean | null;
  accountName: string | null;
  accountNoDec: string | null;
  corpId: number | null;
  corpName: string | null;
  corpBranchName: string | null;
  itemType: string | null;
  itemTypeName: string | null;
  note: string | null;
  apprId: number | null;
  apprRegDate: string | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
  trCnt: number | null;
  bookCnt: number | null;
  bookInitCnt: number | null;
}

/** 계좌신고현황 한 행 (J01 Flt03_Tab_AccountAdmin, flt03_account.selectByDate) — 회사 전체 */
export interface FltAccountAdmin {
  accountId: number;
  orgName: string | null;
  personName: string | null;
  corpName: string | null;
  accountNoDec: string | null;
  accountName: string | null;
  familyRelateName: string | null;
  itemTypeName: string | null;
  setupDate: string | null;
  apprId: number | null;
  apprRegDate: string | null;      // J07 계좌정보 조회창의 상신일
  apprStatusName: string | null;
  closeDate: string | null;
  closeApprId: number | null;
  closeApprStatusName: string | null;
}

/** 폐쇄 계좌 (flt06_account_close) */
export interface FltAccountClose {
  accountCloseId: number;
  accountId: number;
  closeDate: string | null;
  familyRelateName: string | null;
  accountName: string | null;
  accountNoDec: string | null;
  corpName: string | null;
  corpBranchName: string | null;
  itemTypeName: string | null;
  apprId: number | null;
  apprRegDate: string | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
}

/** 화면 위 안내: 보고주기('1' 분기 / '2' 월 / 없음)·서약서 상신 상태('30'이면 서명완료) */
export interface FltAccountStatus {
  checkCycle: string | null;
  oathStatusCode: string | null;
  oathStatusName: string | null;
}

/** 기본 문서분류 (dcr30_link) */
export interface FltDocClass {
  classTreeId: number;
  classTreeFullName: string | null;
}

/** 임직원 매매 사전신고 한 행 (I03 Flt10_Tab_BuyReport, flt10_tr) — 날짜는 YYYY-MM-DD */
export interface FltTr {
  trId: number;
  companyId: number;
  personId: number;
  /** 10I 매수 / 20O 매도 */
  trType: string | null;
  trTypeName: string | null;
  accountId: number | null;
  /** 계좌번호 (개설기관) 계좌명 */
  accountInfo: string | null;
  accountRelateCode: string | null;
  regDate: string | null;
  itemType: string | null;
  itemTypeName: string | null;
  itemName: string | null;
  itemCode: string | null;
  expectTrQty: number | null;
  expectTrAmt: number | null;
  expectTrDate: string | null;
  checkBuyLockup: string | null;
  checkFundHold: string | null;
  trReason: string | null;
  /** 10 신청 / 20 승인 / 30 반려 */
  statusCode: string | null;
  statusName: string | null;
  rejectReason: string | null;
  trDate: string | null;
  unfillYn: boolean | null;
  stkPriceYn: boolean | null;
  checkTargetYn: boolean | null;
  /** 매도 사전신고(I04) 보유 열 */
  bookQty: number | null;
  bookAmt: number | null;
  bookDays: string | null;
}

/** 사전신고 화면 위 안내 (flt02_emp·flt04_oath) + 서버 오늘 + 회사의 사전신고 소급 설정 */
export interface FltTrCheck {
  hasEmp: boolean;
  /** '1' 분기별 / '2' 월별 */
  checkCycle: string | null;
  yearInvestLimit: number | null;
  /** '1' 매매금액 / '2' 입출금액 */
  investAmtCalcTargetCode: string | null;
  investAmtOverCheckYn: boolean | null;
  oathStatusCode: string | null;
  today: string;
  fltOnlyCurrYn: boolean;
}

/** 투자한도 그리드 한 행 — 1 한도 / 2 현재 투자금액(사전신고 포함) / 3 현재 투자금액(사전신고 제외) */
export interface FltInvestLimit {
  trId: number;
  checkTypeName: string;
  yearInvestLimit: number | null;
  totalInvestAmt: number | null;
  turnoverRate: number | null;
  monthBuyCount: number | null;
  dayBuyCount: number | null;
}

/** 종목 찾기 창 한 행 */
export interface FltTrItem {
  trId: number;
  itemName: string;
  itemTypeName: string | null;
}

/** 매수제한 검사 결과 — OK 적용 / CONFIRM 확인 뒤 적용 / REJECT 막음 */
export interface FltBuyLockup {
  status: 'OK' | 'CONFIRM' | 'REJECT';
  message: string | null;
}

/** 사전신고 화면 계좌 그리드 한 행 (flt03_account.selectByDate) */
export interface FltTrAccount {
  accountId: number;
  mainAccountYn: boolean | null;
  mainAccountYnStr: string | null;
  familyRelateCode: string | null;
  familyRelateName: string | null;
  corpName: string | null;
  accountNoDec: string | null;
  accountName: string | null;
  itemTypeName: string | null;
  setupDate: string | null;
}

/** 종목유형 콤보 한 행 (sys00_common.selectByFltItemType) */
export interface FltItemTypeCode {
  codeId: number;
  code: string;
  name: string;
  stkPriceYn: boolean;
  targetYn: boolean;
}

/** 보유내역 한 행 (I04 Flt11_Lookup_BookList, flt11_book.selectByText2 · I06 selectByText) */
export interface FltBook {
  bookId: number;
  bookDate: string;
  accountNo: string | null;
  itemType: string | null;
  itemTypeName: string | null;
  itemName: string | null;
  itemCode: string | null;
  bookAmt: number | null;
  bookQty: number | null;
  bookDays: string | null;
  buyDate: string | null;
  checkFundHoldYn: boolean | null;
  lockupCheckYn: boolean | null;
  lockupDate: string | null;
  familyRelateCode: string | null;
  /** 계좌대체(I06)가 출고계좌로 쓴다 */
  accountId: number;
  accountInfo: string | null;
}

/** 의무보유기간 기준 — lockUpCode '1'이면 보유기간 체크, lockUpCalcStdCode 'M'은 개월·그 밖은 영업일 */
export interface FltLockupStd {
  lockUpCode: string | null;
  lockUpDays: number | null;
  lockUpCalcStdCode: string | null;
}

/** 정기보고 매매내역 한 행 (I05 Flt10_Tab_RealTransaction, flt10_tr.selectByPeriod) — 사전신고 열은 [Copy]가 실거래 열로 옮기는 값 */
export interface FltRealTr {
  trId: number;
  accountId: number | null;
  accountInfo: string | null;
  accountNo: string | null;
  accountRelateName: string | null;
  accountRelateCode: string | null;
  trType: string | null;
  trTypeName: string | null;
  statusName: string | null;
  checkPeriod: string | null;
  regDate: string | null;
  itemType: string | null;
  itemTypeName: string | null;
  itemName: string | null;
  itemCode: string | null;
  expectTrQty: number | null;
  expectTrAmt: number | null;
  trReason: string | null;
  trDate: string | null;
  trItemType: string | null;
  trItemTypeName: string | null;
  trItemName: string | null;
  trItemCode: string | null;
  trQty: number | null;
  trAmt: number | null;
  trNote: string | null;
  befTrAmt: number | null;
  stkPriceYn: string | null;
  checkTargetYn: string | null;
  apprId: number | null;
  apprRegDate: string | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
}

/** 투자한도·현재 투자금액 (flt02_emp.selectInvestLimit) */
export interface FltEmpLimit {
  investAmtOverCheckYn: boolean | null;
  yearInvestLimit: number | null;
  yearInvestAmt: number | null;
  totalInvestLimit: number | null;
  totalInvestAmt: number | null;
}

/** 정기보고 상신문서 연결 (flt14_relate_appr.selectByStdDate) */
export interface FltRelateAppr {
  relateApprId: number;
  apprId: number;
  apprRegDate: string | null;
  apprTitle: string | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
}

/** 정기보고서 작성 전 점검 결과 — ok=false면 message를 보여 주고 멈춘다 */
export interface FltReportCheck {
  ok: boolean;
  message: string | null;
}

/** 월말 평가금액 한 행 (flt12_book_month.selectByBookDate). bookMonthId는 평가금액을 아직 안 넣은 행이면 행번호 */
export interface FltBookMonth {
  bookMonthId: number;
  accountId: number;
  accountNo: string | null;
  bookDate: string | null;
  itemType: string | null;
  itemTypeName: string | null;
  itemName: string | null;
  itemCode: string | null;
  bookQty: number | null;
  bookAmt: number | null;
  stkPriceYn: boolean | null;
}

/** 계좌대체 한 행 (I06 Flt10_Tab_AcntTransfer, flt10_tr.selectByTrType) — 출고계좌 → 입고계좌 */
export interface FltAcntTransfer {
  trId: number;
  trType: string | null;
  regDate: string;
  trDate: string | null;
  trItemType: string | null;
  trItemTypeName: string | null;
  trItemName: string | null;
  trItemCode: string | null;
  trQty: number | null;
  trAmt: number | null;
  outAccountId: number | null;
  outAccountInfo: string | null;
  accountId: number | null;
  accountInfo: string | null;
}

/** 권리행사/기타입출고 한 행 (I07 Flt10_Tab_RightsExercise, flt10_tr.selectByTrType · 매매구분 FloorTrCode0002) */
export interface FltRightsExercise {
  trId: number;
  trType: string | null;
  trTypeName: string | null;
  regDate: string;
  trDate: string | null;
  accountId: number | null;
  accountInfo: string | null;
  trItemType: string | null;
  trItemTypeName: string | null;
  trItemName: string | null;
  trItemCode: string | null;
  trQty: number | null;
  trAmt: number | null;
  trNote: string | null;
}

/** 매매내역조회 한 행 (I08 Flt10_Tab_TrList, flt10_tr.selectByTrList). 출고는 수량·금액이 음수 */
export interface FltTrList {
  trId: number;
  /** 사원명(부서) — J03 준감인 화면의 첫 열 */
  personOrgName: string | null;
  accountNo: string | null;
  inOutName: string | null;
  trTypeName: string | null;
  regDate: string | null;
  itemName: string | null;
  expectTrQty: number | null;
  expectTrAmt: number | null;
  statusCode: string | null;
  statusName: string | null;
  trDate: string | null;
  trItemTypeName: string | null;
  trItemName: string | null;
  trQty: number | null;
  trAmt: number | null;
  trPlRate: number | null;
  trNote: string | null;
  trReason: string | null;
  rejectReason: string | null;
  addConfirmReason: string | null;
}

/** 임직원매매현황 한 행 (J07 Flt02_Tab_EmpInfo, flt02_emp.selectByCompanyId). empId는 조회 순서 행번호 */
export interface FltEmpInfo {
  empId: number;
  personId: number;
  orgName: string | null;
  personName: string | null;
  oathYnName: string | null;
  familyYnName: string | null;     // '○' 또는 ''
  accountCntStr: string | null;    // 'n건'
  checkCycle: string | null;
  checkCycleName: string | null;
  rcntReportDate: string | null;
  yearInvestLimit: number | null;
  yearInvestAmt: number | null;
  totalInvestAmt: number | null;
  turnoverRate: number | null;
  dailyAvg: number | null;
  violateCntStr: string | null;    // 'n건'
  note: string | null;             // '있음' 또는 ''
  noteDate: string | null;         // 메모(flt15_tr_status)의 기준일
}

/** 임직원매매현황 화면 설정 (기준관리의 연간투자한도 숨김) */
export interface FltEmpInfoSetting {
  investLimitUnvisibleYn: boolean;
}

/** 임직원매매현황 메모 (J07 Flt15_Lookup_Note, flt15_tr_status) */
export interface FltTrStatus {
  trStatusId: number;
  personId: number;
  date: string;
  note: string | null;
}

/** 정기보고현황 한 행 (J06 Flt10_Tab_EmpAppr, flt10_tr.selectEmpAppr). trId는 조회 순서 행번호 */
export interface FltEmpAppr {
  trId: number;
  personId: number;
  orgName: string | null;
  personName: string | null;
  oathYnName: string | null;
  checkCycle: string | null;       // '1' 분기 / 그 밖 월
  checkCycleName: string | null;
  checkApprName: string | null;
}

/** 사원의 정기보고 상신문서 한 행 (J06 Flt10_Grid_EmpAppr, flt10_tr.selectByApprId). trId는 조회 순서 행번호 */
export interface FltEmpApprDoc {
  trId: number;
  apprId: number;
  apprRegDate: string | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
  apprTitle: string | null;
}

/** 위반내역조회 한 행 (I10 Flt10_Tab_ViolateUser · J05 Flt10_Tab_Violate, flt10_tr.selectViolate). trId는 조회 순서 행번호 */
export interface FltViolate {
  trId: number;
  orgName: string | null;
  personName: string | null;
  checkName: string | null;
  checkStd: string | null;
  checkViolate: string | null;
  trDate: string | null;
  trItemName: string | null;
  rejectReason: string | null;
  trNote: string | null;
}

/** 보유내역조회 한 행 (I09 Flt11_Tab_BookList · J04 Flt11_Tab_BookListAdmin, flt11_book.selectByBookList) */
export interface FltBookList {
  bookId: number;
  personOrgName: string | null;    // J04: 사원명(부서)
  checkCycleName: string | null;   // J04: 점검주기
  accountNo: string | null;
  itemTypeName: string | null;
  itemName: string | null;
  bookQty: number | null;
  bookAmt: number | null;
  bookDays: string | null;
  buyDate: string | null;
  yearInvestLimit: number | null;
  totalInvestAmt: number | null;
  turnoverRate: number | null;
}

/** 사전승인(준감인) 한 행 (J02 Flt10_Tab_PreApprove, flt10_tr.selectByCompanyId). 매수·매도 그리드 공용 */
export interface FltPreApprove {
  trId: number;
  personId: number;
  personName: string | null;
  regDate: string | null;
  expectTrDate: string | null;
  itemTypeName: string | null;
  itemName: string | null;
  expectTrQty: number | null;
  expectTrAmt: number | null;
  yearInvestLimitEmp: number | null;
  yearInvestLimitStr: string | null;
  totalInvestAmtStr: string | null;
  turnoverRateStr: string | null;
  bookDays: string | null;
  checkBuyLockup: string | null;
  checkFundHold: string | null;
  statusCode: string | null;
  statusName: string | null;
  trReason: string | null;
  rejectReason: string | null;
  addConfirmerId: number | null;
  addConfirmerName: string | null;
  addStatusName: string | null;
  addConfirmDatetime: string | null;
  addConfirmReason: string | null;
  confirmSmsYn: boolean;
}

/** 사전승인 화면 설정 — 투자한도 열 숨김(기준관리)·협의승인 사용 회사 */
export interface FltPreApproveSetting {
  investLimitUnvisibleYn: boolean;
  addConfirmYn: boolean;
}

/** 기준관리 한 행 (J09, AS-IS Flt01_CompanyStdModel). yn 열은 'true'/'false' 문자열 */
export interface FltCompanyStd {
  companyStdId: number;
  companyId: number;
  startDate: string;
  totalInvestAmt: number | null;
  investAmtCalcTargetCode: string | null;
  investAmtCalcTargetName: string | null;
  investAmtOverCheckYn: string | null;
  investLimitUnvisibleYn: string | null;
  turnoverRate: number | null;
  apprOverRate: number | null;
  apprQtyOverRate: number | null;
  apprValidDays: number | null;
  stdDateType: string | null;
  stdDateTypeName: string | null;
  fundHoldStkYn: string | null;
  lockUpDetailName: string | null;
  rptStartDate: string | null;
  trFileEvidYn: string | null;
  noAccountSkipYn: string | null;
  lockUpCode: string | null;
  lockUpDays: number | null;
  lockUpCalcStdCode: string | null;
  buyOprDayYn: string | null;
  buyOprMonthYn: string | null;
}

/** 의무보유기간 위반 체크 방식 (J09, Flt01_Lookup_LockUpCheckType) */
export interface FltCompanyStdLockup {
  lockUpCode: string | null;
  lockUpDays: number | null;
  lockUpCalcStdCode: string | null;
  buyOprDayYn: string | null;
  buyOprMonthYn: string | null;
}

/** 매수제한종목 한 행 (J09, AS-IS Flt08_BuyLockupModel). 매수제한 검사 결과(`FltBuyLockup`)와 다르다 */
export interface FltBuyLockupItem {
  buyLockupId: number;
  companyId: number;
  itemCode: string | null;
  itemName: string | null;
  startDate: string | null;
  closeDate: string | null;
  lockupType: string | null;
  lockupTypeName: string | null;
}

/** 책임자보고 > 임직원계좌신고내역 (J08) */
export interface FltCeoAccount {
  accountId: number;
  apprEffectDate: string | null;
  checkCycleName: string | null;
  personName: string;
  orgName: string | null;
  corpName: string | null;
  accountNoDec: string | null;
  accountName: string | null;
  familyRelateName: string | null;
}

/** 책임자보고 > 매월신고대상임직원 (J08) */
export interface FltCeoReportPerson {
  trId: number;
  personId: number;
  personName: string;
  orgName: string | null;
  apprEffectDate: string | null;
}

/** 책임자보고 > 임직원매매명세 (J08) */
export interface FltCeoTr {
  trId: number;
  personId: number;
  personName: string;
  orgName: string | null;
  checkCycleName: string | null;
  trYn: string | null;
  depositAmt: number | null;
  totalInvestAmt: number | null;
  corpName: string | null;
  accountNo: string | null;
  accountName: string | null;
  trItemName: string | null;
  trTypeName: string | null;
  regDate: string | null;
  expectTrQty: number | null;
  trDate: string | null;
  trQty: number | null;
  unitPrice: number | null;
  trAmt: number | null;
}

/** 책임자보고 탭 페이지가 부모에게 여는 조회 함수 (AS-IS 탭 클래스의 public retrieve(reportDate, startDate, transCode)) */
export interface FltCeoTabHandle {
  retrieve(stdDate: string, startDate: string, transCode: string): Promise<void>;
}

/** 책임자보고 상신 문서 (J08, A72) */
export interface FltCeoAppr {
  apprId: number;
  statusCode: string | null;
  statusName: string | null;
}
