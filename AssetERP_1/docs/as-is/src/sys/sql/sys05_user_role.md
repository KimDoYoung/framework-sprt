# sys05_user_role

`server/sys/mapper/sys05_user_role.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 32 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys05_user_role`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate` | - |
| `selectByRoleId` | select | 62 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys05_user_role`](../../../db/tables/sys.md) | `f_cdnm`, `f_code_seq`, `f_get_emptrans`, `f_org_nm`, `f_org_seq`, `f_sysdate` | `sys.Sys05_UserRole.selectByRoleId` |
| `selectByUserId` | select | 96 | [`sys05_user_role`](../../../db/tables/sys.md) | `f_org_nm`, `f_sysdate` | `sys.Sys02_User.getLoginInfo`, `sys.Sys02_User.getMobiLoginInfo` |
| `getAdminCheck` | select | 108 | [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md) |  | `sys.Sys05_UserRole.getAdminCheck` |
| `insert` | insert | 115 | [`sys05_user_role`](../../../db/tables/sys.md) | `f_create_seq` | - |
| `delete` | delete | 146 | [`sys05_user_role`](../../../db/tables/sys.md) |  | - |
