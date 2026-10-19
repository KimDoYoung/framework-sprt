# emp.Emp92_SmsNotice

`server/emp/Emp92_SmsNotice.java`

서비스 키 `emp.Emp92_SmsNotice.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`emp92_sms_notice.selectById`](../../emp/sql/emp92_sms_notice.md) | - |  |
| `selectByPersonId` | 26 | [`emp92_sms_notice.selectByPersonId`](../../emp/sql/emp92_sms_notice.md) | `Emp92_Lookup_SmsNotice` |  |
| `updateList` | 34 | [`emp92_sms_notice.check`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.insert`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.updateNoticeYn`](../../emp/sql/emp92_sms_notice.md) | `Emp92_Lookup_SmsNotice` |  |
| `update` | 61 | `UpdateDataModel(emp92_sms_notice)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 66 | `UpdateDataModel(emp92_sms_notice)` 동적 DELETE | - | `UpdateDataModel` |
