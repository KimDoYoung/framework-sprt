# pay.Pay28_TaxDeductLimit

`server/pay/Pay28_TaxDeductLimit.java`

서비스 키 `pay.Pay28_TaxDeductLimit.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`pay28_tax_deduct_limit.selectById`](../../pay/sql/pay28_tax_deduct_limit.md) | - |  |
| `selectByMonthId` | 25 | [`pay28_tax_deduct_limit.selectByMonthId`](../../pay/sql/pay28_tax_deduct_limit.md) | `Pay27_Lookup_TaxDeductTable` |  |
| `selectByDate` | 31 | [`pay28_tax_deduct_limit.selectByDate`](../../pay/sql/pay28_tax_deduct_limit.md) | `Pay27_TabPage_TaxDeduct` |  |
| `update` | 43 | `UpdateDataModel(pay28_tax_deduct_limit)` 동적 INSERT/UPDATE | `Pay27_TabPage_TaxDeduct` | `UpdateDataModel` |
| `delete` | 48 | `UpdateDataModel(pay28_tax_deduct_limit)` 동적 DELETE | `Pay27_TabPage_TaxDeduct` | `UpdateDataModel` |
