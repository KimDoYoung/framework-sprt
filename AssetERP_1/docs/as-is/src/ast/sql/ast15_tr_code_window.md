# ast15_tr_code_window

`server/ast/mapper/ast15_tr_code_window.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md) | `f_menu_nm_allpath` | `ast.Ast15_TrCodeWindow.selectById` |
| `selectByAll` | select | 37 | [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md) | `f_menu_nm_allpath` | `ast.Ast15_TrCodeWindow.selectByAll` |
| `selectByClassName` | select | 59 | [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md) |  | `ast.Ast15_TrCodeWindow.selectByClassName` |
| `getTrCode` | select | 90 | [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md) |  | `ast.Ast15_TrCodeWindow.getTrCode` |
| `insertFormAst15` | insert | 107 | [`ast15_tr_code_window`](../../../db/tables/ast.md) | `f_create_seq` | - |
| `deleteClassName` | delete | 119 | [`ast15_tr_code_window`](../../../db/tables/ast.md) |  | `ast.Ast15_TrCodeWindow.insert` |
