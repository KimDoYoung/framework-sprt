# act06_journal_tmp

`server/act/mapper/act06_journal_tmp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`act02_journal`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_get_account_nm`, `f_get_journal_corp_nm` | `act.Act06_JournalTmp.selectById` |
| `selectByJournalId` | select | 41 | [`act02_journal`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_get_account_nm`, `f_get_journal_corp_nm` | `act.Act06_JournalTmp.selectByJournalId` |
| `selectByJournalId2` | select | 54 | [`act02_journal`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_get_account_nm`, `f_get_journal_corp_nm` | `act.Act02_Journal.updateAll` |
| `insert` | insert | 67 | [`act06_journal_tmp`](../../../db/tables/act.md) |  | `act.Act02_Journal.updateAll` |
| `deleteByJournalId` | delete | 83 | [`act06_journal_tmp`](../../../db/tables/act.md) |  | `act.Act02_Journal.delete`, `act.Act02_Journal.deleteAllByJournalId`, `act.Act02_Journal.deleteJournalBiz`, `act.Act02_Journal.updateAll`, `pay.Pay50_Expense.deleteJournal` |
| `deleteByTrId` | delete | 89 | [`act02_journal`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`ast07_settle`](../../../db/tables/ast.md) |  | `act.Act02_Journal.deleteJournalBiz`, `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.deleteTrDeposit`, `ast.Ast06_Tr.updateDepositSellBookAmt`, `ast.Ast06_Tr.updateEval`, `ast.Ast06_Tr.updateFxEval`, `ast.Ast30_BookFundFee.updateEvalFundFee`, `ast.Ast33_FundTrans.delete` |
| `deleteByBizId` | delete | 101 | [`act02_journal`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md) |  | `act.Act02_Journal.deleteJournalBiz` |
| `deleteBackJournalByOrgTrId` | delete | 109 | [`act02_journal`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`ast06_tr`](../../../db/tables/ast.md) |  | `ast.Ast30_BookFundFee.updateEvalFundFee` |
