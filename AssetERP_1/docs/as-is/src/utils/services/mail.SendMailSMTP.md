# utils.mail.SendMailSMTP

`server/utils/mail/SendMailSMTP.java`

서비스 키 `utils.mail.SendMailSMTP.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `sendMailSession` | 73 | [`cmp10_mail_book.selectByEmailAddress`](../../cmp/sql/cmp10_mail_book.md), [`emp00_trans_info.getPersonInfo`](../../emp/sql/emp00_trans_info.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.selectByPersonId`](../../sys/sql/sys01_company.md), [`sys10_file.selectByFileId`](../../sys/sql/sys10_file.md) | `Dcr10_Lookup_MailSender` |  |
| `sendMailSessionTest` | 101 | [`cmp10_mail_book.selectByEmailAddress`](../../cmp/sql/cmp10_mail_book.md), [`emp00_trans_info.getPersonInfo`](../../emp/sql/emp00_trans_info.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.selectByPersonId`](../../sys/sql/sys01_company.md), [`sys10_file.selectByFileId`](../../sys/sql/sys10_file.md) | `Biz55_Tab_ErpFeeCharge`, `Dcr10_Lookup_MailSender` |  |
| `checkMail` | 721 | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Emp10_Lookup_MailRetrieve` | `MailConfig` |
| `checkCompanyMail` | 780 | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Cmp10_Edit_Tab_MailBook`, `Sys22_Lookup_Mail` | `MailConfig` |
