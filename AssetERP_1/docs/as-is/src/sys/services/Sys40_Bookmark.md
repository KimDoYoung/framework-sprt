# sys.Sys40_Bookmark

`server/sys/Sys40_Bookmark.java`

서비스 키 `sys.Sys40_Bookmark.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`sys40_bookmark.selectById`](../../sys/sql/sys40_bookmark.md) | - |  |
| `selectBySearchText` | 24 | [`sys40_bookmark.selectBySearchText`](../../sys/sql/sys40_bookmark.md) | `Sys40_Lookup_Bookmark` |  |
| `insertMenuId` | 34 | [`sys40_bookmark.insertMenuId`](../../sys/sql/sys40_bookmark.md), [`sys40_bookmark.selectByMenuId`](../../sys/sql/sys40_bookmark.md) | `Sys06_Lookup_SearchMenu` |  |
| `deleteMenuId` | 48 | [`sys40_bookmark.deleteMenuId`](../../sys/sql/sys40_bookmark.md) | `Sys06_Lookup_SearchMenu` |  |
| `deleteAll` | 58 | [`sys40_bookmark.deleteAll`](../../sys/sql/sys40_bookmark.md) | `Sys40_Lookup_Bookmark` |  |
| `update` | 67 | `UpdateDataModel(sys40_bookmark)` 동적 INSERT/UPDATE | `Sys40_Lookup_Bookmark` | `UpdateDataModel` |
| `delete` | 72 | `UpdateDataModel(sys40_bookmark)` 동적 DELETE | - | `UpdateDataModel` |
