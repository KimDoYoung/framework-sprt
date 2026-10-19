# biz.Biz15_Share

`server/biz/Biz15_Share.java`

서비스 키 `biz.Biz15_Share.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`biz15_share.selectById`](../../biz/sql/biz15_share.md) | - |  |
| `selectByContHistoryId` | 25 | [`biz15_share.selectByContHistoryId`](../../biz/sql/biz15_share.md) | `Biz11_Edit_ContHistory` |  |
| `insert` | 35 | [`biz15_share.insert`](../../biz/sql/biz15_share.md) | `Biz11_Edit_ContHistory` |  |
| `update` | 44 | `UpdateDataModel(biz15_share)` 동적 INSERT/UPDATE | `Biz11_Edit_ContHistory` | `UpdateDataModel` |
| `delete` | 49 | `UpdateDataModel(biz15_share)` 동적 DELETE | `Biz11_Edit_ContHistory` | `UpdateDataModel` |
