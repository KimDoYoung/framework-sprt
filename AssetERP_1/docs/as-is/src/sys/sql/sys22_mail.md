# sys22_mail

`server/sys/mapper/sys22_mail.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`sys22_mail`](../../../db/tables/sys.md) | `to_decrypts` | - |
| `selectByCompanyId` | select | 27 | [`sys22_mail`](../../../db/tables/sys.md) | `to_decrypts` | `sys.Sys22_Mail.selectByCompanyId` |
| `selectByUserId` | select | 34 | [`sys22_mail`](../../../db/tables/sys.md), [`sys23_mail_role`](../../../db/tables/sys.md) | `to_decrypts` | - |
