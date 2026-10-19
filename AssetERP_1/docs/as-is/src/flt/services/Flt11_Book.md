# flt.Flt11_Book

`server/flt/Flt11_Book.java`

서비스 키 `flt.Flt11_Book.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`flt11_book.selectById`](../../flt/sql/flt11_book.md) | - |  |
| `selectByText` | 25 | [`flt11_book.selectByText`](../../flt/sql/flt11_book.md) | `Flt11_Lookup_BookList` |  |
| `selectByText2` | 30 | [`flt11_book.selectByText2`](../../flt/sql/flt11_book.md) | `Flt11_Lookup_BookList` |  |
| `selectByBookList` | 35 | [`flt11_book.selectByBookList`](../../flt/sql/flt11_book.md) | `Flt11_Tab_BookList`, `Flt11_Tab_BookListAdmin` |  |
| `selectByDate` | 40 | [`flt11_book.selectByDate`](../../flt/sql/flt11_book.md) | `Flt10_Tab_RealTransaction` |  |
| `update` | 51 | `UpdateDataModel(flt11_book)` 동적 INSERT/UPDATE | `Flt11_Tab_BookList`, `Flt11_Tab_BookListAdmin` | `UpdateDataModel` |
| `delete` | 56 | `UpdateDataModel(flt11_book)` 동적 DELETE | - | `UpdateDataModel` |
