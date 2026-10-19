# apr01_appr_temp

`server/apr/mapper/apr01_appr_temp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 67 | [`apr01_appr_temp`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` | `apr.Apr01_ApprTemp.selectById` |
| `insert` | insert | 77 | [`apr01_appr_temp`](../../../db/tables/apr.md) |  | `apr.Apr01_ApprTemp.insert` |
