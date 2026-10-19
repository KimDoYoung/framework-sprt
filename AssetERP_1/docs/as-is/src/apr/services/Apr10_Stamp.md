# apr.Apr10_Stamp

`server/apr/Apr10_Stamp.java`

서비스 키 `apr.Apr10_Stamp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`apr10_stamp.selectById`](../../apr/sql/apr10_stamp.md) | `Apr01_Edit_ApprDoc` |  |
| `selectBySearchText2` | 36 | [`apr10_stamp.selectBySearchText2`](../../apr/sql/apr10_stamp.md) | `Apr10_Lookup_DocStamp` |  |
| `selectByOrgId2` | 47 | [`apr10_stamp.selectByOrgId2`](../../apr/sql/apr10_stamp.md) | `Apr10_Lookup_DocStamp` |  |
| `selectByOrgId` | 58 | [`apr10_stamp.selectByOrgId`](../../apr/sql/apr10_stamp.md) | `Apr10_Lookup_Stamp` |  |
| `selectByCodeName` | 79 | [`apr10_stamp.selectByCodeName`](../../apr/sql/apr10_stamp.md) | `Apr10_Tab_Stamp` |  |
| `selectByCompanyId` | 93 | - | - |  |
| `selectBySearchText` | 97 | [`apr10_stamp.selectBySearchText`](../../apr/sql/apr10_stamp.md) | `Apr10_Lookup_Stamp` |  |
| `selectBySearchTextAdmin` | 112 | [`apr10_stamp.selectBySearchTextAdmin`](../../apr/sql/apr10_stamp.md) | `Apr10_Lookup_Stamp` |  |
| `selectByPDFId` | 121 | [`apr10_stamp.selectByPDFId`](../../apr/sql/apr10_stamp.md) | `Apr01_Edit_ApprDoc` |  |
| `selectCorpStampYn` | 137 | [`apr10_stamp.selectCorpStampYn`](../../apr/sql/apr10_stamp.md) | `Apr16_Lookup_StampDocAppl`, `Apr16_Lookup_StampDocReg` |  |
| `update` | 142 | `UpdateDataModel(apr10_stamp)` 동적 INSERT/UPDATE | `Apr10_Tab_Stamp` | `UpdateDataModel` |
| `delete` | 148 | `UpdateDataModel(apr10_stamp)` 동적 DELETE | `Apr10_Tab_Stamp` | `UpdateDataModel` |
