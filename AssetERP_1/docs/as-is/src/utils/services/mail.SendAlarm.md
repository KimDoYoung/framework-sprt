# utils.mail.SendAlarm

`server/utils/mail/SendAlarm.java`

서비스 키 `utils.mail.SendAlarm.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `sendMailSession` | 42 | [`emp00_trans_info.getPersonInfo`](../../emp/sql/emp00_trans_info.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.selectByPersonId`](../../sys/sql/sys01_company.md) | `AlarmPopup` | `File`, `IdmsConfig`, `MailConfig` |
| `insertMailHistory` | 275 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr10_mail_history.insertMailHistory`](../../dcr/sql/dcr10_mail_history.md) | `AlarmPopup` |  |
