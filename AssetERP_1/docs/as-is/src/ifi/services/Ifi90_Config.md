# ifi.Ifi90_Config

`server/ifi/Ifi90_Config.java`

서비스 키 `ifi.Ifi90_Config.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`ifi90_config.selectById`](../../ifi/sql/ifi90_config.md) | - |  |
| `selectByIfType` | 22 | [`ifi90_config.selectByIfType`](../../ifi/sql/ifi90_config.md) | `Ifi90_Tab_Config` |  |
| `update` | 27 | `UpdateDataModel(ifi90_config)` 동적 INSERT/UPDATE | `Ifi90_Edit_Config` | `UpdateDataModel` |
| `delete` | 32 | [`ifi90_config.checkConfigId`](../../ifi/sql/ifi90_config.md), `UpdateDataModel(ifi90_config)` 동적 DELETE | `Ifi90_Tab_Config` | `UpdateDataModel` |
