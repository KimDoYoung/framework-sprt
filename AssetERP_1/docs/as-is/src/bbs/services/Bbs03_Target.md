# bbs.Bbs03_Target

`server/bbs/Bbs03_Target.java`

서비스 키 `bbs.Bbs03_Target.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByNoticeId` | 24 | [`bbs03_target.selectByNoticeId`](../../bbs/sql/bbs03_target.md) | `Bbs02_Edit_Notice` |  |
| `insertTargetList` | 45 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs03_target)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `deleteAllTarget` | 76 | [`bbs03_target.deleteAll`](../../bbs/sql/bbs03_target.md) | `Bbs02_Edit_Notice` |  |
| `update` | 85 | `UpdateDataModel(bbs03_target)` 동적 INSERT/UPDATE | `Bbs02_Edit_Notice` | `UpdateDataModel` |
| `delete` | 90 | `UpdateDataModel(bbs03_target)` 동적 DELETE | `Bbs02_Edit_Notice` | `UpdateDataModel` |
