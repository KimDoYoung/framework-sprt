# sys03_company_menu

`server/sys/mapper/sys03_company_menu.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`sys03_company_menu`](../../../db/tables/sys.md) |  | - |
| `selectByCompanyId` | select | 20 | [`sys03_company_menu`](../../../db/tables/sys.md) |  | `sys.Sys03_CompanyMenu.insert` |
| `selectByMenu` | select | 26 | [`sys03_company_menu`](../../../db/tables/sys.md) |  | `sys.Sys03_CompanyMenu.insert`, `sys.Sys07_RoleMenu.updateMenu` |
| `countUseYn` | select | 33 | [`sys03_company_menu`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md) |  | `sys.Sys06_Menu.updateByMenuYn` |
| `updateMenu` | update | 49 | [`sys03_company_menu`](../../../db/tables/sys.md) |  | `sys.Sys07_RoleMenu.updateMenu` |
| `deleteByCompanyId` | delete | 62 | [`sys03_company_menu`](../../../db/tables/sys.md) |  | `sys.Sys06_Menu.insertByMenuYn` |
| `insertMenu` | insert | 69 | [`sys03_company_menu`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys07_RoleMenu.updateMenu` |
| `insert` | insert | 83 | [`sys03_company_menu`](../../../db/tables/sys.md) |  | `sys.Sys03_CompanyMenu.insert`, `sys.Sys06_Menu.insertByMenuYn`, `sys.Sys06_Menu.updateByMenuYn` |
| `updateUseYn` | update | 97 | [`sys03_company_menu`](../../../db/tables/sys.md) |  | `sys.Sys06_Menu.updateByMenuYn` |
