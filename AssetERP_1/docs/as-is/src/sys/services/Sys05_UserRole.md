# sys.Sys05_UserRole

`server/sys/Sys05_UserRole.java`

서비스 키 `sys.Sys05_UserRole.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByRoleId` | 23 | [`sys05_user_role.selectByRoleId`](../../sys/sql/sys05_user_role.md) | `Sys05_Page_CompanyUserRole`, `Sys05_Page_UserRole`, `Sys05_Page_UserRoleView` |  |
| `selectByUserId` | 30 | [`sys04_role.selectByUserId`](../../sys/sql/sys04_role.md) | - |  |
| `getAdminCheck` | 43 | [`sys05_user_role.getAdminCheck`](../../sys/sql/sys05_user_role.md) | `LoginPage` |  |
| `update` | 55 | `UpdateDataModel(sys05_user_role)` 동적 INSERT/UPDATE | `Sys05_Page_CompanyUserRole`, `Sys05_Page_UserRole` | `UpdateDataModel` |
| `delete` | 60 | `UpdateDataModel(sys05_user_role)` 동적 DELETE | `Sys05_Page_CompanyUserRole`, `Sys05_Page_UserRole` | `UpdateDataModel` |
