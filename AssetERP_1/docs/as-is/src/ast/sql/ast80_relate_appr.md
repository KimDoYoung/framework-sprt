# ast80_relate_appr

`server/ast/mapper/ast80_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`ast80_relate_appr`](../../../db/tables/ast.md) |  | `ast.Ast80_RelateAppr.selectById` |
| `selectByCompanyId` | select | 24 | [`apr01_appr`](../../../db/tables/apr.md), [`ast80_relate_appr`](../../../db/tables/ast.md) | `f_cdnm` | `ast.Ast80_RelateAppr.insert`, `ast.Ast80_RelateAppr.selectApprId`, `ast.Ast80_RelateAppr.selectByCompanyId` |
| `updateApprId` | update | 35 | [`ast80_relate_appr`](../../../db/tables/ast.md) |  | `ast.Ast80_RelateAppr.updateApprId` |
| `insert` | insert | 41 | [`ast80_relate_appr`](../../../db/tables/ast.md) |  | `ast.Ast80_RelateAppr.insert` |
| `deleteByApprId` | delete | 57 | [`ast80_relate_appr`](../../../db/tables/ast.md) |  | `ast.Ast80_RelateAppr.insert` |
