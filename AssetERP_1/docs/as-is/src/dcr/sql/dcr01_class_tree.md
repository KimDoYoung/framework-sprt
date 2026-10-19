# dcr01_class_tree

`server/dcr/mapper/dcr01_class_tree.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 50 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `apr.Apr01_Appr.update`, `apr.Apr04_ApprStep.confirmUpdate`, `apr.Apr04_ApprStep.updateList`, `dcr.Dcr01_ClassTree.selectById`, `dcr.Dcr01_ClassTree.updateCheck`, `fnd.Fnd20_Plan.insertAppr`, `opr.Opr01_Create.insertAppr`, `pln.Pln02_Plan.insertAppr`, `sch.Sch04_List.insertAppr` |
| `selectByText` | select | 72 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr01_ClassTree.selectByText` |
| `dcr_down_with_codeId` | sql | 101 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  |  |
| `selectByClasssTreeId` | select | 186 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `org.Org01_Code.updateDcrAuth` |
| `selectByParentId` | select | 207 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByClassTreeId` |
| `selectByParentId1Bang_postgresql` | sql | 259 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` |  |
| `selectByParentId1Bang_tibero` | sql | 285 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` |  |
| `selectByParentId1Bang` | select | 312 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByCompanyId` |
| `selectByAll` | select | 328 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByAll` |
| `selectByAllWithStampAuth` | select | 387 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByAllWithStampAuth` |
| `selectByParentIdResrchYn` | select | 461 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByParentIdResrchYn` |
| `selectByParentIdRole_1Bang` | select | 483 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByCompanyIdRole` |
| `selectByOrgIdRole_1Bang` | select | 539 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByOrgIdRole` |
| `selectByOrgIdRoleWrite_1Bang` | select | 574 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByOrgIdRoleWrite` |
| `selectByClassTreeId` | select | 606 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_sysdate`, `f_to_number` | - |
| `selectByOrgCodeId` | select | 624 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) |  | - |
| `selectByOrgCodeId_1Bang` | select | 634 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) |  | `dcr.Dcr03_OrgAuth.selectByOrgCodeId`, `org.Org01_Code.copyDcrRight` |
| `selectByDcrTreeId` | select | 669 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | - |
| `selectByDcrDown1Bang_postgresql` | sql | 689 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` |  |
| `selectByDcrDown1Bang_tibero` | sql | 712 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` |  |
| `selectByDcrDown1Bang` | select | 739 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByDcrTreeId` |
| `selectByIcsParentId_postgresql` | sql | 755 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` |  |
| `selectByIcsParentId_tibero` | sql | 777 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` |  |
| `selectByIcsParentId` | select | 803 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByIcsCompanyId` |
| `selectByLinkCode` | select | 819 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr30_Link.selectByLinkCode` |
| `selectByCompanyId` | select | 832 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.commentInsert` |
| `selectByClassTreeCode` | select | 838 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.updateCheck` |
| `selectByOrgCodeId1Bang` | select | 845 | [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr01_ClassTree.selectByOrgCodeId` |
| `apprCheck` | select | 873 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.deleteCheck` |
| `linkCheck` | select | 909 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.deleteCheck` |
| `getDownTreeId` | select | 945 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.deleteAll` |
| `dupClassTreeCode` | select | 980 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.dupClassTreeCode` |
| `getClassTree` | select | 987 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr20_RelateIcs.delete`, `dcr.Dcr20_RelateIcs.update`, `dcr.Dcr21_RelateIcr.delete`, `dcr.Dcr21_RelateIcr.update` |
| `getAdminYn` | select | 994 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr20_RelateIcs.delete`, `dcr.Dcr20_RelateIcs.update`, `dcr.Dcr21_RelateIcr.delete`, `dcr.Dcr21_RelateIcr.update` |
| `selectAdminDcrClassTree` | select | 1003 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.insertAdminCopy` |
| `selectByInsertBakDcrId` | select | 1032 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.insertAdminCopy` |
| `insertAdminDcrClassTree` | insert | 1039 | [`dcr01_class_tree`](../../../db/tables/dcr.md) | `f_create_seq` | `dcr.Dcr01_ClassTree.insertAdminCopy` |
| `updateAdminDcrClassTree` | update | 1070 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.insertAdminCopy` |
| `commentInsert` | update | 1087 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.commentInsert` |
| `insertDcrDel` | insert | 1094 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr99_class_tree_del`](../../../db/tables/dcr.md) | `f_create_seq`, `f_sysdate` | `dcr.Dcr01_ClassTree.delete`, `dcr.Dcr01_ClassTree.deleteAll` |
| `deleteByClassTreeId` | delete | 1124 | [`dcr01_class_tree`](../../../db/tables/dcr.md) |  | `dcr.Dcr01_ClassTree.deleteAll` |
| `importDcr01FromDcr99` | insert | 1130 | - | `dcr01_import_from_dcr99` | - |
| `importDcr01FromAdmin` | insert | 1136 | - | `dcr01_import_from_admin` | - |
