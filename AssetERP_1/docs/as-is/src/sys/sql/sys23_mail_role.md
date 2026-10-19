# sys23_mail_role

`server/sys/mapper/sys23_mail_role.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`emp01_person`](../../../db/tables/emp.md), [`sys23_mail_role`](../../../db/tables/sys.md) |  | - |
| `selectByMailId` | select | 26 | [`emp01_person`](../../../db/tables/emp.md), [`sys23_mail_role`](../../../db/tables/sys.md) |  | `sys.Sys23_MailRole.selectByMailId` |
