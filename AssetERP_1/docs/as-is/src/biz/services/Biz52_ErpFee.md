# biz.Biz52_ErpFee

`server/biz/Biz52_ErpFee.java`

서비스 키 `biz.Biz52_ErpFee.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`biz52_erp_fee.selectById`](../../biz/sql/biz52_erp_fee.md) | - |  |
| `selectByErpContCorpId` | 23 | [`biz52_erp_fee.selectByErpContCorpId`](../../biz/sql/biz52_erp_fee.md) | `Biz52_Lookup_ErpFee` |  |
| `selectByStartDate` | 32 | [`biz52_erp_fee.selectByStartDate`](../../biz/sql/biz52_erp_fee.md) | `Apr01_Edit_ApprDoc`, `Biz51_Edit_ErpContCorp` |  |
| `selectDefaultData` | 42 | [`biz52_erp_fee.selectDefaultData`](../../biz/sql/biz52_erp_fee.md) | `Biz55_Lookup_ErpFeeCharge` |  |
| `update` | 53 | `UpdateDataModel(biz52_erp_fee)` 동적 INSERT/UPDATE | `Biz52_Lookup_ErpFee` | `UpdateDataModel` |
| `delete` | 58 | `UpdateDataModel(biz52_erp_fee)` 동적 DELETE | `Biz52_Lookup_ErpFee` | `UpdateDataModel` |
