# ast40_owner_capital

`server/ast/mapper/ast40_owner_capital.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`ast40_owner_capital`](../../../db/tables/ast.md) |  | `ast.Ast40_OwnerCapital.selectById` |
| `selectByMaxDate` | select | 20 | [`ast40_owner_capital`](../../../db/tables/ast.md), [`sys01_company`](../../../db/tables/sys.md) | `f_get_last_day` | `ast.Ast40_OwnerCapital.selectByMaxDate` |
| `selectByDate` | select | 35 | [`ast40_owner_capital`](../../../db/tables/ast.md) |  | `ast.Ast40_OwnerCapital.selectByDate` |
