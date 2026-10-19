# ics.Ics23_ChecklistMClass

`server/ics/Ics23_ChecklistMClass.java`

서비스 키 `ics.Ics23_ChecklistMClass.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`ics23_checklist_m_class.selectById`](../../ics/sql/ics23_checklist_m_class.md) | - |  |
| `selectByCompanyId` | 27 | [`ics23_checklist_m_class.selectByCompanyId`](../../ics/sql/ics23_checklist_m_class.md) | `Ics23_TabPage_CheckList` |  |
| `deleteCheck` | 38 | [`ics15_checklist_write.deleteMClassIdCheck`](../../ics/sql/ics15_checklist_write.md) | `Ics23_TabPage_CheckList` |  |
| `update` | 64 | [`ics24_checklist_m_class_company.insertUpdate`](../../ics/sql/ics24_checklist_m_class_company.md), `UpdateDataModel(ics23_checklist_m_class)` 동적 INSERT/UPDATE, `UpdateDataModel(ics23_checklist_m_class)` 동적 INSERT/UPDATE | `Ics23_TabPage_CheckList` | `UpdateDataModel` |
| `delete` | 98 | `UpdateDataModel(ics23_checklist_m_class)` 동적 DELETE | `Ics23_TabPage_CheckList` | `UpdateDataModel` |
