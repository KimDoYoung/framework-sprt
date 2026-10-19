# ics24_checklist_m_class_company

`server/ics/mapper/ics24_checklist_m_class_company.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`ics24_checklist_m_class_company`](../../../db/tables/ics.md) |  | `ics.Ics24_ChecklistMClassCompany.selectById` |
| `insertUpdate` | insert | 21 | [`ics24_checklist_m_class_company`](../../../db/tables/ics.md) | `f_create_seq` | `ics.Ics23_ChecklistMClass.update` |
