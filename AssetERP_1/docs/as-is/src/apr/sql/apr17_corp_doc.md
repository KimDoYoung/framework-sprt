# apr17_corp_doc

`server/apr/mapper/apr17_corp_doc.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 38 | [`apr01_appr`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md) | `f_emp_kor_nm` | `apr.Apr17_CorpDoc.selectById` |
| `selectByApprId` | select | 60 | [`apr01_appr`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md) |  | `apr.Apr17_CorpDoc.selectByApprId` |
| `selectByCompanyId` | select | 71 | [`apr01_appr`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md) | `f_emp_kor_nm` | `apr.Apr17_CorpDoc.selectByCompanyId` |
| `selectByCorpRegDate` | select | 101 | [`apr01_appr`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md) | `f_emp_kor_nm` | `apr.Apr17_CorpDoc.selectByCorpRegDate`, `sys.Sys99_Print.insertRdCorpDoc` |
| `selectByAppDate` | select | 114 | [`apr01_appr`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md) |  | `apr.Apr17_CorpDoc.selectByAppDate` |
| `selectByRegDate` | select | 144 | [`apr17_corp_doc`](../../../db/tables/apr.md) |  | `apr.Apr17_CorpDoc.selectByRegDate` |
| `checkByApprId` | select | 168 | [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md) |  | `apr.Apr18_RelateCorpDoc.modelUpdate` |
| `deleteApprId` | delete | 176 | [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md) |  | `apr.Apr17_CorpDoc.deleteApprId` |
| `regDateUpdate` | update | 186 | [`apr17_corp_doc`](../../../db/tables/apr.md) |  | `apr.Apr17_CorpDoc.regDateUpdate` |
| `regDelete` | delete | 192 | [`apr17_corp_doc`](../../../db/tables/apr.md) |  | `apr.Apr17_CorpDoc.regDelete` |
