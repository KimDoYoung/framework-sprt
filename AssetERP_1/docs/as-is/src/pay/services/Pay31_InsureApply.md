# pay.Pay31_InsureApply

`server/pay/Pay31_InsureApply.java`

서비스 키 `pay.Pay31_InsureApply.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 29 | [`pay31_insure_apply.selectById`](../../pay/sql/pay31_insure_apply.md) | - |  |
| `selectByPersonId` | 35 | [`pay31_insure_apply.selectByPersonId`](../../pay/sql/pay31_insure_apply.md) | `Pay31_Popup_InsureApply` |  |
| `selectByCompanyId` | 49 | [`pay31_insure_apply.selectByCompanyId`](../../pay/sql/pay31_insure_apply.md) | `Pay31_TabPage_InsureApply1`, `Pay31_TabPage_InsureApply2`, `Pay31_TabPage_InsureApply3`, `Pay31_TabPage_InsureApply4` | `Calendar` |
| `insert1` | 81 | [`pay31_insure_apply.insert1`](../../pay/sql/pay31_insure_apply.md) | `Pay31_Lookup_Insert1`, `Pay31_Lookup_Insert2` |  |
| `insert3` | 122 | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp35_deduct.selectByCompanyId`](../../emp/sql/emp35_deduct.md), [`pay21_rate.selectByDate`](../../pay/sql/pay21_rate.md), [`pay31_insure_apply.delete3`](../../pay/sql/pay31_insure_apply.md), [`pay31_insure_apply.insert3-2`](../../pay/sql/pay31_insure_apply.md), [`pay31_insure_apply.insert3-4`](../../pay/sql/pay31_insure_apply.md), [`pay32_insure_pay.createInsureAdjust`](../../pay/sql/pay32_insure_pay.md) | `Pay31_Lookup_Insert3` | `Calendar`, `DateUtil` |
| `updateList` | 326 | [`pay31_insure_apply.updateModel`](../../pay/sql/pay31_insure_apply.md), [`pay32_insure_pay.createInsureAdjust`](../../pay/sql/pay32_insure_pay.md) | `Pay31_TabPage_InsureApply3` |  |
| `deleteList` | 349 | [`pay32_insure_pay.deleteByPersonId`](../../pay/sql/pay32_insure_pay.md), `UpdateDataModel(pay31_insure_apply)` 동적 DELETE | `Pay31_TabPage_InsureApply3` | `UpdateDataModel` |
| `update` | 368 | `UpdateDataModel(pay31_insure_apply)` 동적 INSERT/UPDATE | `Pay31_Popup_InsureApply`, `Pay31_TabPage_InsureApply1`, `Pay31_TabPage_InsureApply2`, `Pay31_TabPage_InsureApply4` | `UpdateDataModel` |
| `delete` | 373 | `UpdateDataModel(pay31_insure_apply)` 동적 DELETE | `Pay31_Popup_InsureApply`, `Pay31_TabPage_InsureApply1`, `Pay31_TabPage_InsureApply2`, `Pay31_TabPage_InsureApply4` | `UpdateDataModel` |
