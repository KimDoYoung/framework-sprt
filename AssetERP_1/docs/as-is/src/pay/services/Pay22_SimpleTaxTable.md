# pay.Pay22_SimpleTaxTable

`server/pay/Pay22_SimpleTaxTable.java`

서비스 키 `pay.Pay22_SimpleTaxTable.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`pay22_simple_tax_table.selectById`](../../pay/sql/pay22_simple_tax_table.md) | - |  |
| `selectByDate` | 25 | [`pay22_simple_tax_table.selectByDate`](../../pay/sql/pay22_simple_tax_table.md) | `Pay22_TabPage_SimpleTax` |  |
| `deleteByDate` | 39 | [`pay22_simple_tax_table.deleteByDate`](../../pay/sql/pay22_simple_tax_table.md) | `Pay22_TabPage_SimpleTax` |  |
| `update` | 49 | `UpdateDataModel(pay22_simple_tax_table)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 54 | `UpdateDataModel(pay22_simple_tax_table)` 동적 DELETE | - | `UpdateDataModel` |
