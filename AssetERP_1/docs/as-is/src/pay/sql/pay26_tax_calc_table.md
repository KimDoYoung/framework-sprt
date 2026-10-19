# pay26_tax_calc_table

`server/pay/mapper/pay26_tax_calc_table.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`pay26_tax_calc_table`](../../../db/tables/pay.md) |  | `pay.Pay26_TaxCalcTable.selectById` |
| `selectByAll` | select | 22 | [`pay26_tax_calc_table`](../../../db/tables/pay.md) |  | `pay.Pay26_TaxCalcTable.selectByAll` |
| `selectByMonthId` | select | 31 | [`pay10_month`](../../../db/tables/pay.md), [`pay26_tax_calc_table`](../../../db/tables/pay.md) |  | `pay.Pay26_TaxCalcTable.selectByMonthId` |
| `selectByDate` | select | 44 | [`pay26_tax_calc_table`](../../../db/tables/pay.md) |  | `pay.Pay26_TaxCalcTable.selectByDate` |
| `selectByStartDate` | select | 51 | [`pay26_tax_calc_table`](../../../db/tables/pay.md) |  | `pay.Pay26_TaxCalcTable.insert` |
| `insert` | insert | 60 | [`pay26_tax_calc_table`](../../../db/tables/pay.md) |  | `pay.Pay26_TaxCalcTable.insert` |
| `deleteByDate` | delete | 81 | [`pay26_tax_calc_table`](../../../db/tables/pay.md) |  | `pay.Pay26_TaxCalcTable.deleteByDate` |
