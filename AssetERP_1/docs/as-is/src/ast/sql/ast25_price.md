# ast25_price

`server/ast/mapper/ast25_price.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`ast25_price`](../../../db/tables/ast.md) |  | `ast.Ast25_Price.selectById` |
| `withPrc` | sql | 27 | [`ast25_price`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`icam20_price`](../../../db/tables/icam.md) |  |  |
| `whereCondition` | sql | 63 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) |  |  |
| `selectByStdDatePaging` | select | 87 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast25_price`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`icam20_price`](../../../db/tables/icam.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_cdnm` | `ast.Ast25_Price.selectByStdDatePaging` |
| `selectByStdDatePagingTotal` | select | 100 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast25_price`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`icam20_price`](../../../db/tables/icam.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) |  | `ast.Ast25_Price.selectByStdDatePaging` |
| `checkItemCode` | select | 108 | [`ast25_price`](../../../db/tables/ast.md) |  | `ast.Ast25_Price.upsert` |
| `selectByItemCode` | select | 118 | [`ast25_price`](../../../db/tables/ast.md) |  | `ast.Ast25_Price.insert` |
| `selectHoldItem` | select | 127 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) | `f_cdnm`, `f_get_price` | `ast.Ast25_Price.selectHoldItem` |
| `upsert` | update | 167 | [`ast25_price`](../../../db/tables/ast.md) |  | `ast.Ast25_Price.insert`, `ast.Ast25_Price.upsert` |
