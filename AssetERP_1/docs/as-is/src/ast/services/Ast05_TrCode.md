# ast.Ast05_TrCode

`server/ast/Ast05_TrCode.java`

서비스 키 `ast.Ast05_TrCode.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`ast05_tr_code.selectById`](../../ast/sql/ast05_tr_code.md) | - |  |
| `selectByTrCode` | 25 | [`ast05_tr_code.selectByTrCode`](../../ast/sql/ast05_tr_code.md) | - |  |
| `selectByCompanyId` | 31 | [`ast05_tr_code.selectByCompanyId`](../../ast/sql/ast05_tr_code.md) | `Ast05_Tab_TrCodeAdmin`, `Ast05_Tab_TrCodeIntrinsic`, `Ast05_Tab_TrCodeManagement` |  |
| `selectBySearchText` | 37 | [`ast05_tr_code.selectBySearchText`](../../ast/sql/ast05_tr_code.md) | `Act02_Tab_ForJournal`, `Act02_Tab_Journal`, `Act02_Tab_JournalSub`, `Act11_Tab_TrJournalMap`, `Ast05_Lookup_TrCode` |  |
| `selectByWindowClassName` | 43 | [`ast05_tr_code.selectByWindowClassName`](../../ast/sql/ast05_tr_code.md) | `Ast05_Lookup_TrCodeWindow` |  |
| `insertInitData` | 49 | [`ast05_tr_code.deleteByTrCode`](../../ast/sql/ast05_tr_code.md), [`ast05_tr_code.insertInitData`](../../ast/sql/ast05_tr_code.md) | `Ast05_Tab_TrCodeAdmin` |  |
| `update` | 66 | [`ast05_tr_code.checkTrCode`](../../ast/sql/ast05_tr_code.md), `UpdateDataModel(ast05_tr_code)` 동적 INSERT/UPDATE | `Ast05_Lookup_TrCode`, `Ast05_Tab_TrCodeAdmin`, `Ast05_Tab_TrCodeIntrinsic`, `Ast05_Tab_TrCodeManagement` | `UpdateDataModel` |
| `delete` | 94 | `UpdateDataModel(ast05_tr_code)` 동적 DELETE | `Ast05_Lookup_TrCode`, `Ast05_Tab_TrCodeAdmin`, `Ast05_Tab_TrCodeIntrinsic`, `Ast05_Tab_TrCodeManagement` | `UpdateDataModel` |
