# biz60_fund_price_modi

`server/biz/mapper/biz60_fund_price_modi.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 49 | [`apr01_appr`](../../../db/tables/apr.md), [`biz60_fund_price_modi`](../../../db/tables/biz.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz60_FundPriceModi.selectById` |
| `selectByText` | select | 65 | [`apr01_appr`](../../../db/tables/apr.md), [`biz60_fund_price_modi`](../../../db/tables/biz.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz60_FundPriceModi.selectByText` |
