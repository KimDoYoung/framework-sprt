# ast.Ast10_Manager

`server/ast/Ast10_Manager.java`

서비스 키 `ast.Ast10_Manager.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`ast10_manager.selectById`](../../ast/sql/ast10_manager.md) | - |  |
| `selectByLinkId` | 23 | [`ast10_manager.selectByLinkId`](../../ast/sql/ast10_manager.md) | `Ast10_Grid_Manager`, `Ast10_Lookup_Manager` |  |
| `update` | 33 | `UpdateDataModel(ast10_manager)` 동적 INSERT/UPDATE | `Ast10_Lookup_Manager` | `UpdateDataModel` |
| `delete` | 38 | `UpdateDataModel(ast10_manager)` 동적 DELETE | `Ast10_Lookup_Manager` | `UpdateDataModel` |
