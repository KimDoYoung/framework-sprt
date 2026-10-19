# emp.Emp26_InitLeave

`server/emp/Emp26_InitLeave.java`

서비스 키 `emp.Emp26_InitLeave.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`emp26_init_leave.selectById`](../../emp/sql/emp26_init_leave.md) | - |  |
| `selectByCompanyId` | 23 | [`emp26_init_leave.selectByCompanyId`](../../emp/sql/emp26_init_leave.md) | - |  |
| `selectByYear` | 30 | [`emp26_init_leave.selectByYear`](../../emp/sql/emp26_init_leave.md) | `Emp26_Lookup_InitLeave` |  |
| `update` | 42 | `UpdateDataModel(emp26_init_leave)` 동적 INSERT/UPDATE | `Emp26_Lookup_InitLeave` | `UpdateDataModel` |
| `delete` | 47 | `UpdateDataModel(emp26_init_leave)` 동적 DELETE | `Emp26_Lookup_InitLeave` | `UpdateDataModel` |
