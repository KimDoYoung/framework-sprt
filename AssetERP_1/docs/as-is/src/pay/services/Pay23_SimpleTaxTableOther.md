# pay.Pay23_SimpleTaxTableOther

`server/pay/Pay23_SimpleTaxTableOther.java`

서비스 키 `pay.Pay23_SimpleTaxTableOther.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay23_simple_tax_table_other.selectById`](../../pay/sql/pay23_simple_tax_table_other.md) | - |  |
| `selectByAll` | 26 | [`pay23_simple_tax_table_other.selectByAll`](../../pay/sql/pay23_simple_tax_table_other.md) | `Pay23_TabPage_SimpleTaxTable` |  |
| `selectByDate` | 32 | [`pay23_simple_tax_table_other.selectByDate`](../../pay/sql/pay23_simple_tax_table_other.md) | `Pay22_TabPage_SimpleTax` |  |
| `insert` | 44 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay23_simple_tax_table_other.insert`](../../pay/sql/pay23_simple_tax_table_other.md), [`pay23_simple_tax_table_other.selectByStartDate`](../../pay/sql/pay23_simple_tax_table_other.md) | `Pay23_Popup_SimpleTaxTableCreate` |  |
| `deleteByDate` | 82 | [`pay22_simple_tax_table.deleteByDate`](../../pay/sql/pay22_simple_tax_table.md), [`pay23_simple_tax_table_other.deleteByDate`](../../pay/sql/pay23_simple_tax_table_other.md) | `Pay23_TabPage_SimpleTaxTable` |  |
| `update` | 93 | `UpdateDataModel(pay23_simple_tax_table_other)` 동적 INSERT/UPDATE | `Pay22_TabPage_SimpleTax` | `UpdateDataModel` |
| `delete` | 98 | `UpdateDataModel(pay23_simple_tax_table_other)` 동적 DELETE | `Pay22_TabPage_SimpleTax` | `UpdateDataModel` |
