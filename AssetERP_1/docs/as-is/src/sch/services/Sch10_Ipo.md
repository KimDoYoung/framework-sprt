# sch.Sch10_Ipo

`server/sch/Sch10_Ipo.java`

서비스 키 `sch.Sch10_Ipo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) | `Frm01_Lookup_DailyCheckList`, `Monitoring_Page_DayList`, `Sch01_Tab_List`, `Sch01_Tab_ListOrg`, `Sch04_Tab_DailyCheckList`, `Sch04_Tab_DailyCheckListStatus`, `Sch04_Tab_ToDoList` |  |
| `selectByDate` | 21 | [`sch10_ipo.selectByDate`](../../sch/sql/sch10_ipo.md) | - |  |
| `selectBySearchText` | 26 | [`sch10_ipo.selectBySearchText`](../../sch/sql/sch10_ipo.md) | `Sch10_Tab_Ipo`, `Sch10_Tab_Ipo2` |  |
| `selectBySearchTextAdmin` | 31 | [`sch10_ipo.selectBySearchTextAdmin`](../../sch/sql/sch10_ipo.md) | `Sch10_Tab_IpoAdmin` |  |
| `update` | 36 | `UpdateDataModel(sch10_ipo)` 동적 INSERT/UPDATE | `Sch10_Tab_IpoAdmin` | `UpdateDataModel` |
| `delete` | 61 | `UpdateDataModel(sch10_ipo)` 동적 DELETE | `Sch10_Tab_IpoAdmin` | `UpdateDataModel` |
