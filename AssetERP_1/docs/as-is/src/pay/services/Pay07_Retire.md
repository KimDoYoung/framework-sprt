# pay.Pay07_Retire

`server/pay/Pay07_Retire.java`

서비스 키 `pay.Pay07_Retire.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | [`pay07_retire.selectById`](../../pay/sql/pay07_retire.md) | - |  |
| `selectByCompanyId` | 30 | [`pay07_retire.selectByCompanyId`](../../pay/sql/pay07_retire.md) | - |  |
| `selectByPersonId` | 42 | [`pay07_retire.selectByPersonId`](../../pay/sql/pay07_retire.md) | `Pay07_TabPage_RetireStatement1` |  |
| `countRetire` | 56 | [`pay07_retire.countRetire`](../../pay/sql/pay07_retire.md) | `Pay07_Tab_Retire` |  |
| `createRetire` | 61 | [`pay07_retire.checkAppr`](../../pay/sql/pay07_retire.md) | `Pay07_Lookup_RetireCreate` |  |
| `deleteRetire` | 95 | [`pay07_retire.checkAppr`](../../pay/sql/pay07_retire.md) | `Pay07_Tab_Retire` |  |
| `checkAppr` | 123 | [`pay05_relate_appr.checkAppr`](../../pay/sql/pay05_relate_appr.md) | - |  |
| `updateApprId` | 139 | [`pay07_retire.updateApprId`](../../pay/sql/pay07_retire.md) | `Pay07_TabPage_RetireStatement1` |  |
| `update` | 153 | `UpdateDataModel(pay07_retire)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 158 | `UpdateDataModel(pay07_retire)` 동적 DELETE | - | `UpdateDataModel` |
