# dcr10_mail_history

`server/dcr/mapper/dcr10_mail_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`dcr10_mail_history`](../../../db/tables/dcr.md) |  | `dcr.Dcr10_MailHistory.selectById` |
| `selectByTitleText` | select | 31 | [`apr03_relate_fund`](../../../db/tables/apr.md), [`cmp10_mail_book`](../../../db/tables/cmp.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_emp_kor_nm` | `dcr.Dcr10_MailHistory.selectByTitleText` |
| `selectBySenderEmail` | select | 76 | [`apr03_relate_fund`](../../../db/tables/apr.md), [`cmp10_mail_book`](../../../db/tables/cmp.md), [`cmp11_mail_role`](../../../db/tables/cmp.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_emp_kor_nm` | `dcr.Dcr10_MailHistory.selectBySenderEmail` |
| `insertMailHistory` | insert | 126 | [`dcr10_mail_history`](../../../db/tables/dcr.md) | `f_sysdate` | `dcr.Dcr10_MailHistory.insertAlarmHistory`, `dcr.Dcr10_MailHistory.insertMailHistory`, `utils.mail.SendAlarm.insertMailHistory` |
