# ics21_checklist_l_class

`server/ics/mapper/ics21_checklist_l_class.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`ics21_checklist_l_class`](../../../db/tables/ics.md) |  | `ics.Ics21_ChecklistLClass.selectById` |
| `selectByCompanyId` | select | 22 | [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md) |  | `ics.Ics21_ChecklistLClass.selectByCompanyId` |
| `selectByClassName` | select | 41 | [`ics21_checklist_l_class`](../../../db/tables/ics.md) |  | - |
