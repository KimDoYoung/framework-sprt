# sys.Sys27_LoginManage

`server/sys/Sys27_LoginManage.java`

서비스 키 `sys.Sys27_LoginManage.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`sys27_login_manage.selectById`](../../sys/sql/sys27_login_manage.md) | - |  |
| `selectByPersonId` | 26 | [`sys27_login_manage.selectByPersonId`](../../sys/sql/sys27_login_manage.md) | - |  |
| `selectByMacAddress` | 31 | [`sys27_login_manage.selectByMacAddress`](../../sys/sql/sys27_login_manage.md) | - |  |
| `selectByText` | 36 | [`sys27_login_manage.selectByText`](../../sys/sql/sys27_login_manage.md) | `Sys27_Tab_LoginManage` |  |
| `checkMacAddress` | 41 | [`sys27_login_manage.checkMacAddress`](../../sys/sql/sys27_login_manage.md) | `LoginPage` |  |
| `updateConfirmYn` | 46 | [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md), [`sys27_login_manage.selectById`](../../sys/sql/sys27_login_manage.md), [`sys27_login_manage.updateConfirmYn`](../../sys/sql/sys27_login_manage.md) | `Sys27_Tab_LoginManage` | `SendSMSAPIFunction` |
| `updateCollapse` | 72 | `sys27_login_manage.updateCollapse`(없음) | `Sys27_Tab_LoginManage` |  |
| `insert` | 81 | [`sys27_login_manage.insert`](../../sys/sql/sys27_login_manage.md), [`sys27_login_manage.selectByMacAddress`](../../sys/sql/sys27_login_manage.md) | `Sys27_Lookup_Request` |  |
| `update` | 99 | `UpdateDataModel(sys27_login_manage)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 104 | `UpdateDataModel(sys27_login_manage)` 동적 DELETE | - | `UpdateDataModel` |
