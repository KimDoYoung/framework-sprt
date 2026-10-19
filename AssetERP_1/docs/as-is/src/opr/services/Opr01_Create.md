# opr.Opr01_Create

`server/opr/Opr01_Create.java`

서비스 키 `opr.Opr01_Create.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByTitle` | 34 | [`opr01_create.selectByTitle`](../../opr/sql/opr01_create.md) | `Opr01_Tab_Create_Manager` |  |
| `selectByTitle1` | 69 | [`opr01_create.selectByTitle1`](../../opr/sql/opr01_create.md) | `Opr01_Tab_Create` |  |
| `selectByLookupTitle` | 103 | [`opr01_create.selectByLookupTitle`](../../opr/sql/opr01_create.md) | `Opr02_Lookup_Fund` |  |
| `chkPreDelete` | 126 | `opr01_create.chkPreDelete`(없음) | - |  |
| `insertAppr` | 136 | [`apr01_appr.insert`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.insertOprFund`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`opr01_create.selectById`](../../opr/sql/opr01_create.md), [`opr01_create.updateApprId`](../../opr/sql/opr01_create.md), [`opr03_reg.selectById`](../../opr/sql/opr03_reg.md), [`sys10_file.insert`](../../sys/sql/sys10_file.md), [`sys10_file.selectOneByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE | `Opr01_Tab_Create_Manager` | `Apr04_ApprStep`, `File`, `UpdateDataModel` |
| `update` | 254 | `UpdateDataModel(opr01_create)` 동적 INSERT/UPDATE | `Opr01_Tab_Create`, `Opr01_Tab_Create_Manager` | `UpdateDataModel` |
| `delete` | 259 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(opr01_create)` 동적 DELETE | `Opr01_Tab_Create`, `Opr01_Tab_Create_Manager` | `UpdateDataModel` |
