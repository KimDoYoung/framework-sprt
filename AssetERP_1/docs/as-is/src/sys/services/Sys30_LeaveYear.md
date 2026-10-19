# sys.Sys30_LeaveYear

`server/sys/Sys30_LeaveYear.java`

서비스 키 `sys.Sys30_LeaveYear.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 21 | [`sys30_leave_year.selectByAll`](../../sys/sql/sys30_leave_year.md) | `Sys30_Grid_LeaveYear` |  |
| `selectById` | 36 | [`sys30_leave_year.selectById`](../../sys/sql/sys30_leave_year.md) | - |  |
| `update` | 48 | `UpdateDataModel(sys30_leave_year)` 동적 INSERT/UPDATE | `Sys30_Grid_LeaveYear` | `UpdateDataModel` |
| `delete` | 53 | `UpdateDataModel(sys30_leave_year)` 동적 DELETE | `Sys30_Grid_LeaveYear` | `UpdateDataModel` |
