# mkt.Mkt04_RelateFund

`server/mkt/Mkt04_RelateFund.java`

서비스 키 `mkt.Mkt04_RelateFund.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`mkt04_relate_fund.selectById`](../../mkt/sql/mkt04_relate_fund.md) | - |  |
| `selectByHistoryId` | 21 | [`mkt04_relate_fund.selectByHistoryId`](../../mkt/sql/mkt04_relate_fund.md) | `Mkt03_Lookup_History` |  |
| `updateByList` | 26 | [`mkt04_relate_fund.deleteByHistoryId`](../../mkt/sql/mkt04_relate_fund.md), `UpdateDataModel(mkt04_relate_fund)` 동적 INSERT/UPDATE | `Mkt03_Lookup_History` | `UpdateDataModel` |
| `update` | 35 | `UpdateDataModel(mkt04_relate_fund)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 40 | `UpdateDataModel(mkt04_relate_fund)` 동적 DELETE | `Mkt03_Lookup_History` | `UpdateDataModel` |
