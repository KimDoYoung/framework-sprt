# mkt.Mkt05_Share

`server/mkt/Mkt05_Share.java`

서비스 키 `mkt.Mkt05_Share.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`mkt05_share.selectById`](../../mkt/sql/mkt05_share.md) | - |  |
| `selectByParentId` | 21 | [`mkt05_share.selectByParentId`](../../mkt/sql/mkt05_share.md) | `Mkt05_Lookup_Share` |  |
| `selectShareInfo` | 26 | [`mkt05_share.selectShareInfo`](../../mkt/sql/mkt05_share.md) | `Mkt05_Lookup_Share` |  |
| `insertDefaultShare` | 31 | [`mkt05_share.insertDefaultShare`](../../mkt/sql/mkt05_share.md), [`mkt05_share.selectShareInfo`](../../mkt/sql/mkt05_share.md) | `Mkt03_Lookup_History` |  |
| `deleteDefaultShare` | 40 | [`mkt05_share.deleteByParentId`](../../mkt/sql/mkt05_share.md) | `Mkt03_Lookup_History` |  |
| `update` | 45 | `UpdateDataModel(mkt05_share)` 동적 INSERT/UPDATE | `Mkt05_Lookup_Share` | `UpdateDataModel` |
| `delete` | 50 | `UpdateDataModel(mkt05_share)` 동적 DELETE | `Mkt05_Lookup_Share` | `UpdateDataModel` |
