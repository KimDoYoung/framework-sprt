# sch.Sch21_ChecklistContent

`server/sch/Sch21_ChecklistContent.java`

서비스 키 `sch.Sch21_ChecklistContent.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`sch21_checklist_content.selectById`](../../sch/sql/sch21_checklist_content.md) | - |  |
| `selectBySearchText` | 26 | [`sch21_checklist_content.selectBySearchText`](../../sch/sql/sch21_checklist_content.md) | `Sch21_Page_AddChecklistContent` |  |
| `selectByWriteGroupId` | 36 | [`sch21_checklist_content.selectByWriteGroupId`](../../sch/sql/sch21_checklist_content.md) | - |  |
| `update` | 44 | `UpdateDataModel(sch21_checklist_content)` 동적 INSERT/UPDATE | `Sch21_Edit_ChecklistContent` | `UpdateDataModel` |
| `delete` | 52 | `UpdateDataModel(sch21_checklist_content)` 동적 DELETE | `Sch21_Page_AddChecklistContent` | `UpdateDataModel` |
