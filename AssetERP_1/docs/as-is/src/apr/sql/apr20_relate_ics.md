# apr20_relate_ics

`server/apr/mapper/apr20_relate_ics.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 33 | [`apr20_relate_ics`](../../../db/tables/apr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr20_RelateIcs.selectById` |
| `selectByApprId` | select | 61 | [`apr20_relate_ics`](../../../db/tables/apr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr20_RelateIcs.check`, `apr.Apr20_RelateIcs.selectByApprId` |
| `selectByClassTreeId` | select | 87 | [`apr20_relate_ics`](../../../db/tables/apr.md), [`ics01_class_tree`](../../../db/tables/ics.md) | `f_ics_class_tree_nm_allpath` | `apr.Apr20_RelateIcs.selectByClassTreeId` |
| `getCloseDate` | select | 102 | - | `f_get_std_date` | `apr.Apr20_RelateIcs.getCloseDate` |
| `insert` | insert | 106 | [`apr20_relate_ics`](../../../db/tables/apr.md) |  | - |
