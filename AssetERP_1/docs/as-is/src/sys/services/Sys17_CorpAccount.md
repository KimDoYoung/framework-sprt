# sys.Sys17_CorpAccount

`server/sys/Sys17_CorpAccount.java`

서비스 키 `sys.Sys17_CorpAccount.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`sys17_corp_account.selectById`](../../sys/sql/sys17_corp_account.md) | - |  |
| `selectByCorpId` | 25 | [`sys17_corp_account.selectByCorpId`](../../sys/sql/sys17_corp_account.md) | `Sys17_Grid_CorpAccount`, `Sys17_Lookup_Account` |  |
| `update` | 33 | [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), `UpdateDataModel(sys17_corp_account)` 동적 INSERT/UPDATE | `Sys17_Grid_CorpAccount`, `Sys17_Lookup_Account` | `UpdateDataModel` |
| `delete` | 47 | `UpdateDataModel(sys17_corp_account)` 동적 DELETE | `Sys17_Grid_CorpAccount` | `UpdateDataModel` |
