# apr.Apr19_RelateStamp

`server/apr/Apr19_RelateStamp.java`

서비스 키 `apr.Apr19_RelateStamp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`apr19_relate_stamp.selectById`](../../apr/sql/apr19_relate_stamp.md) | `Apr19_Tab_OrgStampList`, `Apr19_Tab_StampList` |  |
| `selectByCorpDocId` | 24 | [`apr19_relate_stamp.selectByCorpDocId`](../../apr/sql/apr19_relate_stamp.md) | `Apr19_Grid_RelateStamp` |  |
| `selectByApprId` | 30 | [`apr19_relate_stamp.selectByApprId`](../../apr/sql/apr19_relate_stamp.md) | `Apr19_Grid_List_20260904` |  |
| `selectBySearchText` | 35 | [`apr19_relate_stamp.selectBySearchText`](../../apr/sql/apr19_relate_stamp.md) | `Apr19_Tab_StampList` |  |
| `selectByOrgCodeId` | 40 | [`apr19_relate_stamp.selectByOrgCodeId`](../../apr/sql/apr19_relate_stamp.md) | `Apr19_Tab_OrgStampList` |  |
| `selectByStampCheckList` | 45 | [`apr19_relate_stamp.selectByStampCheckList`](../../apr/sql/apr19_relate_stamp.md) | `Apr19_Tab_StampFileCheck` |  |
| `modelUpdate` | 50 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr19_relate_stamp)` 동적 INSERT/UPDATE | `Apr19_Edit_StampDate`, `Apr19_Grid_List_20260904` | `UpdateDataModel` |
| `update` | 63 | `UpdateDataModel(apr19_relate_stamp)` 동적 INSERT/UPDATE | `Apr19_Grid_List_20260904`, `Apr19_Grid_RelateStamp`, `Apr19_Tab_StampFileCheck` | `UpdateDataModel` |
| `delete` | 68 | `UpdateDataModel(apr19_relate_stamp)` 동적 DELETE | `Apr19_Grid_List_20260904`, `Apr19_Grid_RelateStamp` | `UpdateDataModel` |
