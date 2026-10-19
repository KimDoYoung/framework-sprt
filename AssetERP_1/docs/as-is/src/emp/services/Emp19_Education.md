# emp.Emp19_Education

`server/emp/Emp19_Education.java`

서비스 키 `emp.Emp19_Education.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 23 | [`emp19_education.selectByPersonId`](../../emp/sql/emp19_education.md) | `Emp19_TabPage_education` |  |
| `multiUpdate` | 35 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp19_education)` 동적 INSERT/UPDATE | `Emp19_TabPage_education` | `UpdateDataModel` |
| `update` | 53 | `UpdateDataModel(emp19_education)` 동적 INSERT/UPDATE | `Emp19_TabPage_education` | `UpdateDataModel` |
| `delete` | 58 | `UpdateDataModel(emp19_education)` 동적 DELETE | `Emp19_TabPage_education` | `UpdateDataModel` |
