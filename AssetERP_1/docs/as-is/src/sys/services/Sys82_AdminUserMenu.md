# sys.Sys82_AdminUserMenu

`server/sys/Sys82_AdminUserMenu.java`

서비스 키 `sys.Sys82_AdminUserMenu.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `updateMenu` | 19 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys82_admin_user_menu)` 동적 INSERT/UPDATE | `Sys82_Lookup_UserMenu` | `UpdateDataModel` |
| `update` | 52 | `UpdateDataModel(sys82_admin_user_menu)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 57 | `UpdateDataModel(sys82_admin_user_menu)` 동적 DELETE | - | `UpdateDataModel` |
