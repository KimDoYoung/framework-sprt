# apr.Apr42_Comment

`server/apr/Apr42_Comment.java`

서비스 키 `apr.Apr42_Comment.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`apr42_comment.selectById`](../../apr/sql/apr42_comment.md) | - |  |
| `selectByApprId` | 27 | [`apr42_comment.selectByApprId`](../../apr/sql/apr42_comment.md) | `Apr42_Lookup_Comment`, `Apr42_Lookup_CommentView` |  |
| `getSize` | 39 | [`apr42_comment.getSize`](../../apr/sql/apr42_comment.md) | `Apr01_Edit_ApprDoc`, `Apr42_Lookup_Comment`, `Apr42_Lookup_CommentView` |  |
| `modelUpdate` | 50 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr42_comment)` 동적 INSERT/UPDATE | `Apr42_Lookup_Comment` | `UpdateDataModel` |
| `update` | 79 | `UpdateDataModel(apr42_comment)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 84 | `UpdateDataModel(apr42_comment)` 동적 DELETE | `Apr42_Lookup_Comment` | `UpdateDataModel` |
