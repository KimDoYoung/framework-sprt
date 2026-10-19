# ast.Ast24_FxRate

`server/ast/Ast24_FxRate.java`

서비스 키 `ast.Ast24_FxRate.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`ast24_fx_rate.selectById`](../../ast/sql/ast24_fx_rate.md) | - |  |
| `selectByStdDate` | 22 | [`ast24_fx_rate.selectByStdDate`](../../ast/sql/ast24_fx_rate.md) | `Ast24_Lookup_FxRate` |  |
| `update` | 28 | `UpdateDataModel(ast24_fx_rate)` 동적 INSERT/UPDATE | `Ast24_Lookup_FxRate` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(ast24_fx_rate)` 동적 DELETE | `Ast24_Lookup_FxRate` | `UpdateDataModel` |
