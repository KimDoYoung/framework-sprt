# sys.Sys07_RoleMenu

`server/sys/Sys07_RoleMenu.java`

서비스 키 `sys.Sys07_RoleMenu.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `updateRole` | 23 | [`sys04_role.insertRole`](../../sys/sql/sys04_role.md), [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) | `Sys07_Tab_Company` |  |
| `updateMenu` | 46 | [`sys03_company_menu.insertMenu`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.selectByMenu`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.updateMenu`](../../sys/sql/sys03_company_menu.md), [`sys04_role.selectByName`](../../sys/sql/sys04_role.md), [`sys06_menu.getMenuId`](../../sys/sql/sys06_menu.md), [`sys07_role_menu.insertRoleMenu`](../../sys/sql/sys07_role_menu.md), [`sys07_role_menu.selectByMenuId`](../../sys/sql/sys07_role_menu.md), [`sys07_role_menu.updateRoleMenu`](../../sys/sql/sys07_role_menu.md) | `Sys07_Tab_Company` |  |
| `update` | 91 | `UpdateDataModel(sys07_role_menu)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 96 | `UpdateDataModel(sys07_role_menu)` 동적 DELETE | - | `UpdateDataModel` |
