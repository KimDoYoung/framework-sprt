# dcr05_doc_type

`server/dcr/mapper/dcr05_doc_type.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`dcr05_doc_type`](../../../db/tables/dcr.md) | `f_cdnm`, `f_today` | - |
| `selectByAll` | select | 24 | [`dcr05_doc_type`](../../../db/tables/dcr.md) |  | `dcr.Dcr05_DocType.selectByAll` |
| `selectByName` | select | 32 | [`dcr05_doc_type`](../../../db/tables/dcr.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` | `dcr.Dcr05_DocType.selectByName` |
| `selectByClassTreeId` | select | 57 | [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` | `dcr.Dcr05_DocType.selectByClassTreeId` |
| `selectByDefaultClassTreeId` | select | 84 | [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md) |  | `dcr.Dcr05_DocType.selectByDefaultClassTreeId`, `fnd.Fnd20_Plan.insertAppr`, `sch.Sch04_List.insertAppr` |
| `checkDocFormClassCode` | select | 95 | [`dcr05_doc_type`](../../../db/tables/dcr.md) |  | `dcr.Dcr05_DocType.checkDocFormClassCode`, `sys.Sys09_Code.checkCode` |
| `insertRequest` | insert | 102 | [`dcr05_doc_type`](../../../db/tables/dcr.md) |  | `dcr.Dcr05_DocType.pushData` |
| `insertFormDcr05` | insert | 122 | [`dcr05_doc_type`](../../../db/tables/dcr.md) | `f_create_seq` | - |
