# emp.Emp90_Notice

`server/emp/Emp90_Notice.java`

서비스 키 `emp.Emp90_Notice.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`emp90_notice.selectById`](../../emp/sql/emp90_notice.md) | - |  |
| `selectByPersonId` | 25 | [`emp90_notice.selectByPersonId`](../../emp/sql/emp90_notice.md) | `Emp90_Lookup_Notice` |  |
| `updateList` | 34 | [`emp90_notice.insert`](../../emp/sql/emp90_notice.md), [`emp90_notice.selectByText`](../../emp/sql/emp90_notice.md) | `Emp90_Lookup_Notice` |  |
| `deleteList` | 54 | [`emp90_notice.delete`](../../emp/sql/emp90_notice.md), [`emp90_notice.selectByText`](../../emp/sql/emp90_notice.md) | `Emp90_Lookup_Notice` |  |
| `update` | 74 | `UpdateDataModel(emp90_notice)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 79 | `UpdateDataModel(emp90_notice)` 동적 DELETE | - | `UpdateDataModel` |
