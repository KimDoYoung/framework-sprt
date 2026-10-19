# flt.Flt04_Oath

`server/flt/Flt04_Oath.java`

서비스 키 `flt.Flt04_Oath.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`flt04_oath.selectById`](../../flt/sql/flt04_oath.md) | - |  |
| `selectByPersonId` | 26 | [`flt04_oath.selectByPersonId`](../../flt/sql/flt04_oath.md) | `Flt02_Lookup_Emp` |  |
| `selectByDate` | 35 | [`flt04_oath.selectByDate`](../../flt/sql/flt04_oath.md) | `Flt03_Tab_AccountReport`, `Flt10_Tab_BuyReport`, `Flt10_Tab_SellReport` |  |
| `updateApprId` | 45 | [`flt04_oath.insertApprId`](../../flt/sql/flt04_oath.md), [`flt04_oath.selectByStratDate`](../../flt/sql/flt04_oath.md), [`flt04_oath.updateApprId`](../../flt/sql/flt04_oath.md) | `Flt02_Lookup_Emp` |  |
| `update` | 68 | `UpdateDataModel(flt04_oath)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 73 | `UpdateDataModel(flt04_oath)` 동적 DELETE | - | `UpdateDataModel` |
