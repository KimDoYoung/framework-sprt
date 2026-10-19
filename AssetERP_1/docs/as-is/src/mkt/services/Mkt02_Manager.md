# mkt.Mkt02_Manager

`server/mkt/Mkt02_Manager.java`

서비스 키 `mkt.Mkt02_Manager.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`mkt02_manager.selectById`](../../mkt/sql/mkt02_manager.md) | - |  |
| `selectByTargetCompanyId` | 25 | [`mkt02_manager.selectByTargetCompanyId`](../../mkt/sql/mkt02_manager.md) | `Mkt01_Lookup_TargetCompany` |  |
| `updateTargetCompanyId` | 30 | [`mkt02_manager.updateTargetCompanyId`](../../mkt/sql/mkt02_manager.md) | `Mkt01_Lookup_SelectCompany` |  |
| `update` | 51 | `UpdateDataModel(mkt02_manager)` 동적 INSERT/UPDATE | `Mkt01_Lookup_TargetCompany` | `UpdateDataModel` |
| `delete` | 56 | `UpdateDataModel(mkt02_manager)` 동적 DELETE | `Mkt01_Lookup_TargetCompany` | `UpdateDataModel` |
