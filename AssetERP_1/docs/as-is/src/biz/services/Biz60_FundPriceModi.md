# biz.Biz60_FundPriceModi

`server/biz/Biz60_FundPriceModi.java`

서비스 키 `biz.Biz60_FundPriceModi.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`biz60_fund_price_modi.selectById`](../../biz/sql/biz60_fund_price_modi.md) | - |  |
| `selectByText` | 26 | [`biz60_fund_price_modi.selectByText`](../../biz/sql/biz60_fund_price_modi.md) | `Biz60_Tab_FundPriceModiReport` |  |
| `modelUpdate` | 36 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz60_fund_price_modi)` 동적 INSERT/UPDATE | `Biz60_Edit_FundPriceModi` | `UpdateDataModel` |
| `update` | 49 | `UpdateDataModel(biz60_fund_price_modi)` 동적 INSERT/UPDATE | `Biz60_Tab_FundPriceModiReport` | `UpdateDataModel` |
| `delete` | 54 | `UpdateDataModel(biz60_fund_price_modi)` 동적 DELETE | `Biz60_Tab_FundPriceModiReport` | `UpdateDataModel` |
