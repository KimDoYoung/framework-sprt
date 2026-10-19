# sys80_admin_user_list

`server/sys/mapper/sys80_admin_user_list.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`sys80_admin_user_list`](../../../db/tables/sys.md) |  | `sys.Sys80_AdminUserList.selectById` |
| `selectByAll` | select | 20 | [`sys80_admin_user_list`](../../../db/tables/sys.md) |  | `sys.Sys80_AdminUserList.selectByAll` |
| `selectByTempPassword` | select | 26 | [`sys80_admin_user_list`](../../../db/tables/sys.md) |  | `sys.Sys80_AdminUserList.selectByTempPassword` |
| `selectByPhone` | select | 33 | [`sys80_admin_user_list`](../../../db/tables/sys.md) |  | `sys.Sys80_AdminUserList.updateTempPassword` |
| `updateTempPassword` | update | 39 | [`sys80_admin_user_list`](../../../db/tables/sys.md) |  | `sys.Sys80_AdminUserList.updateTempPassword` |
