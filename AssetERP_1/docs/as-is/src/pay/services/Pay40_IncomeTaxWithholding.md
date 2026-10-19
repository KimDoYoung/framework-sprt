# pay.Pay40_IncomeTaxWithholding

`server/pay/Pay40_IncomeTaxWithholding.java`

서비스 키 `pay.Pay40_IncomeTaxWithholding.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay40_income_tax_withholding.selectById`](../../pay/sql/pay40_income_tax_withholding.md) | - |  |
| `selectByCompanyId` | 26 | [`pay40_income_tax_withholding.selectByCompanyId`](../../pay/sql/pay40_income_tax_withholding.md) | `Pay40_Tab_TaxWithholding` |  |
| `updateApprId` | 35 | [`pay40_income_tax_withholding.updateApprId`](../../pay/sql/pay40_income_tax_withholding.md) | `Pay40_Tab_TaxWithholding` |  |
| `updateList` | 46 | [`pay40_income_tax_withholding.insert`](../../pay/sql/pay40_income_tax_withholding.md), [`pay40_income_tax_withholding.selectById`](../../pay/sql/pay40_income_tax_withholding.md), `UpdateDataModel(pay40_income_tax_withholding)` 동적 INSERT/UPDATE | `Pay40_Tab_TaxWithholding` | `UpdateDataModel` |
| `update` | 66 | `UpdateDataModel(pay40_income_tax_withholding)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 71 | `UpdateDataModel(pay40_income_tax_withholding)` 동적 DELETE | `Pay40_Tab_TaxWithholding` | `UpdateDataModel` |
