# emp.Emp31_Director

`server/emp/Emp31_Director.java`

서비스 키 `emp.Emp31_Director.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`emp31_director.selectById`](../../emp/sql/emp31_director.md) | - |  |
| `selectByText` | 24 | [`emp31_director.selectByText`](../../emp/sql/emp31_director.md) | `Emp31_Tab_Director` |  |
| `selectByTextReport` | 30 | [`emp31_director.selectByTextReport`](../../emp/sql/emp31_director.md) | - |  |
| `updateList` | 36 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp31_director.selectByPersonId`](../../emp/sql/emp31_director.md), `UpdateDataModel(emp31_director)` 동적 INSERT/UPDATE | `Emp31_Tab_Director` | `UpdateDataModel` |
| `update` | 57 | `UpdateDataModel(emp31_director)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 62 | `UpdateDataModel(emp31_director)` 동적 DELETE | `Emp31_Tab_Director` | `UpdateDataModel` |
