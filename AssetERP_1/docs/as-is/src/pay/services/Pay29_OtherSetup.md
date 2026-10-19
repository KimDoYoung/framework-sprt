# pay.Pay29_OtherSetup

`server/pay/Pay29_OtherSetup.java`

서비스 키 `pay.Pay29_OtherSetup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay29_other_setup.selectById`](../../pay/sql/pay29_other_setup.md) | - |  |
| `selectByAll` | 26 | [`pay29_other_setup.selectByAll`](../../pay/sql/pay29_other_setup.md) | `Pay29_TabPage_OtherSetupDate` |  |
| `selectByDate` | 32 | [`pay29_other_setup.selectByDate`](../../pay/sql/pay29_other_setup.md) | `Pay29_TabPage_OtherSetup` |  |
| `insert` | 44 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay29_other_setup.insert`](../../pay/sql/pay29_other_setup.md), [`pay29_other_setup.selectByStartDate`](../../pay/sql/pay29_other_setup.md) | `Pay29_Popup_OtherSetupCreate` |  |
| `deleteByDate` | 78 | [`pay29_other_setup.deleteByDate`](../../pay/sql/pay29_other_setup.md) | `Pay29_TabPage_OtherSetupDate` |  |
| `update` | 88 | `UpdateDataModel(pay29_other_setup)` 동적 INSERT/UPDATE | `Pay29_TabPage_OtherSetup` | `UpdateDataModel` |
| `delete` | 93 | `UpdateDataModel(pay29_other_setup)` 동적 DELETE | `Pay29_TabPage_OtherSetup` | `UpdateDataModel` |
