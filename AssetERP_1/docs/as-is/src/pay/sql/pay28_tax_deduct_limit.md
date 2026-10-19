# pay28_tax_deduct_limit

`server/pay/mapper/pay28_tax_deduct_limit.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`pay28_tax_deduct_limit`](../../../db/tables/pay.md) |  | `pay.Pay28_TaxDeductLimit.selectById` |
| `selectByMonthId` | select | 23 | [`pay10_month`](../../../db/tables/pay.md), [`pay28_tax_deduct_limit`](../../../db/tables/pay.md) |  | `pay.Pay28_TaxDeductLimit.selectByMonthId` |
| `selectByDate` | select | 36 | [`pay28_tax_deduct_limit`](../../../db/tables/pay.md) |  | `pay.Pay28_TaxDeductLimit.selectByDate` |
| `selectByStartDate` | select | 43 | [`pay28_tax_deduct_limit`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.insert` |
| `insert` | insert | 52 | [`pay28_tax_deduct_limit`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.insert` |
| `deleteByDate` | delete | 75 | [`pay28_tax_deduct_limit`](../../../db/tables/pay.md) |  | `pay.Pay27_TaxDeductTable.deleteByDate` |
