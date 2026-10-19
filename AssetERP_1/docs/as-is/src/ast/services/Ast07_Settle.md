# ast.Ast07_Settle

`server/ast/Ast07_Settle.java`

서비스 키 `ast.Ast07_Settle.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`ast07_settle.selectById`](../../ast/sql/ast07_settle.md) | - |  |
| `selectByTrId` | 32 | [`ast07_settle.selectByTrId`](../../ast/sql/ast07_settle.md) | `Ast07_Grid_ForSettle`, `Ast07_Grid_Settle` |  |
| `selectByHistoryPaging` | 44 | [`ast07_settle.selectByHistory`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectByHistoryPaing`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectByHistoryPaingTotal`](../../ast/sql/ast07_settle.md) | `Ast07_Grid_ForHistory`, `Ast07_Grid_History` |  |
| `update` | 169 | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast07_settle.selectAmt`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectById`](../../ast/sql/ast07_settle.md), [`ast07_settle.sumForAmt`](../../ast/sql/ast07_settle.md), [`ast07_settle.updateAmt`](../../ast/sql/ast07_settle.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 INSERT/UPDATE | `Ast07_Lookup_ForSettle`, `Ast07_Lookup_Settle` | `UpdateDataModel` |
| `updateMulti` | 277 | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast07_settle.insert`](../../ast/sql/ast07_settle.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Ast07_Lookup_SettleMulti` |  |
| `delete` | 350 | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 DELETE | `Ast07_Grid_ForHistory`, `Ast07_Grid_ForSettle`, `Ast07_Grid_History`, `Ast07_Grid_Settle` | `UpdateDataModel` |
