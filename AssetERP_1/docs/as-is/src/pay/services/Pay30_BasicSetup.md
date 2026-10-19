# pay.Pay30_BasicSetup

`server/pay/Pay30_BasicSetup.java`

서비스 키 `pay.Pay30_BasicSetup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay30_basic_setup.selectById`](../../pay/sql/pay30_basic_setup.md) | - |  |
| `selectByCompanyId` | 24 | [`pay30_basic_setup.selectByCompanyId`](../../pay/sql/pay30_basic_setup.md) | `pay30_Popup_BasicSetup` |  |
| `modelUpdate` | 30 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay30_basic_setup)` 동적 INSERT/UPDATE | `pay30_Popup_BasicSetup` | `UpdateDataModel` |
| `update` | 43 | `UpdateDataModel(pay30_basic_setup)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 48 | `UpdateDataModel(pay30_basic_setup)` 동적 DELETE | - | `UpdateDataModel` |
