# ics02_manager

`server/ics/mapper/ics02_manager.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 32 | [`ics02_manager`](../../../db/tables/ics.md) | `f_emp_kor_nm` | `ics.Ics02_Manager.selectById` |
| `selectByCompanyId` | select | 39 | [`ics02_manager`](../../../db/tables/ics.md) | `f_emp_kor_nm` | `ics.Ics02_Manager.selectByCompanyId` |
| `selectByIcsList` | select | 47 | [`apr01_appr`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md) | `f_emp_kor_nm`, `f_get_appr_close_date`, `f_get_emptrans`, `f_get_ics_manager`, `f_get_std_date`, `f_today` | `ics.Ics02_Manager.selectByIcsList` |
| `getDefaultYn` | select | 214 | [`ics02_manager`](../../../db/tables/ics.md) | `f_emp_kor_nm` | `ics.Ics02_Manager.getDefaultYn` |
| `insertFromIcs02` | insert | 223 | [`ics02_manager`](../../../db/tables/ics.md) | `f_create_seq` | - |
