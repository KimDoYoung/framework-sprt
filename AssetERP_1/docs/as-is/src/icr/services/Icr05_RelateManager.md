# icr.Icr05_RelateManager

`server/icr/Icr05_RelateManager.java`

서비스 키 `icr.Icr05_RelateManager.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`icr05_relate_manager.selectById`](../../icr/sql/icr05_relate_manager.md) | - |  |
| `selectByClassTreeId` | 27 | [`icr05_relate_manager.selectByClassTreeId`](../../icr/sql/icr05_relate_manager.md) | `Icr01_Lookup_Share` |  |
| `relateUpdate` | 36 | [`icr05_relate_manager.delete`](../../icr/sql/icr05_relate_manager.md), [`icr05_relate_manager.insert`](../../icr/sql/icr05_relate_manager.md), [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) | `Icr01_Lookup_Share` |  |
| `updateList` | 65 | [`icr01_class_tree.selectByParentId1Bang`](../../icr/sql/icr01_class_tree.md), [`icr05_relate_manager.delete`](../../icr/sql/icr05_relate_manager.md), [`icr05_relate_manager.insert`](../../icr/sql/icr05_relate_manager.md), [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) | - |  |
| `update` | 102 | `UpdateDataModel(icr05_relate_manager)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 107 | `UpdateDataModel(icr05_relate_manager)` 동적 DELETE | - | `UpdateDataModel` |
