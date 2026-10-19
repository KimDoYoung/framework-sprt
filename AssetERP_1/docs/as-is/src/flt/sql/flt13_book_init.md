# flt13_book_init

`server/flt/mapper/flt13_book_init.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectFlt13BookInit` | sql | 31 | [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `to_decrypts` |  |
| `selectById` | select | 49 | [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `to_decrypts` | `flt.Flt13_BookInit.selectById` |
| `selectByPersonId` | select | 54 | [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `to_decrypts` | `flt.Flt13_BookInit.selectByPersonId` |
| `getInfo` | select | 63 | [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `flt.Flt13_BookInit.getInfo` |
| `getInitDate` | select | 98 | [`flt13_book_init`](../../../db/tables/flt.md) |  | `flt.Flt10_Tr.update`, `flt.Flt13_BookInit.getInitDate` |
| `excelInsert` | insert | 105 | [`flt13_book_init`](../../../db/tables/flt.md) | `f_create_seq` | - |
| `updateItemName` | update | 135 | [`flt13_book_init`](../../../db/tables/flt.md) |  | - |
