# ast02_detail

`server/ast/mapper/ast02_detail.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`ast02_detail`](../../../db/tables/ast.md) |  | `ast.Ast02_Detail.selectById` |
| `selectByCompanyId` | select | 25 | [`ast02_detail`](../../../db/tables/ast.md) |  | `ast.Ast02_Detail.selectByCompanyId` |
| `selectByCompanyId0` | select | 37 | [`ast02_detail`](../../../db/tables/ast.md) |  | `ast.Ast02_Detail.selectByCompanyId0` |
| `selectByClassTreeId` | select | 52 | [`ast02_detail`](../../../db/tables/ast.md) |  | `ast.Ast02_Detail.selectByClassTreeId` |
| `insertFromAst02` | select | 61 | [`ast02_detail`](../../../db/tables/ast.md) | `f_create_seq` | - |
| `deleteByAstClassTreeId` | delete | 85 | [`ast02_detail`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.delete` |
