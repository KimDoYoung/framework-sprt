# ast.Ast33_FundTrans

`server/ast/Ast33_FundTrans.java`

서비스 키 `ast.Ast33_FundTrans.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`ast33_fund_trans.selectById`](../../ast/sql/ast33_fund_trans.md) | - |  |
| `selectByDate` | 28 | [`ast33_fund_trans.selectByDate`](../../ast/sql/ast33_fund_trans.md) | `Ast33_Tab_FundMngTrans`, `Ast33_Tab_OfficeMngFundTrans` |  |
| `update` | 34 | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast05_tr_code.selectByTrCode`](../../ast/sql/ast05_tr_code.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast06_tr.upsert`](../../ast/sql/ast06_tr.md), [`ast30_book_fund_fee.deleteBeforeHoldDate`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md), `UpdateDataModel(ast33_fund_trans)` 동적 INSERT/UPDATE | `Ast33_Lookup_FundMngTrans`, `Ast33_Lookup_OfficeMngFundTrans`, `Ast33_Lookup_OfficeMngFundTrans2` | `UpdateDataModel` |
| `delete` | 145 | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast06_tr.deleteById`](../../ast/sql/ast06_tr.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md), `UpdateDataModel(ast33_fund_trans)` 동적 DELETE | `Ast33_Tab_FundMngTrans`, `Ast33_Tab_OfficeMngFundTrans` | `UpdateDataModel` |
