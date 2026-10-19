# ast21_tr_4insure

`server/ast/mapper/ast21_tr_4insure.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 41 | [`ast21_tr_4insure`](../../../db/tables/ast.md) |  | `ast.Ast21_Tr4Insure.selectById` |
| `selectGenLedgerInsure` | select | 47 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md) | `f_get_last_day` | `ast.Ast21_Tr4Insure.selectGenLedgerInsure` |
| `selectExpenseAppr` | select | 69 | [`ast06_tr`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md) |  | `ast.Ast21_Tr4Insure.selectExpenseAppr` |
| `deleteByTrId` | delete | 136 | [`ast21_tr_4insure`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.delete` |
