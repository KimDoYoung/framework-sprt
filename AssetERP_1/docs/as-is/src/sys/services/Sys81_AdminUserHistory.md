# sys.Sys81_AdminUserHistory

`server/sys/Sys81_AdminUserHistory.java`

서비스 키 `sys.Sys81_AdminUserHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`sys81_admin_user_history.selectById`](../../sys/sql/sys81_admin_user_history.md) | - |  |
| `selectByDate` | 25 | [`sys81_admin_user_history.selectByDate`](../../sys/sql/sys81_admin_user_history.md) | `Sys81_Tab_AdminUserHistory` |  |
| `update` | 37 | `UpdateDataModel(sys81_admin_user_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 42 | `UpdateDataModel(sys81_admin_user_history)` 동적 DELETE | - | `UpdateDataModel` |
