# rpt.Rpt03_Week

`server/rpt/Rpt03_Week.java`

서비스 키 `rpt.Rpt03_Week.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 28 | [`rpt03_week.selectById`](../../rpt/sql/rpt03_week.md) | - |  |
| `selectByStartDate` | 33 | [`rpt03_week.selectByStartDate`](../../rpt/sql/rpt03_week.md) | `Rpt03_Page_WeekWrite`, `Rpt03_Tab_WeekWrite`, `Rpt04_Lookup_Rd_WeekConfirm`, `Rpt04_Tab_WeekConfirm` |  |
| `selectByCompanyId` | 45 | [`rpt03_week.selectByCompanyId`](../../rpt/sql/rpt03_week.md) | `Rpt04_Tab_WeekConfirm` |  |
| `getBeforeWeek` | 56 | [`rpt03_week.getBeforeWeek`](../../rpt/sql/rpt03_week.md) | `Rpt03_Tab_WeekWrite` |  |
| `getLastWeek` | 66 | [`rpt03_week.getLastWeek`](../../rpt/sql/rpt03_week.md) | `Rpt03_Tab_WeekWrite`, `Rpt04_Tab_WeekConfirm` |  |
| `checkWeekBizType` | 76 | [`rpt03_week.checkWeekBizType`](../../rpt/sql/rpt03_week.md) | `Sys09_Lookup_Code` |  |
| `insertBeforeWeek` | 91 | [`rpt03_week.insertBeforeWeek`](../../rpt/sql/rpt03_week.md) | `Rpt03_Tab_WeekWrite` |  |
| `modelUpsert` | 110 | [`rpt03_week.modelUpsert`](../../rpt/sql/rpt03_week.md) | `Rpt03_Lookup_WeekWrite` |  |
| `inUpdateData` | 115 | [`rpt03_week.modelUpsert`](../../rpt/sql/rpt03_week.md) | `Rpt03_Tab_WeekWrite` |  |
| `updateFixYn` | 138 | [`rpt03_week.modelUpsert`](../../rpt/sql/rpt03_week.md) | `Rpt03_Tab_WeekWrite` |  |
| `getWeekDays` | 161 | - | `Rpt03_Tab_WeekWrite`, `Rpt04_Tab_WeekConfirm` |  |
| `boldUpdate` | 187 | [`rpt03_week.boldUpdate`](../../rpt/sql/rpt03_week.md), [`rpt03_week.selectById`](../../rpt/sql/rpt03_week.md) | `Rpt03_Tab_WeekWrite` |  |
| `update` | 204 | `UpdateDataModel(rpt03_week)` 동적 INSERT/UPDATE | `Rpt03_Page_WeekWrite` | `UpdateDataModel` |
| `delete` | 209 | `UpdateDataModel(rpt03_week)` 동적 DELETE | `Rpt03_Page_WeekWrite`, `Rpt03_Tab_WeekWrite` | `UpdateDataModel` |
