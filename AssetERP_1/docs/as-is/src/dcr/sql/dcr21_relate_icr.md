# dcr21_relate_icr

`server/dcr/mapper/dcr21_relate_icr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr21_RelateIcr.selectById` |
| `selectByDcrClassTreeId` | select | 46 | [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr21_RelateIcr.selectByDcrClassTreeId` |
| `selectByClassTreeId` | select | 66 | [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr22_RelateIcr.selectByDcrClassTreeId`, `dcr.Dcr21_RelateIcr.selectByClassTreeId` |
| `selectByToDoList` | select | 81 | `apr20_relate_icr` ⚠DB없음, [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), `sch05_relate_icr` ⚠DB없음 | `f_cdnm`, `f_get_deadline_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr22_RelateIcr.insertToDoList` |
| `insertIcr` | select | 169 | [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `apr.Apr22_RelateIcr.insertIcr` |
| `insertAll` | insert | 210 | [`dcr21_relate_icr`](../../../db/tables/dcr.md) | `f_create_seq` | `dcr.Dcr21_RelateIcr.update` |
| `insertByInsertBakDcrId` | insert | 227 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md) | `f_create_seq` | - |
| `deleteByInsertBakDcrId` | delete | 245 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md) |  | - |
| `newInsertByInsertBakDcrId` | insert | 257 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md) | `f_create_seq` | - |
| `newDeleteByInsertBakDcrId` | delete | 292 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md) |  | - |
| `deleteAll` | delete | 304 | [`dcr21_relate_icr`](../../../db/tables/dcr.md) |  | `dcr.Dcr21_RelateIcr.delete` |
