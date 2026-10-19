# pay.Pay01_Annual

`server/pay/Pay01_Annual.java`

서비스 키 `pay.Pay01_Annual.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay01_annual.selectById`](../../pay/sql/pay01_annual.md) | - |  |
| `selectByAll` | 24 | [`pay01_annual.selectByAll`](../../pay/sql/pay01_annual.md) | `Pay01_Tab_Annual`, `Pay01_Tab_AnnualList` |  |
| `selectByPersonId` | 39 | [`pay01_annual.selectByPersonId`](../../pay/sql/pay01_annual.md) | `Pay01_Tab_Annual`, `Pay01_Tab_AnnualList`, `Pay01_Tab_AnnualPerson` |  |
| `updateApprId` | 45 | [`pay01_annual.updateApprId`](../../pay/sql/pay01_annual.md) | `Pay01_Tab_Annual` |  |
| `update` | 54 | `UpdateDataModel(pay01_annual)` 동적 INSERT/UPDATE | `Pay01_Tab_Annual` | `UpdateDataModel` |
| `delete` | 59 | `UpdateDataModel(pay01_annual)` 동적 DELETE | `Pay01_Tab_Annual` | `UpdateDataModel` |
