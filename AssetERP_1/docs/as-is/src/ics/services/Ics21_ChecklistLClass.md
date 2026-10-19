# ics.Ics21_ChecklistLClass

`server/ics/Ics21_ChecklistLClass.java`

서비스 키 `ics.Ics21_ChecklistLClass.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`ics21_checklist_l_class.selectById`](../../ics/sql/ics21_checklist_l_class.md) | - |  |
| `selectByCompanyId` | 27 | [`ics21_checklist_l_class.selectByCompanyId`](../../ics/sql/ics21_checklist_l_class.md) | `Ics21_Lookup_CheckList` |  |
| `deleteCheck` | 33 | [`ics15_checklist_write.deleteLClassIdCheck`](../../ics/sql/ics15_checklist_write.md) | `Ics21_Lookup_CheckList` |  |
| `update` | 82 | [`ics22_checklist_l_class_company.insertUpdate`](../../ics/sql/ics22_checklist_l_class_company.md), `UpdateDataModel(ics21_checklist_l_class)` 동적 INSERT/UPDATE, `UpdateDataModel(ics21_checklist_l_class)` 동적 INSERT/UPDATE | `Ics21_Lookup_CheckList` | `UpdateDataModel` |
| `delete` | 121 | `UpdateDataModel(ics21_checklist_l_class)` 동적 DELETE | `Ics21_Lookup_CheckList` | `UpdateDataModel` |
