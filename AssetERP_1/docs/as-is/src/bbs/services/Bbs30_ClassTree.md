# bbs.Bbs30_ClassTree

`server/bbs/Bbs30_ClassTree.java`

서비스 키 `bbs.Bbs30_ClassTree.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`bbs30_class_tree.selectById`](../../bbs/sql/bbs30_class_tree.md) | - |  |
| `selectByCompanyId` | 24 | [`bbs30_class_tree.selectByCompanyId`](../../bbs/sql/bbs30_class_tree.md) | - |  |
| `selectByTypeCode` | 30 | [`bbs30_class_tree.selectByTypeCode`](../../bbs/sql/bbs30_class_tree.md) | `Bbs30_Lookup_ClassTree`, `Bbs30_Lookup_ParentTree` |  |
| `selectByUserTypeCode` | 41 | [`bbs30_class_tree.selectByUserTypeCode`](../../bbs/sql/bbs30_class_tree.md) | - |  |
| `selectByRoleUserTypeCode` | 52 | [`bbs30_class_tree.selectByRoleUserTypeCode`](../../bbs/sql/bbs30_class_tree.md) | `Bbs30_Tab_ClassTree` |  |
| `selectByParentTreeId` | 65 | [`bbs30_class_tree.selectByParentTreeId`](../../bbs/sql/bbs30_class_tree.md) | `Bbs30_Lookup_ClassTree` |  |
| `updateParentTreeId` | 77 | [`bbs30_class_tree.updateParentTreeId`](../../bbs/sql/bbs30_class_tree.md) | `Bbs30_Lookup_ParentTree` |  |
| `updatePublicYn` | 88 | [`bbs30_class_tree.updatePublicYn`](../../bbs/sql/bbs30_class_tree.md) | `Bbs33_Lookup_Role` |  |
| `update` | 99 | `UpdateDataModel(bbs30_class_tree)` 동적 INSERT/UPDATE | `Bbs30_Lookup_ClassTree` | `UpdateDataModel` |
| `delete` | 104 | `UpdateDataModel(bbs30_class_tree)` 동적 DELETE | `Bbs30_Lookup_ClassTree` | `UpdateDataModel` |
