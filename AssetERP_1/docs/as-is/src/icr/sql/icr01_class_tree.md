# icr01_class_tree

`server/icr/mapper/icr01_class_tree.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 46 | [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `icr.Icr01_ClassTree.selectById` |
| `selectByClassTreeCode` | select | 70 | [`icr01_class_tree`](../../../db/tables/icr.md) |  | `icr.Icr01_ClassTree.selectByClassTreeCode` |
| `selectByClassTreeId` | select | 76 | [`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `icr.Icr01_ClassTree.selectByClassTreeId` |
| `selectByTypeCode` | select | 118 | [`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `icr.Icr01_ClassTree.selectByTypeCode` |
| `pagingCondition` | sql | 170 | [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md) |  |  |
| `selectByTypeCodePaging` | select | 219 | [`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `icr.Icr01_ClassTree.selectByTypeCodePaging` |
| `selectByTypeCodePagingTotal` | select | 259 | [`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md) |  | `icr.Icr01_ClassTree.selectByTypeCodePaging` |
| `selectByParentTreeId` | select | 267 | [`icr01_class_tree`](../../../db/tables/icr.md) | `f_get_icr_nm`, `f_icr_class_tree_nm`, `f_icr_class_tree_nm_allpath` | `icr.Icr01_ClassTree.selectByParentTreeId` |
| `selectByAll` | select | 278 | [`icr01_class_tree`](../../../db/tables/icr.md) | `f_icr_class_tree_nm` | `icr.Icr01_ClassTree.selectByAll` |
| `selectByText` | select | 292 | [`icr01_class_tree`](../../../db/tables/icr.md) |  | `icr.Icr01_ClassTree.selectByText` |
| `selectByTextTreeDown` | select | 301 | [`icr01_class_tree`](../../../db/tables/icr.md) |  | `icr.Icr01_ClassTree.selectByTextTreeDown` |
| `selectByParentId1Bang` | select | 310 | [`icr01_class_tree`](../../../db/tables/icr.md) |  | `icr.Icr05_RelateManager.updateList` |
| `selectByCompanyId_postgresql` | sql | 322 | [`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_class_tree_nm_allpath`, `f_get_deadline_nm` |  |
| `selectByCompanyId` | select | 351 | [`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_class_tree_nm_allpath`, `f_get_deadline_nm` | `icr.Icr01_ClassTree.selectByCompanyId` |
| `selectByListIcrId` | select | 364 | [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `icr.Icr01_ClassTree.selectByListIcrId` |
| `selectByRelateIcrId` | select | 381 | [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_sysdate` | - |
| `selectByExcept` | select | 395 | [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `icr.Icr01_ClassTree.selectByExcept` |
| `refresh` | select | 439 | [`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate` | `icr.Icr01_ClassTree.refresh` |
| `getDownTreeId` | select | 474 | [`icr01_class_tree`](../../../db/tables/icr.md) |  | `icr.Icr01_ClassTree.deleteAll` |
| `selectByPeriod` | select | 509 | [`apr01_appr`](../../../db/tables/apr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_biz_date`, `f_get_deadline_nm`, `f_get_icr_nm`, `f_get_std_date` | `icr.Icr01_ClassTree.selectByPeriod` |
| `insertIcrDel` | insert | 582 | [`icr01_class_tree`](../../../db/tables/icr.md), [`icr99_class_tree_del`](../../../db/tables/icr.md) | `f_create_seq`, `f_sysdate` | `icr.Icr01_ClassTree.deleteAll` |
| `deleteByClassTreeId` | delete | 604 | [`icr01_class_tree`](../../../db/tables/icr.md) |  | `icr.Icr01_ClassTree.deleteAll` |
