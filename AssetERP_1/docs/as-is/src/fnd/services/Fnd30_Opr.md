# fnd.Fnd30_Opr

`server/fnd/Fnd30_Opr.java`

서비스 키 `fnd.Fnd30_Opr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`fnd30_opr.selectById`](../../fnd/sql/fnd30_opr.md) | `Fnd31_Edit_DemandOprFund`, `Fnd31_Edit_OprFund`, `Fnd31_Page_DemandOprFund`, `Fnd31_Page_OprFund` |  |
| `selectByDate` | 32 | [`fnd30_opr.selectByDate`](../../fnd/sql/fnd30_opr.md) | `Fnd30_Tab_Opr` |  |
| `selectByDemandDate` | 44 | [`fnd30_opr.selectByDemandDate`](../../fnd/sql/fnd30_opr.md) | `Fnd30_Tab_DemandOpr` |  |
| `selectByDemandOprCode` | 56 | [`fnd30_opr.selectByDemandOprCode`](../../fnd/sql/fnd30_opr.md) | `Fnd30_Lookup_DemandOprList` |  |
| `deleteApprId` | 68 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md) | `Fnd30_Tab_DemandOpr`, `Fnd30_Tab_Opr` |  |
| `deleteOprFund` | 87 | [`fnd31_opr_fund.deleteOprFund`](../../fnd/sql/fnd31_opr_fund.md) | `Fnd30_Tab_DemandOpr`, `Fnd30_Tab_Opr` |  |
| `updateApprId` | 97 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`fnd30_opr.updateApprId`](../../fnd/sql/fnd30_opr.md) | `Fnd30_Tab_DemandOpr`, `Fnd30_Tab_Opr` |  |
| `multiUpdate` | 123 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(fnd30_opr)` 동적 INSERT/UPDATE | `Fnd30_Edit_DemandOpr`, `Fnd30_Edit_Opr` | `UpdateDataModel` |
| `modelUpdate` | 146 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd31_opr_fund.demandSumQty`](../../fnd/sql/fnd31_opr_fund.md), [`fnd31_opr_fund.selectByOprId`](../../fnd/sql/fnd31_opr_fund.md), `UpdateDataModel(fnd31_opr_fund)` 동적 INSERT/UPDATE, `UpdateDataModel(fnd30_opr)` 동적 INSERT/UPDATE | `Fnd30_Edit_DemandOpr`, `Fnd30_Edit_Opr` | `UpdateDataModel` |
| `update` | 230 | `UpdateDataModel(fnd30_opr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 235 | `UpdateDataModel(fnd30_opr)` 동적 DELETE | `Fnd30_Tab_DemandOpr`, `Fnd30_Tab_Opr` | `UpdateDataModel` |
