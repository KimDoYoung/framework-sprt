# flt.Flt13_BookInit

`server/flt/Flt13_BookInit.java`

서비스 키 `flt.Flt13_BookInit.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`flt13_book_init.selectById`](../../flt/sql/flt13_book_init.md) | - |  |
| `selectByPersonId` | 31 | [`flt13_book_init.selectByPersonId`](../../flt/sql/flt13_book_init.md) | `Flt13_Lookup_BookInit` |  |
| `getInfo` | 36 | [`flt13_book_init.getInfo`](../../flt/sql/flt13_book_init.md) | `Flt03_Tab_AccountReport` |  |
| `getInitDate` | 56 | [`flt13_book_init.getInitDate`](../../flt/sql/flt13_book_init.md) | `Flt13_Lookup_BookInit` |  |
| `update` | 67 | [`flt05_item_type.selectByItemType`](../../flt/sql/flt05_item_type.md), [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md), [`flt11_book.deleteByItemName`](../../flt/sql/flt11_book.md), [`flt11_book.insertByFlt13`](../../flt/sql/flt11_book.md), `UpdateDataModel(flt13_book_init)` 동적 INSERT/UPDATE | `Flt13_Lookup_BookInit` | `UpdateDataModel` |
| `delete` | 131 | [`flt05_item_type.selectByItemType`](../../flt/sql/flt05_item_type.md), [`flt11_book.deleteByItemName`](../../flt/sql/flt11_book.md), `UpdateDataModel(flt13_book_init)` 동적 DELETE | `Flt13_Lookup_BookInit` | `UpdateDataModel` |
