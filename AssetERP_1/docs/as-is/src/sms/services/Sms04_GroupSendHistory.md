# sms.Sms04_GroupSendHistory

`server/sms/Sms04_GroupSendHistory.java`

서비스 키 `sms.Sms04_GroupSendHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`sms04_group_send_history.selectById`](../../sms/sql/sms04_group_send_history.md) | - |  |
| `selectByText` | 31 | [`sms04_group_send_history.selectByText`](../../sms/sql/sms04_group_send_history.md) | `Sms04_Lookup_History` |  |
| `sendTagetMessage` | 41 | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`sms04_group_send_history.insert`](../../sms/sql/sms04_group_send_history.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | - | `SendSMSAPIFunction` |
| `sendMessage` | 73 | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`sms04_group_send_history.insert`](../../sms/sql/sms04_group_send_history.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | - | `SendSMSAPIFunction` |
| `update` | 114 | `UpdateDataModel(sms04_group_send_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 119 | `UpdateDataModel(sms04_group_send_history)` 동적 DELETE | - | `UpdateDataModel` |
