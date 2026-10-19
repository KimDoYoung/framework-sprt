# apr.Apr18_RelateCorpDoc

`server/apr/Apr18_RelateCorpDoc.java`

서비스 키 `apr.Apr18_RelateCorpDoc.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`apr18_relate_corp_doc.selectById`](../../apr/sql/apr18_relate_corp_doc.md) | - |  |
| `selectByCorpDocId` | 26 | [`apr18_relate_corp_doc.selectByCorpDocId`](../../apr/sql/apr18_relate_corp_doc.md) | `Apr18_Lookup_RelateAppr`, `Apr19_Lookup_RelateAppr` |  |
| `modelUpdate` | 34 | [`apr17_corp_doc.checkByApprId`](../../apr/sql/apr17_corp_doc.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr18_relate_corp_doc)` 동적 INSERT/UPDATE | `Apr18_Lookup_RelateAppr` | `UpdateDataModel` |
| `update` | 62 | `UpdateDataModel(apr18_relate_corp_doc)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 67 | `UpdateDataModel(apr18_relate_corp_doc)` 동적 DELETE | `Apr18_Lookup_RelateAppr` | `UpdateDataModel` |
