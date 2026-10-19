# ics19_revision_relate_ics

`server/ics/mapper/ics19_revision_relate_ics.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`ics01_class_tree`](../../../db/tables/ics.md), [`ics19_revision_relate_ics`](../../../db/tables/ics.md) | `f_ics_class_tree_nm_allpath` | `ics.Ics19_RevisionRelateIcs.selectById` |
| `selectByRevisionHistoryId` | select | 24 | [`ics01_class_tree`](../../../db/tables/ics.md), [`ics19_revision_relate_ics`](../../../db/tables/ics.md) |  | `ics.Ics19_RevisionRelateIcs.selectByRevisionHistoryId` |
