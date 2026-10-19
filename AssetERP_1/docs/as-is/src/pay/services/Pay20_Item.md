# pay.Pay20_Item

`server/pay/Pay20_Item.java`

서비스 키 `pay.Pay20_Item.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay20_item.selectById`](../../pay/sql/pay20_item.md) | - |  |
| `selectByText` | 24 | [`pay20_item.selectByText`](../../pay/sql/pay20_item.md) | `Pay20_Lookup_ItemList` |  |
| `selectBySearchText` | 30 | [`pay20_item.selectBySearchText`](../../pay/sql/pay20_item.md) | `Pay20_TabPage_Item` |  |
| `selectByItemType` | 41 | [`pay20_item.selectByItemType`](../../pay/sql/pay20_item.md) | `Pay20_Lookup_SelectMulti` |  |
| `getMonthItem` | 47 | [`pay20_item.getMonthItem`](../../pay/sql/pay20_item.md) | `Pay20_Lookup_MonthItem` |  |
| `update` | 53 | `UpdateDataModel(pay20_item)` 동적 INSERT/UPDATE | `Pay20_TabPage_Item` | `UpdateDataModel` |
| `delete` | 58 | `UpdateDataModel(pay20_item)` 동적 DELETE | `Pay20_TabPage_Item` | `UpdateDataModel` |
