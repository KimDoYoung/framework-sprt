# apr22_relate_icr

`server/apr/mapper/apr22_relate_icr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`apr22_relate_icr`](../../../db/tables/apr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr22_RelateIcr.selectById` |
| `selectByApprId` | select | 48 | [`apr22_relate_icr`](../../../db/tables/apr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr22_RelateIcr.check`, `apr.Apr22_RelateIcr.selectByApprId` |
| `selectByClassTreeId` | select | 65 | [`apr22_relate_icr`](../../../db/tables/apr.md), [`icr01_class_tree`](../../../db/tables/icr.md) | `f_icr_class_tree_nm_allpath` | `apr.Apr22_RelateIcr.selectByClassTreeId` |
| `getCloseDate` | select | 80 | - | `f_get_std_date` | `apr.Apr22_RelateIcr.getCloseDate` |
| `insert` | insert | 84 | [`apr22_relate_icr`](../../../db/tables/apr.md) |  | - |
