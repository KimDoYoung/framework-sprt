# biz.Biz22_FeeChargeCalc

`server/biz/Biz22_FeeChargeCalc.java`

서비스 키 `biz.Biz22_FeeChargeCalc.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`biz22_fee_charge_calc.selectById`](../../biz/sql/biz22_fee_charge_calc.md) | - |  |
| `selectByContCorpId` | 22 | [`biz22_fee_charge_calc.selectByContCorpId`](../../biz/sql/biz22_fee_charge_calc.md) | `Biz22_Lookup_FeeChargeCalc` |  |
| `update` | 31 | `UpdateDataModel(biz22_fee_charge_calc)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 36 | `UpdateDataModel(biz22_fee_charge_calc)` 동적 DELETE | - | `UpdateDataModel` |
