# fnd31_opr_fund

`server/fnd/mapper/fnd31_opr_fund.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`fnd30_opr`](../../../db/tables/fnd.md), [`fnd31_opr_fund`](../../../db/tables/fnd.md) |  | `fnd.Fnd31_OprFund.selectById` |
| `selectByOprId` | select | 32 | [`adv02_account`](../../../db/tables/adv.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd31_opr_fund`](../../../db/tables/fnd.md) | `f_sysdate` | `fnd.Fnd30_Opr.modelUpdate`, `fnd.Fnd31_OprFund.selectByOprId` |
| `selectByDistinctOprId` | select | 58 | [`adv02_account`](../../../db/tables/adv.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd31_opr_fund`](../../../db/tables/fnd.md) | `f_sysdate` | `fnd.Fnd31_OprFund.selectByDistinctOprId` |
| `sumQty` | select | 88 | [`fnd30_opr`](../../../db/tables/fnd.md), [`fnd31_opr_fund`](../../../db/tables/fnd.md) |  | `fnd.Fnd31_OprFund.sumQty` |
| `demandSumQty` | select | 96 | [`fnd31_opr_fund`](../../../db/tables/fnd.md) |  | `fnd.Fnd30_Opr.modelUpdate` |
| `deleteOprFund` | delete | 102 | [`fnd31_opr_fund`](../../../db/tables/fnd.md) |  | `fnd.Fnd30_Opr.deleteOprFund` |
| `excelDelete` | delete | 108 | [`fnd31_opr_fund`](../../../db/tables/fnd.md) |  | - |
| `excelInsert` | insert | 115 | [`fnd31_opr_fund`](../../../db/tables/fnd.md) |  | - |
| `insert` | insert | 139 | [`fnd31_opr_fund`](../../../db/tables/fnd.md) |  | - |
