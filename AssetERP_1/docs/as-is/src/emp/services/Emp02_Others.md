# emp.Emp02_Others

`server/emp/Emp02_Others.java`

서비스 키 `emp.Emp02_Others.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`emp02_others.selectById`](../../emp/sql/emp02_others.md) | `Emp01_Tab_UserInfo`, `MainFrame` |  |
| `selectByPersonId` | 24 | [`emp02_others.selectByPersonId`](../../emp/sql/emp02_others.md) | `Emp02_Lookup_HireDate` |  |
| `updatePerson` | 30 | [`emp02_others.upsert`](../../emp/sql/emp02_others.md) | `MyInfoPopup` |  |
| `updateOne` | 43 | [`emp02_others.upsert`](../../emp/sql/emp02_others.md) | `Emp02_TabPage_Others` |  |
| `updateHireDate` | 49 | [`emp02_others.updateHireDate`](../../emp/sql/emp02_others.md) | `Emp02_Lookup_HireDate` |  |
| `modelUpdate` | 54 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp02_others)` 동적 INSERT/UPDATE | `Emp02_Edit_Note` | `UpdateDataModel` |
| `update` | 67 | `UpdateDataModel(emp02_others)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 72 | `UpdateDataModel(emp02_others)` 동적 DELETE | - | `UpdateDataModel` |
