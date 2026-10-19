# adv.Adv10_Book

`server/adv/Adv10_Book.java`

서비스 키 `adv.Adv10_Book.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`adv10_book.selectById`](../../adv/sql/adv10_book.md) | - |  |
| `update` | 22 | `UpdateDataModel(adv10_book)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 27 | `UpdateDataModel(adv10_book)` 동적 DELETE | - | `UpdateDataModel` |
