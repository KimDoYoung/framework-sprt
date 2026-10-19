# act.Act01_AccountCode

`server/act/Act01_AccountCode.java`

서비스 키 `act.Act01_AccountCode.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`act01_account_code.selectById`](../../act/sql/act01_account_code.md) | - |  |
| `selectByCompanyId` | 29 | [`act01_account_code.selectByCompanyId`](../../act/sql/act01_account_code.md) | `Act01_Lookup_Parent`, `Act01_Lookup_PrintYn`, `Act01_Tab_AccountCode` |  |
| `selectBySlipYn` | 40 | [`act01_account_code.selectBySlipYn`](../../act/sql/act01_account_code.md) | `Act01_Lookup_AccountCode`, `Act02_Lookup_CreateForJournal`, `Act02_Lookup_CreateJournal`, `Act02_Lookup_ModiForJournal`, `Act02_Lookup_ModiJournal`, `Act02_Tab_JournalSub`, `Act13_Tab_RealAccountMap`, `Biz01_Edit_Account` |  |
| `selectTreeByCompanyId` | 46 | [`act01_account_code.selectTreeByCompanyId`](../../act/sql/act01_account_code.md) | `Act01_Lookup_AccountTree`, `Act01_Lookup_CopyAdmin` | `TreeUtil` |
| `insertAdminCopy` | 53 | [`act01_account_code.insertAdminAccountCode`](../../act/sql/act01_account_code.md), [`act01_account_code.selectByAccountCode`](../../act/sql/act01_account_code.md), [`act01_account_code.selectTreeByAccountCode`](../../act/sql/act01_account_code.md), [`act01_account_code.updateAdminAccountCode`](../../act/sql/act01_account_code.md), [`act14_link.insertUpdate`](../../act/sql/act14_link.md), [`act14_link.selectByAccountCode`](../../act/sql/act14_link.md) | `Act01_Lookup_CopyAdmin` |  |
| `modelUpdate` | 117 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(act01_account_code)` 동적 INSERT/UPDATE | `Act01_Edit_AccountCode` | `UpdateDataModel` |
| `update` | 130 | `UpdateDataModel(act01_account_code)` 동적 INSERT/UPDATE | `Act01_Lookup_PrintYn` | `UpdateDataModel` |
| `delete` | 135 | `UpdateDataModel(act01_account_code)` 동적 DELETE | `Act01_Tab_AccountCode` | `UpdateDataModel` |
