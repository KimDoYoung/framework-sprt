# ics23_checklist_m_class

`server/ics/mapper/ics23_checklist_m_class.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`ics23_checklist_m_class`](../../../db/tables/ics.md) |  | `ics.Ics23_ChecklistMClass.selectById` |
| `selectByCompanyId` | select | 23 | [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md) |  | `ics.Ics23_ChecklistMClass.selectByCompanyId` |
| `selectByClassName` | select | 44 | [`ics23_checklist_m_class`](../../../db/tables/ics.md) |  | - |
