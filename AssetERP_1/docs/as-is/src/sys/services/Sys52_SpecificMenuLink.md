# sys.Sys52_SpecificMenuLink

`server/sys/Sys52_SpecificMenuLink.java`

서비스 키 `sys.Sys52_SpecificMenuLink.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sys52_specific_menu_link.selectById`](../../sys/sql/sys52_specific_menu_link.md) | - |  |
| `selectBySpecificWorkCode` | 23 | [`sys52_specific_menu_link.selectBySpecificWorkCode`](../../sys/sql/sys52_specific_menu_link.md) | `Sys52_Lookup_SpecificMenuLink` |  |
| `update` | 32 | `UpdateDataModel(sys52_specific_menu_link)` 동적 INSERT/UPDATE | `Sys52_Lookup_SpecificMenuLink` | `UpdateDataModel` |
| `delete` | 37 | `UpdateDataModel(sys52_specific_menu_link)` 동적 DELETE | `Sys52_Lookup_SpecificMenuLink` | `UpdateDataModel` |
