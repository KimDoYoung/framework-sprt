# sys.Sys15_Corp

`server/sys/Sys15_Corp.java`

서비스 키 `sys.Sys15_Corp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`sys15_corp.selectById`](../../sys/sql/sys15_corp.md) | - |  |
| `selectByCompanyId` | 25 | [`sys15_corp.selectByCompanyId`](../../sys/sql/sys15_corp.md) | `Sys15_Tab_Corp`, `Sys15_Tab_Corp_backup` |  |
| `selectByUseYn` | 30 | [`sys15_corp.selectByUseYn`](../../sys/sql/sys15_corp.md) | `Act02_Tab_ForJournal`, `Act02_Tab_Journal`, `Act02_Tab_JournalSub`, `Sys15_Lookup_Corp` |  |
| `selectByKFS` | 35 | [`sys15_corp.selectByKFS`](../../sys/sql/sys15_corp.md) | `Sys15_Lookup_Corp_OnlyKFS` |  |
| `insertInitData` | 40 | [`sys15_corp.insertInitData`](../../sys/sql/sys15_corp.md) | `Sys15_Tab_Corp`, `Sys15_Tab_Corp_backup` |  |
| `update` | 45 | [`sys15_corp.insert`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectById`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectCorpCodeCheck`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectNewCorpCodeByBizNo`](../../sys/sql/sys15_corp.md), [`sys15_corp.update`](../../sys/sql/sys15_corp.md) | `Sys15_Edit_Corp`, `Sys15_Lookup_AddCorp`, `Sys15_Lookup_Corp_OnlyKFS`, `Sys15_Tab_Corp_backup` |  |
| `delete` | 128 | [`sys15_corp.checkUseCorpId`](../../sys/sql/sys15_corp.md), `UpdateDataModel(sys15_corp)` 동적 DELETE | `Sys15_Lookup_Corp_OnlyKFS`, `Sys15_Tab_Corp`, `Sys15_Tab_Corp_backup` | `UpdateDataModel` |
