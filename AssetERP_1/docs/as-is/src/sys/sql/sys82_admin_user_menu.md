# sys82_admin_user_menu

`server/sys/mapper/sys82_admin_user_menu.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`sys82_admin_user_menu`](../../../db/tables/sys.md) |  | - |
| `selectByRoleName` | select | 21 | [`sys02_user`](../../../db/tables/sys.md), [`sys82_admin_user_menu`](../../../db/tables/sys.md) |  | - |
| `selectByMenuId` | select | 32 | [`sys02_user`](../../../db/tables/sys.md), [`sys82_admin_user_menu`](../../../db/tables/sys.md) |  | - |
| `insert` | insert | 44 | [`sys82_admin_user_menu`](../../../db/tables/sys.md) |  | - |
| `updateRoleMenu` | update | 60 | [`sys04_role`](../../../db/tables/sys.md), [`sys82_admin_user_menu`](../../../db/tables/sys.md) |  | - |
| `insertRoleMenu` | insert | 83 | [`sys04_role`](../../../db/tables/sys.md), [`sys82_admin_user_menu`](../../../db/tables/sys.md) | `f_create_seq` | - |
