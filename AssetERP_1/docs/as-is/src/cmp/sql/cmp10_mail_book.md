# cmp10_mail_book

`server/cmp/mapper/cmp10_mail_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`cmp10_mail_book`](../../../db/tables/cmp.md) |  | `cmp.Cmp10_MailBook.selectById` |
| `selectByCompanyId` | select | 22 | [`cmp10_mail_book`](../../../db/tables/cmp.md) | `to_decrypts` | `cmp.Cmp10_MailBook.selectByCompanyId` |
| `selectByPersonId` | select | 29 | [`cmp10_mail_book`](../../../db/tables/cmp.md), [`cmp11_mail_role`](../../../db/tables/cmp.md) |  | `cmp.Cmp10_MailBook.selectByPersonId` |
| `createPassword` | select | 35 | - | `to_encrypts` | `cmp.Cmp10_MailBook.modelUpdate` |
| `changeMail` | update | 39 | [`cmp10_mail_book`](../../../db/tables/cmp.md) | `to_encrypts` | - |
| `selectByEmailAddress` | select | 46 | [`cmp10_mail_book`](../../../db/tables/cmp.md), [`cmp11_mail_role`](../../../db/tables/cmp.md), [`emp01_person`](../../../db/tables/emp.md) | `to_decrypts` | `utils.mail.SendMailSMTP.sendMailSession`, `utils.mail.SendMailSMTP.sendMailSessionTest` |
| `selectByText` | select | 56 | [`cmp10_mail_book`](../../../db/tables/cmp.md), [`cmp11_mail_role`](../../../db/tables/cmp.md) |  | `cmp.Cmp10_MailBook.selectByText` |
