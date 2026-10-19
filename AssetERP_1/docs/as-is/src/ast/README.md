# 도메인: ast

화면 44개, 컴포넌트 9개, 서버 클래스 24개, 매퍼 23개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Ast01_Tab_ClassTreeIntrinsic`](screens/Ast01_Tab_ClassTreeIntrinsic.md) | 고유자산 > 10. 고유자산 등록 > 고유자산 기본등록 ① | 9 | 20 |
| [`Ast01_Tab_ClassTreeManagement`](screens/Ast01_Tab_ClassTreeManagement.md) | 펀드관리 > 80. 펀드자산 > 펀드자산 종목기본 | 7 | 12 |
| [`Ast01_Tab_InfoIntrinsic`](screens/Ast01_Tab_InfoIntrinsic.md) | 고유자산 > 10. 고유자산 등록 > 고유자산 상세등록 ② | 7 | 17 |
| [`Ast01_Tab_InfoManagement`](screens/Ast01_Tab_InfoManagement.md) | 펀드관리 > 80. 펀드자산 > 펀드자산 종목상세 | 7 | 16 |
| [`Ast01_Tab_InfoManager`](screens/Ast01_Tab_InfoManager.md) | 기초자료 > 30. 자산&경영 > 자산상세 항목관리 | 1 | 3 |
| [`Ast05_Tab_TrCodeAdmin`](screens/Ast05_Tab_TrCodeAdmin.md) | 기초자료 > 40. 관리회계 > 거래유형 등록(관리자) | 3 | 10 |
| [`Ast05_Tab_TrCodeIntrinsic`](screens/Ast05_Tab_TrCodeIntrinsic.md) | 관리자 > 05. 관리회계 > 거래유형 등록 | 3 | 9 |
| [`Ast05_Tab_TrCodeManagement`](screens/Ast05_Tab_TrCodeManagement.md) | 펀드관리 > 80. 펀드자산 > 거래코드 관리(운용) | 1 | 3 |
| [`Ast06_Tab_AccruedForIntrinsic`](screens/Ast06_Tab_AccruedForIntrinsic.md) | 관리회계 > 12. 특수회계처리(외화) > 미수/미지급(외화) | 4 | 9 |
| [`Ast06_Tab_AccruedIntrinsic`](screens/Ast06_Tab_AccruedIntrinsic.md) | 관리회계 > 11. 특수회계처리 > 미수/미지급 | 2 | 2 |
| [`Ast06_Tab_AccruedManagement`](screens/Ast06_Tab_AccruedManagement.md) | 펀드관리 > 80. 펀드자산 > 펀드자산 미수/미지급 | 1 | 2 |
| [`Ast06_Tab_EvalDepn`](screens/Ast06_Tab_EvalDepn.md) | 고유자산 > 20. 고유자산 거래처리 > 감가상각처리 | 4 | 9 |
| [`Ast06_Tab_EvalFinance`](screens/Ast06_Tab_EvalFinance.md) | 고유자산 > 20. 고유자산 거래처리 > 금융상품 평가처리 | 5 | 9 |
| [`Ast06_Tab_FxEvalDeposit`](screens/Ast06_Tab_FxEvalDeposit.md) | 관리회계 > 20. 결산 > 외화예금 환평가처리 | 3 | 9 |
| [`Ast06_Tab_TrAcntTransfer`](screens/Ast06_Tab_TrAcntTransfer.md) | 고유자산 > 20. 고유자산 거래처리 > 금융상품 계좌대체 | 4 | 9 |
| [`Ast06_Tab_TrDeposit`](screens/Ast06_Tab_TrDeposit.md) | 관리회계 > 11. 특수회계처리 > 계좌이체 | 3 | 9 |
| [`Ast06_Tab_TrDepositInt`](screens/Ast06_Tab_TrDepositInt.md) | 고유자산 > 40. 예금관리 > 예금/예치금 이자수령; 관리회계 > 11. 특수회계처리 > 예금/예치금 이자수령 | 3 | 8 |
| [`Ast06_Tab_TrFinance`](screens/Ast06_Tab_TrFinance.md) | 고유자산 > 20. 고유자산 거래처리 > 금융상품 거래처리 | 5 | 11 |
| [`Ast06_Tab_TrForDeposit`](screens/Ast06_Tab_TrForDeposit.md) | 관리회계 > 12. 특수회계처리(외화) > 계좌이체(외화) | 3 | 9 |
| [`Ast06_Tab_TrForFinance`](screens/Ast06_Tab_TrForFinance.md) | 고유자산 > 20. 고유자산 거래처리 > 금융상품 거래처리(외화) | 5 | 12 |
| [`Ast06_Tab_TrForIntrinsic`](screens/Ast06_Tab_TrForIntrinsic.md) | 관리회계 > 12. 특수회계처리(외화) > 고유자산 거래처리(외화) | 6 | 13 |
| [`Ast06_Tab_TrIPO`](screens/Ast06_Tab_TrIPO.md) | 고유자산 > 20. 고유자산 거래처리 > 청약처리 | 5 | 12 |
| [`Ast06_Tab_TrIntrinsic`](screens/Ast06_Tab_TrIntrinsic.md) | 관리회계 > 11. 특수회계처리 > 고유자산 거래처리 | 8 | 17 |
| [`Ast06_Tab_TrManagement`](screens/Ast06_Tab_TrManagement.md) | 펀드관리 > 80. 펀드자산 > 펀드자산 거래관리 | 3 | 9 |
| [`Ast06_Tab_TrTax`](screens/Ast06_Tab_TrTax.md) | 자금관리 > 20. 사업비관리 > 세금/4대보험 등록 | 5 | 15 |
| [`Ast09_Tab_DepositBook`](screens/Ast09_Tab_DepositBook.md) | 고유자산 > 40. 예금관리 > 예금잔고대사; 관리회계 > 20. 결산 > 예금잔고대사 | 2 | 10 |
| [`Ast09_Tab_DepositBookPeriod`](screens/Ast09_Tab_DepositBookPeriod.md) | 자금관리 > 10. 자금관리 > 예금잔고조회; 고유자산 > 40. 예금관리 > 예금잔고조회 | 1 | 2 |
| [`Ast09_Tab_FinanceBook`](screens/Ast09_Tab_FinanceBook.md) | 고유자산 > 30. 고유자산 현황 > 금융상품 보유내역 | 1 | 8 |
| [`Ast09_Tab_FinanceBookOpr`](screens/Ast09_Tab_FinanceBookOpr.md) | 고유자산 > 30. 고유자산 현황 > 금융상품 운용내역 | 2 | 7 |
| [`Ast09_Tab_FinanceBookPeriod`](screens/Ast09_Tab_FinanceBookPeriod.md) | 고유자산 > 30. 고유자산 현황 > 금융상품 보유내역(기간조회) | 1 | 2 |
| [`Ast09_Tab_FinanceForBook`](screens/Ast09_Tab_FinanceForBook.md) | 고유자산 > 30. 고유자산 현황 > 금융상품 보유내역(외화) | 1 | 8 |
| [`Ast09_Tab_PreDepositBook`](screens/Ast09_Tab_PreDepositBook.md) | 관리회계 > 21. 회계장부 > 선급금/선급비용 조회 | 1 | 1 |
| [`Ast13_Tab_DepnBook`](screens/Ast13_Tab_DepnBook.md) | 고유자산 > 30. 고유자산 현황 > 감가상각대장 | 2 | 12 |
| [`Ast13_Tab_OfficeAssets`](screens/Ast13_Tab_OfficeAssets.md) | 고유자산 > 30. 고유자산 현황 > 비품관리대장 | 3 | 17 |
| [`Ast25_Tab_Price`](screens/Ast25_Tab_Price.md) | 고유자산 > 20. 고유자산 거래처리 > 금융상품 시세관리 | 1 | 4 |
| [`Ast30_Tab_FundMngFee`](screens/Ast30_Tab_FundMngFee.md) | 관리회계 > 30. 펀드운용보수관리 > 펀드보수현황 | 1 | 1 |
| [`Ast30_Tab_FundMngFeeClose`](screens/Ast30_Tab_FundMngFeeClose.md) | 관리회계 > 30. 펀드운용보수관리 > 운용보수 회계처리 | 2 | 7 |
| [`Ast30_Tab_FundMngFeeState`](screens/Ast30_Tab_FundMngFeeState.md) | 관리회계 > 30. 펀드운용보수관리 > 펀드보수원장 | 2 | 3 |
| [`Ast30_Tab_OfficeMngFeeClose`](screens/Ast30_Tab_OfficeMngFeeClose.md) | 관리회계 > 20. 결산 > 펀드보수 결산처리 | 3 | 9 |
| [`Ast30_Tab_OfficeMngFeeState`](screens/Ast30_Tab_OfficeMngFeeState.md) | 관리회계 > 30. 사무보수관리 > 보수원장 | 2 | 3 |
| [`Ast30_Tab_OfficeMngFeeStatePeriod`](screens/Ast30_Tab_OfficeMngFeeStatePeriod.md) | 관리회계 > 30. 사무보수관리 > 보수원장(기간조회) | 2 | 3 |
| [`Ast33_Tab_FundMngTrans`](screens/Ast33_Tab_FundMngTrans.md) | 관리회계 > 30. 펀드운용보수관리 > 이관펀드 등록 | 3 | 5 |
| [`Ast33_Tab_OfficeMngFundTrans`](screens/Ast33_Tab_OfficeMngFundTrans.md) | 관리회계 > 30. 사무보수관리 > 이관펀드 등록(사무관리) | 4 | 5 |
| [`Ast40_Tab_OwnerCapital`](screens/Ast40_Tab_OwnerCapital.md) | 고유자산 > 10. 고유자산 등록 > 자기자본/투자한도 등록 | 3 | 9 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Ast01_Lookup_ClassTree`](components/Ast01_Lookup_ClassTree.md) | bmt | 1 | 1 |
| [`Ast01_Lookup_CorpAccount`](components/Ast01_Lookup_CorpAccount.md) | act, crd, icam, pay | 1 | 1 |
| [`Ast01_Lookup_Info`](components/Ast01_Lookup_Info.md) | biz, pay | 1 | 1 |
| [`Ast04_Lookup_Cf`](components/Ast04_Lookup_Cf.md) | frm | 1 | 0 |
| [`Ast05_Lookup_TrCode`](components/Ast05_Lookup_TrCode.md) | act | 1 | 3 |
| [`Ast06_Lookup_TrBizCard`](components/Ast06_Lookup_TrBizCard.md) | biz | 1 | 5 |
| [`Ast07_Grid_History`](components/Ast07_Grid_History.md) | pay | 1 | 4 |
| [`Ast07_Lookup_Settle`](components/Ast07_Lookup_Settle.md) | pay | 1 | 5 |
| [`Ast07_Lookup_SettleMulti`](components/Ast07_Lookup_SettleMulti.md) | pay | 1 | 3 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`ast.Ast01_ClassTree`](../ast/services/Ast01_ClassTree.md) | 15 |
| [`ast.Ast02_Detail`](../ast/services/Ast02_Detail.md) | 6 |
| [`ast.Ast03_CfInfo`](../ast/services/Ast03_CfInfo.md) | 5 |
| [`ast.Ast04_Cf`](../ast/services/Ast04_Cf.md) | 5 |
| [`ast.Ast05_TrCode`](../ast/services/Ast05_TrCode.md) | 8 |
| [`ast.Ast06_Tr`](../ast/services/Ast06_Tr.md) | 31 |
| [`ast.Ast07_Settle`](../ast/services/Ast07_Settle.md) | 6 |
| [`ast.Ast08_TrFinance`](../ast/services/Ast08_TrFinance.md) | 1 |
| [`ast.Ast09_Book`](../ast/services/Ast09_Book.md) | 9 |
| [`ast.Ast10_Manager`](../ast/services/Ast10_Manager.md) | 4 |
| [`ast.Ast12_BookReal`](../ast/services/Ast12_BookReal.md) | 4 |
| [`ast.Ast13_BookDepn`](../ast/services/Ast13_BookDepn.md) | 11 |
| [`ast.Ast14_BookFundFee`](../ast/services/Ast14_BookFundFee.md) | 3 |
| [`ast.Ast15_TrCodeWindow`](../ast/services/Ast15_TrCodeWindow.md) | 8 |
| [`ast.Ast16_NonDeductTax`](../ast/services/Ast16_NonDeductTax.md) | 4 |
| [`ast.Ast20_TrTax`](../ast/services/Ast20_TrTax.md) | 2 |
| [`ast.Ast21_Tr4Insure`](../ast/services/Ast21_Tr4Insure.md) | 3 |
| [`ast.Ast24_FxRate`](../ast/services/Ast24_FxRate.md) | 4 |
| [`ast.Ast25_Price`](../ast/services/Ast25_Price.md) | 6 |
| [`ast.Ast30_BookFundFee`](../ast/services/Ast30_BookFundFee.md) | 12 |
| [`ast.Ast33_FundTrans`](../ast/services/Ast33_FundTrans.md) | 4 |
| [`ast.Ast40_OwnerCapital`](../ast/services/Ast40_OwnerCapital.md) | 5 |
| [`ast.Ast41_InvestLimit`](../ast/services/Ast41_InvestLimit.md) | 7 |
| [`ast.Ast80_RelateAppr`](../ast/services/Ast80_RelateAppr.md) | 7 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`ast01_class_tree`](sql/ast01_class_tree.md) | 26 |
| [`ast02_detail`](sql/ast02_detail.md) | 6 |
| [`ast03_cf_info`](sql/ast03_cf_info.md) | 2 |
| [`ast04_cf`](sql/ast04_cf.md) | 7 |
| [`ast05_tr_code`](sql/ast05_tr_code.md) | 10 |
| [`ast06_tr`](sql/ast06_tr.md) | 27 |
| [`ast07_settle`](sql/ast07_settle.md) | 13 |
| [`ast08_tr_finance`](sql/ast08_tr_finance.md) | 2 |
| [`ast09_book`](sql/ast09_book.md) | 22 |
| [`ast10_manager`](sql/ast10_manager.md) | 4 |
| [`ast12_book_real`](sql/ast12_book_real.md) | 2 |
| [`ast13_book_depn`](sql/ast13_book_depn.md) | 8 |
| [`ast15_tr_code_window`](sql/ast15_tr_code_window.md) | 6 |
| [`ast16_non_deduct_tax`](sql/ast16_non_deduct_tax.md) | 2 |
| [`ast20_tr_tax`](sql/ast20_tr_tax.md) | 3 |
| [`ast21_tr_4insure`](sql/ast21_tr_4insure.md) | 4 |
| [`ast24_fx_rate`](sql/ast24_fx_rate.md) | 2 |
| [`ast25_price`](sql/ast25_price.md) | 9 |
| [`ast30_book_fund_fee`](sql/ast30_book_fund_fee.md) | 23 |
| [`ast33_fund_trans`](sql/ast33_fund_trans.md) | 4 |
| [`ast40_owner_capital`](sql/ast40_owner_capital.md) | 3 |
| [`ast41_invest_limit`](sql/ast41_invest_limit.md) | 6 |
| [`ast80_relate_appr`](sql/ast80_relate_appr.md) | 5 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Ast06_Tab_EvalFinance_20260204` | `client/vi/ast/Ast06_Tab_EvalFinance_20260204.java` | `act.Act04_GenLedger.checkClose`, `ast.Ast06_Tr.selectEvalList`, `ast.Ast06_Tr.updateEval`, `sys.Sys12_Calendar.selectBizDate2`, `sys.Sys99_Print.insertRdEvalFinance` |
