# sys.Sys13_CodeGroup

`server/sys/Sys13_CodeGroup.java`

서비스 키 `sys.Sys13_CodeGroup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`sys13_code_group.selectById`](../../sys/sql/sys13_code_group.md) | - |  |
| `selectByGroupCodeKind` | 25 | [`sys13_code_group.selectByGroupCodeKind`](../../sys/sql/sys13_code_group.md) | `Sys13_Lookup_CodeGroup` |  |
| `selectByKindGroupCode` | 34 | [`sys13_code_group.selectByKindGroupCode`](../../sys/sql/sys13_code_group.md) | `Sys13_TabPage_Code` |  |
| `insert` | 44 | [`sys13_code_group.insert`](../../sys/sql/sys13_code_group.md), [`sys13_code_group.selectById`](../../sys/sql/sys13_code_group.md) | `Sys13_TabPage_Code` |  |
| `deleteAll` | 57 | [`sys13_code_group.delete`](../../sys/sql/sys13_code_group.md), `UpdateDataModel(sys13_code_group)` 동적 DELETE | `Sys13_Lookup_CodeGroup` | `UpdateDataModel` |
| `update` | 72 | [`sys13_code_group.selectById`](../../sys/sql/sys13_code_group.md), [`sys13_code_group.update`](../../sys/sql/sys13_code_group.md), `UpdateDataModel(sys13_code_group)` 동적 INSERT/UPDATE | `Sys13_Lookup_CodeGroup` | `UpdateDataModel` |
| `delete` | 93 | `UpdateDataModel(sys13_code_group)` 동적 DELETE | `Sys13_TabPage_Code` | `UpdateDataModel` |
