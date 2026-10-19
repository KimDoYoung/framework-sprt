# sys.Sys96_OpenMenuLog

`server/sys/Sys96_OpenMenuLog.java`

서비스 키 `sys.Sys96_OpenMenuLog.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`sys96_open_menu_log.selectById`](../../sys/sql/sys96_open_menu_log.md) | - |  |
| `selectByTextAdmin` | 23 | [`sys96_open_menu_log.selectByTextAdmin`](../../sys/sql/sys96_open_menu_log.md) | - |  |
| `selectByTextAdminPaging` | 33 | [`sys96_open_menu_log.selectByTextAdminPaging`](../../sys/sql/sys96_open_menu_log.md), [`sys96_open_menu_log.selectByTextAdminPagingTotal`](../../sys/sql/sys96_open_menu_log.md) | `Sys96_Tab_OpenMenuLogAdmin` |  |
| `insert` | 40 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys96_open_menu_log.insert`](../../sys/sql/sys96_open_menu_log.md) | `MainFrame` |  |
| `updateSecond` | 55 | [`sys96_open_menu_log.updateSecond`](../../sys/sql/sys96_open_menu_log.md) | `MainFrame` |  |
