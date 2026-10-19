# sys.Sys06_Menu

`server/sys/Sys06_Menu.java`

서비스 키 `sys.Sys06_Menu.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 24 | [`sys06_menu.selectByParentId`](../../sys/sql/sys06_menu.md) | `Sys06_Lookup_SelectSingle`, `Sys06_Select_Menu`, `Sys06_Tab_Menu` |  |
| `selectByCompanyId` | 46 | [`sys06_menu.selectByCompanyId`](../../sys/sql/sys06_menu.md) | `Sys06_Tab_MenuView` |  |
| `checkMenualUrl` | 65 | [`sys06_menu.checkMenualUrl`](../../sys/sql/sys06_menu.md) | `MainFrame` |  |
| `selectByCompanyIdAll` | 99 | [`sys06_menu.selectByCompanyIdAll`](../../sys/sql/sys06_menu.md) | `Sys03_Tree_CompanyMenu` |  |
| `selectByRoleId` | 136 | [`sys06_menu.selectByRoleId`](../../sys/sql/sys06_menu.md) | `Sys07_TapPage_Menu`, `Sys07_Tree_CompanyRoleMenu`, `Sys07_Tree_RoleMenu` |  |
| `selectByAdminUserId` | 179 | [`sys06_menu.selectByAdminUserId`](../../sys/sql/sys06_menu.md) | `Sys82_Lookup_UserMenu` |  |
| `selectByUserId` | 227 | [`sys06_menu.selectByRoleId`](../../sys/sql/sys06_menu.md), [`sys06_menu.selectByUserId`](../../sys/sql/sys06_menu.md) | - |  |
| `selectByPersonId` | 275 | [`sys06_menu.selectUserMenu1Bang`](../../sys/sql/sys06_menu.md) | `Sys07_Tree_PersonRoleMenu` | `TreeUtil` |
| `getMenuList` | 286 | [`sys06_menu.getMenuList`](../../sys/sql/sys06_menu.md) | `Emp04_Lookup_AddTitleList`, `MainFrame` |  |
| `getMenuInfo` | 295 | [`sys06_menu.getMenuInfo`](../../sys/sql/sys06_menu.md) | - |  |
| `getMenuModel` | 304 | [`sys06_menu.getMenuModel`](../../sys/sql/sys06_menu.md) | `MyTabItemConfig` |  |
| `updateRoleMenu` | 312 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys07_role_menu)` 동적 INSERT/UPDATE | `Sys07_Tree_CompanyRoleMenu`, `Sys07_Tree_RoleMenu` | `UpdateDataModel` |
| `updateCompanyMenu` | 345 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys03_company_menu)` 동적 INSERT/UPDATE | `Sys03_Tree_CompanyMenu` | `UpdateDataModel` |
| `selectByHeaderMenu` | 378 | `sys06_menu.selectByHeaderMenu`(없음) | - |  |
| `selectByOneDepthsUser` | 390 | `sys06_menu.selectByOneDepthsUser`(없음) | - |  |
| `selectByHeaderMenuCompanyId` | 402 | [`sys06_menu.selectByHeaderMenuCompanyId`](../../sys/sql/sys06_menu.md) | `MainFrame` |  |
| `selectByHeaderMenuUserId` | 415 | [`sys06_menu.selectByHeaderMenuUserId`](../../sys/sql/sys06_menu.md) | `MainFrame` |  |
| `selectByTailMenuCompanyId` | 427 | [`sys06_menu.selectByTailMenuCompanyId`](../../sys/sql/sys06_menu.md) | `MenuGrid`, `MenuGrid_Del`, `MenuGrid_ORI` |  |
| `selectByTailMenuUserId` | 440 | [`sys06_menu.selectByTailMenuUserId`](../../sys/sql/sys06_menu.md) | `MenuGrid`, `MenuGrid_Del`, `MenuGrid_ORI` |  |
| `selectByTextManager` | 452 | [`sys06_menu.selectByTextManager`](../../sys/sql/sys06_menu.md) | `MainFrame`, `Sys06_Lookup_SearchMenu` |  |
| `selectByText` | 470 | [`sys06_menu.selectByText`](../../sys/sql/sys06_menu.md) | `MainFrame`, `Sys06_Lookup_SearchMenu` |  |
| `getAllMenuList` | 493 | [`sys06_menu.getAllMenuList`](../../sys/sql/sys06_menu.md) | `Sys06_Lookup_CopyMulti`, `Sys06_Lookup_SelectMulti` |  |
| `selectByClassName` | 510 | [`sys06_menu.selectByClassName`](../../sys/sql/sys06_menu.md) | - |  |
| `selectByMenuNoPlusName` | 520 | [`sys06_menu.selectByMenuNoPlusName`](../../sys/sql/sys06_menu.md) | `MainFrame` |  |
| `getMenualUrl` | 530 | [`sys06_menu.getMenualUrl`](../../sys/sql/sys06_menu.md) | - |  |
| `selectByMenuName` | 545 | [`sys06_menu.selectByMenuName`](../../sys/sql/sys06_menu.md) | - |  |
| `selectByMenuId` | 555 | [`sys06_menu.selectByMenuId`](../../sys/sql/sys06_menu.md) | `Sys06_Tab_MenuGuide` |  |
| `mobi_selectByHeaderMenuUserId` | 564 | [`sys06_menu.mobi_selectByHeaderMenuUserId`](../../sys/sql/sys06_menu.md) | - |  |
| `mobi_selectByTailMenuUserId` | 576 | [`sys06_menu.mobi_selectByTailMenuUserId`](../../sys/sql/sys06_menu.md) | - |  |
| `updateByMenuYn` | 588 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.getInfoByMenuId`](../../sys/sql/sys01_company.md), [`sys03_company_menu.countUseYn`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.insert`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.updateUseYn`](../../sys/sql/sys03_company_menu.md), [`sys06_menu.selectById`](../../sys/sql/sys06_menu.md) | - |  |
| `insertByMenuYn` | 650 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.getInfoByMenuId`](../../sys/sql/sys01_company.md), [`sys03_company_menu.deleteByCompanyId`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.insert`](../../sys/sql/sys03_company_menu.md), [`sys06_menu.selectById`](../../sys/sql/sys06_menu.md) | `Sys06_Lookup_CopyMulti` |  |
| `update` | 695 | `UpdateDataModel(sys06_menu)` 동적 INSERT/UPDATE | `Sys06_Edit_Menu`, `Sys06_Select_Menu`, `Sys06_Tab_MenuGuide` | `UpdateDataModel` |
| `delete` | 700 | `UpdateDataModel(sys06_menu)` 동적 DELETE | `Sys06_Edit_Menu` | `UpdateDataModel` |
