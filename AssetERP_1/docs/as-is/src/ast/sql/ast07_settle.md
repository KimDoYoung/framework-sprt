# ast07_settle

`server/ast/mapper/ast07_settle.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md) |  | `ast.Ast07_Settle.selectById`, `ast.Ast07_Settle.update` |
| `selectByTrId` | select | 44 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md) |  | `ast.Ast07_Settle.selectByTrId` |
| `selectSettleList` | sql | 59 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md) | `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note` |  |
| `condition` | sql | 130 | - |  |  |
| `selectByHistory` | select | 149 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md) | `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note` | `ast.Ast07_Settle.selectByHistoryPaging` |
| `selectByHistoryPaing` | select | 155 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md) | `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note` | `ast.Ast07_Settle.selectByHistoryPaging` |
| `selectByHistoryPaingTotal` | select | 165 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md) | `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note` | `ast.Ast07_Settle.selectByHistoryPaging` |
| `sumForAmt` | select | 172 | [`ast07_settle`](../../../db/tables/ast.md) |  | `ast.Ast07_Settle.update` |
| `selectAmt` | select | 181 | [`ast07_settle`](../../../db/tables/ast.md) |  | `ast.Ast07_Settle.update` |
| `countByExpenseId` | select | 196 | [`ast07_settle`](../../../db/tables/ast.md) |  | `pay.Pay50_Expense.initExpenseSettle` |
| `updateAmt` | update | 202 | [`ast07_settle`](../../../db/tables/ast.md) |  | `ast.Ast07_Settle.update` |
| `deleteByTrId` | delete | 209 | [`ast07_settle`](../../../db/tables/ast.md) |  | `act.Act02_Journal.deleteJournalBiz`, `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.deleteTrDeposit`, `ast.Ast33_FundTrans.delete` |
| `insert` | insert | 215 | [`ast07_settle`](../../../db/tables/ast.md) |  | `ast.Ast07_Settle.updateMulti` |
