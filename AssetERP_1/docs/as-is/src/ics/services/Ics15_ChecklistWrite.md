# ics.Ics15_ChecklistWrite

`server/ics/Ics15_ChecklistWrite.java`

서비스 키 `ics.Ics15_ChecklistWrite.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`ics15_checklist_write.selectById`](../../ics/sql/ics15_checklist_write.md) | `Ics15_Tab_ChecklistWrite` |  |
| `updateAnswerCode` | 29 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics15_checklist_write.selectByPersonId`](../../ics/sql/ics15_checklist_write.md), [`ics15_checklist_write.updateAnswerCode`](../../ics/sql/ics15_checklist_write.md), `UpdateDataModel(ics15_checklist_write)` 동적 INSERT/UPDATE | `Ics15_Tab_ChecklistWrite` | `UpdateDataModel` |
| `updateConfirmYn` | 79 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics15_checklist_write.selectByPersonId`](../../ics/sql/ics15_checklist_write.md), [`ics15_checklist_write.updateConfirmYn`](../../ics/sql/ics15_checklist_write.md), `UpdateDataModel(ics15_checklist_write)` 동적 INSERT/UPDATE | `Ics15_Tab_ChecklistConfirm` | `UpdateDataModel` |
| `modelUpdate` | 137 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics15_checklist_write)` 동적 INSERT/UPDATE | `Ics15_Edit_Reason`, `Ics15_Tab_ChecklistWrite` | `UpdateDataModel` |
| `updateFixYn` | 150 | [`ics15_checklist_write.updateFixYn`](../../ics/sql/ics15_checklist_write.md) | `Ics15_Tab_ChecklistWrite` |  |
| `deleteByPersonId` | 166 | [`ics15_checklist_write.selectWrite`](../../ics/sql/ics15_checklist_write.md), `UpdateDataModel(ics15_checklist_write)` 동적 DELETE | `Ics15_Tab_ChecklistWrite` | `UpdateDataModel` |
| `update` | 187 | `UpdateDataModel(ics15_checklist_write)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 192 | `UpdateDataModel(ics15_checklist_write)` 동적 DELETE | - | `UpdateDataModel` |
