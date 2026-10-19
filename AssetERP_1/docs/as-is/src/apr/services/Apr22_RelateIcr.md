# apr.Apr22_RelateIcr

`server/apr/Apr22_RelateIcr.java`

서비스 키 `apr.Apr22_RelateIcr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`apr22_relate_icr.selectById`](../../apr/sql/apr22_relate_icr.md) | `Sch04_Lookup_IcrList` |  |
| `selectByApprId` | 32 | [`apr22_relate_icr.selectByApprId`](../../apr/sql/apr22_relate_icr.md) | `Apr03_Page_Relate`, `Apr22_Lookup_RelateIcrList` |  |
| `selectByClassTreeId` | 38 | [`apr22_relate_icr.selectByClassTreeId`](../../apr/sql/apr22_relate_icr.md) | - |  |
| `selectByDcrClassTreeId` | 44 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr21_relate_icr.selectByClassTreeId`](../../dcr/sql/dcr21_relate_icr.md) | `Apr03_Page_Relate` |  |
| `insertToDoList` | 81 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr21_relate_icr.selectByToDoList`](../../dcr/sql/dcr21_relate_icr.md) | `Apr22_Lookup_SelectIcr` |  |
| `insertIcr` | 143 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr21_relate_icr.insertIcr`](../../dcr/sql/dcr21_relate_icr.md) | `Apr22_Lookup_SelectIcr` |  |
| `getCloseDate` | 197 | [`apr22_relate_icr.getCloseDate`](../../apr/sql/apr22_relate_icr.md) | `Apr22_Lookup_RelateIcr` |  |
| `check` | 206 | [`apr22_relate_icr.selectByApprId`](../../apr/sql/apr22_relate_icr.md), [`bbs02_notice.insert`](../../bbs/sql/bbs02_notice.md), [`bbs03_target.insert`](../../bbs/sql/bbs03_target.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr22_relate_icr)` 동적 DELETE, `UpdateDataModel(apr22_relate_icr)` 동적 INSERT/UPDATE | `Apr22_Lookup_RelateIcrList` | `UpdateDataModel` |
| `modelUpdate` | 289 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr22_relate_icr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `deleteList` | 302 | [`sch04_list.codeUpdate`](../../sch/sql/sch04_list.md), [`sch04_list.selectByInfoId`](../../sch/sql/sch04_list.md), `UpdateDataModel(apr22_relate_icr)` 동적 DELETE | `Apr22_Lookup_RelateIcrList` | `UpdateDataModel` |
| `update` | 321 | `UpdateDataModel(apr22_relate_icr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 326 | `UpdateDataModel(apr22_relate_icr)` 동적 DELETE | `Apr03_Page_Relate`, `Apr22_Lookup_SelectIcr` | `UpdateDataModel` |
