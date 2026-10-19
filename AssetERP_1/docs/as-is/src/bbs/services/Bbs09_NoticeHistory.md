# bbs.Bbs09_NoticeHistory

`server/bbs/Bbs09_NoticeHistory.java`

서비스 키 `bbs.Bbs09_NoticeHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`bbs09_notice_history.selectById`](../../bbs/sql/bbs09_notice_history.md) | - |  |
| `selectByNoticeId` | 24 | [`bbs09_notice_history.selectByNoticeId`](../../bbs/sql/bbs09_notice_history.md) | `Bbs09_Lookup_History` |  |
| `insert` | 34 | [`bbs09_notice_history.insert`](../../bbs/sql/bbs09_notice_history.md) | `Bbs02_Edit_NoticeAdmin` |  |
| `update` | 49 | `UpdateDataModel(bbs09_notice_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 54 | `UpdateDataModel(bbs09_notice_history)` 동적 DELETE | - | `UpdateDataModel` |
