# pln03_Resrch

`server/pln/mapper/pln03_resrch.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 32 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd07_issuing_entity`](../../../db/tables/fnd.md), [`pln03_resrch`](../../../db/tables/pln.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm` | - |
| `selectBySearchText` | select | 115 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd07_issuing_entity`](../../../db/tables/fnd.md), [`pln03_resrch`](../../../db/tables/pln.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm` | - |
| `selectDetailInit` | select | 217 | [`apr06_appr_step_rule`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md) | `f_add_day`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc` | - |
| `closeUpdate` | update | 240 | [`pln03_resrch`](../../../db/tables/pln.md) |  | - |
| `apprUpdate` | update | 247 | [`pln03_resrch`](../../../db/tables/pln.md) |  | - |
| `insert` | insert | 254 | [`pln03_resrch`](../../../db/tables/pln.md) |  | - |
