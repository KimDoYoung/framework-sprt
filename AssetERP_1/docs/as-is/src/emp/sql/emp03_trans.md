# emp03_trans

`server/emp/mapper/emp03_trans.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 51 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md) | `f_cdnm`, `f_get_emptrans` | - |
| `selectByPersonId` | select | 74 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_get_emptrans` | `emp.Emp03_Trans.selectByPersonId` |
| `selectByHistory` | select | 98 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_get_emptrans` | `emp.Emp03_Trans.selectByHistory`, `sys.Sys99_Print.insertRdEmp03History` |
| `selectByText` | select | 128 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_code_seq`, `f_get_emptrans` | `emp.Emp03_Trans.selectByText` |
| `selectByLoginId` | select | 178 | [`emp00_trans_info`](../../../db/views.md), [`emp01_person`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys01_company`](../../../db/tables/sys.md) | `f_sysdate` | - |
| `selectByGrade` | select | 202 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp25_mypage_notice`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_get_emptrans`, `f_org_parent_full_nm`, `f_sysdate` | `emp.Emp03_Trans.selectByGrade` |
| `selectByPasswordPersonId` | select | 238 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm` | `emp.Emp03_Trans.selectByPasswordPersonId` |
| `selectByDate` | select | 270 | [`emp03_trans`](../../../db/tables/emp.md) |  | `emp.Emp03_Trans.selectByDate` |
| `getGrade` | select | 282 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md) | `f_cdnm`, `f_sysdate` | `emp.Emp03_Trans.getGrade` |
| `Monitoring` | select | 309 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys28_login_real_time`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `emp.Emp03_Trans.Monitoring` |
| `MonitoringByText` | select | 433 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys28_login_real_time`](../../../db/tables/sys.md) | `f_cdnm`, `f_org_parent_full_nm`, `f_sysdate` | `emp.Emp03_Trans.MonitoringByText` |
| `selectInOffice` | select | 732 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp33_except_biz`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_code_seq` | `sys.Sys99_Print.insertComplianceState` |
| `LoginCheck` | select | 775 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_sysdate` | `emp.Emp03_Trans.LoginCheck` |
| `deleteCheck` | select | 816 | [`emp03_trans`](../../../db/tables/emp.md) |  | `emp.Emp03_Trans.deleteCheck` |
| `deleteOrgCheck` | select | 823 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md) |  | `org.Org02_Info.deleteCheck` |
| `selectByTdmYn` | select | 832 | - | `f_cdnm`, `getorg`, `getperson`, `getsuborg` | `emp.Emp03_Trans.selectByTdmYn` |
| `getRetireDate` | select | 862 | - | `f_get_emptrans` | `sys.Sys99_Print.insertComplianceState` |
| `insert` | insert | 866 | [`emp03_trans`](../../../db/tables/emp.md) |  | - |
| `insertAddTitle` | insert | 892 | [`emp03_trans`](../../../db/tables/emp.md) |  | `emp.Emp04_AddTitle.updateList` |
| `updateAddTitle` | update | 922 | [`emp03_trans`](../../../db/tables/emp.md) |  | `emp.Emp04_AddTitle.updateList` |
| `deleteByPersonId` | delete | 933 | [`emp03_trans`](../../../db/tables/emp.md) |  | - |
