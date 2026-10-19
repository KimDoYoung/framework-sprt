# icam.Icam03_Fund

`server/icam/Icam03_Fund.java`

서비스 키 `icam.Icam03_Fund.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`icam03_fund.selectById`](../../icam/sql/icam03_fund.md) | - |  |
| `selectByCompanyId` | 24 | [`icam03_fund.selectByCompanyId`](../../icam/sql/icam03_fund.md) | - |  |
| `selectRecentFund` | 29 | [`icam03_fund.selectRecentFund`](../../icam/sql/icam03_fund.md) | `Icam03_Tab_Fund` |  |
| `selectByFundCode` | 34 | [`icam03_fund.selectByFundCode`](../../icam/sql/icam03_fund.md) | - |  |
| `selectByPaging` | 39 | [`icam03_fund.selectByNamePaging`](../../icam/sql/icam03_fund.md), [`icam03_fund.selectByNameTotal`](../../icam/sql/icam03_fund.md) | `Icam03_Grid_Fund` |  |
