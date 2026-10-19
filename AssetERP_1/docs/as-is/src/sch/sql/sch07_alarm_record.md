# sch07_alarm_record

`server/sch/mapper/sch07_alarm_record.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`sch07_alarm_record`](../../../db/tables/sch.md) |  | - |
| `selectByAlarmType` | select | 26 | [`sch07_alarm_record`](../../../db/tables/sch.md) | `f_sysdate` | - |
| `updateInfo` | update | 34 | [`sch07_alarm_record`](../../../db/tables/sch.md) | `f_sysdate` | - |
