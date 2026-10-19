# pay24_deduct_table

`server/pay/mapper/pay24_deduct_table.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`pay24_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay24_DeductTable.selectById` |
| `selectByAll` | select | 24 | [`pay24_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay24_DeductTable.selectByAll` |
| `selectByMonthId` | select | 33 | [`pay10_month`](../../../db/tables/pay.md), [`pay24_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay24_DeductTable.selectByMonthId` |
| `selectByDataCode` | select | 47 | [`pay24_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay24_DeductTable.selectByDataCode` |
| `selectByStartDate` | select | 55 | [`pay24_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay24_DeductTable.insert` |
| `insert` | insert | 64 | [`pay24_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay24_DeductTable.insert` |
| `updateLimitAmt` | update | 89 | [`pay24_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay24_DeductTable.updateLimitAmt` |
| `deleteByDate` | delete | 96 | [`pay24_deduct_table`](../../../db/tables/pay.md) |  | `pay.Pay24_DeductTable.deleteByDate` |
