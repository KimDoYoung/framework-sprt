# apr.Apr03_RelateFund

`server/apr/Apr03_RelateFund.java`

서비스 키 `apr.Apr03_RelateFund.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByApprId` | 22 | [`apr03_relate_fund.selectByApprId`](../../apr/sql/apr03_relate_fund.md) | `Apr03_Page_Relate`, `Apr03_TabPage_Relate` |  |
| `selectByClassTreeId` | 32 | [`apr03_relate_fund.selectByClassTreeId`](../../apr/sql/apr03_relate_fund.md) | `Apr05_Grid_RelateAprList` |  |
| `selectByClassTreeId2` | 51 | `apr03_relate_fund.selectByClassTreeId2`(없음) | - |  |
| `selectByIcsClassTreeId` | 74 | [`apr03_relate_fund.selectByIcsClassTreeId`](../../apr/sql/apr03_relate_fund.md) | `Ics01_Grid_ApprList` |  |
| `selectBySearch` | 90 | [`apr03_relate_fund.selectBySearch`](../../apr/sql/apr03_relate_fund.md) | `Apr05_Grid_RelateAprList` |  |
| `selectByAfterYn` | 109 | [`apr03_relate_fund.selectByAfterYn`](../../apr/sql/apr03_relate_fund.md) | `Apr01_Lookup_RelateFund` |  |
| `insert` | 118 | [`apr03_relate_fund.deleteByAfterYn`](../../apr/sql/apr03_relate_fund.md), `UpdateDataModel(apr03_relate_fund)` 동적 INSERT/UPDATE | `Apr01_Lookup_RelateFund` | `UpdateDataModel` |
| `update` | 131 | `UpdateDataModel(apr03_relate_fund)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 140 | `UpdateDataModel(apr03_relate_fund)` 동적 DELETE | `Apr03_Page_Relate` | `UpdateDataModel` |
