# dcr.Dcr01_ClassTree

`server/dcr/Dcr01_ClassTree.java`

서비스 키 `dcr.Dcr01_ClassTree.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 27 | [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md) | `Biz14_Lookup_RelateAppr`, `Dcr01_Lookup_Class`, `Dcr01_Tab_DcrWrite` |  |
| `selectByText` | 40 | [`dcr01_class_tree.selectByText`](../../dcr/sql/dcr01_class_tree.md) | `Dcr00_TabPage_GridFundPlan`, `Dcr01_Lookup_SelectMulti` |  |
| `selectByCompanyId` | 50 | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) | `Dcr00_TabPage_TreeFundPlan`, `Dcr01_Lookup_DcrClass`, `Dcr01_Lookup_DcrCopyAdmin`, `Dcr01_Move_DcrClass`, `Dcr01_Move_Grid`, `Dcr01_Move_TreeGrid`, `Dcr01_Tab_ClassTree`, `Dcr01_Tab_DcrClassModify`, `Dcr01_Tab_DcrManager`, `Dcr03_Tab_DcrAuth`, `Dcr04_Tab_EmpAuth`, `Dcr30_Move_DcrClass`, `Fbx01_Tab_Document`, `Pln00_Lookup_ClassTree`, `Sch04_Lookup_DcrClass` | `TreeUtil` |
| `selectByOrgCodeId` | 61 | [`dcr01_class_tree.selectByOrgCodeId1Bang`](../../dcr/sql/dcr01_class_tree.md) | `Dcr04_Tab_EmpAuth` | `TreeUtil` |
| `selectByAll` | 73 | [`dcr01_class_tree.selectByAll`](../../dcr/sql/dcr01_class_tree.md) | `Dcr01_Lookup_UseYn` | `TreeUtil` |
| `selectByAllWithStampAuth` | 84 | [`dcr01_class_tree.selectByAllWithStampAuth`](../../dcr/sql/dcr01_class_tree.md) | `Dcr40_Lookup_StampAuth` | `TreeUtil` |
| `selectByIcsCompanyId` | 96 | [`dcr01_class_tree.selectByIcsParentId`](../../dcr/sql/dcr01_class_tree.md) | `Ics01_Move_IcsClass` | `TreeUtil` |
| `selectByParentIdResrchYn` | 107 | [`dcr01_class_tree.selectByParentIdResrchYn`](../../dcr/sql/dcr01_class_tree.md) | `Dcr01_Lookup_ClassTree` |  |
| `selectByCompanyIdRole` | 156 | [`dcr01_class_tree.selectByParentIdRole_1Bang`](../../dcr/sql/dcr01_class_tree.md) | `Apr05_Lookup_LoadDoc`, `Apr05_Lookup_RelateDoc`, `Dcr01_Lookup_DcrClass` | `TreeUtil` |
| `selectByOrgIdRole` | 172 | [`dcr01_class_tree.selectByOrgIdRole_1Bang`](../../dcr/sql/dcr01_class_tree.md) | - | `TreeUtil` |
| `selectByOrgIdRoleWrite` | 190 | [`dcr01_class_tree.selectByOrgIdRoleWrite_1Bang`](../../dcr/sql/dcr01_class_tree.md) | `Dcr01_Tab_DcrUser` | `TreeUtil` |
| `selectByClassTreeId` | 202 | [`dcr01_class_tree.selectByParentId`](../../dcr/sql/dcr01_class_tree.md) | `Dcr00_Tab_TreeFundPlan`, `Dcr01_Grid_DocType`, `Pln00_Grid_ClassTree` |  |
| `selectByBondId` | 226 | `dcr01_class_tree.selectByBondId`(없음) | - |  |
| `selectByDcrTreeId` | 261 | [`dcr01_class_tree.selectByDcrDown1Bang`](../../dcr/sql/dcr01_class_tree.md) | `Fbx01_Tab_BoxDocument` | `TreeUtil` |
| `commentInsert` | 273 | [`dcr01_class_tree.commentInsert`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.selectByCompanyId`](../../dcr/sql/dcr01_class_tree.md) | `Sys01_Tab_Company` |  |
| `updateCheck` | 288 | [`dcr01_class_tree.selectByClassTreeCode`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md) | `Dcr01_Edit_ClassTree`, `Dcr01_Grid_DocType` |  |
| `dupClassTreeCode` | 342 | [`dcr01_class_tree.dupClassTreeCode`](../../dcr/sql/dcr01_class_tree.md) | - |  |
| `insertAdminCopy` | 349 | [`dcr01_class_tree.insertAdminDcrClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.selectAdminDcrClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.selectByInsertBakDcrId`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.updateAdminDcrClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr20_relate_ics.deleteByInsertBakDcrId`](../../dcr/sql/dcr20_relate_ics.md), [`dcr20_relate_ics.insertByInsertBakDcrId`](../../dcr/sql/dcr20_relate_ics.md) | `Dcr01_Lookup_DcrCopyAdmin` |  |
| `update` | 410 | `UpdateDataModel(dcr01_class_tree)` 동적 INSERT/UPDATE | `Dcr01_Edit_ClassTree`, `Dcr01_Grid_DocType`, `Dcr01_Lookup_UseYn`, `Dcr01_Move_Grid`, `Dcr01_Move_TreeGrid` | `UpdateDataModel` |
| `deleteCheck` | 415 | [`dcr01_class_tree.apprCheck`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.linkCheck`](../../dcr/sql/dcr01_class_tree.md) | `Dcr01_Edit_ClassTree`, `Dcr01_Grid_DocType` |  |
| `deleteAll` | 452 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectByClassTreeId`](../../apr/sql/apr01_appr.md), [`dcr01_class_tree.deleteByClassTreeId`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getDownTreeId`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.insertDcrDel`](../../dcr/sql/dcr01_class_tree.md) | `Dcr01_Edit_ClassTree`, `Dcr01_Grid_DocType` |  |
| `delete` | 482 | [`dcr01_class_tree.insertDcrDel`](../../dcr/sql/dcr01_class_tree.md), `UpdateDataModel(dcr01_class_tree)` 동적 DELETE | - | `UpdateDataModel` |
