# ics.Ics01_ClassTree

`server/ics/Ics01_ClassTree.java`

서비스 키 `ics.Ics01_ClassTree.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`ics01_class_tree.selectById`](../../ics/sql/ics01_class_tree.md) | `Ics01_Lookup_ClassTreeDetail`, `Ics01_Lookup_Info`, `Ics01_Lookup_SelectParent`, `Sch04_Lookup_IcsList`, `Tdm45_Lookup_RelateIcs` |  |
| `selectByCompanyId` | 28 | [`ics01_class_tree.selectByCompanyId`](../../ics/sql/ics01_class_tree.md) | `Ics01_Lookup_SelectParent`, `Ics01_Move_Grid`, `Ics01_Move_TreeGrid`, `Ics01_Tab_ApprList`, `Ics01_Tab_ClassTree`, `Sch05_Lookup_IcsClass_backup` | `TreeUtil` |
| `selectByClassTreeId` | 43 | [`ics01_class_tree.selectByClassTreeId`](../../ics/sql/ics01_class_tree.md) | `Ics01_Grid_IcsType`, `Ics01_Move_IcsClass`, `Sch05_Lookup_IcsClass_backup` |  |
| `selectByTypeCode` | 76 | [`ics01_class_tree.selectByTypeCode`](../../ics/sql/ics01_class_tree.md) | - |  |
| `selectByTypeCodePaging` | 96 | [`ics01_class_tree.selectByTypeCodePaging`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.selectByTypeCodePagingTotal`](../../ics/sql/ics01_class_tree.md) | `Ics01_Lookup_SelectMulti`, `Ics01_Tab_ClassTreeUser`, `Ics01_Tab_ClassTreeUserView`, `Sch05_Lookup_IcsClass` |  |
| `selectByParentTreeId` | 131 | [`ics01_class_tree.selectByParentTreeId`](../../ics/sql/ics01_class_tree.md) | `Ics01_Lookup_CheckList`, `IcsComboBoxField` |  |
| `selectByClassTreeCode` | 147 | [`ics01_class_tree.selectByClassTreeCode`](../../ics/sql/ics01_class_tree.md) | `Icam01_Tab_DataInfo` |  |
| `selectByAll` | 153 | [`ics01_class_tree.selectByAll`](../../ics/sql/ics01_class_tree.md) | `Ics01_Lookup_CheckList` |  |
| `selectByExcept` | 163 | [`ics01_class_tree.selectByExcept`](../../ics/sql/ics01_class_tree.md) | `Ics01_Lookup_Except` |  |
| `selectByText` | 186 | [`ics01_class_tree.selectByText`](../../ics/sql/ics01_class_tree.md) | - |  |
| `selectByTextTreeDown` | 196 | [`ics01_class_tree.selectByTextTreeDown`](../../ics/sql/ics01_class_tree.md) | - |  |
| `selectByListIcsId` | 206 | [`ics01_class_tree.selectByListIcsId`](../../ics/sql/ics01_class_tree.md) | `Ics01_Lookup_SelectMulti` |  |
| `selectByPeriod` | 216 | [`ics01_class_tree.selectByPeriod`](../../ics/sql/ics01_class_tree.md) | `Ics01_Tab_PeriodList` |  |
| `refresh` | 264 | [`ics01_class_tree.refresh`](../../ics/sql/ics01_class_tree.md) | `Ics01_Grid_IcsType`, `Ics01_Tab_ClassTreeUser` |  |
| `deleteAll` | 275 | [`ics01_class_tree.deleteByClassTreeId`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.getDownTreeId`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.insertIcsDel`](../../ics/sql/ics01_class_tree.md) | `Ics01_Edit_ClassTree` |  |
| `dcrUpdate` | 298 | `UpdateDataModel(dcr01_class_tree)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `modelUpdate` | 309 | `UpdateDataModel(ics01_class_tree)` 동적 INSERT/UPDATE | `Ics01_Lookup_Content` | `UpdateDataModel` |
| `update` | 317 | `UpdateDataModel(ics01_class_tree)` 동적 INSERT/UPDATE | `Ics01_Edit_ClassTree`, `Ics01_Grid_IcsType`, `Ics01_Move_Grid`, `Ics01_Move_TreeGrid` | `UpdateDataModel` |
| `delete` | 322 | `UpdateDataModel(ics01_class_tree)` 동적 DELETE | `Ics01_Edit_ClassTree`, `Ics01_Grid_IcsType` | `UpdateDataModel` |
