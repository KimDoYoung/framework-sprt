# ast09_book

`server/ast/mapper/ast09_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 77 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_get_corp_nm`, `f_get_sellpossibleqty`, `f_today` | `ast.Ast09_Book.selectById` |
| `selectByHoldDate` | select | 100 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_sellpossibleqty`, `f_nvl` | `ast.Ast09_Book.selectByHoldDate`, `ast.Ast09_Book.selectByHoldDatePeriod`, `sys.Sys99_Print.insertRdFinanceBook` |
| `selectFinanceByHoldDate` | select | 243 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_sellpossibleqty`, `f_nvl` | `ast.Ast09_Book.selectFinanceByHoldDate`, `sys.Sys99_Print.insertRdFinanceBookOpr2` |
| `selectByHoldDatePeriod` | select | 324 | [`sys99_print`](../../../db/tables/sys.md) |  | `ast.Ast09_Book.selectByHoldDatePeriod` |
| `selectPreDepositByHoldDate` | select | 368 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_corp_nm` | `ast.Ast09_Book.selectPreDepositByHoldDate` |
| `selectDepositCurGroupSum` | select | 391 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) |  | `ast.Ast09_Book.selectDepositCurGroupSum` |
| `selectTargetBook` | select | 420 | [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.updateDepositSellBookAmt`, `ast.Ast06_Tr.updateFxEval` |
| `checkBook` | select | 427 | [`ast09_book`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.updateFxEval` |
| `selectNoEvalFinance` | select | 436 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) | `f_ast_class_tree_nm_allpath` | `act.Act04_GenLedger.insertClose` |
| `selectNoFxEval` | select | 459 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectNoDepn` | select | 476 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md) | `f_ast_class_tree_nm_allpath` | `act.Act04_GenLedger.insertClose` |
| `selectInvestAssetLimit` | select | 509 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast40_owner_capital`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_last_day` | `ast.Ast09_Book.selectInvestAssetLimit`, `sys.Sys99_Print.insertRdFinanceBookOpr1` |
| `getHoldDate` | select | 548 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_sellpossibleqty`, `f_nvl` | `ast.Ast09_Book.getHoldDate` |
| `createFinanceBook` | select | 639 | - | `f_create_financebook` | `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.updateEval`, `ast.Ast06_Tr.updateFinance` |
| `createDepnBook` | select | 643 | - | `f_create_depnbook` | `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.updateDepn`, `ast.Ast06_Tr.updateDepn2`, `ast.Ast06_Tr.updateDepnCost`, `ast.Ast06_Tr.updateDepnEval` |
| `createDepositBook` | select | 647 | - | `f_create_depositbook` | `act.Act02_Journal.updateAll`, `ast.Ast06_Tr.deleteTrDeposit`, `ast.Ast06_Tr.updateDeposit`, `ast.Ast06_Tr.updateDepositSellBookAmt`, `ast.Ast09_Book.createDepositBook` |
| `createDepositBookClose` | select | 651 | - | `f_create_depositbook_close` | `act.Act04_GenLedger.insertClose` |
| `insert` | insert | 655 | [`ast09_book`](../../../db/tables/ast.md) | `f_create_seq` | `ast.Ast06_Tr.updateFxEval` |
| `insertBookClose` | insert | 685 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) | `f_create_seq`, `f_get_account_close_date` | `ast.Ast06_Tr.updateEval` |
| `updateFxPl` | update | 745 | [`ast09_book`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.updateFxEval` |
| `deleteBookClose` | delete | 754 | [`ast11_book_close`](../../../db/tables/ast.md) |  | - |
| `deleteBookCloseByAstId` | delete | 761 | [`ast11_book_close`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.updateEval` |
