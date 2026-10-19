# pay.Pay12_RetireInsure

`server/pay/Pay12_RetireInsure.java`

서비스 키 `pay.Pay12_RetireInsure.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`pay12_retire_insure.selectById`](../../pay/sql/pay12_retire_insure.md) | - |  |
| `selectByPersonId` | 26 | [`pay12_retire_insure.selectByPersonId`](../../pay/sql/pay12_retire_insure.md) | `Pay12_TabPage_RetireInsure` |  |
| `selectByRdPersonId` | 37 | [`pay12_retire_insure.selectByRdPersonId`](../../pay/sql/pay12_retire_insure.md) | - |  |
| `getInsureRetire` | 47 | [`pay05_relate_appr.deleteRetireId`](../../pay/sql/pay05_relate_appr.md), [`pay11_month_item.getLeavePayRetire`](../../pay/sql/pay11_month_item.md), [`pay12_retire_insure.getInsureRetire`](../../pay/sql/pay12_retire_insure.md), [`pay13_retire_tax.getIncomeTaxRetire`](../../pay/sql/pay13_retire_tax.md), [`pay13_retire_tax.getIncomeTaxRetireC`](../../pay/sql/pay13_retire_tax.md) | `Pay10_Tab_Retire`, `Pay12_Lookup_RetireCreate` |  |
| `insertRetireInfo` | 105 | [`pay11_month_item.updateItemAmt`](../../pay/sql/pay11_month_item.md), [`pay12_retire_insure.deleteByRetireInsureId`](../../pay/sql/pay12_retire_insure.md), [`pay12_retire_insure.selectByYear`](../../pay/sql/pay12_retire_insure.md), [`pay12_retire_insure.updateModel`](../../pay/sql/pay12_retire_insure.md) | `Pay12_TabPage_RetireInsure` |  |
| `callInsureRetire` | 186 | [`pay12_retire_insure.getInsureRetire`](../../pay/sql/pay12_retire_insure.md) | `Pay12_TabPage_RetireInsure` |  |
| `update` | 210 | `UpdateDataModel(pay12_retire_insure)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 215 | `UpdateDataModel(pay12_retire_insure)` 동적 DELETE | - | `UpdateDataModel` |
