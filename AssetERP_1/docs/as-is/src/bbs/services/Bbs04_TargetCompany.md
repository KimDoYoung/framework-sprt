# bbs.Bbs04_TargetCompany

`server/bbs/Bbs04_TargetCompany.java`

서비스 키 `bbs.Bbs04_TargetCompany.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByNoticeId` | 20 | [`bbs04_target_company.selectByNoticeId`](../../bbs/sql/bbs04_target_company.md) | `Bbs02_Edit_NoticeAdmin` |  |
| `insertTargetList` | 32 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs04_target_company)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `deleteAllTarget` | 56 | [`bbs04_target_company.deleteAll`](../../bbs/sql/bbs04_target_company.md) | `Bbs02_Edit_NoticeAdmin` |  |
| `update` | 64 | `UpdateDataModel(bbs04_target_company)` 동적 INSERT/UPDATE | `Bbs02_Edit_NoticeAdmin` | `UpdateDataModel` |
| `delete` | 69 | `UpdateDataModel(bbs04_target_company)` 동적 DELETE | `Bbs02_Edit_NoticeAdmin` | `UpdateDataModel` |
