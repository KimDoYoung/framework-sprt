# apr19_relate_stamp

`server/apr/mapper/apr19_relate_stamp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md) | `f_emp_kor_nm` | `apr.Apr19_RelateStamp.selectById` |
| `selectByCorpDocId` | select | 48 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md) |  | `apr.Apr19_RelateStamp.selectByCorpDocId` |
| `selectByApprId` | select | 59 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md) |  | `apr.Apr19_RelateStamp.selectByApprId` |
| `selectBySearchText` | select | 71 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `apr.Apr19_RelateStamp.selectBySearchText`, `sys.Sys99_Print.insertRdStampList` |
| `selectByOrgCodeId` | select | 177 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`org10_role_stamp`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `apr.Apr19_RelateStamp.selectByOrgCodeId`, `sys.Sys99_Print.insertRdOrgStampList` |
| `selectByStampCheckList` | select | 298 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `apr.Apr19_RelateStamp.selectByStampCheckList` |
| `updateCorpDocId` | update | 354 | [`apr19_relate_stamp`](../../../db/tables/apr.md) |  | - |
| `deleteApprId` | delete | 360 | [`apr19_relate_stamp`](../../../db/tables/apr.md) |  | - |
