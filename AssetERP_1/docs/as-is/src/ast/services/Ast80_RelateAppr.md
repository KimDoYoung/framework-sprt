# ast.Ast80_RelateAppr

`server/ast/Ast80_RelateAppr.java`

서비스 키 `ast.Ast80_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`ast80_relate_appr.selectById`](../../ast/sql/ast80_relate_appr.md) | - |  |
| `selectByCompanyId` | 26 | [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md) | `Act02_Tab_DepositIoList`, `Ast09_Tab_DepositBook`, `Ast09_Tab_FinanceBook`, `Ast09_Tab_FinanceForBook`, `Ast13_Tab_DepnBook`, `Ast13_Tab_OfficeAssets` |  |
| `selectApprId` | 42 | [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md) | `Ast09_Tab_DepositBook` |  |
| `insert` | 58 | [`ast80_relate_appr.deleteByApprId`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.insert`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Act02_Tab_DepositIoList`, `Ast09_Tab_DepositBook`, `Ast09_Tab_FinanceBook`, `Ast09_Tab_FinanceForBook`, `Ast13_Tab_DepnBook`, `Ast13_Tab_OfficeAssets` |  |
| `updateApprId` | 95 | [`ast80_relate_appr.updateApprId`](../../ast/sql/ast80_relate_appr.md) | `Act02_Tab_DepositIoList`, `Ast09_Tab_DepositBook`, `Ast09_Tab_FinanceBook`, `Ast09_Tab_FinanceForBook`, `Ast13_Tab_DepnBook`, `Ast13_Tab_OfficeAssets` |  |
| `update` | 104 | `UpdateDataModel(ast80_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 109 | `UpdateDataModel(ast80_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
