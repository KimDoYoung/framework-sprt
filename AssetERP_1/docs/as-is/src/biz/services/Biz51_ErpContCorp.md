# biz.Biz51_ErpContCorp

`server/biz/Biz51_ErpContCorp.java`

서비스 키 `biz.Biz51_ErpContCorp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`biz51_erp_cont_corp.selectById`](../../biz/sql/biz51_erp_cont_corp.md) | `Biz51_Tab_ErpContCorp` |  |
| `selectByContStatusCode` | 24 | [`biz51_erp_cont_corp.selectByContStatusCode`](../../biz/sql/biz51_erp_cont_corp.md) | `Biz51_Tab_ErpContCorp` |  |
| `selectErpCompany` | 33 | [`biz51_erp_cont_corp.selectErpCompany`](../../biz/sql/biz51_erp_cont_corp.md) | `Biz55_Lookup_ErpCompany` |  |
| `insertUpdate` | 42 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz51_erp_cont_corp)` 동적 INSERT/UPDATE | `Biz51_Edit_ErpContCorp` | `UpdateDataModel` |
| `deleteList` | 56 | [`biz51_erp_cont_corp.deleteById`](../../biz/sql/biz51_erp_cont_corp.md), [`biz52_erp_fee.deleteByErpContCorpId`](../../biz/sql/biz52_erp_fee.md), [`com01_relate_appr.deleteByKeyTableId`](../../com/sql/com01_relate_appr.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md) | `Biz51_Tab_ErpContCorp` |  |
| `update` | 68 | `UpdateDataModel(biz51_erp_cont_corp)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 73 | `UpdateDataModel(biz51_erp_cont_corp)` 동적 DELETE | - | `UpdateDataModel` |
