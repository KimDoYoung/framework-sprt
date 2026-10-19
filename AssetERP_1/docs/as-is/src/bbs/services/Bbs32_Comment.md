# bbs.Bbs32_Comment

`server/bbs/Bbs32_Comment.java`

서비스 키 `bbs.Bbs32_Comment.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`bbs32_comment.selectById`](../../bbs/sql/bbs32_comment.md) | - |  |
| `selectByContentId` | 28 | [`bbs32_comment.selectByContentId`](../../bbs/sql/bbs32_comment.md) | `Bbs32_TapPage_Comment` |  |
| `getSize` | 39 | [`bbs32_comment.getSize`](../../bbs/sql/bbs32_comment.md) | `Bbs32_TapPage_Comment` |  |
| `modelUpdate` | 50 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs32_comment)` 동적 INSERT/UPDATE | `Bbs32_TapPage_Comment` | `UpdateDataModel` |
| `update` | 79 | `UpdateDataModel(bbs32_comment)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 84 | `UpdateDataModel(bbs32_comment)` 동적 DELETE | `Bbs32_TapPage_Comment` | `UpdateDataModel` |
