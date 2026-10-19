# fnd.Fnd31_OprFund

`server/fnd/Fnd31_OprFund.java`

서비스 키 `fnd.Fnd31_OprFund.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`fnd31_opr_fund.selectById`](../../fnd/sql/fnd31_opr_fund.md) | - |  |
| `selectByOprId` | 25 | [`fnd31_opr_fund.selectByOprId`](../../fnd/sql/fnd31_opr_fund.md) | `Apr01_Edit_ApprDoc`, `Fnd30_Tab_Opr`, `Fnd31_Page_DemandOprFund`, `Fnd31_Page_OprFund` |  |
| `selectByDistinctOprId` | 32 | [`fnd31_opr_fund.selectByDistinctOprId`](../../fnd/sql/fnd31_opr_fund.md) | `Apr01_Edit_ApprDoc` |  |
| `modelUpdate` | 39 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(fnd31_opr_fund)` 동적 INSERT/UPDATE | `Fnd31_Edit_DemandOprFund`, `Fnd31_Edit_OprFund` | `UpdateDataModel` |
| `sumQty` | 51 | [`fnd31_opr_fund.sumQty`](../../fnd/sql/fnd31_opr_fund.md) | `Fnd31_Edit_OprFund` |  |
| `update` | 57 | `UpdateDataModel(fnd31_opr_fund)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 62 | `UpdateDataModel(fnd31_opr_fund)` 동적 DELETE | `Fnd31_Page_DemandOprFund`, `Fnd31_Page_OprFund` | `UpdateDataModel` |
