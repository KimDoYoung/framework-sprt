# fnd01_fund_code

`server/fnd/mapper/fnd01_fund_code.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md) | `f_cdnm`, `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd01_FundCode.noteUpdate`, `fnd.Fnd01_FundCode.selectById` |
| `selectByCd` | select | 111 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | - |
| `selectByFundCode` | select | 118 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | - |
| `getSystemCodeName` | sql | 125 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` |  |
| `selectByFundName` | select | 249 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_max_workdate`, `f_sysdate`, `f_today`, `f_trunc` | `fnd.Fnd01_FundCode.selectByFundName`, `sys.Sys99_Print.insertRdFundSearch` |
| `selectByCompanyId` | select | 310 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`icam06_fund_book`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) |  | `fnd.Fnd01_FundCode.selectByCompanyId` |
| `selectByHistoryCompanyId` | select | 349 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md) |  | `fnd.Fnd01_FundCode.selectByHistoryCompanyId` |
| `selectByFundOrgAuth` | select | 368 | [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` | `fnd.Fnd01_FundCode.selectByFundOrgAuth` |
| `selectByWorkDate` | select | 465 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `fnd.Fnd01_FundCode.selectByWorkDate` |
| `selectByFundPlan` | select | 510 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_fund_nm2`, `f_max_workdate`, `f_sysdate`, `f_today`, `f_trunc` | `fnd.Fnd01_FundCode.selectByFundPlan` |
| `selectByFundPlanEmp` | select | 570 | [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fnd00_fund_sysdate`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`pln02_plan`](../../../db/tables/pln.md) | `f_cdnm`, `f_emp_kor_nm`, `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd01_FundCode.selectByFundPlanEmp` |
| `selectByLookupFundCode` | select | 626 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd01_FundCode.selectByLookupFundCode` |
| `selectOneFundCodeCheck` | select | 641 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | `fnd.Fnd01_FundCode.update` |
| `selectLastUploadDate` | select | 649 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md) |  | `fnd.Fnd01_FundCode.getLastUploadDate` |
| `selectByRealFundId` | select | 659 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | - |
| `insertUpdate` | insert | 666 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | - |
| `selectByOverlap` | select | 747 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | `fnd.Fnd01_FundCode.selectByOverlap` |
| `selectIcamFundInfo` | select | 753 | `szm0fd` ⚠DB없음 |  | - |
| `selectByCompanyIdAndFundCode` | select | 769 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | - |
| `selectByPlan` | select | 776 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_fund_nm2`, `f_max_workdate`, `f_sysdate`, `f_today`, `f_trunc` | `fnd.Fnd01_FundCode.selectByPlan` |
| `noteUpdate` | update | 881 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | `fnd.Fnd01_FundCode.noteUpdate` |
| `excelInsert` | insert | 887 | [`fnd01_fund_code`](../../../db/tables/fnd.md) |  | - |
