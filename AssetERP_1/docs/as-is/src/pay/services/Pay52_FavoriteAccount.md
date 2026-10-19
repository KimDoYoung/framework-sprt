# pay.Pay52_FavoriteAccount

`server/pay/Pay52_FavoriteAccount.java`

서비스 키 `pay.Pay52_FavoriteAccount.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay52_favorite_account.selectById`](../../pay/sql/pay52_favorite_account.md) | - |  |
| `selectByCompanyId` | 24 | [`pay52_favorite_account.selectByCompanyId`](../../pay/sql/pay52_favorite_account.md) | `Pay52_Lookup_AccountCode` |  |
| `insert` | 30 | [`pay52_favorite_account.countByAccountCodeId`](../../pay/sql/pay52_favorite_account.md), [`pay52_favorite_account.insert`](../../pay/sql/pay52_favorite_account.md) | `Pay52_Lookup_AccountCode` |  |
| `update` | 52 | `UpdateDataModel(pay52_favorite_account)` 동적 INSERT/UPDATE | `Pay52_Lookup_AccountCode` | `UpdateDataModel` |
| `delete` | 57 | `UpdateDataModel(pay52_favorite_account)` 동적 DELETE | `Pay52_Lookup_AccountCode` | `UpdateDataModel` |
