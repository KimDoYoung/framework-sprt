# act04_gen_ledger

`server/act/mapper/act04_gen_ledger.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 45 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.selectById` |
| `selectByStdDate1` | select | 55 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`sys01_company`](../../../db/tables/sys.md) | `f_get_account_close_date`, `f_get_quarter_date` | `act.Act04_GenLedger.selectByStdDate1`, `sys.Sys99_Print.insertRdGenLedger` |
| `selectByStdDate2` | select | 186 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.selectByStdDate2`, `sys.Sys99_Print.insertRdGenLedger` |
| `selectCloseStatus` | select | 221 | [`act05_gen_ledger_close`](../../../db/tables/act.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_last_day`, `f_sysdate` | `act.Act04_GenLedger.selectCloseStatus` |
| `selectCloseCount` | select | 242 | [`act05_gen_ledger_close`](../../../db/tables/act.md) |  | `biz.Biz01_Promo.cardClose` |
| `checkCloseCount` | select | 249 | [`act05_gen_ledger_close`](../../../db/tables/act.md) |  | `act.Act02_Journal.updateFixYn`, `act.Act04_GenLedger.checkClose`, `act.Act04_GenLedger.insertClose` |
| `selectCloseDateCount` | select | 256 | [`act05_gen_ledger_close`](../../../db/tables/act.md) |  | `act.Act02_Journal.updateFixYn`, `act.Act04_GenLedger.checkClose`, `act.Act04_GenLedger.insertClose`, `act.Act04_GenLedger.selectBSPL`, `act.Act04_GenLedger.selectFssBSPL` |
| `selectCloseDate` | select | 263 | [`act05_gen_ledger_close`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `summaryGenLedger` | select | 270 | - | `f_create_genledger` | `act.Act04_GenLedger.insertClose`, `act.Act04_GenLedger.summaryGenLedger` |
| `setDateInfo` | select | 274 | - |  | `act.Act04_GenLedger.insertClose` |
| `selectPreMonthLastDay` | select | 278 | - | `f_get_last_day` | `act.Act04_GenLedger.insertClose` |
| `selectByAccountCode` | select | 282 | [`act01_account_code`](../../../db/tables/act.md), `act01list` ⚠DB없음, [`act04_gen_ledger`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md) |  | `act.Act04_GenLedger.selectByAccountCode` |
| `selectCountByAccountCode` | select | 334 | [`act04_gen_ledger`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectBSPL` | select | 420 | [`act01_account_code`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act07_gen_ledger_closetmp`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.selectBSPL` |
| `selectFssBSPL` | select | 514 | [`act01_account_code`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act07_gen_ledger_closetmp`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.selectFssBSPL` |
| `selectBookDiff` | select | 565 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) | `f_ast_class_tree_nm`, `f_get_account_nm`, `f_get_real_account_code` | `act.Act04_GenLedger.insertClose` |
| `selectDepositRealDiff` | select | 598 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectDepositApprStatus` | select | 629 | [`apr01_appr`](../../../db/tables/apr.md), [`ast80_relate_appr`](../../../db/tables/ast.md) | `f_cdnm` | `act.Act04_GenLedger.insertClose` |
| `selectFinanceBookDiff` | select | 639 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) | `f_get_account_nm`, `f_get_real_account_code` | `act.Act04_GenLedger.insertClose` |
| `selectRemDepnCostDiff` | select | 709 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectRemDepnCostDiff2` | select | 748 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md) | `f_get_account_nm`, `f_get_real_account_code` | `act.Act04_GenLedger.insertClose` |
| `selectCurrYearOfficeAssetsDiff` | select | 822 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectNoSlipAccount` | select | 860 | [`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectNoUseAccount` | select | 875 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `selectNoneAccount` | select | 887 | [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md) | `f_cdnm`, `f_get_journal_tr_cd` | `act.Act04_GenLedger.insertClose` |
| `selectTodayBalAmtByAccountCode` | select | 899 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `updateUnApprEarnSurplus` | update | 910 | [`act04_gen_ledger`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `insertUnApprEarnSurplus` | insert | 942 | [`act04_gen_ledger`](../../../db/tables/act.md) | `f_create_seq`, `f_sysdate` | `act.Act04_GenLedger.insertClose` |
| `insertGenLedgerClose` | insert | 959 | [`act04_gen_ledger`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md) | `f_create_seq` | `act.Act04_GenLedger.insertClose` |
| `insertGenLedgerCloseTmp` | insert | 969 | [`act04_gen_ledger`](../../../db/tables/act.md), [`act07_gen_ledger_closetmp`](../../../db/tables/act.md) | `f_create_seq` | `act.Act04_GenLedger.selectBSPL`, `act.Act04_GenLedger.selectFssBSPL` |
| `insertGenLedgerCloseEicp` | insert | 979 | - | `f_create_genledgerclose_eicp` | `act.Act04_GenLedger.insertClose` |
| `insertGenLedgerCloseTmpEicp` | insert | 983 | - | `f_create_genledgerclosetmp_eicp` | `act.Act04_GenLedger.selectBSPL`, `act.Act04_GenLedger.selectFssBSPL` |
| `deleteGenLedgerClose` | delete | 987 | [`act05_gen_ledger_close`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `deleteGenLedgerCloseTmp` | delete | 994 | [`act07_gen_ledger_closetmp`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.selectBSPL`, `act.Act04_GenLedger.selectFssBSPL` |
