# ast.Ast12_BookReal

`server/ast/Ast12_BookReal.java`

서비스 키 `ast.Ast12_BookReal.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`ast12_book_real.selectById`](../../ast/sql/ast12_book_real.md) | - |  |
| `selectByHoldDate` | 22 | [`ast12_book_real.selectByHoldDate`](../../ast/sql/ast12_book_real.md) | `Ast12_Lookup_RealDeposit` |  |
| `update` | 27 | `UpdateDataModel(ast12_book_real)` 동적 INSERT/UPDATE | `Ast12_Lookup_RealDeposit` | `UpdateDataModel` |
| `delete` | 51 | `UpdateDataModel(ast12_book_real)` 동적 DELETE | - | `UpdateDataModel` |
