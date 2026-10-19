# crm.Crm01_Item

`server/crm/Crm01_Item.java`

서비스 키 `crm.Crm01_Item.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`crm01_item.selectById`](../../crm/sql/crm01_item.md) | - |  |
| `selectByText` | 27 | [`crm01_item.selectByParentId`](../../crm/sql/crm01_item.md), [`crm01_item.selectByText`](../../crm/sql/crm01_item.md) | `Crm01_Tab_ItemTreeGrid` |  |
| `update` | 73 | `UpdateDataModel(crm01_item)` 동적 INSERT/UPDATE | `Crm01_Edit_Item` | `UpdateDataModel` |
| `delete` | 85 | [`crm01_item.selectByParentId`](../../crm/sql/crm01_item.md), [`crm10_cmnt.selectByItemId`](../../crm/sql/crm10_cmnt.md), `UpdateDataModel(crm01_item)` 동적 DELETE | `Crm01_Edit_Item` | `UpdateDataModel` |
