# ast.Ast41_InvestLimit

`server/ast/Ast41_InvestLimit.java`

서비스 키 `ast.Ast41_InvestLimit.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`ast41_invest_limit.selectById`](../../ast/sql/ast41_invest_limit.md) | - |  |
| `selectByCompanyId` | 26 | [`ast41_invest_limit.selectByCompanyId`](../../ast/sql/ast41_invest_limit.md) | `Ast41_Lookup_InvestLimit` |  |
| `selectByDate` | 38 | [`ast41_invest_limit.selectByDate`](../../ast/sql/ast41_invest_limit.md) | `Ast41_Lookup_InvestLimit` |  |
| `insert` | 52 | [`ast41_invest_limit.insert`](../../ast/sql/ast41_invest_limit.md), [`ast41_invest_limit.selectByMaxCompanyId`](../../ast/sql/ast41_invest_limit.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Ast41_Lookup_Insert` |  |
| `deleteByDate` | 88 | [`ast41_invest_limit.deleteByDate`](../../ast/sql/ast41_invest_limit.md) | `Ast41_Lookup_InvestLimit` |  |
| `update` | 101 | `UpdateDataModel(ast41_invest_limit)` 동적 INSERT/UPDATE | `Ast41_Lookup_InvestLimit` | `UpdateDataModel` |
| `delete` | 106 | `UpdateDataModel(ast41_invest_limit)` 동적 DELETE | `Ast41_Lookup_InvestLimit` | `UpdateDataModel` |
