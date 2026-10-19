# sys83_secondary_auth_user

`server/sys/mapper/sys83_secondary_auth_user.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`sys83_secondary_auth_user`](../../../db/tables/sys.md) |  | `sys.Sys83_SecondaryAuthUser.selectById` |
| `selectByTempPassword` | select | 22 | [`sys83_secondary_auth_user`](../../../db/tables/sys.md) |  | `sys.Sys83_SecondaryAuthUser.selectByTempPassword` |
| `insert` | insert | 33 | [`sys83_secondary_auth_user`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys83_SecondaryAuthUser.sendTempPassword` |
