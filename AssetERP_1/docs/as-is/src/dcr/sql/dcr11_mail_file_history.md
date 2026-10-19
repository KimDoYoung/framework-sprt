# dcr11_mail_file_history

`server/dcr/mapper/dcr11_mail_file_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 12 | [`dcr11_mail_file_history`](../../../db/tables/dcr.md) |  | `dcr.Dcr11_MailFileHistory.selectById` |
| `insertMailFileHistory` | insert | 18 | [`dcr11_mail_file_history`](../../../db/tables/dcr.md) | `f_create_seq` | `dcr.Dcr10_MailHistory.insertMailHistory` |
