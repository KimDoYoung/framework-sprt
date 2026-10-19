# pay14_retire_tax_item

`server/pay/mapper/pay14_retire_tax_item.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`pay14_retire_tax_item`](../../../db/tables/pay.md) |  | `pay.Pay14_RetireTaxItem.selectById` |
| `selectByItemType` | select | 21 | [`pay14_retire_tax_item`](../../../db/tables/pay.md) |  | `pay.Pay14_RetireTaxItem.selectByItemType` |
| `selectByMonthId` | select | 28 | [`pay14_retire_tax_item`](../../../db/tables/pay.md) |  | `pay.Pay14_RetireTaxItem.selectByMonthId` |
| `updateModel` | update | 36 | [`pay14_retire_tax_item`](../../../db/tables/pay.md) | `f_create_seq` | `pay.Pay14_RetireTaxItem.insertRetireTaxItem` |
| `deleteByRetireTaxItemId` | delete | 67 | [`pay14_retire_tax_item`](../../../db/tables/pay.md) |  | `pay.Pay14_RetireTaxItem.insertRetireTaxItem` |
| `deleteByMonthId` | delete | 73 | [`pay14_retire_tax_item`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.deleteAll` |
