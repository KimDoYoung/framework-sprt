# sys28_login_real_time

`server/sys/mapper/sys28_login_real_time.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`sys28_login_real_time`](../../../db/tables/sys.md) |  | `sys.Sys28_LoginRealTime.selectById` |
| `selectByPersonId` | select | 23 | [`sys28_login_real_time`](../../../db/tables/sys.md) |  | `sys.Sys28_LoginRealTime.updateIpAddress` |
| `selectByDate` | select | 31 | [`sys28_login_real_time`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys28_LoginRealTime.selectByDate`, `sys.Sys28_LoginRealTime.updateIpAddress` |
| `updateInfo` | update | 39 | [`sys28_login_real_time`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys28_LoginRealTime.updateIpAddress` |
| `insertInfo` | insert | 47 | [`sys28_login_real_time`](../../../db/tables/sys.md) | `f_create_seq`, `f_sysdate` | `sys.Sys28_LoginRealTime.updateIpAddress` |
