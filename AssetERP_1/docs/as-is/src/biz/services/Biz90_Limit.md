# biz.Biz90_Limit

`server/biz/Biz90_Limit.java`

서비스 키 `biz.Biz90_Limit.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`biz90_limit.selectById`](../../biz/sql/biz90_limit.md) | - |  |
| `selectByCompanyId` | 23 | [`biz90_limit.selectByCompanyId`](../../biz/sql/biz90_limit.md) | `Biz90_Tab_Limit` |  |
| `update` | 31 | `UpdateDataModel(biz90_limit)` 동적 INSERT/UPDATE | `Biz90_Tab_Limit` | `UpdateDataModel` |
| `delete` | 36 | `UpdateDataModel(biz90_limit)` 동적 DELETE | `Biz90_Tab_Limit` | `UpdateDataModel` |
