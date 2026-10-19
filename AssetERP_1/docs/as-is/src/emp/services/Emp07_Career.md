# emp.Emp07_Career

`server/emp/Emp07_Career.java`

서비스 키 `emp.Emp07_Career.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 20 | [`emp07_career.selectByPersonId`](../../emp/sql/emp07_career.md) | `Emp07_TabPage_Career`, `Tdm03_Lookup_AddTitle` |  |
| `update` | 33 | `UpdateDataModel(emp07_career)` 동적 INSERT/UPDATE | `Emp07_TabPage_Career`, `Tdm03_Lookup_AddTitle` | `UpdateDataModel` |
| `delete` | 38 | `UpdateDataModel(emp07_career)` 동적 DELETE | `Emp07_TabPage_Career`, `Tdm03_Lookup_AddTitle` | `UpdateDataModel` |
