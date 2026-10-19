# ast.Ast15_TrCodeWindow

`server/ast/Ast15_TrCodeWindow.java`

서비스 키 `ast.Ast15_TrCodeWindow.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`ast15_tr_code_window.selectById`](../../ast/sql/ast15_tr_code_window.md) | - |  |
| `selectByAll` | 24 | [`ast15_tr_code_window.selectByAll`](../../ast/sql/ast15_tr_code_window.md) | `Ast15_Lookup_TrCodeWindow` |  |
| `selectByClassName` | 29 | [`ast15_tr_code_window.selectByClassName`](../../ast/sql/ast15_tr_code_window.md) | `Ast15_Page_TrCodeWindow` |  |
| `getTrCode` | 48 | [`ast15_tr_code_window.getTrCode`](../../ast/sql/ast15_tr_code_window.md) | `Ast15_Page_TrCodeWindow` |  |
| `insert` | 66 | [`ast15_tr_code_window.deleteClassName`](../../ast/sql/ast15_tr_code_window.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast15_tr_code_window)` 동적 INSERT/UPDATE | `Ast15_Page_TrCodeWindow` | `UpdateDataModel` |
| `modelUpdate` | 87 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast15_tr_code_window)` 동적 INSERT/UPDATE | `Ast15_Lookup_TrCodeWindow` | `UpdateDataModel` |
| `update` | 100 | `UpdateDataModel(ast15_tr_code_window)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 105 | `UpdateDataModel(ast15_tr_code_window)` 동적 DELETE | `Ast15_Lookup_TrCodeWindow` | `UpdateDataModel` |
