# icam.Icam13_FeeBookCheck

`server/icam/Icam13_FeeBookCheck.java`

서비스 키 `icam.Icam13_FeeBookCheck.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`icam13_fee_book_check.selectById`](../../icam/sql/icam13_fee_book_check.md) | - |  |
| `selectByStdDate` | 31 | [`icam13_fee_book_check.selectByStdDate`](../../icam/sql/icam13_fee_book_check.md) | `Icam13_Lookup_FeeBookCheck` |  |
| `checkFeeBook` | 36 | [`ast30_book_fund_fee.selectFeeBookDiff`](../../ast/sql/ast30_book_fund_fee.md), [`ast33_fund_trans.selectFundTransByCorpCode`](../../ast/sql/ast33_fund_trans.md), [`biz13_with_corp.selectManageTypeIs1`](../../biz/sql/biz13_with_corp.md), [`icam12_fee_book.delete`](../../icam/sql/icam12_fee_book.md), [`icam12_fee_book.insert`](../../icam/sql/icam12_fee_book.md), [`icam13_fee_book_check.delete`](../../icam/sql/icam13_fee_book_check.md), [`icam13_fee_book_check.insert`](../../icam/sql/icam13_fee_book_check.md) | `Icam13_Lookup_FeeBookCheck` | `DatabaseFactoryICAM` |
