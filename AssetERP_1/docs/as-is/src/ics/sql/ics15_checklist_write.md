# ics15_checklist_write

`server/ics/mapper/ics15_checklist_write.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 32 | [`ics15_checklist_write`](../../../db/tables/ics.md) |  | `ics.Ics15_ChecklistWrite.selectById` |
| `selectByPersonId` | select | 39 | [`ics15_checklist_write`](../../../db/tables/ics.md) |  | `ics.Ics15_ChecklistWrite.updateAnswerCode`, `ics.Ics15_ChecklistWrite.updateConfirmYn` |
| `selectWrite` | select | 49 | [`ics15_checklist_write`](../../../db/tables/ics.md) |  | `ics.Ics15_ChecklistWrite.deleteByPersonId` |
| `deleteChecklistIdCheck` | select | 58 | [`ics15_checklist_write`](../../../db/tables/ics.md) |  | `ics.Ics10_Checklist.preDelete` |
| `deleteLClassIdCheck` | select | 65 | [`ics10_checklist`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md) |  | `ics.Ics21_ChecklistLClass.deleteCheck` |
| `deleteMClassIdCheck` | select | 78 | [`ics10_checklist`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md) |  | `ics.Ics23_ChecklistMClass.deleteCheck` |
| `updateAnswerCode` | update | 87 | [`ics15_checklist_write`](../../../db/tables/ics.md) |  | `ics.Ics15_ChecklistWrite.updateAnswerCode` |
| `updateFixYn` | update | 93 | [`ics15_checklist_write`](../../../db/tables/ics.md) |  | `ics.Ics15_ChecklistWrite.updateFixYn` |
| `updateConfirmYn` | update | 99 | [`ics15_checklist_write`](../../../db/tables/ics.md) |  | `ics.Ics15_ChecklistWrite.updateConfirmYn` |
