# common

`server/utils/db/mapper/Common.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `rownumLimit1` | sql | 14 | - |  |  |
| `sequenceNextVal` | sql | 27 | - | `f_create_seq` |  |
| `orgcodePriorParent` | sql | 42 | [`org00_org_info`](../../../db/views.md) |  |  |
| `orgCodePriorParent_Tibero` | sql | 56 | [`org00_org_info`](../../../db/views.md) |  |  |
| `orgCodePriorParent_Postgre` | sql | 64 | [`org00_org_info`](../../../db/views.md) |  |  |
| `orgcodeParent` | sql | 101 | [`org00_org_info`](../../../db/views.md) |  |  |
| `orgCodeParent_Tibero` | sql | 114 | [`org00_org_info`](../../../db/views.md) |  |  |
| `orgCodeParent_Postgre` | sql | 122 | [`org00_org_info`](../../../db/views.md) |  |  |
| `minusExcept` | sql | 159 | - |  |  |
| `orgCodeByEmpId` | sql | 166 | [`emp00_trans_info`](../../../db/views.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_trunc` |  |
| `orgCodeByEmpId_tibero` | sql | 173 | [`emp00_trans_info`](../../../db/views.md), [`org02_info`](../../../db/tables/org.md) | `f_sysdate`, `f_trunc` |  |
| `orgCodeByEmpId_postgresql` | sql | 185 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` |  |
| `common.orgCodeDown` | sql | 236 | [`org00_org_info`](../../../db/views.md) | `f_trunc` |  |
| `dcr_tree_all_tibero` | sql | 281 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  |  |
| `dcr_tree_all_postgresql` | sql | 299 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  |  |
| `dcr01ClassId_Down` | sql | 398 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  |  |
| `dcr_tree_down` | sql | 462 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  |  |
| `org_tree_down_postgresql` | sql | 552 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_trunc` |  |
| `org_tree_down_tibero` | sql | 612 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_trunc` |  |
| `ics_tree_all_postgresql` | sql | 652 | [`ics01_class_tree`](../../../db/tables/ics.md) |  |  |
| `icr_tree_all_postgresql` | sql | 713 | [`icr01_class_tree`](../../../db/tables/icr.md) |  |  |
| `ast_tree_all_postgresql` | sql | 775 | [`ast01_class_tree`](../../../db/tables/ast.md) |  |  |
| `common.icsTreeDown` | sql | 902 | [`ics01_class_tree`](../../../db/tables/ics.md) |  |  |
| `common.icrTreeDown` | sql | 944 | [`icr01_class_tree`](../../../db/tables/icr.md) |  |  |
| `common.dcrTreeDown` | sql | 986 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  |  |
| `common.astTreeDown` | sql | 1028 | [`ast01_class_tree`](../../../db/tables/ast.md) |  |  |
| `common.actTreeDown` | sql | 1069 | [`act01_account_code`](../../../db/tables/act.md) |  |  |
| `common.chkTreeDown` | sql | 1107 | [`chk01_class_tree`](../../../db/tables/chk.md) |  |  |
| `dcr_all_postgresql` | sql | 1146 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  |  |
| `ast_book_postgresql` | sql | 1240 | [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md) |  |  |
| `sys_code` | sql | 1314 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` |  |
| `sys_codeByDate` | sql | 1329 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  |  |
| `ics_checklist_class` | sql | 1347 | [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md) |  |  |
| `emp00_trans_info` | sql | 1372 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` |  |
| `org00_org_info_with` | sql | 1513 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) |  |  |
| `org00_org_info` | sql | 1517 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) |  |  |
| `aprEmpOrg_by_apprId` | sql | 1553 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` |  |
| `aprStepEmpOrg_by_apprStepId` | sql | 1626 | [`apr04_appr_step`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_today` |  |
| `aprTempEmpOrg_by_apprId` | sql | 1682 | [`apr01_appr_temp`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` |  |
| `dcr_auth_all_postgresql` | sql | 1756 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) |  |  |
| `empOrg_by_transId` | sql | 1893 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` |  |
| `fnd00_by_apprId` | sql | 1960 | [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md) | `f_cdnm`, `f_emp_kor_nm`, `f_today` |  |
