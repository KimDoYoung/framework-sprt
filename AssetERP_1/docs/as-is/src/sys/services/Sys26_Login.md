# sys.Sys26_Login

`server/sys/Sys26_Login.java`

서비스 키 `sys.Sys26_Login.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`sys26_login.selectById`](../../sys/sql/sys26_login.md) | - |  |
| `selectByLoginDate` | 21 | [`sys26_login.selectByLoginDate`](../../sys/sql/sys26_login.md) | `Sys26_Tab_LoginHistory` |  |
| `update` | 26 | `UpdateDataModel(sys26_login)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 31 | `UpdateDataModel(sys26_login)` 동적 DELETE | `Sys26_Tab_LoginHistory` | `UpdateDataModel` |
