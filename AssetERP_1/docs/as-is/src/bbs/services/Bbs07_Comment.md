# bbs.Bbs07_Comment

`server/bbs/Bbs07_Comment.java`

서비스 키 `bbs.Bbs07_Comment.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`bbs07_comment.selectById`](../../bbs/sql/bbs07_comment.md) | - |  |
| `selectByNoticeId` | 27 | [`bbs07_comment.selectByNoticeId`](../../bbs/sql/bbs07_comment.md) | `Bbs07_Lookup_Comment`, `Bbs07_TapPage_Comment` |  |
| `getSize` | 39 | [`bbs07_comment.getSize`](../../bbs/sql/bbs07_comment.md) | `Bbs07_Lookup_Comment`, `Bbs07_TapPage_Comment` |  |
| `modelUpdate` | 50 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs07_comment)` 동적 INSERT/UPDATE | `Bbs07_TapPage_Comment` | `UpdateDataModel` |
| `update` | 79 | `UpdateDataModel(bbs07_comment)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 84 | `UpdateDataModel(bbs07_comment)` 동적 DELETE | `Bbs07_Lookup_Comment`, `Bbs07_TapPage_Comment` | `UpdateDataModel` |
