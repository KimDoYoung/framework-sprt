# ast30_book_fund_fee

`server/ast/mapper/ast30_book_fund_fee.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 53 | [`ast30_book_fund_fee`](../../../db/tables/ast.md) |  | `ast.Ast30_BookFundFee.selectById` |
| `selectByPreHoldDate` | select | 59 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`sys15_corp`](../../../db/tables/sys.md) |  | `ast.Ast30_BookFundFee.selectByPreHoldDate` |
| `selectByCompanyId` | select | 81 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_calc_dual_fund_fee` | `ast.Ast30_BookFundFee.selectByCompanyId` |
| `whereCondition` | sql | 109 | - |  |  |
| `selectByHoldDatePaging` | select | 115 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_calc_dual_fund_fee` | `ast.Ast30_BookFundFee.selectByHoldDatePaging` |
| `selectByHoldDatePagingTotal` | select | 145 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`sys15_corp`](../../../db/tables/sys.md) |  | `ast.Ast30_BookFundFee.selectByHoldDatePaging` |
| `selectByCorpId` | select | 156 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_calc_dual_fund_fee` | `ast.Ast30_BookFundFee.selectByCorpId` |
| `selectFundFeeBook` | select | 195 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md) | `f_calc_dual_fund_fee`, `f_nvl` | `ast.Ast30_BookFundFee.selectFundFeeBook`, `sys.Sys99_Print.insertRdFundMngFeeState` |
| `selectEvalFundFee` | select | 270 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast31_book_fund_fee_close`](../../../db/tables/ast.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm` | `ast.Ast30_BookFundFee.selectEvalFundFee`, `sys.Sys99_Print.insertRdFundMngFeeClose`, `sys.Sys99_Print.insertRdOfficeMngFeeClose` |
| `selectFeeBookDiff` | select | 338 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz17_dual_manage_fund`](../../../db/tables/biz.md), [`icam10_fee`](../../../db/tables/icam.md), [`icam12_fee_book`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_calc_dual_fund_fee` | `act.Act04_GenLedger.insertClose`, `icam.Icam13_FeeBookCheck.checkFeeBook` |
| `selectFeeBookDiff2` | select | 737 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam12_fee_book`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectNoFeeEval` | select | 784 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast31_book_fund_fee_close`](../../../db/tables/ast.md), [`sys15_corp`](../../../db/tables/sys.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectByContCorpId` | select | 796 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`biz13_with_corp`](../../../db/tables/biz.md) |  | `ast.Ast30_BookFundFee.selectByContCorpId` |
| `selectByStdDate` | select | 811 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md) |  | `ast.Ast30_BookFundFee.selectByStdDate` |
| `insertBookFundFeeClose` | insert | 847 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast31_book_fund_fee_close`](../../../db/tables/ast.md) | `f_create_seq` | `ast.Ast30_BookFundFee.updateEvalFundFee` |
| `insertBookFundFeeRecovery` | insert | 865 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast32_book_fund_fee_recovery`](../../../db/tables/ast.md) | `f_create_seq` | `ast.Ast30_BookFundFee.updateEvalFundFee` |
| `insertBookFundFeeByTrId` | insert | 882 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast31_book_fund_fee_close`](../../../db/tables/ast.md), [`ast32_book_fund_fee_recovery`](../../../db/tables/ast.md) |  | `ast.Ast30_BookFundFee.updateEvalFundFee` |
| `updateFxRate` | update | 913 | [`ast30_book_fund_fee`](../../../db/tables/ast.md) |  | - |
| `updateFixFee` | update | 927 | [`ast30_book_fund_fee`](../../../db/tables/ast.md) |  | `ast.Ast30_BookFundFee.updateEvalFundFee` |
| `deleteBeforeHoldDate` | delete | 943 | [`ast30_book_fund_fee`](../../../db/tables/ast.md) |  | `ast.Ast33_FundTrans.update` |
| `deleteBookFundFeeByTrId` | delete | 952 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast31_book_fund_fee_close`](../../../db/tables/ast.md) |  | `ast.Ast30_BookFundFee.updateEvalFundFee` |
| `deleteBookFundFeeRecoveryByTrId` | delete | 960 | [`ast31_book_fund_fee_close`](../../../db/tables/ast.md), [`ast32_book_fund_fee_recovery`](../../../db/tables/ast.md) |  | `ast.Ast30_BookFundFee.updateEvalFundFee` |
| `deleteBookFundFeeCloseByTrId` | delete | 968 | [`ast31_book_fund_fee_close`](../../../db/tables/ast.md) |  | `ast.Ast30_BookFundFee.updateEvalFundFee` |
