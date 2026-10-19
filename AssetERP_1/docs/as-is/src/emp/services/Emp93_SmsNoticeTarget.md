# emp.Emp93_SmsNoticeTarget

`server/emp/Emp93_SmsNoticeTarget.java`

서비스 키 `emp.Emp93_SmsNoticeTarget.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`emp93_sms_notice_target.selectById`](../../emp/sql/emp93_sms_notice_target.md) | - |  |
| `selectBySmsNoticeCode` | 24 | [`emp93_sms_notice_target.selectBySmsNoticeCode`](../../emp/sql/emp93_sms_notice_target.md) | `Emp93_Lookup_SmsNoticeTarget`, `Emp93_Tabpage_SmsNoticeTargetList` |  |
| `getSmsNoticeList` | 33 | [`emp93_sms_notice_target.getSmsNoticeList`](../../emp/sql/emp93_sms_notice_target.md) | `Emp93_Lookup_SmsNoticeTargetList` |  |
| `update` | 38 | `UpdateDataModel(emp93_sms_notice_target)` 동적 INSERT/UPDATE | `Emp93_Lookup_SmsNoticeTarget`, `Emp93_Tabpage_SmsNoticeTargetList` | `UpdateDataModel` |
| `delete` | 43 | `UpdateDataModel(emp93_sms_notice_target)` 동적 DELETE | `Emp93_Lookup_SmsNoticeTarget`, `Emp93_Tabpage_SmsNoticeTargetList` | `UpdateDataModel` |
