# fnd.Fnd11_BookExtr

`server/fnd/Fnd11_BookExtr.java`

서비스 키 `fnd.Fnd11_BookExtr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`fnd11_book_extr.selectById`](../../fnd/sql/fnd11_book_extr.md) | - |  |
| `selectByStdDate` | 22 | [`fnd11_book_extr.selectByStdDate`](../../fnd/sql/fnd11_book_extr.md) | `Fnd11_Tab_BookExtr` |  |
| `selectRecentStdDate` | 28 | [`fnd11_book_extr.selectRecentStdDate`](../../fnd/sql/fnd11_book_extr.md) | `Fnd11_Tab_BookExtr` |  |
| `update` | 39 | `UpdateDataModel(fnd11_book_extr)` 동적 INSERT/UPDATE | `Fnd11_Tab_BookExtr` | `UpdateDataModel` |
| `delete` | 44 | `UpdateDataModel(fnd11_book_extr)` 동적 DELETE | `Fnd11_Tab_BookExtr` | `UpdateDataModel` |
