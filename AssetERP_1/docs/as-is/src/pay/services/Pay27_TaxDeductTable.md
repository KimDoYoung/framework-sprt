# pay.Pay27_TaxDeductTable

`server/pay/Pay27_TaxDeductTable.java`

서비스 키 `pay.Pay27_TaxDeductTable.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`pay27_tax_deduct_table.selectById`](../../pay/sql/pay27_tax_deduct_table.md) | - |  |
| `selectByAll` | 27 | [`pay27_tax_deduct_table.selectByAll`](../../pay/sql/pay27_tax_deduct_table.md) | `Pay27_TabPage_TaxDeductTable` |  |
| `selectByMonthId` | 33 | [`pay27_tax_deduct_table.selectByMonthId`](../../pay/sql/pay27_tax_deduct_table.md) | `Pay27_Lookup_TaxDeductTable` |  |
| `selectByDate` | 39 | [`pay27_tax_deduct_table.selectByDate`](../../pay/sql/pay27_tax_deduct_table.md) | `Pay27_TabPage_TaxDeduct` |  |
| `insert` | 51 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay27_tax_deduct_table.insert`](../../pay/sql/pay27_tax_deduct_table.md), [`pay27_tax_deduct_table.selectByStartDate`](../../pay/sql/pay27_tax_deduct_table.md), [`pay28_tax_deduct_limit.insert`](../../pay/sql/pay28_tax_deduct_limit.md), [`pay28_tax_deduct_limit.selectByStartDate`](../../pay/sql/pay28_tax_deduct_limit.md) | `Pay27_Popup_TaxDeductTableCreate` |  |
| `deleteByDate` | 103 | [`pay27_tax_deduct_table.deleteByDate`](../../pay/sql/pay27_tax_deduct_table.md), [`pay28_tax_deduct_limit.deleteByDate`](../../pay/sql/pay28_tax_deduct_limit.md) | `Pay27_TabPage_TaxDeductTable` |  |
| `update` | 114 | `UpdateDataModel(pay27_tax_deduct_table)` 동적 INSERT/UPDATE | `Pay27_TabPage_TaxDeduct` | `UpdateDataModel` |
| `delete` | 119 | `UpdateDataModel(pay27_tax_deduct_table)` 동적 DELETE | `Pay27_TabPage_TaxDeduct` | `UpdateDataModel` |
