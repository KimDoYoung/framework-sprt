# sys.Sys25_Password

`server/sys/Sys25_Password.java`

서비스 키 `sys.Sys25_Password.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`sys25_password.selectById`](../../sys/sql/sys25_password.md) | - |  |
| `getCode` | 28 | [`sys25_password.check`](../../sys/sql/sys25_password.md) | `Sys25_Lookup_Reset` | `SendSMSAPIFunction` |
| `checkPassword` | 57 | [`sys25_password.checkPassword`](../../sys/sql/sys25_password.md) | `Sys25_Lookup_Password` |  |
| `checkPasswordRule` | 67 | [`sys25_password.checkPasswordRule`](../../sys/sql/sys25_password.md) | `Sys25_Lookup_Password` |  |
| `insert` | 79 | [`emp01_person.selectByCompanyCode`](../../emp/sql/emp01_person.md), [`sys25_password.checkInsert`](../../sys/sql/sys25_password.md), [`sys25_password.insert`](../../sys/sql/sys25_password.md), [`sys25_password.updatePassword`](../../sys/sql/sys25_password.md) | `Sys25_Lookup_Password`, `Sys25_Tab_ResetPassword` |  |
| `extension` | 118 | [`sys25_password.extension`](../../sys/sql/sys25_password.md), [`sys25_password.getPersonId`](../../sys/sql/sys25_password.md) | `Sys25_Lookup_Password` |  |
| `update` | 129 | `UpdateDataModel(sys25_password)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 134 | `UpdateDataModel(sys25_password)` 동적 DELETE | - | `UpdateDataModel` |
