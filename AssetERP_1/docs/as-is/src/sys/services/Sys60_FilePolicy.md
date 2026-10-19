# sys.Sys60_FilePolicy

`server/sys/Sys60_FilePolicy.java`

서비스 키 `sys.Sys60_FilePolicy.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sys60_file_policy.selectById`](../../sys/sql/sys60_file_policy.md) | - |  |
| `selectByText` | 23 | [`sys60_file_policy.selectByText`](../../sys/sql/sys60_file_policy.md) | `Sys60_Tab_FilePolicy` |  |
| `getAll` | 31 | [`sys60_file_policy.getAll`](../../sys/sql/sys60_file_policy.md) | - |  |
| `update` | 36 | `UpdateDataModel(sys60_file_policy)` 동적 INSERT/UPDATE | `Sys60_Tab_FilePolicy` | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(sys60_file_policy)` 동적 DELETE | `Sys60_Tab_FilePolicy` | `UpdateDataModel` |
