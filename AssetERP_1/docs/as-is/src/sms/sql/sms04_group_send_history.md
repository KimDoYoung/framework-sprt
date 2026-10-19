# sms04_group_send_history

`server/sms/mapper/sms04_group_send_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`sms04_group_send_history`](../../../db/tables/sms.md) |  | `sms.Sms04_GroupSendHistory.selectById` |
| `selectByText` | select | 26 | [`sms04_group_send_history`](../../../db/tables/sms.md) |  | `sms.Sms04_GroupSendHistory.selectByText` |
| `insert` | insert | 36 | [`sms04_group_send_history`](../../../db/tables/sms.md) |  | `sms.Sms04_GroupSendHistory.sendMessage`, `sms.Sms04_GroupSendHistory.sendTagetMessage` |
