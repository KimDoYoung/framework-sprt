# biz21_fee_charge_dtl

`server/biz/mapper/biz21_fee_charge_dtl.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) |  | `biz.Biz21_FeeChargeDtl.selectById` |
| `selectByFeeChargeId` | select | 34 | [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) |  | - |
| `selectByFundCode` | select | 42 | [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) |  | - |
| `selectByGroupFundName` | select | 51 | [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) |  | - |
| `selectOccFeeSum` | select | 60 | [`biz20_fee_charge`](../../../db/tables/biz.md), [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `selectByGroupFundCode` | select | 71 | [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) |  | - |
| `getMaxSize` | select | 80 | [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) |  | - |
| `insert` | insert | 94 | [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) | `f_create_seq`, `f_sysdate` | `biz.Biz20_FeeCharge.createFeeCharge` |
| `deleteByFeeChargeId` | delete | 115 | [`biz21_fee_charge_dtl`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
