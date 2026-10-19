# sys04_role

`server/sys/mapper/sys04_role.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`sys04_role`](../../../db/tables/sys.md) | `f_get_company_nm` | - |
| `selectByName` | select | 31 | [`sys04_role`](../../../db/tables/sys.md) | `f_get_company_nm` | `sys.Sys03_CompanyMenu.insert`, `sys.Sys04_Role.selectByName`, `sys.Sys07_RoleMenu.updateMenu`, `sys.Sys07_RoleMenu.updateRole` |
| `selectByCompanyId` | select | 40 | [`sys04_role`](../../../db/tables/sys.md) | `f_get_company_nm` | `sys.Sys03_CompanyMenu.insert`, `sys.Sys04_Role.selectByCompanyId` |
| `selectByUserId` | select | 48 | [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md) | `f_get_company_nm` | `sys.Sys04_Role.selectByUserId`, `sys.Sys04_Role.updateUserRole`, `sys.Sys05_UserRole.selectByUserId` |
| `selectByMenuId` | select | 60 | [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md) | `f_get_company_nm` | `sys.Sys04_Role.selectByMenuId` |
| `insertRole` | insert | 73 | [`sys04_role`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys07_RoleMenu.updateRole` |
| `copyRole` | select | 89 | [`sys04_role`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys03_CompanyMenu.insert` |
| `insertFromSys04` | select | 105 | [`sys04_role`](../../../db/tables/sys.md) | `f_create_seq` | - |
