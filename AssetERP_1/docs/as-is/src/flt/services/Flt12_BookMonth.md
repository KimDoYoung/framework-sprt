# flt.Flt12_BookMonth

`server/flt/Flt12_BookMonth.java`

서비스 키 `flt.Flt12_BookMonth.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`flt12_book_month.selectById`](../../flt/sql/flt12_book_month.md) | - |  |
| `selectByBookDate` | 26 | [`flt12_book_month.selectByBookDate`](../../flt/sql/flt12_book_month.md) | `Flt10_Tab_RealTransaction` |  |
| `checkBookMonth` | 31 | [`flt12_book_month.checkBookMonth`](../../flt/sql/flt12_book_month.md) | `Flt10_Tab_RealTransaction` |  |
| `update` | 41 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt11_book.updateBookAmt`](../../flt/sql/flt11_book.md), [`flt12_book_month.selectById`](../../flt/sql/flt12_book_month.md), `UpdateDataModel(flt12_book_month)` 동적 INSERT/UPDATE | `Flt10_Tab_RealTransaction` | `UpdateDataModel` |
| `insertBookAmt` | 75 | [`flt11_book.updateBookAmt`](../../flt/sql/flt11_book.md), [`flt12_book_month.selectInsertBookAmtTarget`](../../flt/sql/flt12_book_month.md), `UpdateDataModel(flt12_book_month)` 동적 INSERT/UPDATE | `Flt10_Tab_RealTransaction` | `UpdateDataModel` |
| `delete` | 102 | `UpdateDataModel(flt12_book_month)` 동적 DELETE | - | `UpdateDataModel` |
