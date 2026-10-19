# ast08_tr_finance

`server/ast/mapper/ast08_tr_finance.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 48 | [`ast06_tr`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md) | `f_ast_class_tree_nm`, `f_cdnm` | `ast.Ast08_TrFinance.selectById` |
| `deleteByTrId` | delete | 67 | [`ast08_tr_finance`](../../../db/tables/ast.md) |  | `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.updateEval` |
