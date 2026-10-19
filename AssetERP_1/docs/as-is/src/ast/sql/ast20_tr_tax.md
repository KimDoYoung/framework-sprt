# ast20_tr_tax

`server/ast/mapper/ast20_tr_tax.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`ast20_tr_tax`](../../../db/tables/ast.md) |  | `ast.Ast20_TrTax.selectById` |
| `selectGenLedgerTax` | select | 22 | [`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md) | `f_get_last_day` | `ast.Ast20_TrTax.selectGenLedgerTax` |
| `deleteByTrId` | delete | 50 | [`ast20_tr_tax`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.delete` |
