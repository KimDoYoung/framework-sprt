# pay.Pay24_DeductTable

`server/pay/Pay24_DeductTable.java`

서비스 키 `pay.Pay24_DeductTable.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay24_deduct_table.selectById`](../../pay/sql/pay24_deduct_table.md) | - |  |
| `selectByAll` | 26 | [`pay24_deduct_table.selectByAll`](../../pay/sql/pay24_deduct_table.md) | `Pay24_TabPage_DeductTable` |  |
| `selectByMonthId` | 32 | [`pay24_deduct_table.selectByMonthId`](../../pay/sql/pay24_deduct_table.md) | `Pay24_Lookup_DeductTable` |  |
| `selectByDataCode` | 43 | [`pay24_deduct_table.selectByDataCode`](../../pay/sql/pay24_deduct_table.md) | `Pay24_TabPage_Deduct` |  |
| `insert` | 57 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay24_deduct_table.insert`](../../pay/sql/pay24_deduct_table.md), [`pay24_deduct_table.selectByStartDate`](../../pay/sql/pay24_deduct_table.md) | `Pay24_Popup_DeductTableCreate` |  |
| `updateLimitAmt` | 98 | [`pay24_deduct_table.updateLimitAmt`](../../pay/sql/pay24_deduct_table.md) | `Pay24_TabPage_Deduct` |  |
| `deleteByDate` | 115 | [`pay24_deduct_table.deleteByDate`](../../pay/sql/pay24_deduct_table.md) | `Pay24_TabPage_DeductTable` |  |
| `update` | 125 | `UpdateDataModel(pay24_deduct_table)` 동적 INSERT/UPDATE | `Pay24_TabPage_Deduct` | `UpdateDataModel` |
| `delete` | 130 | `UpdateDataModel(pay24_deduct_table)` 동적 DELETE | `Pay24_TabPage_Deduct` | `UpdateDataModel` |
