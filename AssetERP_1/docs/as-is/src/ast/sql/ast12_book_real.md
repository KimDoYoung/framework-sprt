# ast12_book_real

`server/ast/mapper/ast12_book_real.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md) | `f_cdnm`, `f_get_corp_nm` | `ast.Ast12_BookReal.selectById` |
| `selectByHoldDate` | select | 45 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_cdnm`, `f_create_seq`, `f_get_corp_nm` | `ast.Ast12_BookReal.selectByHoldDate` |
