# emp.Emp12_Event

`server/emp/Emp12_Event.java`

서비스 키 `emp.Emp12_Event.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 20 | [`emp12_event.selectByPersonId`](../../emp/sql/emp12_event.md) | `Emp12_TabPage_Event` |  |
| `update` | 32 | `UpdateDataModel(emp12_event)` 동적 INSERT/UPDATE | `Emp12_TabPage_Event` | `UpdateDataModel` |
| `delete` | 37 | `UpdateDataModel(emp12_event)` 동적 DELETE | `Emp12_TabPage_Event` | `UpdateDataModel` |
