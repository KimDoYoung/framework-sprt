# biz.Biz03_AccountMap

`server/biz/Biz03_AccountMap.java`

서비스 키 `biz.Biz03_AccountMap.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`biz03_account_map.selectById`](../../biz/sql/biz03_account_map.md) | - |  |
| `selectByUseItemCode` | 23 | [`biz03_account_map.selectByUseItemCode`](../../biz/sql/biz03_account_map.md) | `Biz03_Lookup_AccountMap` |  |
| `update` | 32 | `UpdateDataModel(biz03_account_map)` 동적 INSERT/UPDATE | `Biz03_Lookup_AccountMap` | `UpdateDataModel` |
| `delete` | 37 | `UpdateDataModel(biz03_account_map)` 동적 DELETE | `Biz03_Lookup_AccountMap` | `UpdateDataModel` |
