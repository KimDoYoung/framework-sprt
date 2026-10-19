# pay.Pay21_Rate

`server/pay/Pay21_Rate.java`

서비스 키 `pay.Pay21_Rate.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay21_rate.selectById`](../../pay/sql/pay21_rate.md) | - |  |
| `selectByCode` | 24 | [`pay21_rate.selectByCode`](../../pay/sql/pay21_rate.md) | `Pay21_TabPage_Rate` |  |
| `update` | 34 | `UpdateDataModel(pay21_rate)` 동적 INSERT/UPDATE | `Pay21_TabPage_Rate` | `UpdateDataModel` |
| `delete` | 39 | `UpdateDataModel(pay21_rate)` 동적 DELETE | `Pay21_TabPage_Rate` | `UpdateDataModel` |
