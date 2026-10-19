# sys81_admin_user_history

`server/sys/mapper/sys81_admin_user_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`sys81_admin_user_history`](../../../db/tables/sys.md) |  | `sys.Sys81_AdminUserHistory.selectById` |
| `selectByDate` | select | 21 | [`sys81_admin_user_history`](../../../db/tables/sys.md) | `f_trunc` | `sys.Sys81_AdminUserHistory.selectByDate` |
| `insert` | insert | 29 | [`sys81_admin_user_history`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys80_AdminUserList.updateTempPassword` |
