# sys.Sys80_AdminUserList

`server/sys/Sys80_AdminUserList.java`

서비스 키 `sys.Sys80_AdminUserList.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`sys80_admin_user_list.selectById`](../../sys/sql/sys80_admin_user_list.md) | - |  |
| `selectByAll` | 27 | [`sys80_admin_user_list.selectByAll`](../../sys/sql/sys80_admin_user_list.md) | `Sys80_Tab_AdminUserList` |  |
| `selectByTempPassword` | 32 | [`sys80_admin_user_list.selectByTempPassword`](../../sys/sql/sys80_admin_user_list.md) | `Sys80_Lookup_TempPassword` |  |
| `updateTempPassword` | 41 | [`sys80_admin_user_list.selectByPhone`](../../sys/sql/sys80_admin_user_list.md), [`sys80_admin_user_list.updateTempPassword`](../../sys/sql/sys80_admin_user_list.md), [`sys81_admin_user_history.insert`](../../sys/sql/sys81_admin_user_history.md) | `Sys80_Lookup_TempPassword` |  |
| `sendTempPassword` | 64 | - | `Sys80_Lookup_TempPassword` | `SendSMSAPIFunction` |
| `update` | 75 | `UpdateDataModel(sys80_admin_user_list)` 동적 INSERT/UPDATE | `Sys80_Tab_AdminUserList` | `UpdateDataModel` |
| `delete` | 80 | `UpdateDataModel(sys80_admin_user_list)` 동적 DELETE | `Sys80_Tab_AdminUserList` | `UpdateDataModel` |
