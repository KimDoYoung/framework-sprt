# apr10_stamp

`server/apr/mapper/apr10_stamp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 34 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md), [`org10_role_stamp`](../../../db/tables/org.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | `apr.Apr10_Stamp.selectById` |
| `selectByCodeName` | select | 64 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md), [`org10_role_stamp`](../../../db/tables/org.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | `apr.Apr10_Stamp.selectByCodeName` |
| `selectByApprId` | select | 95 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.selectByApprId` |
| `selectByAlt` | select | 104 | [`apr01_appr`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md) | `f_today` | `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate` |
| `org_tree_list` | sql | 117 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_sysdate` |  |
| `selectByOrgId2` | select | 166 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md), [`org10_role_stamp`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md) | `f_org_nm` | `apr.Apr10_Stamp.selectByOrgId2` |
| `selectBySearchText2` | select | 215 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md), [`org10_role_stamp`](../../../db/tables/org.md) | `f_org_nm`, `f_today` | `apr.Apr10_Stamp.selectBySearchText2` |
| `selectByOrgId` | select | 241 | [`apr10_stamp`](../../../db/tables/apr.md), [`org10_role_stamp`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md) | `f_org_nm` | `apr.Apr10_Stamp.selectByOrgId` |
| `getStampFileId` | select | 284 | [`apr10_stamp`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) | `f_org_nm` | - |
| `selectOneStampFileId` | select | 294 | [`apr10_stamp`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) | `f_org_nm` | - |
| `selectCorpStampYn` | select | 319 | [`apr10_stamp`](../../../db/tables/apr.md) |  | `apr.Apr10_Stamp.selectCorpStampYn` |
| `selectByPDFId` | select | 327 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) |  | `apr.Apr10_Stamp.selectByPDFId` |
| `getPDFId` | select | 335 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) |  | - |
| `selectBySearchText` | select | 345 | [`apr10_stamp`](../../../db/tables/apr.md), [`org10_role_stamp`](../../../db/tables/org.md) | `f_org_nm`, `f_today` | `apr.Apr10_Stamp.selectBySearchText` |
| `selectBySearchTextAdmin` | select | 365 | [`apr10_stamp`](../../../db/tables/apr.md) | `f_org_nm`, `f_today` | `apr.Apr10_Stamp.selectBySearchTextAdmin` |
| `checkCloseDate` | select | 376 | [`apr10_stamp`](../../../db/tables/apr.md) | `f_today` | `org.Org10_RoleStamp.checkRole` |
