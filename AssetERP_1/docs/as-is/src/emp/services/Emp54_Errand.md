# emp.Emp54_Errand

`server/emp/Emp54_Errand.java`

서비스 키 `emp.Emp54_Errand.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 27 | [`emp54_errand.selectById`](../../emp/sql/emp54_errand.md) | - |  |
| `selectByPersonId` | 33 | [`emp54_errand.selectByPersonId`](../../emp/sql/emp54_errand.md) | - |  |
| `selectByDate` | 39 | [`emp54_errand.selectByDate`](../../emp/sql/emp54_errand.md) | `Emp54_Tab_Errand` |  |
| `selectByManager` | 51 | [`emp54_errand.selectByManager`](../../emp/sql/emp54_errand.md) | `Emp54_Tab_ErrandManager` |  |
| `modelUpdate` | 57 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp54_errand.insert`](../../emp/sql/emp54_errand.md) | `Emp54_Edit_Errand` | `Calendar`, `DatabaseFactory` |
| `updatePublicYn` | 195 | [`emp54_errand.selectById`](../../emp/sql/emp54_errand.md), [`emp54_errand.updatePublicYn`](../../emp/sql/emp54_errand.md) | `Emp54_Tab_Errand` |  |
| `update` | 202 | `UpdateDataModel(emp54_errand)` 동적 INSERT/UPDATE | `Emp54_Tab_Errand` | `UpdateDataModel` |
| `delete` | 207 | `UpdateDataModel(emp54_errand)` 동적 DELETE | `Emp54_Tab_Errand` | `UpdateDataModel` |
