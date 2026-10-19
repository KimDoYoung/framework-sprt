# emp12_event

`server/emp/mapper/emp12_event.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectByPersonId` | select | 21 | [`emp01_person`](../../../db/tables/emp.md), [`emp12_event`](../../../db/tables/emp.md) |  | `emp.Emp12_Event.selectByPersonId` |
| `selectById` | select | 30 | [`emp01_person`](../../../db/tables/emp.md), [`emp12_event`](../../../db/tables/emp.md) |  | - |
