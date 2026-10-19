# dcr.Dcr10_MailHistory

`server/dcr/Dcr10_MailHistory.java`

서비스 키 `dcr.Dcr10_MailHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 38 | [`dcr10_mail_history.selectById`](../../dcr/sql/dcr10_mail_history.md) | - |  |
| `selectByTitleText` | 50 | [`dcr10_mail_history.selectByTitleText`](../../dcr/sql/dcr10_mail_history.md) | `Dcr10_Tab_MailHistory_Manager` |  |
| `selectBySenderEmail` | 64 | [`dcr10_mail_history.selectBySenderEmail`](../../dcr/sql/dcr10_mail_history.md) | `Dcr10_Tab_MailHistory` |  |
| `update` | 78 | `UpdateDataModel(dcr10_mail_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 84 | `UpdateDataModel(dcr10_mail_history)` 동적 DELETE | - | `UpdateDataModel` |
| `insertMailHistory` | 94 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr10_mail_history.insertMailHistory`](../../dcr/sql/dcr10_mail_history.md), [`dcr11_mail_file_history.insertMailFileHistory`](../../dcr/sql/dcr11_mail_file_history.md) | `Biz55_Tab_ErpFeeCharge`, `Dcr10_Lookup_MailSender` |  |
| `insertAlarmHistory` | 126 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr10_mail_history.insertMailHistory`](../../dcr/sql/dcr10_mail_history.md) | - |  |
