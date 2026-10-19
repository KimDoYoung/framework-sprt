# ast.Ast02_Detail

`server/ast/Ast02_Detail.java`

서비스 키 `ast.Ast02_Detail.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`ast02_detail.selectById`](../../ast/sql/ast02_detail.md) | - |  |
| `selectByCompanyId` | 24 | [`ast02_detail.selectByCompanyId`](../../ast/sql/ast02_detail.md) | `Ast02_Lookup_Detail` |  |
| `selectByCompanyId0` | 31 | [`ast02_detail.selectByCompanyId0`](../../ast/sql/ast02_detail.md) | `Ast01_Tab_InfoManager` |  |
| `selectByClassTreeId` | 38 | [`ast02_detail.selectByClassTreeId`](../../ast/sql/ast02_detail.md) | `Ast02_Grid_Detail`, `Ast02_Grid_DetailManagement` |  |
| `update` | 52 | `UpdateDataModel(ast02_detail)` 동적 INSERT/UPDATE | `Ast01_Tab_InfoManager`, `Ast02_Grid_Detail`, `Ast02_Grid_DetailManagement`, `Ast02_Lookup_Detail` | `UpdateDataModel` |
| `delete` | 57 | `UpdateDataModel(ast02_detail)` 동적 DELETE | `Ast01_Tab_InfoManager`, `Ast02_Grid_Detail`, `Ast02_Grid_DetailManagement`, `Ast02_Lookup_Detail` | `UpdateDataModel` |
