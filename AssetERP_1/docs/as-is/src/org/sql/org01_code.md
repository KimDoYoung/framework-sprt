# org01_code

`server/org/mapper/org01_code.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 44 | [`org01_code`](../../../db/tables/org.md) |  | - |
| `selectByCompanyId` | select | 50 | [`org01_code`](../../../db/tables/org.md) |  | `ast.Ast01_ClassTree.insert`, `ast.Ast01_ClassTree.insertIpo` |
| `selectByOrgCode` | select | 57 | [`org01_code`](../../../db/tables/org.md) |  | - |
| `selectByBaseDate` | select | 64 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm` | `org.Org01_Code.delete`, `org.Org01_Code.update` |
| `selectByParentId_1Bang` | select | 82 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_trunc` | `org.Org01_Code.selectByCompanyId` |
| `selectByParentId` | select | 159 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_trunc` | `emp.Emp00_TransInfo.selectByAuthEmp` |
| `selectByFundCodeId` | select | 179 | [`fnd08_org_auth`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_sysdate` | `org.Org01_Code.selectByFundCodeId`, `org.Org01_Code.selectByOrgCodeId` |
| `selectByAccountId` | select | 198 | [`adv05_org_auth`](../../../db/tables/adv.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_sysdate` | `org.Org01_Code.selectByAccountId` |
| `selectByDcrCodeId` | select | 217 | [`dcr03_org_auth`](../../../db/tables/dcr.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_sysdate` | `org.Org01_Code.selectByDcrCodeId` |
| `selectByOrgCodeId` | select | 236 | [`fnd08_org_auth`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm` | `org.Org01_Code.selectByOrgCodeId` |
| `selectByKorName` | select | 255 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_org_parent_full_nm` | `org.Org01_Code.selectByKorName` |
| `selectOneByKorName` | select | 274 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm` | - |
| `selectByRdBaseDate` | select | 292 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_trunc` | `sys.Sys99_Print.insertRdOrgState` |
| `checkUseOrgId` | select | 338 | - |  | `org.Org02_Info.deleteCheck` |
| `insertOrg01Code` | insert | 342 | [`org01_code`](../../../db/tables/org.md) |  | - |
| `deleteOrg` | delete | 365 | [`org01_code`](../../../db/tables/org.md) |  | `org.Org02_Info.deleteOrg` |
