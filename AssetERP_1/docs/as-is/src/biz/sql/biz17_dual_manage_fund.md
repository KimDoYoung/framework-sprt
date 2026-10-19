# biz17_dual_manage_fund

`server/biz/mapper/biz17_dual_manage_fund.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`biz17_dual_manage_fund`](../../../db/tables/biz.md) |  | `biz.Biz17_DualManageFund.selectById` |
| `selectByContCorpId` | select | 27 | [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz17_dual_manage_fund`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz17_DualManageFund.selectByContCorpId` |
| `calcDualFundFee` | select | 45 | - | `f_calc_dual_fund_fee` | `biz.Biz20_FeeCharge.createFeeCharge` |
