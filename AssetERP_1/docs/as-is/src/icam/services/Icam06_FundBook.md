# icam.Icam06_FundBook

`server/icam/Icam06_FundBook.java`

서비스 키 `icam.Icam06_FundBook.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`icam06_fund_book.selectById`](../../icam/sql/icam06_fund_book.md) | - |  |
| `selectByStdDate` | 21 | [`icam06_fund_book.selectByStdDate`](../../icam/sql/icam06_fund_book.md) | `Icam06_Grid_FundOperateStatus` |  |
| `selectIcamFundPrice` | 26 | [`icam06_fund_book.selectFundPrice`](../../icam/sql/icam06_fund_book.md) | `Icam06_Tab_FundPrice` |  |
| `selectFundBookAvg` | 34 | [`icam06_fund_book.calcStartRow`](../../icam/sql/icam06_fund_book.md), [`icam06_fund_book.selectFundBookAvg`](../../icam/sql/icam06_fund_book.md) | `Icam06_Tab_FundOperateStatus` |  |
