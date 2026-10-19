# sys.Sys83_SecondaryAuthUser

`server/sys/Sys83_SecondaryAuthUser.java`

서비스 키 `sys.Sys83_SecondaryAuthUser.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`sys83_secondary_auth_user.selectById`](../../sys/sql/sys83_secondary_auth_user.md) | - |  |
| `selectByTempPassword` | 25 | [`sys83_secondary_auth_user.selectByTempPassword`](../../sys/sql/sys83_secondary_auth_user.md) | `Sys83_Lookup_TempPassword` |  |
| `sendTempPassword` | 36 | [`sys83_secondary_auth_user.insert`](../../sys/sql/sys83_secondary_auth_user.md) | `Sys83_Lookup_TempPassword` | `SendSMSAPIFunction` |
| `update` | 51 | `UpdateDataModel(sys83_secondary_auth_user)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 56 | `UpdateDataModel(sys83_secondary_auth_user)` 동적 DELETE | - | `UpdateDataModel` |
