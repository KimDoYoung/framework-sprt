# act02_journal

`server/act/mapper/act02_journal.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 46 | [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count` | `act.Act02_Journal.selectById`, `act.Act02_Journal.update`, `act.Act02_Journal.updateAll`, `act.Act02_Journal.updateFixYn` |
| `selectByTrId` | select | 72 | [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count` | `ast.Ast06_Tr.update` |
| `selectByBizId` | select | 98 | [`act02_journal`](../../../db/tables/act.md) |  | `biz.Biz01_Promo.cardClose` |
| `selectOneJournalIdByTrId` | select | 104 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act02_Journal.createJournalBiz`, `act.Act02_Journal.selectOneJournalIdByTrId` |
| `selectByDate` | select | 110 | [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`pay50_expense`](../../../db/tables/pay.md) | `f_emp_kor_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_relate_dcr_count` | `act.Act02_Journal.selectByDate` |
| `selectByDateAll` | select | 147 | [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count` | `act.Act02_Journal.selectByDateAll` |
| `selectMonthBiz` | select | 187 | [`act02_journal`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md), [`biz55_erp_fee_charge`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm` | `act.Act02_Journal.selectMonthBiz` |
| `selectByAstClassTreeId` | select | 378 | [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md) | `f_cdnm`, `f_get_journal_tr_cd` | `act.Act02_Journal.selectByAstClassTreeId` |
| `countByPayMonthCode` | select | 407 | [`act02_journal`](../../../db/tables/act.md) |  | `pay.Pay10_Month.checkAppr` |
| `createJournal` | select | 418 | - | `f_create_journal` | `act.Act02_Journal.createJournal`, `act.Act02_Journal.createJournalBiz`, `ast.Ast06_Tr.insertByCf`, `ast.Ast06_Tr.updateDepnCost`, `ast.Ast06_Tr.updateDepnEval`, `ast.Ast06_Tr.updateEval`, `ast.Ast06_Tr.updateFxEval`, `ast.Ast07_Settle.delete`, `ast.Ast07_Settle.update`, `ast.Ast07_Settle.updateMulti`, `ast.Ast30_BookFundFee.updateEvalFundFee`, `ast.Ast33_FundTrans.update` |
| `createJournalPayMonth` | select | 422 | - | `f_create_journalpaymonth` | `act.Act02_Journal.createJournalBiz` |
| `createBackJournal` | select | 426 | - | `f_create_back_journal` | `ast.Ast06_Tr.updateEval`, `ast.Ast06_Tr.updateFxEval`, `ast.Ast30_BookFundFee.updateEvalFundFee` |
| `createJournalNo` | select | 430 | - | `f_create_journal_no` | `act.Act02_Journal.update`, `act.Act02_Journal.updateAll` |
| `selectUnFixCount` | select | 438 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `countByTrId` | select | 446 | [`act02_journal`](../../../db/tables/act.md) |  | `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.deleteTrDeposit`, `ast.Ast06_Tr.updateDepositSellBookAmt`, `ast.Ast06_Tr.updateEval`, `ast.Ast06_Tr.updateFxEval`, `ast.Ast07_Settle.delete`, `ast.Ast07_Settle.update`, `ast.Ast30_BookFundFee.updateEvalFundFee`, `ast.Ast33_FundTrans.delete` |
| `countByOrgTrId` | select | 453 | [`act02_journal`](../../../db/tables/act.md), [`ast06_tr`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.updateEval`, `ast.Ast06_Tr.updateFxEval`, `ast.Ast30_BookFundFee.updateEvalFundFee` |
| `getAccountCode` | select | 463 | [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md) | `f_get_account_nm`, `f_get_fss_account_cd` | `act.Act02_Journal.getAccountCode` |
| `getOneAccountCode` | select | 486 | [`act01_account_code`](../../../db/tables/act.md) | `f_get_account_nm` | - |
| `selectFirstJournalDate` | select | 521 | [`act02_journal`](../../../db/tables/act.md) |  | - |
| `insert` | insert | 528 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act02_Journal.updateAll` |
| `update` | update | 550 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act02_Journal.updateAll` |
| `updateCloseYn` | update | 558 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `updateFixYn` | update | 565 | [`act02_journal`](../../../db/tables/act.md) | `f_sysdate` | `act.Act02_Journal.updateFixYn` |
| `updateTrInfo` | update | 573 | [`act02_journal`](../../../db/tables/act.md) |  | `ast.Ast06_Tr.update` |
| `deleteByJournalId` | delete | 581 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act02_Journal.deleteAllByJournalId`, `act.Act02_Journal.deleteJournalBiz`, `pay.Pay50_Expense.deleteJournal` |
| `deleteByBizId` | delete | 587 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act02_Journal.deleteJournalBiz` |
| `deleteByTrId` | delete | 593 | [`act02_journal`](../../../db/tables/act.md), [`ast07_settle`](../../../db/tables/ast.md) |  | `act.Act02_Journal.deleteJournalBiz`, `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.deleteTrDeposit`, `ast.Ast06_Tr.updateDepositSellBookAmt`, `ast.Ast06_Tr.updateEval`, `ast.Ast06_Tr.updateFxEval`, `ast.Ast30_BookFundFee.updateEvalFundFee`, `ast.Ast33_FundTrans.delete` |
| `deleteBackJournal` | delete | 603 | [`act02_journal`](../../../db/tables/act.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.updateEval` |
| `deleteDepositBackJournal` | delete | 617 | [`act02_journal`](../../../db/tables/act.md), [`ast06_tr`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.updateFxEval` |
| `deleteBackJournalByOrgTrId` | delete | 629 | [`act02_journal`](../../../db/tables/act.md), [`ast06_tr`](../../../db/tables/ast.md) |  | `ast.Ast30_BookFundFee.updateEvalFundFee` |
