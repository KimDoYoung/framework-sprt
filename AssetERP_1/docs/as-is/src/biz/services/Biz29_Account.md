# biz.Biz29_Account

`server/biz/Biz29_Account.java`

서비스 키 `biz.Biz29_Account.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`biz29_account.selectById`](../../biz/sql/biz29_account.md) | - |  |
| `selectByCompanyId` | 22 | [`biz29_account.selectByCompanyId`](../../biz/sql/biz29_account.md) | - |  |
| `selectBySearchText` | 27 | [`biz29_account.selectBySearchText`](../../biz/sql/biz29_account.md) | `Biz29_Lookup_Account` |  |
| `update` | 36 | `UpdateDataModel(biz29_account)` 동적 INSERT/UPDATE | `Biz29_Lookup_Account` | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(biz29_account)` 동적 DELETE | `Biz29_Lookup_Account` | `UpdateDataModel` |
