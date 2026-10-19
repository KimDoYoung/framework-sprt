# act.Act03_JournalDtl

`server/act/Act03_JournalDtl.java`

서비스 키 `act.Act03_JournalDtl.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`act03_journal_dtl.selectById`](../../act/sql/act03_journal_dtl.md) | - |  |
| `selectByCompanyId` | 26 | [`act03_journal_dtl.selectByCompanyId`](../../act/sql/act03_journal_dtl.md) | `Act02_Tab_ForJournal`, `Act02_Tab_Journal` |  |
| `selectByJournalId` | 32 | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) | `Act02_Grid_CreateForJournal`, `Act02_Grid_CreateJournal`, `Act02_Grid_CreateJournalBiz`, `Act02_Grid_JournalFix`, `Act02_Lookup_ModiForJournal`, `Act02_Lookup_ModiJournal`, `Ast06_Grid_ForJournal`, `Ast06_Grid_Journal` |  |
| `selectByAccountCode` | 38 | [`act03_journal_dtl.selectByAccountCode`](../../act/sql/act03_journal_dtl.md) | `Act02_Tab_JournalSub` |  |
| `selectPayMonth` | 45 | [`act03_journal_dtl.selectPayMonth`](../../act/sql/act03_journal_dtl.md) | `Pay02_Lookup_Journal`, `Pay10_Lookup_Journal` |  |
| `selectBizCard` | 51 | [`act03_journal_dtl.selectBizCard`](../../act/sql/act03_journal_dtl.md) | `Act02_Grid_CreateJournalBiz` |  |
| `selectChargeFee` | 57 | [`act03_journal_dtl.selectChargeFee`](../../act/sql/act03_journal_dtl.md) | `Act02_Grid_CreateJournalBiz` |  |
| `selectErpChargeFee` | 63 | [`act03_journal_dtl.selectErpChargeFee`](../../act/sql/act03_journal_dtl.md) | `Act02_Grid_CreateJournalBiz` |  |
| `selectByAstId` | 69 | [`act03_journal_dtl.selectByAstId`](../../act/sql/act03_journal_dtl.md) | `Act02_Tab_DepositIoList` |  |
| `insertByJournalId` | 75 | [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.insertByJournalId`](../../act/sql/act03_journal_dtl.md) | - |  |
| `updateNote` | 126 | [`act03_journal_dtl.updateNote`](../../act/sql/act03_journal_dtl.md) | `Act03_Lookup_Note` |  |
| `deleteByJournalId` | 132 | [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md) | - |  |
| `update` | 142 | `UpdateDataModel(act03_journal_dtl)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 147 | `UpdateDataModel(act03_journal_dtl)` 동적 DELETE | - | `UpdateDataModel` |
