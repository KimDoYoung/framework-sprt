# apr14_relate_ast

`server/apr/mapper/apr14_relate_ast.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 34 | [`apr14_relate_ast`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md) |  | - |
| `selectByApprId` | select | 44 | [`apr14_relate_ast`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md) |  | `apr.Apr14_RelateAst.selectByApprId` |
| `deleteByApprId` | delete | 53 | [`apr14_relate_ast`](../../../db/tables/apr.md) |  | - |
