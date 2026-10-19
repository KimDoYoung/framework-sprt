# emp.Emp35_Deduct

`server/emp/Emp35_Deduct.java`

서비스 키 `emp.Emp35_Deduct.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`emp35_deduct.selectById`](../../emp/sql/emp35_deduct.md) | - |  |
| `selectByPersonId` | 28 | [`emp35_deduct.selectByPersonId`](../../emp/sql/emp35_deduct.md) | `Emp35_Page_DeductDate`, `Emp35_TabPage_DeductDate` |  |
| `selectByStdDate` | 42 | [`emp35_deduct.selectByStdDate`](../../emp/sql/emp35_deduct.md) | `Emp35_Tab_DeductPerson` |  |
| `insert` | 60 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp35_deduct.deleteByDeductId`](../../emp/sql/emp35_deduct.md), [`emp35_deduct.insert`](../../emp/sql/emp35_deduct.md), [`emp35_deduct.selectByCompanyId`](../../emp/sql/emp35_deduct.md), [`emp36_add_deduct.addDeductTypeInsert`](../../emp/sql/emp36_add_deduct.md), [`emp36_add_deduct.deleteByDeductId`](../../emp/sql/emp36_add_deduct.md) | `Emp35_Popup_DeductCreate` |  |
| `deleteAll` | 128 | [`emp35_deduct.deleteByDeductId`](../../emp/sql/emp35_deduct.md), [`emp36_add_deduct.deleteByDeductId`](../../emp/sql/emp36_add_deduct.md) | `Emp35_TabPage_DeductInsert` |  |
| `update` | 138 | `UpdateDataModel(emp35_deduct)` 동적 INSERT/UPDATE | `Emp35_TabPage_DeductInsert` | `UpdateDataModel` |
| `delete` | 143 | `UpdateDataModel(emp35_deduct)` 동적 DELETE | - | `UpdateDataModel` |
