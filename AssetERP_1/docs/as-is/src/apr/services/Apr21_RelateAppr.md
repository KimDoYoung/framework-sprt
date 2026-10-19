# apr.Apr21_RelateAppr

`server/apr/Apr21_RelateAppr.java`

서비스 키 `apr.Apr21_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`apr21_relate_appr.selectById`](../../apr/sql/apr21_relate_appr.md) | - |  |
| `selectByApprId` | 23 | [`apr21_relate_appr.selectByApprId`](../../apr/sql/apr21_relate_appr.md) | `Apr01_Lookup_RelateAppr`, `Apr03_Page_Relate` |  |
| `insert` | 31 | [`apr21_relate_appr.deleteByApprId`](../../apr/sql/apr21_relate_appr.md), `UpdateDataModel(apr21_relate_appr)` 동적 INSERT/UPDATE | `Apr01_Lookup_RelateAppr` | `UpdateDataModel` |
| `update` | 43 | `UpdateDataModel(apr21_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 48 | `UpdateDataModel(apr21_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
