# fnd10_book

`server/fnd/mapper/fnd10_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 35 | [`fnd10_book`](../../../db/tables/fnd.md) |  | `fnd.Fnd10_Book.selectById` |
| `selectByRelateAst` | select | 42 | [`ast01_class_tree`](../../../db/tables/ast.md), [`fnd10_book`](../../../db/tables/fnd.md) | `f_ast_class_tree_nm_allpath2` | `fnd.Fnd10_Book.selectByRelateAst` |
| `selectByRelateFnd` | select | 59 | [`ast01_class_tree`](../../../db/tables/ast.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd10_book`](../../../db/tables/fnd.md) |  | `fnd.Fnd10_Book.selectByRelateFnd` |
| `selectIcamBook` | select | 93 | `sjm0jj` ⚠DB없음, `szx0gr` ⚠DB없음, `uzm0ui` ⚠DB없음 |  | - |
| `selectItemList` | select | 123 | [`adv10_book`](../../../db/tables/adv.md), [`adv11_book_extr`](../../../db/tables/adv.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`flt09_fund_item`](../../../db/tables/flt.md), [`fnd10_book`](../../../db/tables/fnd.md), [`fnd11_book_extr`](../../../db/tables/fnd.md) |  | `fnd.Fnd10_Book.selectItemList` |
| `selectFundListByItemCode` | select | 193 | [`adv10_book`](../../../db/tables/adv.md), [`adv11_book_extr`](../../../db/tables/adv.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`flt09_fund_item`](../../../db/tables/flt.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd10_book`](../../../db/tables/fnd.md), [`fnd11_book_extr`](../../../db/tables/fnd.md) |  | `fnd.Fnd10_Book.selectFundListByItemCode` |
| `delete` | delete | 285 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd10_book`](../../../db/tables/fnd.md) |  | - |
| `insert` | insert | 296 | [`fnd10_book`](../../../db/tables/fnd.md) | `f_sysdate` | - |
