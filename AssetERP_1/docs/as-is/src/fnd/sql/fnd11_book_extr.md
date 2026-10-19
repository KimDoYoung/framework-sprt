# fnd11_book_extr

`server/fnd/mapper/fnd11_book_extr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`fnd11_book_extr`](../../../db/tables/fnd.md) | `f_cdnm` | `fnd.Fnd11_BookExtr.selectById` |
| `selectByStdDate` | select | 26 | [`fnd11_book_extr`](../../../db/tables/fnd.md) | `f_cdnm` | `fnd.Fnd11_BookExtr.selectByStdDate` |
| `selectRecentStdDate` | select | 36 | [`fnd11_book_extr`](../../../db/tables/fnd.md) |  | `fnd.Fnd11_BookExtr.selectRecentStdDate` |
| `excelInsert` | insert | 43 | [`fnd11_book_extr`](../../../db/tables/fnd.md) | `f_create_seq` | - |
