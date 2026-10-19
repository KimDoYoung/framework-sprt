# fnd.Fnd00_Fund

`server/fnd/Fnd00_Fund.java`

서비스 키 `fnd.Fnd00_Fund.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`fnd00_fund.selectById`](../../fnd/sql/fnd00_fund.md) | `Apr03_Page_Relate` |  |
| `selectByLookupFundInfo` | 26 | [`fnd00_fund.selectByLookupFundInfo`](../../fnd/sql/fnd00_fund.md) | - |  |
| `selectBySearchText` | 32 | [`fnd00_fund.selectBySearchText`](../../fnd/sql/fnd00_fund.md), [`fnd00_fund.selectBySearchTextAdmin`](../../fnd/sql/fnd00_fund.md) | `Fnd01_Lookup_SelectMulti`, `Fnd01_Lookup_SelectSingle` |  |
| `selectByDocIdText` | 76 | [`fnd00_fund.selectByDocIdText`](../../fnd/sql/fnd00_fund.md) | `Fnd01_Tab_MultiFund` |  |
| `selectByLookupFundCode` | 100 | [`fnd00_fund.selectByLookupFundCode`](../../fnd/sql/fnd00_fund.md) | `Fnd00_Lookup_FundCode` |  |
| `selectByLookupFundPlan` | 117 | [`fnd00_fund.selectByLookupFundPlan`](../../fnd/sql/fnd00_fund.md) | `Fnd00_Lookup_PlanFund` |  |
| `selectByOprfund` | 134 | [`fnd00_fund.selectByOprfund`](../../fnd/sql/fnd00_fund.md) | - |  |
