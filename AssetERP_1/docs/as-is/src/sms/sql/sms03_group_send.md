# sms03_group_send

`server/sms/mapper/sms03_group_send.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`sms03_group_send`](../../../db/tables/sms.md) |  | `sms.Sms03_GroupSend.selectById`, `sms.Sms03_GroupSend.sendGroupMessage`, `sms.Sms03_GroupSend.sendMessage` |
| `selectByCompanyId` | select | 22 | [`sms03_group_send`](../../../db/tables/sms.md) |  | `sms.Sms03_GroupSend.selectByCompanyId` |
