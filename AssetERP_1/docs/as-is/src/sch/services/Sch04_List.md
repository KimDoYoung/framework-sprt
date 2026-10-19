# sch.Sch04_List

`server/sch/Sch04_List.java`

서비스 키 `sch.Sch04_List.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 28 | [`sch04_list.selectById`](../../sch/sql/sch04_list.md) | - |  |
| `selectByManagerId` | 34 | [`sch04_list.selectByManagerId`](../../sch/sql/sch04_list.md) | `Frm01_Lookup_DailyCheckList`, `Sch04_Tab_DailyCheckList`, `Sch04_Tab_List`, `Sch04_Tab_ToDoList` |  |
| `selectCheckListStatus` | 101 | [`sch04_list.selectCheckListStatus`](../../sch/sql/sch04_list.md) | `Sch04_Tab_DailyCheckListStatus` |  |
| `selectSchedule` | 107 | `sch04_list.selectSchedule`(없음) | - |  |
| `selectByCheckList` | 113 | [`sch04_list.selectByCheckList`](../../sch/sql/sch04_list.md) | `Sch04_Tab_CheckList` |  |
| `selectByBizReClass` | 147 | [`sch04_list.selectByBizReClass`](../../sch/sql/sch04_list.md) | `Sch04_Tab_BizReClass` |  |
| `selectByIcs` | 171 | [`dbConfig.getBizDate`](../../utils/sql/dbConfig.md), [`sch04_list.selectByIcs`](../../sch/sql/sch04_list.md) | `Sch04_Tab_IcsList`, `Sch04_Tab_IcsListManager` |  |
| `updateApprId` | 192 | [`sch04_list.updateApprId`](../../sch/sql/sch04_list.md) | `Sch04_Tab_DailyCheckList` |  |
| `insertCheck` | 207 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch04_list.confirmUpdate`](../../sch/sql/sch04_list.md), [`sch04_list.insert`](../../sch/sql/sch04_list.md), [`sch04_list.selectById`](../../sch/sql/sch04_list.md) | `Sch04_Lookup_SchList`, `Sch04_Tab_ToDoList` |  |
| `statusUpdateCheck` | 254 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch04_list.selectByCheck`](../../sch/sql/sch04_list.md), [`sch04_list.updateStatusCode`](../../sch/sql/sch04_list.md), `UpdateDataModel(sch04_list)` 동적 INSERT/UPDATE | `Frm01_Lookup_DailyCheckList`, `Sch04_Tab_DailyCheckList` | `UpdateDataModel` |
| `selectByToDoList` | 318 | [`sch04_list.selectByToDoList`](../../sch/sql/sch04_list.md) | `Monitoring_Page_Relate`, `Sch04_Tab_List` |  |
| `insertAppr` | 325 | [`apr01_appr.insert`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.insert`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`dcr05_doc_type.selectByDefaultClassTreeId`](../../dcr/sql/dcr05_doc_type.md), [`fnd20_plan.selectById`](../../fnd/sql/fnd20_plan.md), [`fnd20_plan.updateApprId`](../../fnd/sql/fnd20_plan.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE | - | `Apr04_ApprStep`, `UpdateDataModel` |
| `updateConfirm` | 396 | [`sch04_list.selectById`](../../sch/sql/sch04_list.md), [`sch04_list.updateConfirm`](../../sch/sql/sch04_list.md), [`sch04_list.updateNote`](../../sch/sql/sch04_list.md) | `Sch04_Lookup_IcsMsg` |  |
| `modelUpdate` | 423 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sch04_list)` 동적 INSERT/UPDATE | `Sch04_Edit_Note` | `UpdateDataModel` |
| `upsert` | 436 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch04_list.insert`](../../sch/sql/sch04_list.md), [`sch04_list.selectById`](../../sch/sql/sch04_list.md), [`sch04_list.updatePersonId`](../../sch/sql/sch04_list.md) | `Sch04_Tab_IcsList` |  |
| `update` | 462 | `UpdateDataModel(sch04_list)` 동적 INSERT/UPDATE | `Sch04_Tab_BizReClass`, `Sch04_Tab_CheckList` | `UpdateDataModel` |
| `delete` | 467 | `UpdateDataModel(sch04_list)` 동적 DELETE | - | `UpdateDataModel` |
