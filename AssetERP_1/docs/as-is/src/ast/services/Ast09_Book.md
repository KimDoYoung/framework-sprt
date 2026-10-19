# ast.Ast09_Book

`server/ast/Ast09_Book.java`

서비스 키 `ast.Ast09_Book.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`ast09_book.selectById`](../../ast/sql/ast09_book.md) | - |  |
| `selectByHoldDate` | 28 | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md) | `Act02_Tab_DepositIoList`, `Ast09_Lookup_Book`, `Ast09_Tab_DepositBook`, `Ast09_Tab_FinanceBook`, `Ast09_Tab_FinanceForBook` |  |
| `selectFinanceByHoldDate` | 46 | [`ast09_book.selectFinanceByHoldDate`](../../ast/sql/ast09_book.md) | `Ast09_Tab_FinanceBookOpr` |  |
| `selectPreDepositByHoldDate` | 52 | [`ast09_book.selectPreDepositByHoldDate`](../../ast/sql/ast09_book.md) | `Ast09_Tab_PreDepositBook` |  |
| `getHoldDate` | 58 | [`ast09_book.getHoldDate`](../../ast/sql/ast09_book.md) | `Ast09_Tab_FinanceBook`, `Ast09_Tab_FinanceForBook` |  |
| `selectByHoldDatePeriod` | 64 | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md), [`ast09_book.selectByHoldDatePeriod`](../../ast/sql/ast09_book.md), [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys12_calendar.selectPeriod`](../../sys/sql/sys12_calendar.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) | `Ast09_Tab_DepositBookPeriod`, `Ast09_Tab_FinanceBookPeriod` | `Calendar` |
| `selectDepositCurGroupSum` | 148 | [`ast09_book.selectDepositCurGroupSum`](../../ast/sql/ast09_book.md) | `Act02_Tab_DepositIoList` |  |
| `selectInvestAssetLimit` | 154 | [`ast09_book.selectInvestAssetLimit`](../../ast/sql/ast09_book.md) | `Ast09_Tab_FinanceBookOpr` |  |
| `createDepositBook` | 163 | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) | `Act02_Tab_DepositIoList`, `Ast06_Tab_FxEvalDeposit`, `Ast09_Tab_DepositBook`, `Ast09_Tab_DepositBookPeriod` |  |
