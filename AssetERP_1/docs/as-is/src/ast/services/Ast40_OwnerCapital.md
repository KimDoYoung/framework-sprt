# ast.Ast40_OwnerCapital

`server/ast/Ast40_OwnerCapital.java`

서비스 키 `ast.Ast40_OwnerCapital.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`ast40_owner_capital.selectById`](../../ast/sql/ast40_owner_capital.md) | - |  |
| `selectByMaxDate` | 24 | [`ast40_owner_capital.selectByMaxDate`](../../ast/sql/ast40_owner_capital.md) | `Ast09_Tab_FinanceBookOpr` |  |
| `selectByDate` | 34 | [`ast40_owner_capital.selectByDate`](../../ast/sql/ast40_owner_capital.md) | `Ast40_Tab_OwnerCapital` |  |
| `update` | 44 | `UpdateDataModel(ast40_owner_capital)` 동적 INSERT/UPDATE | `Ast40_Tab_OwnerCapital` | `UpdateDataModel` |
| `delete` | 49 | `UpdateDataModel(ast40_owner_capital)` 동적 DELETE | `Ast40_Tab_OwnerCapital` | `UpdateDataModel` |
