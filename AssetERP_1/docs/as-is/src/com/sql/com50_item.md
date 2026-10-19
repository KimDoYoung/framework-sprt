# com50_item

`server/com/mapper/com50_item.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`com50_item`](../../../db/tables/com.md) |  | `com.Com50_Item.selectById` |
| `selectByItemCode` | select | 20 | [`com50_item`](../../../db/tables/com.md) |  | `com.Com50_Item.selectByItemCode` |
| `selectItemCode` | select | 27 | [`com50_item`](../../../db/tables/com.md) |  | - |
| `whereCondition` | sql | 33 | - |  |  |
| `selectByTextPaging` | select | 38 | [`com50_item`](../../../db/tables/com.md) |  | `com.Com50_Item.selectByTextPaging` |
| `selectByTextPagingTotal` | select | 48 | [`com50_item`](../../../db/tables/com.md) |  | `com.Com50_Item.selectByTextPaging` |
| `checkItemCode` | select | 55 | [`com50_item`](../../../db/tables/com.md) |  | `com.Com50_Item.update` |
| `insert` | insert | 62 | [`com50_item`](../../../db/tables/com.md) | `f_create_seq` | - |
| `updateItemName` | update | 72 | [`com50_item`](../../../db/tables/com.md) |  | - |
