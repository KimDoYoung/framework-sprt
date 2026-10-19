# biz.Biz50_ErpSetup

`server/biz/Biz50_ErpSetup.java`

서비스 키 `biz.Biz50_ErpSetup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`biz50_erp_setup.selectById`](../../biz/sql/biz50_erp_setup.md) | - |  |
| `selectAll` | 24 | [`biz50_erp_setup.selectAll`](../../biz/sql/biz50_erp_setup.md) | `Biz50_Lookup_ErpSetup` |  |
| `selectByStartDate` | 32 | [`biz50_erp_setup.selectByStartDate`](../../biz/sql/biz50_erp_setup.md) | `Biz52_Lookup_ErpFee` |  |
| `selectDefaultData` | 40 | [`biz50_erp_setup.selectDefaultData`](../../biz/sql/biz50_erp_setup.md) | - |  |
| `selectMailForm` | 51 | [`biz50_erp_setup.selectMailForm`](../../biz/sql/biz50_erp_setup.md) | `Biz50_Lookup_ErpSetup`, `Biz55_Tab_ErpFeeCharge` |  |
| `getNote` | 59 | [`biz50_erp_setup.getNote`](../../biz/sql/biz50_erp_setup.md) | `Biz50_Lookup_ErpSetup` |  |
| `updateNote` | 67 | [`biz50_erp_setup.updateNote`](../../biz/sql/biz50_erp_setup.md) | `Biz50_Lookup_ErpSetup` |  |
| `insertMailForm` | 76 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz50_erp_setup)` 동적 INSERT/UPDATE | `Biz50_Lookup_ErpSetup`, `Biz50_Lookup_MailMapping` | `UpdateDataModel` |
| `update` | 90 | `UpdateDataModel(biz50_erp_setup)` 동적 INSERT/UPDATE | `Biz50_Lookup_ErpSetup` | `UpdateDataModel` |
| `delete` | 95 | `UpdateDataModel(biz50_erp_setup)` 동적 DELETE | `Biz50_Lookup_ErpSetup` | `UpdateDataModel` |
