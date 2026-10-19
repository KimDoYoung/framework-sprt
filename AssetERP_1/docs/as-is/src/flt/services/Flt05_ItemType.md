# flt.Flt05_ItemType

`server/flt/Flt05_ItemType.java`

서비스 키 `flt.Flt05_ItemType.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`flt05_item_type.selectById`](../../flt/sql/flt05_item_type.md) | - |  |
| `selectBySearchText` | 24 | [`flt05_item_type.selectBySearchText`](../../flt/sql/flt05_item_type.md) | `Flt05_Lookup_ItemType`, `Flt05_Lookup_ItemTypeConfirm`, `Flt05_Tab_ItemTypeAdmin` |  |
| `selectUseCount` | 30 | [`flt05_item_type.selectUseCount`](../../flt/sql/flt05_item_type.md) | `Flt05_Lookup_ItemType` |  |
| `insertInitData` | 58 | [`flt05_item_type.insertInitData`](../../flt/sql/flt05_item_type.md) | `Flt05_Tab_ItemTypeAdmin` |  |
| `update` | 71 | `UpdateDataModel(flt05_item_type)` 동적 INSERT/UPDATE | `Flt05_Lookup_ItemType`, `Flt05_Tab_ItemTypeAdmin` | `UpdateDataModel` |
| `delete` | 76 | `UpdateDataModel(flt05_item_type)` 동적 DELETE | `Flt05_Lookup_ItemType`, `Flt05_Tab_ItemTypeAdmin` | `UpdateDataModel` |
