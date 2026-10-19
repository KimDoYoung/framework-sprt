# bbs.Bbs01_Board

`server/bbs/Bbs01_Board.java`

서비스 키 `bbs.Bbs01_Board.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`bbs01_board.selectById`](../../bbs/sql/bbs01_board.md) | - |  |
| `selectByCompanyId` | 28 | [`bbs01_board.selectByCompanyId`](../../bbs/sql/bbs01_board.md) | `Bbs01_Tab_Board`, `Bbs01_Tab_BoardManager`, `Page_Board` |  |
| `selectByTypeCode` | 57 | [`bbs01_board.selectByTypeCode`](../../bbs/sql/bbs01_board.md) | - |  |
| `update` | 88 | `UpdateDataModel(bbs01_board)` 동적 INSERT/UPDATE | `Bbs01_Lookup_BoardInsert`, `Bbs01_Lookup_BoardUpdate`, `Edit_BoardOriginal` | `UpdateDataModel` |
| `delete` | 98 | `UpdateDataModel(bbs01_board)` 동적 DELETE | `Bbs01_Edit_Board`, `Bbs01_Lookup_BoardUpdate`, `Bbs01_Tab_Board`, `Bbs01_Tab_BoardManager`, `Edit_BoardOriginal` | `UpdateDataModel` |
