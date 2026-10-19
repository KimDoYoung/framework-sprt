# act.Act13_RealAccountMap

`server/act/Act13_RealAccountMap.java`

서비스 키 `act.Act13_RealAccountMap.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`act13_real_account_map.selectById`](../../act/sql/act13_real_account_map.md) | - |  |
| `selectByCompanyId` | 25 | [`act13_real_account_map.selectByCompanyId`](../../act/sql/act13_real_account_map.md) | `Act13_Tab_RealAccountMap` |  |
| `selectByAstClassTreeId` | 31 | [`act13_real_account_map.selectByAstClassTreeId`](../../act/sql/act13_real_account_map.md) | `Act02_Tab_JournalSub` |  |
| `getAccountName` | 37 | [`act13_real_account_map.getAccountName`](../../act/sql/act13_real_account_map.md) | `Emp50_Tab_TransportExpenseMng` |  |
| `insertInitData` | 55 | [`act13_real_account_map.deleteByAccountMap`](../../act/sql/act13_real_account_map.md), [`act13_real_account_map.insertInitData`](../../act/sql/act13_real_account_map.md) | `Act13_Tab_RealAccountMap` |  |
| `update` | 73 | `UpdateDataModel(act13_real_account_map)` 동적 INSERT/UPDATE | `Act13_Tab_RealAccountMap` | `UpdateDataModel` |
| `delete` | 78 | `UpdateDataModel(act13_real_account_map)` 동적 DELETE | `Act13_Tab_RealAccountMap` | `UpdateDataModel` |
