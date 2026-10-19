# sys.Sys85_ClientInfo

`server/sys/Sys85_ClientInfo.java`

서비스 키 `sys.Sys85_ClientInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sys85_client_info.selectById`](../../sys/sql/sys85_client_info.md) | - |  |
| `selectByText` | 24 | [`sys85_client_info.selectByText`](../../sys/sql/sys85_client_info.md) | `Sys85_Lookup_ClientInfoList` |  |
| `update` | 32 | `UpdateDataModel(sys85_client_info)` 동적 INSERT/UPDATE | `Sys85_Lookup_ClientInfoList` | `UpdateDataModel` |
| `delete` | 37 | `UpdateDataModel(sys85_client_info)` 동적 DELETE | `Sys85_Lookup_ClientInfoList` | `UpdateDataModel` |
