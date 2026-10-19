# ast.Ast30_BookFundFee

`server/ast/Ast30_BookFundFee.java`

서비스 키 `ast.Ast30_BookFundFee.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | [`ast30_book_fund_fee.selectById`](../../ast/sql/ast30_book_fund_fee.md) | - |  |
| `selectByPreHoldDate` | 30 | [`ast30_book_fund_fee.selectByPreHoldDate`](../../ast/sql/ast30_book_fund_fee.md) | `Ast30_Lookup_HoldFee` |  |
| `selectByCompanyId` | 36 | [`ast30_book_fund_fee.selectByCompanyId`](../../ast/sql/ast30_book_fund_fee.md) | `Ast30_Tab_OfficeMngFeeState` |  |
| `selectByHoldDatePaging` | 42 | [`ast30_book_fund_fee.selectByHoldDatePaging`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.selectByHoldDatePagingTotal`](../../ast/sql/ast30_book_fund_fee.md) | `Ast30_Tab_OfficeMngFeeStatePeriod` |  |
| `selectByCorpId` | 48 | [`ast30_book_fund_fee.selectByCorpId`](../../ast/sql/ast30_book_fund_fee.md) | `Ast30_Lookup_FeeClose`, `Ast30_Tab_OfficeMngFeeState`, `Ast30_Tab_OfficeMngFeeStatePeriod` |  |
| `selectFundFeeBook` | 54 | [`ast30_book_fund_fee.selectFundFeeBook`](../../ast/sql/ast30_book_fund_fee.md) | `Ast30_Tab_FundMngFeeState` |  |
| `selectByContCorpId` | 60 | [`ast30_book_fund_fee.selectByContCorpId`](../../ast/sql/ast30_book_fund_fee.md) | `Biz17_Lookup_HoldFee` |  |
| `selectByStdDate` | 66 | [`ast30_book_fund_fee.selectByStdDate`](../../ast/sql/ast30_book_fund_fee.md) | `Ast30_Tab_FundMngFee` |  |
| `selectEvalFundFee` | 72 | [`ast30_book_fund_fee.selectEvalFundFee`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getAccountCloseDate`](../../utils/sql/dbConfig.md) | `Ast30_Tab_FundMngFeeClose`, `Ast30_Tab_OfficeMngFeeClose` |  |
| `updateEvalFundFee` | 88 | [`act02_journal.countByOrgTrId`](../../act/sql/act02_journal.md), [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createBackJournal`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`act02_journal.deleteBackJournalByOrgTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteBackJournalByOrgTrId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteBackJournalByOrgTrId`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`ast06_tr.deleteById`](../../ast/sql/ast06_tr.md), [`ast06_tr.deleteByOrgTrId`](../../ast/sql/ast06_tr.md), [`ast06_tr.insert`](../../ast/sql/ast06_tr.md), [`ast30_book_fund_fee.deleteBookFundFeeByTrId`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.deleteBookFundFeeCloseByTrId`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.deleteBookFundFeeRecoveryByTrId`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.insertBookFundFeeByTrId`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.insertBookFundFeeClose`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.insertBookFundFeeRecovery`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.updateFixFee`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getAccountCloseDate`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md) | `Ast30_Tab_FundMngFeeClose`, `Ast30_Tab_OfficeMngFeeClose` | `Calendar` |
| `reprocFundFee` | 301 | [`dbConfig.getCompanyCloseDate`](../../utils/sql/dbConfig.md), [`icam10_fee.createFundFeeBook`](../../icam/sql/icam10_fee.md) | `Ast30_Tab_FundMngFeeClose`, `Ast30_Tab_OfficeMngFeeClose` | `Calendar` |
| `update` | 387 | `UpdateDataModel(ast30_book_fund_fee)` 동적 INSERT/UPDATE | `Ast30_Lookup_FeeClose` | `UpdateDataModel` |
