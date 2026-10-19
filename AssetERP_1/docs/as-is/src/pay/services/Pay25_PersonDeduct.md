# pay.Pay25_PersonDeduct

`server/pay/Pay25_PersonDeduct.java`

서비스 키 `pay.Pay25_PersonDeduct.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay25_person_deduct.selectById`](../../pay/sql/pay25_person_deduct.md) | - |  |
| `selectByAll` | 26 | [`pay25_person_deduct.selectByAll`](../../pay/sql/pay25_person_deduct.md) | `Pay25_TabPage_PersonDeduct` |  |
| `selectByMonthId` | 32 | [`pay25_person_deduct.selectByMonthId`](../../pay/sql/pay25_person_deduct.md) | `Pay25_Lookup_PersonDeduct` |  |
| `selectByDate` | 39 | [`pay25_person_deduct.selectByDate`](../../pay/sql/pay25_person_deduct.md) | `Pay25_TabPage_Deduct` |  |
| `insert` | 51 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay25_person_deduct.insert`](../../pay/sql/pay25_person_deduct.md), [`pay25_person_deduct.selectByStartDate`](../../pay/sql/pay25_person_deduct.md) | `Pay25_Popup_personDeductCreate` |  |
| `deleteByDate` | 82 | [`pay25_person_deduct.deleteByDate`](../../pay/sql/pay25_person_deduct.md) | `Pay25_TabPage_PersonDeduct` |  |
| `update` | 92 | `UpdateDataModel(pay25_person_deduct)` 동적 INSERT/UPDATE | `Pay25_TabPage_Deduct` | `UpdateDataModel` |
| `delete` | 97 | `UpdateDataModel(pay25_person_deduct)` 동적 DELETE | `Pay25_TabPage_Deduct` | `UpdateDataModel` |
