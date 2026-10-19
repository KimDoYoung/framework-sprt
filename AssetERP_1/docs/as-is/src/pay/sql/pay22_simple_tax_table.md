# pay22_simple_tax_table

`server/pay/mapper/pay22_simple_tax_table.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`pay22_simple_tax_table`](../../../db/tables/pay.md) |  | `pay.Pay22_SimpleTaxTable.selectById` |
| `selectByDate` | select | 30 | [`pay22_simple_tax_table`](../../../db/tables/pay.md) |  | `pay.Pay22_SimpleTaxTable.selectByDate` |
| `excelInsert` | insert | 43 | [`pay22_simple_tax_table`](../../../db/tables/pay.md) |  | - |
| `excelDelete` | delete | 79 | [`pay22_simple_tax_table`](../../../db/tables/pay.md) |  | - |
| `deleteByDate` | delete | 86 | [`pay22_simple_tax_table`](../../../db/tables/pay.md) |  | `pay.Pay22_SimpleTaxTable.deleteByDate`, `pay.Pay23_SimpleTaxTableOther.deleteByDate` |
