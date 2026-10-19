# apr.Apr20_RelateIcs

`server/apr/Apr20_RelateIcs.java`

서비스 키 `apr.Apr20_RelateIcs.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`apr20_relate_ics.selectById`](../../apr/sql/apr20_relate_ics.md) | `Sch04_Lookup_IcsList` |  |
| `selectByApprId` | 32 | [`apr20_relate_ics.selectByApprId`](../../apr/sql/apr20_relate_ics.md) | `Apr03_Page_Relate`, `Apr20_Grid_RelateIcs`, `Apr20_Lookup_RelateIcsList` |  |
| `selectByClassTreeId` | 38 | [`apr20_relate_ics.selectByClassTreeId`](../../apr/sql/apr20_relate_ics.md) | - |  |
| `selectByDcrClassTreeId` | 44 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr20_relate_ics.selectByClassTreeId`](../../dcr/sql/dcr20_relate_ics.md) | `Apr03_Page_Relate` |  |
| `insertToDoList` | 87 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr20_relate_ics.selectByToDoList`](../../dcr/sql/dcr20_relate_ics.md) | `Apr20_Lookup_SelectIcs` |  |
| `insertIcs` | 149 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr20_relate_ics.insertIcs`](../../dcr/sql/dcr20_relate_ics.md) | `Apr20_Lookup_SelectIcs` |  |
| `getCloseDate` | 203 | [`apr20_relate_ics.getCloseDate`](../../apr/sql/apr20_relate_ics.md) | `Apr20_Lookup_RelateIcs` |  |
| `check` | 212 | [`apr20_relate_ics.selectByApprId`](../../apr/sql/apr20_relate_ics.md), [`bbs02_notice.insert`](../../bbs/sql/bbs02_notice.md), [`bbs03_target.insert`](../../bbs/sql/bbs03_target.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr20_relate_ics)` 동적 DELETE, `UpdateDataModel(apr20_relate_ics)` 동적 INSERT/UPDATE | `Apr20_Lookup_RelateIcsList` | `UpdateDataModel` |
| `modelUpdate` | 295 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr20_relate_ics)` 동적 INSERT/UPDATE | `Apr20_Edit_RelateIcs` | `UpdateDataModel` |
| `deleteList` | 308 | [`sch04_list.codeUpdate`](../../sch/sql/sch04_list.md), [`sch04_list.selectByInfoId`](../../sch/sql/sch04_list.md), `UpdateDataModel(apr20_relate_ics)` 동적 DELETE | `Apr20_Lookup_RelateIcsList` | `UpdateDataModel` |
| `update` | 327 | `UpdateDataModel(apr20_relate_ics)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 332 | `UpdateDataModel(apr20_relate_ics)` 동적 DELETE | `Apr03_Page_Relate`, `Apr20_Lookup_SelectIcs` | `UpdateDataModel` |
