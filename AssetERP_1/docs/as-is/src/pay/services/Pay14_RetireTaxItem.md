# pay.Pay14_RetireTaxItem

`server/pay/Pay14_RetireTaxItem.java`

서비스 키 `pay.Pay14_RetireTaxItem.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay14_retire_tax_item.selectById`](../../pay/sql/pay14_retire_tax_item.md) | - |  |
| `selectByMonthId` | 26 | [`pay14_retire_tax_item.selectByMonthId`](../../pay/sql/pay14_retire_tax_item.md) | `Pay13_TabPage_RetireTax` |  |
| `selectByItemType` | 37 | [`pay14_retire_tax_item.selectByItemType`](../../pay/sql/pay14_retire_tax_item.md) | - |  |
| `insertRetireTaxItem` | 43 | [`pay13_retire_tax.getIncomeTaxRetire`](../../pay/sql/pay13_retire_tax.md), [`pay14_retire_tax_item.deleteByRetireTaxItemId`](../../pay/sql/pay14_retire_tax_item.md), [`pay14_retire_tax_item.updateModel`](../../pay/sql/pay14_retire_tax_item.md) | `Pay13_TabPage_RetireTax` |  |
| `update` | 135 | `UpdateDataModel(pay14_retire_tax_item)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 140 | `UpdateDataModel(pay14_retire_tax_item)` 동적 DELETE | - | `UpdateDataModel` |
