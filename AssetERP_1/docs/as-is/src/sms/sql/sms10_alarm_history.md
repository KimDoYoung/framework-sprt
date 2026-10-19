# sms10_alarm_history

`server/sms/mapper/sms10_alarm_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`sms10_alarm_history`](../../../db/tables/sms.md) | `f_emp_kor_nm` | `sms.Sms10_AlarmHistory.selectById` |
| `selectByText` | select | 26 | [`sms10_alarm_history`](../../../db/tables/sms.md) | `f_emp_kor_nm`, `f_trunc` | `sms.Sms10_AlarmHistory.selectByText` |
| `insert` | insert | 51 | [`sms10_alarm_history`](../../../db/tables/sms.md) |  | `sms.Sms10_AlarmHistory.failMessage`, `sms.Sms10_AlarmHistory.successMessage` |
