# mkt.Mkt06_Favorite

`server/mkt/Mkt06_Favorite.java`

서비스 키 `mkt.Mkt06_Favorite.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`mkt06_favorite.selectById`](../../mkt/sql/mkt06_favorite.md) | - |  |
| `update` | 27 | `UpdateDataModel(mkt06_favorite)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `modelUpdate` | 32 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(mkt06_favorite)` 동적 INSERT/UPDATE | `Mkt01_Lookup_Favorite` | `UpdateDataModel` |
| `delete` | 46 | `UpdateDataModel(mkt06_favorite)` 동적 DELETE | - | `UpdateDataModel` |
| `deleteList` | 51 | [`mkt06_favorite.deleteFavoriteId`](../../mkt/sql/mkt06_favorite.md), `UpdateDataModel(mkt06_favorite)` 동적 DELETE | `Mkt01_Lookup_Favorite` | `UpdateDataModel` |
