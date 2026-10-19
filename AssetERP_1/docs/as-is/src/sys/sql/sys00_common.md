# sys00_common

`server/sys/mapper/sys00_common.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectDeadLine` | select | 24 | [`sch03_deadline`](../../../db/tables/sch.md), [`sys09_code`](../../../db/tables/sys.md) | `f_get_deadline_nm` | `sys.Sys00_Common.selectDeadLine` |
| `selectCertCode` | select | 34 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectCertCode` |
| `selectByFormCode` | select | 45 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectByFormCode` |
| `selectBenefitCode` | select | 55 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectBenefitCode` |
| `selectCompanyInfo` | select | 66 | [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectCompanyInfo` |
| `selectLocName` | select | 74 | [`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectLocName` |
| `selectLocName2` | select | 85 | [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectLocName2` |
| `selectCompanyName` | select | 94 | [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectCompanyName` |
| `selectCompanyInfoName` | select | 103 | [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectCompanyInfoName` |
| `selectBizCardManager` | select | 112 | [`act01_account_code`](../../../db/tables/act.md), [`biz01_promo`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `sys.Sys00_Common.selectBizCardManager` |
| `selectCardManager` | select | 147 | [`crd01_card`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`sys09_code`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_sysdate` | `sys.Sys00_Common.selectCardManager` |
| `selectDeposit` | select | 164 | [`ast01_class_tree`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectDeposit` |
| `selectForDeposit` | select | 185 | [`ast01_class_tree`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectForDeposit` |
| `selectAllDeposit` | select | 206 | [`ast01_class_tree`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectAllDeposit` |
| `selectWindowUseTrCode` | select | 226 | [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectWindowUseTrCode` |
| `selectByProvideContentCode` | select | 239 | [`act01_account_code`](../../../db/tables/act.md), [`act14_link`](../../../db/tables/act.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectByProvideContentCode` |
| `selectByFltItemType` | select | 251 | [`flt05_item_type`](../../../db/tables/flt.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectByFltItemType` |
| `selectMenuName` | select | 272 | [`sys06_menu`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectMenuName` |
| `selectDevStatus` | select | 282 | [`scm10_dev`](../../../db/tables/scm.md), [`sys09_code`](../../../db/tables/sys.md) | `f_get_dev_status` | `sys.Sys00_Common.selectDevStatus` |
| `selectLeaveCode` | select | 292 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys31_leave_company`](../../../db/tables/sys.md) | `f_today` | `sys.Sys00_Common.selectLeaveCode` |
| `selectSpcLeaveCode` | select | 313 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys31_leave_company`](../../../db/tables/sys.md) | `f_today` | `sys.Sys00_Common.selectSpcLeaveCode` |
| `selectBenefit` | select | 337 | [`emp55_benefit_info`](../../../db/tables/emp.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` | `sys.Sys00_Common.selectBenefit` |
| `selectDepnItemType` | select | 358 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectDepnItemType` |
| `selectOfficeAssets` | select | 370 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectOfficeAssets` |
