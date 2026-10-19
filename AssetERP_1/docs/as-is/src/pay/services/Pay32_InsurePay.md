# pay.Pay32_InsurePay

`server/pay/Pay32_InsurePay.java`

서비스 키 `pay.Pay32_InsurePay.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay32_insure_pay.selectById`](../../pay/sql/pay32_insure_pay.md) | - |  |
| `selectByCompanyId` | 24 | [`pay32_insure_pay.selectByCompanyId`](../../pay/sql/pay32_insure_pay.md) | `Pay32_Tab_InsurePay` |  |
| `selectByPersonId` | 41 | [`pay32_insure_pay.selectByPersonId`](../../pay/sql/pay32_insure_pay.md) | `Pay32_Lookup_Detail` |  |
| `update` | 58 | `UpdateDataModel(pay32_insure_pay)` 동적 INSERT/UPDATE | `Pay32_Lookup_Detail` | `UpdateDataModel` |
| `delete` | 63 | `UpdateDataModel(pay32_insure_pay)` 동적 DELETE | `Pay32_Lookup_Detail` | `UpdateDataModel` |
