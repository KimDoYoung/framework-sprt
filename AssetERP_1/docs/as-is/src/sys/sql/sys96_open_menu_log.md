# sys96_open_menu_log

`server/sys/mapper/sys96_open_menu_log.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`sys96_open_menu_log`](../../../db/tables/sys.md) |  | `sys.Sys96_OpenMenuLog.selectById` |
| `selectByTextAdmin` | select | 28 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys26_login`](../../../db/tables/sys.md), [`sys96_open_menu_log`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `sys.Sys96_OpenMenuLog.selectByTextAdmin` |
| `selectByTextAdminPaging` | select | 69 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys26_login`](../../../db/tables/sys.md), [`sys96_open_menu_log`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `sys.Sys96_OpenMenuLog.selectByTextAdminPaging` |
| `selectByTextAdminPagingTotal` | select | 117 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys96_open_menu_log`](../../../db/tables/sys.md) |  | `sys.Sys96_OpenMenuLog.selectByTextAdminPaging` |
| `getClassName` | select | 137 | [`sys96_open_menu_log`](../../../db/tables/sys.md) |  | - |
| `insert` | insert | 144 | [`sys96_open_menu_log`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys96_OpenMenuLog.insert` |
| `updateSecond` | update | 165 | [`sys96_open_menu_log`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys96_OpenMenuLog.updateSecond` |
