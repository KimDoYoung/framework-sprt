# apr03_relate_fund

`server/apr/mapper/apr03_relate_fund.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 42 | [`apr03_relate_fund`](../../../db/tables/apr.md) |  | - |
| `selectByApprId` | select | 48 | [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md) | `f_cdnm`, `f_emp_kor_nm`, `f_today` | `apr.Apr03_RelateFund.selectByApprId` |
| `selectByClassTreeId` | select | 54 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` | `apr.Apr03_RelateFund.selectByClassTreeId` |
| `selectByIcsClassTreeId` | select | 106 | [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr14_relate_ast`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md) | `f_max_workdate`, `f_org_nm`, `f_sysdate`, `f_trunc` | `apr.Apr03_RelateFund.selectByIcsClassTreeId` |
| `selectBySearch` | select | 172 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_emp_kor_nm` | `apr.Apr03_RelateFund.selectBySearch` |
| `selectByFundCodeId` | select | 213 | [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md) |  | - |
| `selectByAfterYn` | select | 223 | [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md) | `f_cdnm`, `f_get_fund_nm2`, `f_max_workdate`, `f_today`, `f_trunc` | `apr.Apr03_RelateFund.selectByAfterYn` |
| `getPrintYn` | select | 287 | [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md) | `f_sysdate`, `f_trunc` | - |
| `insertOprFund` | insert | 339 | [`apr03_relate_fund`](../../../db/tables/apr.md), [`opr02_fund`](../../../db/tables/opr.md) | `f_create_seq` | `opr.Opr01_Create.insertAppr` |
| `insert` | insert | 349 | [`apr03_relate_fund`](../../../db/tables/apr.md) |  | `fnd.Fnd20_Plan.insertAppr`, `pln.Pln02_Plan.insertAppr`, `sch.Sch04_List.insertAppr` |
| `conflict` | insert | 387 | [`apr03_relate_fund`](../../../db/tables/apr.md) |  | `apr.Apr01_ApprTemp.insert` |
| `deleteByAfterYn` | delete | 409 | [`apr03_relate_fund`](../../../db/tables/apr.md) |  | `apr.Apr03_RelateFund.insert` |
| `deleteByApprId` | delete | 416 | [`apr03_relate_fund`](../../../db/tables/apr.md) |  | `apr.Apr01_Appr.deleteByApprId`, `fnd.Fnd20_Plan.delete`, `fnd.Fnd30_Opr.deleteApprId`, `opr.Opr01_Create.delete`, `pln.Pln02_Plan.delete` |
