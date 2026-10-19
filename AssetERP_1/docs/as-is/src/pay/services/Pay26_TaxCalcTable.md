# pay.Pay26_TaxCalcTable

`server/pay/Pay26_TaxCalcTable.java`

서비스 키 `pay.Pay26_TaxCalcTable.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay26_tax_calc_table.selectById`](../../pay/sql/pay26_tax_calc_table.md) | - |  |
| `selectByAll` | 26 | [`pay26_tax_calc_table.selectByAll`](../../pay/sql/pay26_tax_calc_table.md) | `Pay26_TabPage_TaxCalcTable` |  |
| `selectByMonthId` | 32 | [`pay26_tax_calc_table.selectByMonthId`](../../pay/sql/pay26_tax_calc_table.md) | `Pay26_Lookup_TaxCalcTable` |  |
| `selectByDate` | 39 | [`pay26_tax_calc_table.selectByDate`](../../pay/sql/pay26_tax_calc_table.md) | `Pay26_TabPage_TaxCalc` |  |
| `insert` | 51 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay26_tax_calc_table.insert`](../../pay/sql/pay26_tax_calc_table.md), [`pay26_tax_calc_table.selectByStartDate`](../../pay/sql/pay26_tax_calc_table.md) | `Pay26_Popup_TaxCalcCreate` |  |
| `deleteByDate` | 84 | [`pay26_tax_calc_table.deleteByDate`](../../pay/sql/pay26_tax_calc_table.md) | `Pay26_TabPage_TaxCalcTable` |  |
| `update` | 94 | `UpdateDataModel(pay26_tax_calc_table)` 동적 INSERT/UPDATE | `Pay26_TabPage_TaxCalc` | `UpdateDataModel` |
| `delete` | 99 | `UpdateDataModel(pay26_tax_calc_table)` 동적 DELETE | `Pay26_TabPage_TaxCalc` | `UpdateDataModel` |
