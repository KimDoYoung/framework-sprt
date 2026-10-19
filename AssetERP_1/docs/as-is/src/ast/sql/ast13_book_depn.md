# ast13_book_depn

`server/ast/mapper/ast13_book_depn.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 34 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md) | `f_ast_class_tree_nm_allpath2`, `f_cdnm` | `ast.Ast13_BookDepn.selectById` |
| `selectByDepnDate` | select | 61 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md) | `f_ast_class_tree_nm_allpath2`, `f_cdnm` | `ast.Ast13_BookDepn.selectByDepnDate` |
| `selectByDepnDate2` | select | 99 | [`act02_journal`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md) | `f_ast_class_tree_nm_allpath2`, `f_cdnm` | `ast.Ast13_BookDepn.selectByDepnDate2`, `sys.Sys99_Print.insertRdDepnBook` |
| `getDepnDate2` | select | 155 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md) | `f_cdnm` | `ast.Ast13_BookDepn.getDepnDate2` |
| `selectOfficeAssets` | select | 198 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_ast_class_tree_nm_allpath2`, `f_cdnm` | `ast.Ast13_BookDepn.selectOfficeAssets`, `sys.Sys99_Print.insertRdOfficeAssets` |
| `selectOfficeAssetsGroup` | select | 235 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md) | `f_cdnm` | `ast.Ast13_BookDepn.selectOfficeAssetsGroup` |
| `selectByPurTrId` | select | 261 | [`ast13_book_depn`](../../../db/tables/ast.md) | `f_get_account_close_date` | `ast.Ast06_Tr.updateDepnEval` |
| `updateRetireDate` | update | 274 | [`ast13_book_depn`](../../../db/tables/ast.md) |  | `ast.Ast13_BookDepn.updateRetireDate` |
