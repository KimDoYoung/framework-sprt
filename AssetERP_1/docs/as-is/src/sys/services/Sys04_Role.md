# sys.Sys04_Role

`server/sys/Sys04_Role.java`

서비스 키 `sys.Sys04_Role.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByName` | 24 | [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) | `Sys04_Tab_Role`, `Sys04_Tab_RoleAdmin`, `Sys05_Tab_CompanyUserRole`, `Sys05_Tab_UserRole`, `Sys07_TabPage_Role`, `Sys07_Tab_RoleMenu` |  |
| `selectByCompanyId` | 35 | [`sys04_role.selectByCompanyId`](../../sys/sql/sys04_role.md) | `Sys07_Tab_CompanyRoleMenu` |  |
| `selectByUserId` | 40 | [`sys04_role.selectByUserId`](../../sys/sql/sys04_role.md) | `Sys05_Lookup_PersonRole`, `Sys05_Tab_PersonRole` |  |
| `selectByMenuId` | 45 | [`sys04_role.selectByMenuId`](../../sys/sql/sys04_role.md) | `Sys04_Page_RoleView` |  |
| `selectByNotAssigned` | 50 | `sys04_role.selectByNotAssigned`(없음) | `Lookup_AdminRole` |  |
| `update` | 56 | `UpdateDataModel(sys04_role)` 동적 INSERT/UPDATE | `Sys04_Tab_Role`, `Sys04_Tab_RoleAdmin` | `UpdateDataModel` |
| `updateUserRole` | 61 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys04_role.selectByUserId`](../../sys/sql/sys04_role.md), `UpdateDataModel(sys05_user_role)` 동적 INSERT/UPDATE, `UpdateDataModel(sys05_user_role)` 동적 DELETE | `Sys05_Tab_PersonRole` | `UpdateDataModel` |
| `delete` | 115 | `UpdateDataModel(sys04_role)` 동적 DELETE | `Sys04_Tab_Role`, `Sys04_Tab_RoleAdmin` | `UpdateDataModel` |
