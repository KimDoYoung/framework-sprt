# sys96_menu_log

`server/sys/mapper/sys96_menu_log.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`sys96_menu_log`](../../../db/tables/sys.md) |  | `sys.Sys96_MenuLog.selectById` |
| `selectByTextAdmin` | select | 28 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys96_menu_log`](../../../db/tables/sys.md) | `f_get_emptrans`, `f_sysdate` | `sys.Sys96_MenuLog.selectByTextAdmin` |
| `selectByTextAdminPaging` | select | 62 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys96_menu_log`](../../../db/tables/sys.md) | `f_get_emptrans`, `f_sysdate` | `sys.Sys96_MenuLog.selectByTextAdminPaging` |
| `selectByTextAdminPagingTotal` | select | 98 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys96_menu_log`](../../../db/tables/sys.md) |  | `sys.Sys96_MenuLog.selectByTextAdminPaging` |
| `getClassName` | select | 113 | [`sys96_menu_log`](../../../db/tables/sys.md) |  | `sys.Sys96_MenuLog.upsertMenuLog` |
| `updateByClassName` | update | 120 | [`sys96_menu_log`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys96_MenuLog.upsertMenuLog` |
| `insertByClassName` | insert | 128 | [`sys96_menu_log`](../../../db/tables/sys.md) | `f_create_seq`, `f_sysdate` | `sys.Sys96_MenuLog.upsertMenuLog` |
