# sys.Sys50_SpecificMenu

`server/sys/Sys50_SpecificMenu.java`

서비스 키 `sys.Sys50_SpecificMenu.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sys50_specific_menu.selectById`](../../sys/sql/sys50_specific_menu.md) | - |  |
| `selectByCompanyId` | 23 | [`sys50_specific_menu.selectByCompanyId`](../../sys/sql/sys50_specific_menu.md) | - |  |
| `selectBySpecificWorkCode` | 31 | [`sys50_specific_menu.selectBySpecificWorkCode`](../../sys/sql/sys50_specific_menu.md) | `Sys50_TabPage_SpecificMenu` |  |
| `update` | 40 | `UpdateDataModel(sys50_specific_menu)` 동적 INSERT/UPDATE | `Sys50_TabPage_SpecificMenu` | `UpdateDataModel` |
| `delete` | 45 | `UpdateDataModel(sys50_specific_menu)` 동적 DELETE | `Sys50_TabPage_SpecificMenu` | `UpdateDataModel` |
