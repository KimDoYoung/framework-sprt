# apr.Apr17_CorpDoc

`server/apr/Apr17_CorpDoc.java`

서비스 키 `apr.Apr17_CorpDoc.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`apr17_corp_doc.selectById`](../../apr/sql/apr17_corp_doc.md) | `Apr17_Tab_CorpDoc`, `Apr17_Tab_CorpDocApp` |  |
| `selectByApprId` | 25 | [`apr17_corp_doc.selectByApprId`](../../apr/sql/apr17_corp_doc.md) | `Apr18_Grid_RelateCorpDoc_20260904` |  |
| `selectByCompanyId` | 33 | [`apr17_corp_doc.selectByCompanyId`](../../apr/sql/apr17_corp_doc.md) | `Apr17_Lookup_CorpDoc`, `Apr17_Tab_CorpDoc` |  |
| `selectByAppDate` | 41 | [`apr17_corp_doc.selectByAppDate`](../../apr/sql/apr17_corp_doc.md) | `Apr17_Tab_CorpDocApp` |  |
| `selectByCorpRegDate` | 54 | [`apr17_corp_doc.selectByCorpRegDate`](../../apr/sql/apr17_corp_doc.md) | `Apr17_Tab_CorpDoc` |  |
| `selectByRegDate` | 64 | [`apr17_corp_doc.selectByRegDate`](../../apr/sql/apr17_corp_doc.md) | `Apr17_Tab_CorpDoc` |  |
| `regDateUpdate` | 74 | [`apr17_corp_doc.regDateUpdate`](../../apr/sql/apr17_corp_doc.md) | `Apr17_Lookup_CorpDoc`, `Apr17_Tab_CorpDoc` |  |
| `regDelete` | 87 | [`apr17_corp_doc.regDelete`](../../apr/sql/apr17_corp_doc.md) | `Apr17_Tab_CorpDoc` |  |
| `copyUpdate` | 95 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr17_corp_doc)` 동적 INSERT/UPDATE | `Apr17_Tab_CorpDocApp` | `UpdateDataModel` |
| `deleteApprId` | 108 | [`apr17_corp_doc.deleteApprId`](../../apr/sql/apr17_corp_doc.md), [`apr18_relate_corp_doc.deleteApprId`](../../apr/sql/apr18_relate_corp_doc.md) | - |  |
| `update` | 117 | `UpdateDataModel(apr17_corp_doc)` 동적 INSERT/UPDATE | `Apr17_Tab_CorpDoc`, `Apr17_Tab_CorpDocApp` | `UpdateDataModel` |
| `delete` | 122 | `UpdateDataModel(apr17_corp_doc)` 동적 DELETE | `Apr17_Tab_CorpDocApp` | `UpdateDataModel` |
