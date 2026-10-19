# sms.Sms10_AlarmHistory

`server/sms/Sms10_AlarmHistory.java`

서비스 키 `sms.Sms10_AlarmHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`sms10_alarm_history.selectById`](../../sms/sql/sms10_alarm_history.md) | - |  |
| `selectByText` | 27 | [`sms10_alarm_history.selectByText`](../../sms/sql/sms10_alarm_history.md) | `Sms10_Lookup_AlarmList` |  |
| `successMessage` | 39 | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`sms10_alarm_history.insert`](../../sms/sql/sms10_alarm_history.md) | `SocketList` |  |
| `failMessage` | 60 | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`sms10_alarm_history.insert`](../../sms/sql/sms10_alarm_history.md) | `SocketList` |  |
| `update` | 81 | `UpdateDataModel(sms10_alarm_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 86 | `UpdateDataModel(sms10_alarm_history)` 동적 DELETE | - | `UpdateDataModel` |
