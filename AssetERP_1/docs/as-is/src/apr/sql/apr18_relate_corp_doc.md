# apr18_relate_corp_doc

`server/apr/mapper/apr18_relate_corp_doc.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`apr18_relate_corp_doc`](../../../db/tables/apr.md) |  | `apr.Apr18_RelateCorpDoc.selectById` |
| `selectByCorpDocId` | select | 24 | [`apr01_appr`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `apr.Apr18_RelateCorpDoc.selectByCorpDocId` |
| `deleteApprId` | delete | 37 | [`apr18_relate_corp_doc`](../../../db/tables/apr.md) |  | `apr.Apr17_CorpDoc.deleteApprId` |
