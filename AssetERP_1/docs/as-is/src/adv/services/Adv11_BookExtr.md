# adv.Adv11_BookExtr

`server/adv/Adv11_BookExtr.java`

서비스 키 `adv.Adv11_BookExtr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`adv11_book_extr.selectById`](../../adv/sql/adv11_book_extr.md) | - |  |
| `selectByStdDate` | 22 | [`adv11_book_extr.selectByStdDate`](../../adv/sql/adv11_book_extr.md) | `Adv11_Tab_BookExtr` |  |
| `selectRecentStdDate` | 28 | [`adv11_book_extr.selectRecentStdDate`](../../adv/sql/adv11_book_extr.md) | `Adv11_Tab_BookExtr` |  |
| `update` | 39 | `UpdateDataModel(adv11_book_extr)` 동적 INSERT/UPDATE | `Adv11_Tab_BookExtr` | `UpdateDataModel` |
| `delete` | 44 | `UpdateDataModel(adv11_book_extr)` 동적 DELETE | `Adv11_Tab_BookExtr` | `UpdateDataModel` |
