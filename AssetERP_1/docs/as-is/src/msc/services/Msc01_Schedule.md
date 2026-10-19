# msc.Msc01_Schedule

`server/msc/Msc01_Schedule.java`

서비스 키 `msc.Msc01_Schedule.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`msc01_schedule.selectById`](../../msc/sql/msc01_schedule.md) | `Msc01_Edit_Week` |  |
| `selectByDate` | 32 | [`msc01_schedule.selectByDate`](../../msc/sql/msc01_schedule.md) | `Monitoring_Page_Schedule` | `DateUtil` |
| `selectByOrg` | 56 | [`msc01_schedule.selectByOrg`](../../msc/sql/msc01_schedule.md) | `Msc01_Tab_Popup`, `Msc01_Tab_Schedule` |  |
| `selectMonitorngMsc` | 73 | [`msc01_schedule.selectMonitorngMsc`](../../msc/sql/msc01_schedule.md) | `Msc01_Tab_Popup`, `Msc01_Tab_Schedule` |  |
| `update` | 86 | `UpdateDataModel(msc01_schedule)` 동적 INSERT/UPDATE | `Msc01_Edit_Schedule` | `UpdateDataModel` |
| `delete` | 99 | `UpdateDataModel(msc01_schedule)` 동적 DELETE | `Msc01_Edit_Schedule` | `UpdateDataModel` |
