# sys.Sys51_SpecificMenuPerson

`server/sys/Sys51_SpecificMenuPerson.java`

서비스 키 `sys.Sys51_SpecificMenuPerson.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`sys51_specific_menu_person.selectById`](../../sys/sql/sys51_specific_menu_person.md) | - |  |
| `selectBySpecificMenuId` | 24 | [`sys51_specific_menu_person.selectBySpecificMenuId`](../../sys/sql/sys51_specific_menu_person.md) | `Sys51_Lookup_SpecificMenuPerson` |  |
| `updateGroup` | 33 | [`sys51_specific_menu_person.deleteSpecificMenuPerson`](../../sys/sql/sys51_specific_menu_person.md), [`sys51_specific_menu_person.insertSpecificMenuPerson`](../../sys/sql/sys51_specific_menu_person.md), [`sys51_specific_menu_person.selectBySpecificMenuId`](../../sys/sql/sys51_specific_menu_person.md) | `Sys51_Lookup_SpecificMenuPerson` |  |
| `update` | 55 | `UpdateDataModel(sys51_specific_menu_person)` 동적 INSERT/UPDATE | `Sys51_Lookup_SpecificMenuPerson` | `UpdateDataModel` |
| `delete` | 60 | `UpdateDataModel(sys51_specific_menu_person)` 동적 DELETE | `Sys51_Lookup_SpecificMenuPerson` | `UpdateDataModel` |
