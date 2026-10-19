# ics20_revision_history

`server/ics/mapper/ics20_revision_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 23 | [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm` | `ics.Ics20_RevisionHistory.selectById` |
| `selectByDate` | select | 40 | [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm` | `ics.Ics20_RevisionHistory.selectByDate` |
| `selectByClassTreeId` | select | 76 | [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm` | `ics.Ics20_RevisionHistory.selectByClassTreeId` |
| `updateContent` | update | 90 | [`ics20_revision_history`](../../../db/tables/ics.md) |  | `ics.Ics20_RevisionHistory.updateContent` |
