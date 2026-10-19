# sys.Sys96_MenuLog

`server/sys/Sys96_MenuLog.java`

서비스 키 `sys.Sys96_MenuLog.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`sys96_menu_log.selectById`](../../sys/sql/sys96_menu_log.md) | - |  |
| `selectByTextAdmin` | 23 | [`sys96_menu_log.selectByTextAdmin`](../../sys/sql/sys96_menu_log.md) | - |  |
| `selectByTextAdminPaging` | 33 | [`sys96_menu_log.selectByTextAdminPaging`](../../sys/sql/sys96_menu_log.md), [`sys96_menu_log.selectByTextAdminPagingTotal`](../../sys/sql/sys96_menu_log.md) | `Sys96_Tab_MenuLogAdmin` |  |
| `upsertMenuLog` | 40 | [`sys96_menu_log.getClassName`](../../sys/sql/sys96_menu_log.md), [`sys96_menu_log.insertByClassName`](../../sys/sql/sys96_menu_log.md), [`sys96_menu_log.updateByClassName`](../../sys/sql/sys96_menu_log.md) | - |  |
