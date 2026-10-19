# sys.Sys54_SpecificMenuHistory

`server/sys/Sys54_SpecificMenuHistory.java`

서비스 키 `sys.Sys54_SpecificMenuHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`sys54_specific_menu_history.selectById`](../../sys/sql/sys54_specific_menu_history.md) | - |  |
| `selectByCompanyId` | 26 | [`sys54_specific_menu_history.selectByCompanyId`](../../sys/sql/sys54_specific_menu_history.md) | `Sys54_Lookup_SpecificMenuHistory` |  |
| `deleteFile` | 34 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(sys10_file)` 동적 DELETE | `Sys54_Lookup_SpecificMenuHistory` | `File`, `UpdateDataModel` |
| `updateByNote` | 51 | [`sys54_specific_menu_history.updateByNote`](../../sys/sql/sys54_specific_menu_history.md) | `Sys54_Edit_Note` |  |
| `update` | 56 | `UpdateDataModel(sys54_specific_menu_history)` 동적 INSERT/UPDATE | `Sys54_Lookup_SpecificMenuHistory` | `UpdateDataModel` |
| `delete` | 61 | `UpdateDataModel(sys54_specific_menu_history)` 동적 DELETE | `Sys54_Lookup_SpecificMenuHistory` | `UpdateDataModel` |
