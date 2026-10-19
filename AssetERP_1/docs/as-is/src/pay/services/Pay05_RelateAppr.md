# pay.Pay05_RelateAppr

`server/pay/Pay05_RelateAppr.java`

서비스 키 `pay.Pay05_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay05_relate_appr.selectById`](../../pay/sql/pay05_relate_appr.md) | - |  |
| `selectByCompanyId` | 26 | [`pay05_relate_appr.selectByCompanyId`](../../pay/sql/pay05_relate_appr.md) | `Pay02_Tab_List`, `Pay10_Tab_List` |  |
| `selectByRetire` | 42 | [`pay05_relate_appr.selectByRetire`](../../pay/sql/pay05_relate_appr.md) | `Pay10_TabPage_Retire` |  |
| `insert` | 60 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay05_relate_appr.insert`](../../pay/sql/pay05_relate_appr.md), [`pay05_relate_appr.selectByCompanyId`](../../pay/sql/pay05_relate_appr.md) | `Pay02_Tab_List`, `Pay10_Tab_List` |  |
| `insertRetire` | 88 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay05_relate_appr.insert`](../../pay/sql/pay05_relate_appr.md), [`pay05_relate_appr.selectByRetire`](../../pay/sql/pay05_relate_appr.md) | `Pay10_TabPage_Retire` |  |
| `updateApprId` | 119 | [`pay05_relate_appr.updateApprId`](../../pay/sql/pay05_relate_appr.md) | `Pay02_Tab_List`, `Pay10_TabPage_Retire`, `Pay10_Tab_List` |  |
| `update` | 129 | `UpdateDataModel(pay05_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 134 | `UpdateDataModel(pay05_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
