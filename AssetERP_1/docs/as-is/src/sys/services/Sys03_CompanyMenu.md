# sys.Sys03_CompanyMenu

`server/sys/Sys03_CompanyMenu.java`

서비스 키 `sys.Sys03_CompanyMenu.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `insert` | 21 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys03_company_menu.insert`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.selectByCompanyId`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.selectByMenu`](../../sys/sql/sys03_company_menu.md), [`sys04_role.copyRole`](../../sys/sql/sys04_role.md), [`sys04_role.selectByCompanyId`](../../sys/sql/sys04_role.md), [`sys04_role.selectByName`](../../sys/sql/sys04_role.md), [`sys07_role_menu.insert`](../../sys/sql/sys07_role_menu.md), [`sys07_role_menu.selectByMenuId`](../../sys/sql/sys07_role_menu.md), [`sys07_role_menu.selectByRoleName`](../../sys/sql/sys07_role_menu.md) | `Sys03_Lookup_CompanyMenu` |  |
| `update` | 91 | `UpdateDataModel(sys03_company_menu)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 96 | `UpdateDataModel(sys03_company_menu)` 동적 DELETE | - | `UpdateDataModel` |
