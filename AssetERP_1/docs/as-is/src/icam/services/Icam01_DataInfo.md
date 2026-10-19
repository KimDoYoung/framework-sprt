# icam.Icam01_DataInfo

`server/icam/Icam01_DataInfo.java`

서비스 키 `icam.Icam01_DataInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`icam01_data_info.selectById`](../../icam/sql/icam01_data_info.md) | - |  |
| `selectBySearchText` | 25 | [`icam01_data_info.selectBySearchText`](../../icam/sql/icam01_data_info.md) | `Icam01_Tab_DataInfo` |  |
| `update` | 30 | `UpdateDataModel(icam01_data_info)` 동적 INSERT/UPDATE | `Icam01_Tab_DataInfo` | `UpdateDataModel` |
| `delete` | 35 | `UpdateDataModel(icam01_data_info)` 동적 DELETE | `Icam01_Tab_DataInfo` | `UpdateDataModel` |
