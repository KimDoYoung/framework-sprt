# dcr06_relate_doc_Type

`server/dcr/mapper/dcr06_relate_doc_Type.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md) |  | - |
| `selectByName` | select | 32 | [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md) |  | `dcr.Dcr06_RelateDocType.selectByName` |
| `selectByClassTreeId` | select | 47 | [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md) |  | `dcr.Dcr06_RelateDocType.selectByClassTreeId` |
| `selectByDocTypeId` | select | 62 | [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md) |  | `dcr.Dcr05_DocType.delete` |
