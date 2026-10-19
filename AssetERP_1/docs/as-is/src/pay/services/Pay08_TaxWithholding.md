# pay.Pay08_TaxWithholding

`server/pay/Pay08_TaxWithholding.java`

서비스 키 `pay.Pay08_TaxWithholding.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay08_tax_withholding.selectById`](../../pay/sql/pay08_tax_withholding.md) | - |  |
| `selectByCompanyId` | 24 | [`pay08_tax_withholding.selectByCompanyId`](../../pay/sql/pay08_tax_withholding.md) | - |  |
| `selectByPersonId` | 34 | [`pay08_tax_withholding.selectByPersonId`](../../pay/sql/pay08_tax_withholding.md) | `Pay08_Tab_TaxWithholding` |  |
| `update` | 45 | `UpdateDataModel(pay08_tax_withholding)` 동적 INSERT/UPDATE | `Pay08_Tab_TaxWithholdingAdmin` | `UpdateDataModel` |
| `delete` | 50 | `UpdateDataModel(pay08_tax_withholding)` 동적 DELETE | `Pay08_Tab_TaxWithholdingAdmin` | `UpdateDataModel` |
