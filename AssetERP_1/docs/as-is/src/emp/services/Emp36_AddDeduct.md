# emp.Emp36_AddDeduct

`server/emp/Emp36_AddDeduct.java`

서비스 키 `emp.Emp36_AddDeduct.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`emp36_add_deduct.selectById`](../../emp/sql/emp36_add_deduct.md) | - |  |
| `selectByDeductId` | 27 | [`emp36_add_deduct.selectByDeductId`](../../emp/sql/emp36_add_deduct.md) | `Emp36_Popup_AddDeduct` |  |
| `updateDeductCnt` | 33 | `UpdateDataModel(emp36_add_deduct)` 동적 INSERT/UPDATE | `Emp36_Popup_AddDeduct` | `UpdateDataModel` |
| `addDeductTypeInsert` | 50 | [`emp36_add_deduct.addDeductTypeInsert`](../../emp/sql/emp36_add_deduct.md) | - |  |
| `update` | 68 | `UpdateDataModel(emp36_add_deduct)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 73 | `UpdateDataModel(emp36_add_deduct)` 동적 DELETE | - | `UpdateDataModel` |
