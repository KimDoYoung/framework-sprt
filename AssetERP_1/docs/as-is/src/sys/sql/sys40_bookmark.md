# sys40_bookmark

`server/sys/mapper/sys40_bookmark.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`sys06_menu`](../../../db/tables/sys.md), [`sys40_bookmark`](../../../db/tables/sys.md) | `f_menu_nm_allpath` | `sys.Sys40_Bookmark.selectById` |
| `selectBySearchText` | select | 25 | [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys40_bookmark`](../../../db/tables/sys.md) | `f_menu_nm_allpath` | `sys.Sys40_Bookmark.selectBySearchText` |
| `selectByMenuId` | select | 68 | [`sys40_bookmark`](../../../db/tables/sys.md) |  | `sys.Sys40_Bookmark.insertMenuId` |
| `insertMenuId` | insert | 76 | [`sys40_bookmark`](../../../db/tables/sys.md) |  | `sys.Sys40_Bookmark.insertMenuId` |
| `deleteMenuId` | delete | 94 | [`sys40_bookmark`](../../../db/tables/sys.md) |  | `sys.Sys40_Bookmark.deleteMenuId` |
| `deleteAll` | delete | 102 | [`sys40_bookmark`](../../../db/tables/sys.md) |  | `sys.Sys40_Bookmark.deleteAll` |
