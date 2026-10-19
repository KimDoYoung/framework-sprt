# sys.Sys29_LoginSecure

`server/sys/Sys29_LoginSecure.java`

서비스 키 `sys.Sys29_LoginSecure.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sys29_login_secure.selectById`](../../sys/sql/sys29_login_secure.md) | - |  |
| `selectByCompanyId` | 23 | [`sys29_login_secure.selectByCompanyId`](../../sys/sql/sys29_login_secure.md) | `Sys29_Lookup_PublicIpList` |  |
| `checkLoginSecure` | 28 | [`sys29_login_secure.checkLoginSecure`](../../sys/sql/sys29_login_secure.md) | `LoginPage` |  |
| `update` | 38 | `UpdateDataModel(sys29_login_secure)` 동적 INSERT/UPDATE | `Sys29_Lookup_PublicIpList` | `UpdateDataModel` |
| `delete` | 43 | `UpdateDataModel(sys29_login_secure)` 동적 DELETE | `Sys29_Lookup_PublicIpList` | `UpdateDataModel` |
