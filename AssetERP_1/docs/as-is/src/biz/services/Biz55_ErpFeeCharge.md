# biz.Biz55_ErpFeeCharge

`server/biz/Biz55_ErpFeeCharge.java`

서비스 키 `biz.Biz55_ErpFeeCharge.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`biz55_erp_fee_charge.selectById`](../../biz/sql/biz55_erp_fee_charge.md) | - |  |
| `selectByStartDate` | 31 | [`biz55_erp_fee_charge.selectByStartDate`](../../biz/sql/biz55_erp_fee_charge.md) | - |  |
| `selectByStdDate` | 40 | [`biz55_erp_fee_charge.selectByStdDate`](../../biz/sql/biz55_erp_fee_charge.md) | `Biz55_Tab_ErpFeeCharge` |  |
| `confirmUpdate` | 49 | [`biz55_erp_fee_charge.confirmUpdate`](../../biz/sql/biz55_erp_fee_charge.md) | `Biz55_Tab_ErpFeeCharge` |  |
| `updateErpCompany` | 64 | [`biz52_erp_fee.selectByDate`](../../biz/sql/biz52_erp_fee.md), [`biz55_erp_fee_charge.insertErpFeeCharge`](../../biz/sql/biz55_erp_fee_charge.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.getPersonCount`](../../emp/sql/emp01_person.md), [`sms02_history.selectByCompanyId`](../../sms/sql/sms02_history.md), [`sys10_file.selectByCompanyId`](../../sys/sql/sys10_file.md) | `Biz55_Tab_ErpFeeCharge` |  |
| `updateApprId` | 244 | [`biz55_erp_fee_charge.updateApprId`](../../biz/sql/biz55_erp_fee_charge.md) | `Biz55_Tab_ErpFeeCharge` |  |
| `insertUpdate` | 260 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz55_erp_fee_charge)` 동적 INSERT/UPDATE | `Biz55_Lookup_ErpFeeCharge` | `UpdateDataModel` |
| `update` | 274 | `UpdateDataModel(biz55_erp_fee_charge)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 279 | `UpdateDataModel(biz55_erp_fee_charge)` 동적 DELETE | `Biz55_Tab_ErpFeeCharge` | `UpdateDataModel` |
