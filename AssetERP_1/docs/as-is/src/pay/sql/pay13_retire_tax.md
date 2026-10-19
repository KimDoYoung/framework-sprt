# pay13_retire_tax

`server/pay/mapper/pay13_retire_tax.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`pay13_retire_tax`](../../../db/tables/pay.md) |  | `pay.Pay13_RetireTax.selectById` |
| `selectByMonthId` | select | 37 | [`pay13_retire_tax`](../../../db/tables/pay.md) |  | `pay.Pay13_RetireTax.selectByMonthId` |
| `getIncomeTaxRetire` | select | 43 | - | `f_calc_income_tax_retire` | `pay.Pay12_RetireInsure.getInsureRetire`, `pay.Pay13_RetireTax.insertOfficePayTax`, `pay.Pay13_RetireTax.insertRetireTax`, `pay.Pay14_RetireTaxItem.insertRetireTaxItem` |
| `getIncomeTaxRetireC` | select | 47 | - | `f_calc_income_tax_retire_c` | `pay.Pay12_RetireInsure.getInsureRetire` |
| `getOfficePayTax` | select | 51 | [`pay13_retire_tax`](../../../db/tables/pay.md) |  | `pay.Pay13_RetireTax.getOfficePayTax` |
| `updateAmt` | update | 70 | [`pay13_retire_tax`](../../../db/tables/pay.md) |  | `pay.Pay13_RetireTax.insertRetireTax` |
| `updateOfficePayTax` | update | 102 | [`pay13_retire_tax`](../../../db/tables/pay.md) |  | `pay.Pay13_RetireTax.insertOfficePayTax` |
| `deleteByMonthId` | delete | 111 | [`pay13_retire_tax`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.deleteAll` |
