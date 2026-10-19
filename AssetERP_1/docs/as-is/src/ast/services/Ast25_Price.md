# ast.Ast25_Price

`server/ast/Ast25_Price.java`

서비스 키 `ast.Ast25_Price.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`ast25_price.selectById`](../../ast/sql/ast25_price.md) | - |  |
| `selectByStdDatePaging` | 26 | [`ast25_price.selectByStdDatePaging`](../../ast/sql/ast25_price.md), [`ast25_price.selectByStdDatePagingTotal`](../../ast/sql/ast25_price.md) | `Ast25_Tab_Price` |  |
| `selectHoldItem` | 32 | [`ast25_price.selectHoldItem`](../../ast/sql/ast25_price.md) | `Ast25_Lookup_Price` |  |
| `upsert` | 38 | [`ast25_price.checkItemCode`](../../ast/sql/ast25_price.md), [`ast25_price.upsert`](../../ast/sql/ast25_price.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Ast25_Tab_Price` |  |
| `insert` | 75 | [`ast25_price.selectByItemCode`](../../ast/sql/ast25_price.md), [`ast25_price.upsert`](../../ast/sql/ast25_price.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Ast25_Lookup_Price` |  |
| `delete` | 110 | `UpdateDataModel(ast25_price)` 동적 DELETE | `Ast25_Tab_Price` | `UpdateDataModel` |
