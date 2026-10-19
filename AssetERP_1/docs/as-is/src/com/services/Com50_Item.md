# com.Com50_Item

`server/com/Com50_Item.java`

서비스 키 `com.Com50_Item.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`com50_item.selectById`](../../com/sql/com50_item.md) | - |  |
| `selectByItemCode` | 24 | [`com50_item.selectByItemCode`](../../com/sql/com50_item.md) | - |  |
| `selectByTextPaging` | 30 | [`com50_item.selectByTextPaging`](../../com/sql/com50_item.md), [`com50_item.selectByTextPagingTotal`](../../com/sql/com50_item.md) | `Com50_Lookup_StkItem` |  |
| `update` | 37 | [`com50_item.checkItemCode`](../../com/sql/com50_item.md), `UpdateDataModel(com50_item)` 동적 INSERT/UPDATE | `Com50_Lookup_StkItem` | `UpdateDataModel` |
| `delete` | 57 | `UpdateDataModel(com50_item)` 동적 DELETE | `Com50_Lookup_StkItem` | `UpdateDataModel` |
