# ast41_invest_limit

`server/ast/mapper/ast41_invest_limit.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`ast41_invest_limit`](../../../db/tables/ast.md) |  | `ast.Ast41_InvestLimit.selectById` |
| `selectByCompanyId` | select | 24 | [`ast41_invest_limit`](../../../db/tables/ast.md) |  | `ast.Ast41_InvestLimit.selectByCompanyId` |
| `selectByMaxCompanyId` | select | 33 | [`ast41_invest_limit`](../../../db/tables/ast.md) |  | `ast.Ast41_InvestLimit.insert` |
| `selectByDate` | select | 44 | [`ast41_invest_limit`](../../../db/tables/ast.md) | `f_cdnm` | `ast.Ast41_InvestLimit.selectByDate` |
| `insert` | insert | 52 | [`ast41_invest_limit`](../../../db/tables/ast.md) |  | `ast.Ast41_InvestLimit.insert` |
| `deleteByDate` | delete | 73 | [`ast41_invest_limit`](../../../db/tables/ast.md) |  | `ast.Ast41_InvestLimit.deleteByDate` |
