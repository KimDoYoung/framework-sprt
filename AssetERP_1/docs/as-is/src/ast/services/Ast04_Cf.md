# ast.Ast04_Cf

`server/ast/Ast04_Cf.java`

서비스 키 `ast.Ast04_Cf.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`ast04_cf.selectById`](../../ast/sql/ast04_cf.md) | - |  |
| `selectByRelateId` | 24 | [`ast04_cf.selectByRelateId`](../../ast/sql/ast04_cf.md) | `Monitoring_Page_DayList` |  |
| `selectByCfInfoId` | 38 | [`ast04_cf.selectByCfInfoId`](../../ast/sql/ast04_cf.md) | `Ast03_Lookup_CfInfo` |  |
| `update` | 50 | `UpdateDataModel(ast04_cf)` 동적 INSERT/UPDATE | `Ast03_Lookup_CfInfo` | `UpdateDataModel` |
| `delete` | 55 | `UpdateDataModel(ast04_cf)` 동적 DELETE | `Ast03_Lookup_CfInfo` | `UpdateDataModel` |
