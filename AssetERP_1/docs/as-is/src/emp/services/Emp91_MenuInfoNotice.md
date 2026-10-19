# emp.Emp91_MenuInfoNotice

`server/emp/Emp91_MenuInfoNotice.java`

서비스 키 `emp.Emp91_MenuInfoNotice.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`emp91_menu_info_notice.selectById`](../../emp/sql/emp91_menu_info_notice.md) | - |  |
| `selectByPersonId` | 27 | [`emp91_menu_info_notice.selectByPersonId`](../../emp/sql/emp91_menu_info_notice.md) | - |  |
| `selectByText` | 34 | [`emp91_menu_info_notice.selectByText`](../../emp/sql/emp91_menu_info_notice.md) | `Emp91_Lookup_List` |  |
| `getList` | 45 | [`emp91_menu_info_notice.getList`](../../emp/sql/emp91_menu_info_notice.md) | `MenuInfoNotice` |  |
| `updatePersonId` | 52 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp91_menu_info_notice.insert`](../../emp/sql/emp91_menu_info_notice.md), [`emp91_menu_info_notice.selectByMenuId`](../../emp/sql/emp91_menu_info_notice.md), `UpdateDataModel(emp91_menu_info_notice)` 동적 INSERT/UPDATE | `Emp91_Lookup_List`, `MenuInfoNotice` | `UpdateDataModel` |
| `deletePersonId` | 84 | [`emp91_menu_info_notice.deletePersonId`](../../emp/sql/emp91_menu_info_notice.md) | `Emp91_Lookup_List` |  |
| `update` | 93 | `UpdateDataModel(emp91_menu_info_notice)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 98 | `UpdateDataModel(emp91_menu_info_notice)` 동적 DELETE | `Emp91_Lookup_List` | `UpdateDataModel` |
