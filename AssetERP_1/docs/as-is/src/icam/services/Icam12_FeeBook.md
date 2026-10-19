# icam.Icam12_FeeBook

`server/icam/Icam12_FeeBook.java`

서비스 키 `icam.Icam12_FeeBook.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 15 | [`icam12_fee_book.selectById`](../../icam/sql/icam12_fee_book.md) | - |  |
| `selectByStdDatePaging` | 20 | [`icam12_fee_book.selectByStdDatePaging`](../../icam/sql/icam12_fee_book.md), [`icam12_fee_book.selectByStdDatePagingTotal`](../../icam/sql/icam12_fee_book.md) | `Icam12_Tab_FundMngFeeBook`, `Icam12_Tab_OfficeMngFeeBook` |  |
