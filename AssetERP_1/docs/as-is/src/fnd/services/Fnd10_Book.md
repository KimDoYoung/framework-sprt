# fnd.Fnd10_Book

`server/fnd/Fnd10_Book.java`

서비스 키 `fnd.Fnd10_Book.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`fnd10_book.selectById`](../../fnd/sql/fnd10_book.md) | - |  |
| `selectByRelateAst` | 22 | [`fnd10_book.selectByRelateAst`](../../fnd/sql/fnd10_book.md) | `Fnd10_Tab_RelateAst` |  |
| `selectByRelateFnd` | 28 | [`fnd10_book.selectByRelateFnd`](../../fnd/sql/fnd10_book.md) | `Fnd10_Tab_RelateFnd` |  |
| `selectItemList` | 34 | [`fnd10_book.selectItemList`](../../fnd/sql/fnd10_book.md) | `Fnd10_Lookup_RelateFund` |  |
| `selectFundListByItemCode` | 40 | [`fnd10_book.selectFundListByItemCode`](../../fnd/sql/fnd10_book.md) | `Fnd10_Lookup_RelateFund` |  |
| `update` | 46 | `UpdateDataModel(fnd10_book)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 51 | `UpdateDataModel(fnd10_book)` 동적 DELETE | - | `UpdateDataModel` |
