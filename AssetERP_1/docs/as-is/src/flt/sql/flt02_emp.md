# flt02_emp

`server/flt/mapper/flt02_emp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 39 | [`flt02_emp`](../../../db/tables/flt.md) | `f_cdnm`, `f_sysdate` | `flt.Flt02_Emp.selectById` |
| `selectByPersonId` | select | 47 | [`flt02_emp`](../../../db/tables/flt.md) | `f_cdnm`, `f_sysdate` | `flt.Flt02_Emp.selectByPersonId` |
| `selectByCompanyId` | select | 57 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt04_oath`](../../../db/tables/flt.md), [`flt07_family_consent`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt15_tr_status`](../../../db/tables/flt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_last_day`, `f_get_quarter_date`, `f_today` | `flt.Flt02_Emp.selectByCompanyId` |
| `selectByCompanyId2` | select | 95 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt04_oath`](../../../db/tables/flt.md), [`flt07_family_consent`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt15_tr_status`](../../../db/tables/flt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_last_day`, `f_get_quarter_date`, `f_today` | `sys.Sys99_Print.insertRdEmpInfo` |
| `selectByDate` | select | 139 | [`emp01_person`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md) | `f_cdnm`, `f_sysdate` | `flt.Flt02_Emp.selectByDate`, `flt.Flt10_Tr.checkNextAppr`, `flt.Flt10_Tr.checkPreAppr` |
| `selectInvestLimit` | select | 171 | [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md) | `f_get_floortrcheck` | `flt.Flt02_Emp.selectInvestLimit` |
