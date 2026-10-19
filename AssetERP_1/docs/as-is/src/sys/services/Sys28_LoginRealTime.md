# sys.Sys28_LoginRealTime

`server/sys/Sys28_LoginRealTime.java`

서비스 키 `sys.Sys28_LoginRealTime.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`sys28_login_real_time.selectById`](../../sys/sql/sys28_login_real_time.md) | - |  |
| `selectByDate` | 24 | [`sys28_login_real_time.selectByDate`](../../sys/sql/sys28_login_real_time.md) | `Sys28_Lookup_LoginRealTime` |  |
| `updateIpAddress` | 32 | [`sys28_login_real_time.insertInfo`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.selectByDate`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.selectByPersonId`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.updateInfo`](../../sys/sql/sys28_login_real_time.md) | `LoginPage`, `MainFrame` |  |
| `update` | 53 | `UpdateDataModel(sys28_login_real_time)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 58 | `UpdateDataModel(sys28_login_real_time)` 동적 DELETE | - | `UpdateDataModel` |
