# adv11_book_extr

`server/adv/mapper/adv11_book_extr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`adv11_book_extr`](../../../db/tables/adv.md) | `f_cdnm` | `adv.Adv11_BookExtr.selectById` |
| `selectByStdDate` | select | 26 | [`adv11_book_extr`](../../../db/tables/adv.md) | `f_cdnm` | `adv.Adv11_BookExtr.selectByStdDate` |
| `selectRecentStdDate` | select | 36 | [`adv11_book_extr`](../../../db/tables/adv.md) |  | `adv.Adv11_BookExtr.selectRecentStdDate` |
| `excelInsert` | insert | 43 | [`adv11_book_extr`](../../../db/tables/adv.md) | `f_create_seq` | - |
