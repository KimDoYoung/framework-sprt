# bmt.Bmt01_Buy

`server/bmt/Bmt01_Buy.java`

서비스 키 `bmt.Bmt01_Buy.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`bmt01_buy.selectById`](../../bmt/sql/bmt01_buy.md) | - |  |
| `selectByCompanyId` | 23 | [`bmt01_buy.selectByCompanyId`](../../bmt/sql/bmt01_buy.md) | `Bmt01_Tab_Buy` |  |
| `update` | 35 | `UpdateDataModel(bmt01_buy)` 동적 INSERT/UPDATE | `Bmt01_Tab_Buy` | `UpdateDataModel` |
| `delete` | 40 | `UpdateDataModel(bmt01_buy)` 동적 DELETE | `Bmt01_Tab_Buy` | `UpdateDataModel` |
