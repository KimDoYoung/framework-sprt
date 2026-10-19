# pay.Pay13_RetireTax

`server/pay/Pay13_RetireTax.java`

서비스 키 `pay.Pay13_RetireTax.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay13_retire_tax.selectById`](../../pay/sql/pay13_retire_tax.md) | - |  |
| `selectByMonthId` | 24 | [`pay13_retire_tax.selectByMonthId`](../../pay/sql/pay13_retire_tax.md) | `Pay13_TabPage_RetireTax` |  |
| `getOfficePayTax` | 30 | [`pay13_retire_tax.getOfficePayTax`](../../pay/sql/pay13_retire_tax.md) | `Pay13_TabPage_RetireTax` |  |
| `insertRetireTax` | 36 | [`pay13_retire_tax.getIncomeTaxRetire`](../../pay/sql/pay13_retire_tax.md), [`pay13_retire_tax.updateAmt`](../../pay/sql/pay13_retire_tax.md) | `Pay13_TabPage_RetireTax` |  |
| `insertOfficePayTax` | 60 | [`pay13_retire_tax.getIncomeTaxRetire`](../../pay/sql/pay13_retire_tax.md), [`pay13_retire_tax.updateOfficePayTax`](../../pay/sql/pay13_retire_tax.md) | `Pay13_TabPage_RetireTax` |  |
| `update` | 86 | `UpdateDataModel(pay13_retire_tax)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 91 | `UpdateDataModel(pay13_retire_tax)` 동적 DELETE | - | `UpdateDataModel` |
