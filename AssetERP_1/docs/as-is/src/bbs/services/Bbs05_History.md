# bbs.Bbs05_History

`server/bbs/Bbs05_History.java`

서비스 키 `bbs.Bbs05_History.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByNoticeId` | 20 | [`bbs05_history.selectByNoticeId`](../../bbs/sql/bbs05_history.md) | - |  |
| `updatePersonId` | 32 | [`bbs05_history.insert`](../../bbs/sql/bbs05_history.md), [`bbs05_history.selectByNoticeId`](../../bbs/sql/bbs05_history.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs05_history)` 동적 INSERT/UPDATE | `Bbs02_Lookup_NoticeAdmin`, `Bbs02_Popup_NoticeAdmin` | `UpdateDataModel` |
| `update` | 64 | `UpdateDataModel(bbs05_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 69 | `UpdateDataModel(bbs05_history)` 동적 DELETE | - | `UpdateDataModel` |
