# ast.Ast13_BookDepn

`server/ast/Ast13_BookDepn.java`

서비스 키 `ast.Ast13_BookDepn.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 15 | [`ast13_book_depn.selectById`](../../ast/sql/ast13_book_depn.md) | - |  |
| `selectByDepnDate` | 20 | [`ast13_book_depn.selectByDepnDate`](../../ast/sql/ast13_book_depn.md) | `Ast13_Lookup_BookDepn` |  |
| `selectByDepnDate2` | 25 | [`ast13_book_depn.selectByDepnDate2`](../../ast/sql/ast13_book_depn.md) | `Ast13_Tab_DepnBook` |  |
| `selectOfficeAssets` | 31 | [`ast13_book_depn.selectOfficeAssets`](../../ast/sql/ast13_book_depn.md) | `Ast13_Tab_OfficeAssets` |  |
| `selectOfficeAssetsGroup` | 37 | [`ast13_book_depn.selectOfficeAssetsGroup`](../../ast/sql/ast13_book_depn.md) | `Ast13_Tab_OfficeAssets` |  |
| `getDepnDate2` | 43 | [`ast13_book_depn.getDepnDate2`](../../ast/sql/ast13_book_depn.md) | `Ast13_Tab_DepnBook` |  |
| `checkByDepnDate` | 48 | `ast13_book_depn.checkByDepnDate`(없음), `ast13_book_depn.checkByDepnDateAfter`(없음) | - |  |
| `updateRetireDate` | 72 | [`ast13_book_depn.updateRetireDate`](../../ast/sql/ast13_book_depn.md) | `Ast13_Tab_OfficeAssets` |  |
| `deleteDepn` | 77 | - | - |  |
| `update` | 81 | `UpdateDataModel(ast13_book_depn)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 86 | `UpdateDataModel(ast13_book_depn)` 동적 DELETE | - | `UpdateDataModel` |
