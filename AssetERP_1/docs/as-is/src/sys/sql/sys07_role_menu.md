# sys07_role_menu

`server/sys/mapper/sys07_role_menu.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`sys07_role_menu`](../../../db/tables/sys.md) |  | - |
| `selectByRoleName` | select | 21 | [`sys04_role`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md) |  | `sys.Sys03_CompanyMenu.insert` |
| `selectByMenuId` | select | 30 | [`sys04_role`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md) |  | `sys.Sys03_CompanyMenu.insert`, `sys.Sys07_RoleMenu.updateMenu` |
| `insert` | insert | 42 | [`sys07_role_menu`](../../../db/tables/sys.md) |  | `sys.Sys03_CompanyMenu.insert` |
| `updateRoleMenu` | update | 56 | [`sys04_role`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md) |  | `sys.Sys07_RoleMenu.updateMenu` |
| `insertRoleMenu` | insert | 79 | [`sys04_role`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys07_RoleMenu.updateMenu` |
