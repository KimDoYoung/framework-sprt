# apr.Apr92_ApprModi

`server/apr/Apr92_ApprModi.java`

서비스 키 `apr.Apr92_ApprModi.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`apr92_appr_modi.selectById`](../../apr/sql/apr92_appr_modi.md) | - |  |
| `selectByPersonId` | 23 | [`apr92_appr_modi.selectByPersonId`](../../apr/sql/apr92_appr_modi.md) | `Apr01_Edit_ApprModi`, `Apr03_Page_Relate` |  |
| `insert` | 33 | [`apr92_appr_modi.insert`](../../apr/sql/apr92_appr_modi.md) | - |  |
| `deleteByApprId` | 55 | [`apr92_appr_modi.deleteByApprId`](../../apr/sql/apr92_appr_modi.md) | `Apr01_Edit_ApprDoc` |  |
| `update` | 60 | `UpdateDataModel(apr92_appr_modi)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 65 | `UpdateDataModel(apr92_appr_modi)` 동적 DELETE | - | `UpdateDataModel` |
