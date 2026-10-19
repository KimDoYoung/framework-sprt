# pay.Pay11_MonthItem

`server/pay/Pay11_MonthItem.java`

서비스 키 `pay.Pay11_MonthItem.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`pay11_month_item.selectById`](../../pay/sql/pay11_month_item.md) | - |  |
| `selectByMonthId` | 32 | [`pay11_month_item.selectByMonthId`](../../pay/sql/pay11_month_item.md) | - |  |
| `selectByItemType` | 38 | [`pay11_month_item.selectByItemType`](../../pay/sql/pay11_month_item.md) | `Pay11_TabPage_MonthItem` |  |
| `selectByDate` | 49 | [`pay11_month_item.selectByDate`](../../pay/sql/pay11_month_item.md) | `Pay10_Tab_MonthSearch` |  |
| `selectByText` | 66 | [`pay11_month_item.selectByText`](../../pay/sql/pay11_month_item.md) | `Pay10_Tab_MonthItem` |  |
| `insertItemType` | 83 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay10_month.selectByCompanyId`](../../pay/sql/pay10_month.md), [`pay11_month_item.insert`](../../pay/sql/pay11_month_item.md) | `Pay10_Tab_MonthItem` |  |
| `updateList` | 116 | [`pay11_month_item.deleteByMonthItemId`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateItemAmt`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateModel`](../../pay/sql/pay11_month_item.md) | `Pay11_TabPage_MonthItem` |  |
| `getInsureAdjustModi` | 158 | [`pay11_month_item.deleteByMonthItemId`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureAdjustModi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateModel`](../../pay/sql/pay11_month_item.md) | `Pay11_TabPage_MonthItem` |  |
| `updateMonthItemList` | 262 | [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureAdjustModi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateItemAmt`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateModel`](../../pay/sql/pay11_month_item.md) | `Pay10_Tab_MonthItem` |  |
| `recalculationTax` | 340 | [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateItemAmt`](../../pay/sql/pay11_month_item.md) | `Pay11_TabPage_MonthItem` |  |
| `update` | 360 | `UpdateDataModel(pay11_month_item)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 365 | `UpdateDataModel(pay11_month_item)` 동적 DELETE | - | `UpdateDataModel` |
