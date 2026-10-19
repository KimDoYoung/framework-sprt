# ics.Ics19_RevisionRelateIcs

`server/ics/Ics19_RevisionRelateIcs.java`

서비스 키 `ics.Ics19_RevisionRelateIcs.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`ics19_revision_relate_ics.selectById`](../../ics/sql/ics19_revision_relate_ics.md) | - |  |
| `selectByRevisionHistoryId` | 22 | [`ics19_revision_relate_ics.selectByRevisionHistoryId`](../../ics/sql/ics19_revision_relate_ics.md) | `ics19_Grid_IcsList` |  |
| `update` | 27 | `UpdateDataModel(ics19_revision_relate_ics)` 동적 INSERT/UPDATE | `Ics20_Edit_RevisionHistoryAdmin` | `UpdateDataModel` |
| `delete` | 32 | `UpdateDataModel(ics19_revision_relate_ics)` 동적 DELETE | `Ics20_Edit_RevisionHistoryAdmin` | `UpdateDataModel` |
