# pay27_tax_deduct_table

`server/pay/mapper/pay27_tax_deduct_table.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`pay27_tax_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.selectById` |
| `selectByAll` | select | 22 | [`pay27_tax_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.selectByAll` |
| `selectByMonthId` | select | 31 | [`pay10_month`](../../../db/tables/pay.md), [`pay27_tax_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.selectByMonthId` |
| `selectByDate` | select | 44 | [`pay27_tax_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.selectByDate` |
| `selectByStartDate` | select | 51 | [`pay27_tax_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.insert` |
| `insert` | insert | 60 | [`pay27_tax_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.insert` |
| `deleteByDate` | delete | 81 | [`pay27_tax_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.deleteByDate` |
