# ast05_tr_code

`server/ast/mapper/ast05_tr_code.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `ast.Ast05_TrCode.selectById` |
| `selectByTrCode` | select | 46 | [`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `ast.Ast01_ClassTree.selectByTrCode`, `ast.Ast05_TrCode.selectByTrCode`, `ast.Ast33_FundTrans.update` |
| `selectByCompanyId` | select | 64 | [`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `ast.Ast05_TrCode.selectByCompanyId` |
| `selectBySearchText` | select | 87 | [`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `ast.Ast05_TrCode.selectBySearchText` |
| `checkTrCode` | select | 110 | [`ast05_tr_code`](../../../db/tables/ast.md) |  | `ast.Ast05_TrCode.update` |
| `selectByWindowClassName` | select | 118 | [`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `ast.Ast05_TrCode.selectByWindowClassName` |
| `insertInitData` | insert | 143 | [`ast05_tr_code`](../../../db/tables/ast.md) | `f_create_seq` | `ast.Ast05_TrCode.insertInitData` |
| `insertFormAst05` | insert | 168 | [`ast05_tr_code`](../../../db/tables/ast.md) | `f_create_seq` | - |
| `deleteByTrCode` | delete | 189 | [`ast05_tr_code`](../../../db/tables/ast.md) |  | `ast.Ast05_TrCode.insertInitData` |
| `selectByTrCodeWindow` | select | 196 | [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md) |  | - |
