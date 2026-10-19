# biz22_fee_charge_calc

`server/biz/mapper/biz22_fee_charge_calc.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 36 | [`biz22_fee_charge_calc`](../../../db/tables/biz.md) |  | `biz.Biz22_FeeChargeCalc.selectById` |
| `selectByContCorpId` | select | 42 | [`biz22_fee_charge_calc`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge`, `biz.Biz22_FeeChargeCalc.selectByContCorpId` |
| `selectTermStartDate` | select | 50 | [`biz11_cont_history`](../../../db/tables/biz.md), [`biz13_with_corp`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `insert` | insert | 73 | [`biz22_fee_charge_calc`](../../../db/tables/biz.md) | `f_create_seq` | `biz.Biz20_FeeCharge.createFeeCharge` |
| `updateFeeInfo` | update | 105 | [`biz22_fee_charge_calc`](../../../db/tables/biz.md) | `f_get_datedif` | `biz.Biz20_FeeCharge.createFeeCharge` |
| `updateTermCloseDate` | update | 132 | [`biz22_fee_charge_calc`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `deleteByContCorpId` | delete | 138 | [`biz22_fee_charge_calc`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `deleteTermLastCloseDate` | delete | 145 | [`biz13_with_corp`](../../../db/tables/biz.md), [`biz22_fee_charge_calc`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `deleteByFeeChargeCalcId` | delete | 153 | [`biz22_fee_charge_calc`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
