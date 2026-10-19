# biz.Biz05_RelateAppr

`server/biz/Biz05_RelateAppr.java`

서비스 키 `biz.Biz05_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`biz05_relate_appr.selectById`](../../biz/sql/biz05_relate_appr.md) | - |  |
| `selectByPromoId` | 26 | [`biz05_relate_appr.selectByPromoId`](../../biz/sql/biz05_relate_appr.md) | `Biz05_Lookup_RelateAppr` |  |
| `selectByPromoIdList` | 33 | [`biz05_relate_appr.selectByPromoIdList`](../../biz/sql/biz05_relate_appr.md) | `Apr03_Page_Relate` |  |
| `selectByDataYm` | 48 | [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md) | `Biz01_Tab_CardManagement`, `Biz01_Tab_CardReport`, `Biz01_Tab_EntertmExpenseReport` |  |
| `selectByPersonId` | 62 | [`biz05_relate_appr.selectByPersonId`](../../biz/sql/biz05_relate_appr.md) | `Biz01_Tab_Card` |  |
| `selectApprId` | 78 | [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md) | - |  |
| `selectFileCount` | 92 | [`biz05_relate_appr.selectFileCount`](../../biz/sql/biz05_relate_appr.md) | `Biz01_Edit_Account`, `Biz01_Edit_Card`, `Biz01_Edit_CardSimple`, `Biz01_Edit_Other`, `Biz01_Edit_OtherSimple` |  |
| `modelUpdate` | 102 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz05_relate_appr)` 동적 INSERT/UPDATE | `Biz05_Lookup_RelateAppr` | `UpdateDataModel` |
| `updateApprId` | 115 | [`biz05_relate_appr.updateApprId`](../../biz/sql/biz05_relate_appr.md) | - |  |
| `insert` | 124 | [`biz05_relate_appr.deleteByApprId`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.insert`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Biz01_Tab_CardManagement`, `Biz01_Tab_CardReport`, `Biz01_Tab_EntertmExpenseReport` |  |
| `insertPersonId` | 164 | [`biz05_relate_appr.deleteByApprId`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.insertPersonId`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.selectByPersonId`](../../biz/sql/biz05_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Biz01_Tab_Card` |  |
| `update` | 208 | `UpdateDataModel(biz05_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 213 | `UpdateDataModel(biz05_relate_appr)` 동적 DELETE | `Biz05_Lookup_RelateAppr` | `UpdateDataModel` |
