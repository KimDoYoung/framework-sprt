# pay.Pay06_ActMapping

`server/pay/Pay06_ActMapping.java`

서비스 키 `pay.Pay06_ActMapping.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`pay06_act_mapping.selectById`](../../pay/sql/pay06_act_mapping.md) | - |  |
| `selectByCompanyId` | 25 | [`pay06_act_mapping.selectByCompanyId`](../../pay/sql/pay06_act_mapping.md) | - |  |
| `selectByKindCode` | 37 | [`pay06_act_mapping.selectByKindCode`](../../pay/sql/pay06_act_mapping.md) | - |  |
| `selectByLinkCode` | 51 | [`pay06_act_mapping.selectByLinkCode`](../../pay/sql/pay06_act_mapping.md) | `Apr01_Edit_ApprDoc`, `Pay06_Lookup_ActList`, `Pay06_Lookup_LinkContent`, `Pay06_Lookup_RetireList`, `Pay06_TabPage_ActMapping`, `Pay06_TabPage_RetireMapping` |  |
| `updateModel` | 67 | `UpdateDataModel(pay06_act_mapping)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 77 | `UpdateDataModel(pay06_act_mapping)` 동적 INSERT/UPDATE | `Pay06_Lookup_ActList`, `Pay06_Lookup_RetireList`, `Pay06_TabPage_ActMapping`, `Pay06_TabPage_RetireMapping` | `UpdateDataModel` |
| `delete` | 82 | `UpdateDataModel(pay06_act_mapping)` 동적 DELETE | `Pay06_Lookup_ActList`, `Pay06_Lookup_RetireList`, `Pay06_TabPage_ActMapping`, `Pay06_TabPage_RetireMapping` | `UpdateDataModel` |
