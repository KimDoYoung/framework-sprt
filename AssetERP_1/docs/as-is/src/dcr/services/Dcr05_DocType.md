# dcr.Dcr05_DocType

`server/dcr/Dcr05_DocType.java`

서비스 키 `dcr.Dcr05_DocType.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 20 | [`dcr05_doc_type.selectByAll`](../../dcr/sql/dcr05_doc_type.md) | - |  |
| `selectByName` | 31 | [`dcr05_doc_type.selectByName`](../../dcr/sql/dcr05_doc_type.md) | `Dcr05_Lookup_DocType`, `Dcr05_Lookup_FormView`, `Dcr05_Tab_DocType` |  |
| `selectByClassTreeId` | 59 | [`dcr05_doc_type.selectByClassTreeId`](../../dcr/sql/dcr05_doc_type.md) | `Dcr05_Lookup_FormView` |  |
| `selectByDefaultClassTreeId` | 87 | [`dcr05_doc_type.selectByDefaultClassTreeId`](../../dcr/sql/dcr05_doc_type.md) | `Apr01_Edit_ApprDoc` |  |
| `checkDocFormClassCode` | 104 | [`dcr05_doc_type.checkDocFormClassCode`](../../dcr/sql/dcr05_doc_type.md) | `Sys09_Lookup_Code` |  |
| `update` | 113 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(dcr05_doc_type)` 동적 INSERT/UPDATE | `Dcr05_Edit_DocType` | `UpdateDataModel` |
| `updateEdit` | 128 | `UpdateDataModel(dcr05_doc_type)` 동적 INSERT/UPDATE | `Dcr05_Edit_Update` | `UpdateDataModel` |
| `pushData` | 139 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr05_doc_type.insertRequest`](../../dcr/sql/dcr05_doc_type.md) | `Dcr05_Tab_DocType` |  |
| `delete` | 163 | [`dcr06_relate_doc_Type.selectByDocTypeId`](../../dcr/sql/dcr06_relate_doc_Type.md), `UpdateDataModel(dcr05_doc_type)` 동적 DELETE | `Dcr05_Tab_DocType` | `UpdateDataModel` |
