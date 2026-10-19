# ics.Ics05_RelateManager

`server/ics/Ics05_RelateManager.java`

서비스 키 `ics.Ics05_RelateManager.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`ics05_relate_manager.selectById`](../../ics/sql/ics05_relate_manager.md) | - |  |
| `selectByClassTreeId` | 28 | [`ics05_relate_manager.selectByClassTreeId`](../../ics/sql/ics05_relate_manager.md) | `Ics01_Lookup_Share` |  |
| `relateUpdate` | 37 | [`ics01_class_tree.refresh`](../../ics/sql/ics01_class_tree.md), [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`ics05_relate_manager.delete`](../../ics/sql/ics05_relate_manager.md), [`ics05_relate_manager.insert`](../../ics/sql/ics05_relate_manager.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) | `Ics01_Lookup_Share`, `Ics02_Lookup_ManagerGroup` |  |
| `updateList` | 81 | [`ics01_class_tree.selectByParentId1Bang`](../../ics/sql/ics01_class_tree.md), [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`ics05_relate_manager.delete`](../../ics/sql/ics05_relate_manager.md), [`ics05_relate_manager.insert`](../../ics/sql/ics05_relate_manager.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) | `Ics02_Lookup_ManagerGroup` |  |
| `update` | 118 | `UpdateDataModel(ics05_relate_manager)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 123 | `UpdateDataModel(ics05_relate_manager)` 동적 DELETE | - | `UpdateDataModel` |
