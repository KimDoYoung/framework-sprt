# apr99_appr_del

`server/apr/mapper/apr99_appr_del.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 62 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`org00_org_info`](../../../db/views.md) | `f_class_tree_nm_allpath`, `f_emp_kor_nm` | `apr.Apr99_ApprDel.selectById` |
| `selectByCompanyId` | select | 88 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` | `apr.Apr99_ApprDel.selectByCompanyId` |
| `restore` | insert | 121 | [`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md) |  | `apr.Apr99_ApprDel.restore` |
| `deleteApprId` | delete | 151 | [`apr99_appr_del`](../../../db/tables/apr.md) |  | `apr.Apr99_ApprDel.restore` |
