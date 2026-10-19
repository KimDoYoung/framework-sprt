# apr.Apr16_StampDoc

`server/apr/Apr16_StampDoc.java`

서비스 키 `apr.Apr16_StampDoc.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`apr16_stamp_doc.selectById`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Tab_StampList`, `Apr16_Tab_StampListOrg` |  |
| `selectByApplEmpId` | 26 | [`apr16_stamp_doc.selectByApplEmpId`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Tab_StampDocAppl` |  |
| `selectByApplType` | 31 | [`apr16_stamp_doc.selectByApplType`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Lookup_StampReprCorp` |  |
| `selectApplDocByRegDateIsNull` | 36 | [`apr16_stamp_doc.selectApplDocByRegDateIsNull`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Lookup_GetDocAppl`, `Apr16_Tab_StampDocManager` |  |
| `selectDocByRegDate` | 41 | [`apr16_stamp_doc.selectDocByRegDate`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Tab_StampDocManager` |  |
| `selectDocGroupSum` | 46 | [`apr16_stamp_doc.selectDocGroupSum`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Tab_StampDocManager` |  |
| `selectStampByCompanyId` | 51 | [`apr16_stamp_doc.selectStampByCompanyId`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Tab_StampList`, `Apr16_Tab_StampListOrg` |  |
| `selectStampCheck` | 56 | [`apr16_stamp_doc.selectStampCheck`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Tab_StampFileCheck` |  |
| `selectByApprId` | 61 | [`apr16_stamp_doc.selectByApprId`](../../apr/sql/apr16_stamp_doc.md) | `Apr01_Edit_ApprDoc`, `Apr16_Grid_StampApplList` |  |
| `selectProvideCoByApprId` | 66 | [`apr16_stamp_doc.selectProvideCoByApprId`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Grid_StampDoc` |  |
| `updateRegDate` | 71 | `UpdateDataModel(apr16_stamp_doc)` 동적 INSERT/UPDATE | `Apr16_Lookup_GetDocAppl` | `UpdateDataModel` |
| `updateStampDate` | 81 | [`apr16_stamp_doc.updateStampDate`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Lookup_UpdateStampDate` |  |
| `updateConfirmDate` | 92 | [`apr16_stamp_doc.updateConfirmDate`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Tab_StampFileCheck` |  |
| `modelUpdate` | 107 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr16_stamp_doc)` 동적 INSERT/UPDATE | `Apr16_Lookup_StampApplQty` | `UpdateDataModel` |
| `update` | 120 | `UpdateDataModel(apr16_stamp_doc)` 동적 INSERT/UPDATE | `Apr16_Lookup_StampDocAppl`, `Apr16_Lookup_StampDocReg`, `Apr16_Tab_StampDocManager` | `UpdateDataModel` |
| `deleteReg` | 125 | [`apr16_stamp_doc.deleteById`](../../apr/sql/apr16_stamp_doc.md), [`apr16_stamp_doc.selectSimpleById`](../../apr/sql/apr16_stamp_doc.md), [`apr16_stamp_doc.updateRegDate`](../../apr/sql/apr16_stamp_doc.md) | `Apr16_Tab_StampDocManager` |  |
| `deleteByApprId` | 142 | [`apr16_stamp_doc.deleteByApprId`](../../apr/sql/apr16_stamp_doc.md) | `Apr01_Edit_ApprDoc` |  |
| `delete` | 147 | `UpdateDataModel(apr16_stamp_doc)` 동적 DELETE | `Apr16_Grid_StampApplList`, `Apr16_Tab_StampDocAppl` | `UpdateDataModel` |
