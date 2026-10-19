# apr.Apr50_Bookmark

`server/apr/Apr50_Bookmark.java`

서비스 키 `apr.Apr50_Bookmark.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`apr50_bookmark.selectById`](../../apr/sql/apr50_bookmark.md) | - |  |
| `selectByPersonId` | 23 | [`apr50_bookmark.selectByPersonId`](../../apr/sql/apr50_bookmark.md) | - |  |
| `selectByPersonIdPaging` | 33 | [`apr50_bookmark.selectByPersonIdPaging`](../../apr/sql/apr50_bookmark.md), [`apr50_bookmark.selectByPersonIdPagingTotal`](../../apr/sql/apr50_bookmark.md) | `Apr50_Lookup_ApprList` |  |
| `selectByApprId` | 40 | [`apr50_bookmark.selectByApprId`](../../apr/sql/apr50_bookmark.md) | `Apr50_Lookup_PersonList` |  |
| `selectByPublicYn` | 49 | [`apr50_bookmark.selectByPublicYn`](../../apr/sql/apr50_bookmark.md) | `Apr01_Edit_ApprDoc` |  |
| `deleteByApprId` | 60 | [`apr50_bookmark.deleteByApprId`](../../apr/sql/apr50_bookmark.md) | `Apr50_Lookup_PersonList` |  |
| `insert` | 69 | [`apr50_bookmark.insert`](../../apr/sql/apr50_bookmark.md), [`apr50_bookmark.insertCheck`](../../apr/sql/apr50_bookmark.md), [`apr50_bookmark.updatePublicYn`](../../apr/sql/apr50_bookmark.md) | `Apr50_Lookup_PersonList` |  |
| `update` | 86 | `UpdateDataModel(apr50_bookmark)` 동적 INSERT/UPDATE | `Apr50_Lookup_PersonList` | `UpdateDataModel` |
| `delete` | 91 | `UpdateDataModel(apr50_bookmark)` 동적 DELETE | `Apr50_Lookup_PersonList` | `UpdateDataModel` |
