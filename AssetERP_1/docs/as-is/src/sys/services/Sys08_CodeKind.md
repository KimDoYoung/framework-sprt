# sys.Sys08_CodeKind

`server/sys/Sys08_CodeKind.java`

서비스 키 `sys.Sys08_CodeKind.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByKindName` | 22 | [`sys08_code_kind.selectByKindName`](../../sys/sql/sys08_code_kind.md) | `Sys08_Tab_CodeKindAdmin`, `Sys08_Tab_CodeKindClient` |  |
| `selectByAll` | 50 | [`sys08_code_kind.selectByAll`](../../sys/sql/sys08_code_kind.md) | `Sys08_Tab_SuperUser` |  |
| `selectByKindCode` | 55 | [`sys08_code_kind.selectByKindCode`](../../sys/sql/sys08_code_kind.md) | `Sys09_Lookup_Code`, `Sys09_Lookup_CodeKind` |  |
| `update` | 60 | `UpdateDataModel(sys08_code_kind)` 동적 INSERT/UPDATE | `Sys08_Tab_CodeKindAdmin`, `Sys08_Tab_CodeKindClient` | `UpdateDataModel` |
| `delete` | 65 | `UpdateDataModel(sys08_code_kind)` 동적 DELETE | `Sys08_Tab_CodeKindAdmin`, `Sys08_Tab_CodeKindClient` | `UpdateDataModel` |
