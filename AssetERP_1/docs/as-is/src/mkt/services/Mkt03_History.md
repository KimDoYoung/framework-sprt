# mkt.Mkt03_History

`server/mkt/Mkt03_History.java`

서비스 키 `mkt.Mkt03_History.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`mkt03_history.selectById`](../../mkt/sql/mkt03_history.md) | - |  |
| `selectByTargetCompanyId` | 24 | [`mkt03_history.selectByTargetCompanyId`](../../mkt/sql/mkt03_history.md) | `Mkt03_Grid_History`, `Mkt03_Tab_HistoryManager` |  |
| `selectByRegDate` | 29 | [`mkt03_history.selectByRegDate`](../../mkt/sql/mkt03_history.md) | `Monitoring_Page_Relate` |  |
| `checkByTargetCompanyId` | 34 | [`mkt03_history.checkByTargetCompanyId`](../../mkt/sql/mkt03_history.md) | `Mkt01_Grid_TargetCompany` |  |
| `updateOne` | 48 | `UpdateDataModel(mkt03_history)` 동적 INSERT/UPDATE | `Mkt03_Lookup_History` | `UpdateDataModel` |
| `update` | 56 | `UpdateDataModel(mkt03_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 61 | [`mkt04_relate_fund.deleteByHistoryId`](../../mkt/sql/mkt04_relate_fund.md), [`mkt05_share.deleteByParentId`](../../mkt/sql/mkt05_share.md), `UpdateDataModel(mkt03_history)` 동적 DELETE | `Mkt03_Grid_History` | `UpdateDataModel` |
