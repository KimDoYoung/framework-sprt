# rpt.Rpt04_WeekConfirm

`server/rpt/Rpt04_WeekConfirm.java`

서비스 키 `rpt.Rpt04_WeekConfirm.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`rpt04_week_confirm.selectById`](../../rpt/sql/rpt04_week_confirm.md) | - |  |
| `selectByCompanyId` | 25 | [`rpt04_week_confirm.selectByCompanyId`](../../rpt/sql/rpt04_week_confirm.md) | `Rpt03_Page_WeekWrite`, `Rpt03_Tab_WeekWrite`, `Rpt04_Lookup_Rd_WeekConfirm` |  |
| `selectByConfirmerId` | 35 | [`rpt04_week_confirm.selectByConfirmerId`](../../rpt/sql/rpt04_week_confirm.md) | `Rpt04_Lookup_Rd_WeekConfirm` |  |
| `confirmUpdate` | 46 | [`rpt04_week_confirm.confirmUpdate`](../../rpt/sql/rpt04_week_confirm.md) | `Rpt04_Lookup_Rd_WeekConfirm` |  |
| `updateNote` | 65 | [`rpt04_week_confirm.updateNote`](../../rpt/sql/rpt04_week_confirm.md) | `Rpt04_Lookup_Rd_WeekConfirm` |  |
| `updateByPersonId` | 82 | [`rpt04_week_confirm.updateByPersonId`](../../rpt/sql/rpt04_week_confirm.md) | `Rpt04_Lookup_Rd_WeekConfirm` |  |
| `update` | 99 | `UpdateDataModel(rpt04_week_confirm)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 104 | `UpdateDataModel(rpt04_week_confirm)` 동적 DELETE | - | `UpdateDataModel` |
