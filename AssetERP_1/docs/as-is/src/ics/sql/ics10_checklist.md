# ics10_checklist

`server/ics/mapper/ics10_checklist.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 34 | [`ics10_checklist`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md) |  | `ics.Ics10_Checklist.selectById` |
| `selectBySearchText` | select | 67 | [`ics10_checklist`](../../../db/tables/ics.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sch22_write_group`](../../../db/tables/sch.md) |  | `ics.Ics10_Checklist.selectBySearchText`, `sys.Sys99_Print.insertRdCheckList` |
| `selectByAdmin` | select | 115 | [`ics10_checklist`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md) |  | `ics.Ics10_Checklist.selectByAdmin` |
| `selectByPersonId` | select | 149 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`ics10_checklist`](../../../db/tables/ics.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md) |  | `ics.Ics10_Checklist.selectByPersonId` |
| `updateUseYn` | update | 227 | [`ics10_checklist`](../../../db/tables/ics.md) |  | `ics.Ics11_ChecklistCompany.updateUseYn` |
| `excelInsert` | insert | 234 | [`ics10_checklist`](../../../db/tables/ics.md) |  | - |
