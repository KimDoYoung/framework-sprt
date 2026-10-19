# icr.Icr01_ClassTree

`server/icr/Icr01_ClassTree.java`

서비스 키 `icr.Icr01_ClassTree.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) | `Icr01_Lookup_ClassTreeDetail`, `Icr01_Lookup_SelectParent`, `Sch04_Lookup_IcrList`, `Tdm46_Lookup_RelateIcr` |  |
| `selectByCompanyId` | 28 | [`icr01_class_tree.selectByCompanyId`](../../icr/sql/icr01_class_tree.md) | `Icr01_Lookup_SelectParent`, `Icr01_Move_Grid`, `Icr01_Move_TreeGrid`, `Icr01_Tab_ClassTree` | `TreeUtil` |
| `selectByClassTreeId` | 43 | [`icr01_class_tree.selectByClassTreeId`](../../icr/sql/icr01_class_tree.md) | `Icr01_Grid_IcrType` |  |
| `selectByTypeCode` | 65 | [`icr01_class_tree.selectByTypeCode`](../../icr/sql/icr01_class_tree.md) | - |  |
| `selectByTypeCodePaging` | 85 | [`icr01_class_tree.selectByTypeCodePaging`](../../icr/sql/icr01_class_tree.md), [`icr01_class_tree.selectByTypeCodePagingTotal`](../../icr/sql/icr01_class_tree.md) | `Icr01_Lookup_SelectMulti`, `Icr01_Tab_ClassTreeView` |  |
| `selectByParentTreeId` | 112 | [`icr01_class_tree.selectByParentTreeId`](../../icr/sql/icr01_class_tree.md) | `IcrComboBoxField` |  |
| `selectByClassTreeCode` | 128 | [`icr01_class_tree.selectByClassTreeCode`](../../icr/sql/icr01_class_tree.md) | - |  |
| `selectByAll` | 134 | [`icr01_class_tree.selectByAll`](../../icr/sql/icr01_class_tree.md) | - |  |
| `selectByExcept` | 144 | [`icr01_class_tree.selectByExcept`](../../icr/sql/icr01_class_tree.md) | - |  |
| `selectByText` | 166 | [`icr01_class_tree.selectByText`](../../icr/sql/icr01_class_tree.md) | - |  |
| `selectByTextTreeDown` | 176 | [`icr01_class_tree.selectByTextTreeDown`](../../icr/sql/icr01_class_tree.md) | - |  |
| `selectByListIcrId` | 186 | [`icr01_class_tree.selectByListIcrId`](../../icr/sql/icr01_class_tree.md) | `Icr01_Lookup_SelectMulti` |  |
| `selectByPeriod` | 196 | [`icr01_class_tree.selectByPeriod`](../../icr/sql/icr01_class_tree.md) | - |  |
| `refresh` | 242 | [`icr01_class_tree.refresh`](../../icr/sql/icr01_class_tree.md) | `Icr01_Grid_IcrType`, `Icr01_Tab_ClassTreeView` |  |
| `deleteAll` | 253 | [`icr01_class_tree.deleteByClassTreeId`](../../icr/sql/icr01_class_tree.md), [`icr01_class_tree.getDownTreeId`](../../icr/sql/icr01_class_tree.md), [`icr01_class_tree.insertIcrDel`](../../icr/sql/icr01_class_tree.md) | `Icr01_Edit_ClassTree` |  |
| `dcrUpdate` | 276 | `UpdateDataModel(dcr01_class_tree)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `modelUpdate` | 287 | `UpdateDataModel(icr01_class_tree)` 동적 INSERT/UPDATE | `Icr01_Lookup_Content` | `UpdateDataModel` |
| `update` | 295 | `UpdateDataModel(icr01_class_tree)` 동적 INSERT/UPDATE | `Icr01_Edit_ClassTree`, `Icr01_Grid_IcrType`, `Icr01_Move_Grid`, `Icr01_Move_TreeGrid` | `UpdateDataModel` |
| `delete` | 300 | `UpdateDataModel(icr01_class_tree)` 동적 DELETE | `Icr01_Edit_ClassTree`, `Icr01_Grid_IcrType` | `UpdateDataModel` |
