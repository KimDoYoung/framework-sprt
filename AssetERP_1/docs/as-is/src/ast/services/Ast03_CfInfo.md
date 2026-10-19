# ast.Ast03_CfInfo

`server/ast/Ast03_CfInfo.java`

서비스 키 `ast.Ast03_CfInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`ast03_cf_info.selectById`](../../ast/sql/ast03_cf_info.md) | - |  |
| `selectByClassTreeId` | 31 | [`ast03_cf_info.selectByClassTreeId`](../../ast/sql/ast03_cf_info.md) | `Ast03_Lookup_CfInfo` |  |
| `bacthUpdate` | 43 | [`ast04_cf.bizDate`](../../ast/sql/ast04_cf.md), [`ast04_cf.deleteByCfInfoId`](../../ast/sql/ast04_cf.md), [`ast04_cf.insert`](../../ast/sql/ast04_cf.md), [`ast04_cf.lastDate`](../../ast/sql/ast04_cf.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast03_cf_info)` 동적 INSERT/UPDATE | `Ast03_Lookup_CfAutoCreate` | `Calendar`, `UpdateDataModel` |
| `update` | 135 | `UpdateDataModel(ast03_cf_info)` 동적 INSERT/UPDATE | `Ast03_Lookup_CfInfo` | `UpdateDataModel` |
| `delete` | 140 | `UpdateDataModel(ast03_cf_info)` 동적 DELETE | `Ast03_Lookup_CfInfo` | `UpdateDataModel` |
