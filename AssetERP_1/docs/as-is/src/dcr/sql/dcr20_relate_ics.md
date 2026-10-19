# dcr20_relate_ics

`server/dcr/mapper/dcr20_relate_ics.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr20_RelateIcs.selectById` |
| `selectByDcrClassTreeId` | select | 70 | [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr20_RelateIcs.selectByDcrClassTreeId` |
| `selectByClassTreeId` | select | 115 | [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr20_RelateIcs.selectByDcrClassTreeId`, `dcr.Dcr20_RelateIcs.selectByClassTreeId` |
| `selectByToDoList` | select | 140 | [`apr20_relate_ics`](../../../db/tables/apr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr20_RelateIcs.insertToDoList` |
| `insertIcs` | select | 229 | [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr20_RelateIcs.insertIcs` |
| `insertAll` | insert | 270 | [`dcr20_relate_ics`](../../../db/tables/dcr.md) | `f_create_seq` | `dcr.Dcr20_RelateIcs.update` |
| `insertByInsertBakDcrId` | insert | 285 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md) | `f_create_seq` | `dcr.Dcr01_ClassTree.insertAdminCopy` |
| `deleteByInsertBakDcrId` | delete | 301 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.insertAdminCopy` |
| `newInsertByInsertBakDcrId` | insert | 311 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md) | `f_create_seq` | - |
| `newDeleteByInsertBakDcrId` | delete | 346 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md) |  | - |
| `deleteAll` | delete | 364 | [`dcr20_relate_ics`](../../../db/tables/dcr.md) |  | `dcr.Dcr20_RelateIcs.delete` |
