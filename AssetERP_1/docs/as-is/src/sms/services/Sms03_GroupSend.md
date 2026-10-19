# sms.Sms03_GroupSend

`server/sms/Sms03_GroupSend.java`

서비스 키 `sms.Sms03_GroupSend.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`sms03_group_send.selectById`](../../sms/sql/sms03_group_send.md) | - |  |
| `selectByCompanyId` | 31 | [`sms03_group_send.selectByCompanyId`](../../sms/sql/sms03_group_send.md) | `Sms03_Tab_GroupSend`, `Sms03_Tab_SendAdmin` |  |
| `sendNoticeMessage` | 37 | - | `Bbs02_Tab_NoticeAdmin` | `SendSMSAPIFunction` |
| `sendMessage` | 62 | [`sms03_group_send.selectById`](../../sms/sql/sms03_group_send.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Sms03_Page_UserList` | `SendSMSAPIFunction` |
| `sendGroupMessage` | 97 | [`sms03_group_send.selectById`](../../sms/sql/sms03_group_send.md) | `Sms03_Page_UserListAdmin` | `SendSMSAPIFunction` |
| `sendMessageList` | 129 | - | `Sms03_Lookup_SendList` | `SendSMSAPIFunction` |
| `update` | 162 | `UpdateDataModel(sms03_group_send)` 동적 INSERT/UPDATE | `Sms03_Edit_GroupSend` | `UpdateDataModel` |
| `delete` | 167 | `UpdateDataModel(sms03_group_send)` 동적 DELETE | `Sms03_Tab_GroupSend`, `Sms03_Tab_SendAdmin` | `UpdateDataModel` |
