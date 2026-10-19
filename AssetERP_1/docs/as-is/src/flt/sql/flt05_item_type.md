# flt05_item_type

`server/flt/mapper/flt05_item_type.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`flt05_item_type`](../../../db/tables/flt.md), [`sys01_company`](../../../db/tables/sys.md) |  | `flt.Flt05_ItemType.selectById` |
| `selectBySearchText` | select | 30 | [`flt05_item_type`](../../../db/tables/flt.md), [`sys01_company`](../../../db/tables/sys.md) |  | `flt.Flt05_ItemType.selectBySearchText` |
| `selectByItemType` | select | 40 | [`flt05_item_type`](../../../db/tables/flt.md) |  | `flt.Flt13_BookInit.delete`, `flt.Flt13_BookInit.update` |
| `selectUseCount` | select | 50 | [`flt05_item_type`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt12_book_month`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md) |  | `flt.Flt05_ItemType.selectUseCount` |
| `insertInitData` | insert | 85 | [`flt05_item_type`](../../../db/tables/flt.md) | `f_create_seq` | `flt.Flt05_ItemType.insertInitData` |
| `insertFromFlt05` | insert | 103 | [`flt05_item_type`](../../../db/tables/flt.md) | `f_create_seq` | - |
