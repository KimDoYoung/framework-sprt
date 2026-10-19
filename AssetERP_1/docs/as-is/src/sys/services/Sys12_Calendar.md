# sys.Sys12_Calendar

`server/sys/Sys12_Calendar.java`

서비스 키 `sys.Sys12_Calendar.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`sys12_calendar.selectById`](../../sys/sql/sys12_calendar.md) | - |  |
| `selectByDay` | 31 | [`sys12_calendar.selectByDay`](../../sys/sql/sys12_calendar.md) | `Flt10_Tab_RealTransaction`, `Flt13_Lookup_BookInit`, `Sys12_Lookup_Customer` |  |
| `selectByYear` | 36 | [`sys12_calendar.selectByYear`](../../sys/sql/sys12_calendar.md) | `Sys12_Tab_Calendar` |  |
| `selectBizDate` | 60 | [`sys12_calendar.bizDate`](../../sys/sql/sys12_calendar.md) | `Ast06_Lookup_TrIPO`, `Fnd10_Lookup_RelateFund`, `Fnd10_Tab_RelateAst`, `Fnd10_Tab_RelateFnd` |  |
| `selectBizDate2` | 66 | [`sys12_calendar.bizDate2`](../../sys/sql/sys12_calendar.md) | `Ast06_Tab_EvalFinance`, `Ast06_Tab_EvalFinance_20260204`, `Flt10_Lookup_ItemStk` |  |
| `updateList` | 72 | `UpdateDataModel(sys12_calendar)` 동적 INSERT/UPDATE | `Sys12_Lookup_Customer` | `UpdateDataModel` |
| `update` | 77 | `UpdateDataModel(sys12_calendar)` 동적 INSERT/UPDATE | `Sys12_Lookup_Customer`, `Sys12_Tab_Calendar` | `UpdateDataModel` |
| `delete` | 82 | `UpdateDataModel(sys12_calendar)` 동적 DELETE | - | `UpdateDataModel` |
| `insertAuto` | 87 | [`sys12_calendar.deleteByDay`](../../sys/sql/sys12_calendar.md), [`sys12_calendar.insertAuto`](../../sys/sql/sys12_calendar.md) | `Sys12_Tab_Calendar` |  |
