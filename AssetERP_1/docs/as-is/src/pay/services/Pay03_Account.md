# pay.Pay03_Account

`server/pay/Pay03_Account.java`

서비스 키 `pay.Pay03_Account.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`pay03_account.selectById`](../../pay/sql/pay03_account.md) | - |  |
| `selectByCompanyId` | 22 | [`pay03_account.selectByCompanyId`](../../pay/sql/pay03_account.md) | `Pay03_Lookup_PayAccount`, `Pay03_Tab_Account` |  |
| `selectByStartDate` | 28 | [`pay03_account.selectByStartDate`](../../pay/sql/pay03_account.md) | `Pay02_Tab_List`, `Pay10_TabPage_Retire`, `Pay10_Tab_List` |  |
| `update` | 37 | `UpdateDataModel(pay03_account)` 동적 INSERT/UPDATE | `Pay03_Lookup_PayAccount`, `Pay03_Tab_Account` | `UpdateDataModel` |
| `delete` | 42 | `UpdateDataModel(pay03_account)` 동적 DELETE | `Pay03_Lookup_PayAccount`, `Pay03_Tab_Account` | `UpdateDataModel` |
