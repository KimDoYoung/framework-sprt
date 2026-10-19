# crm02_inspection

`server/crm/mapper/crm02_inspection.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`crm02_inspection`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `crm.Crm02_Inspection.selectById` |
| `selectByFindText` | select | 38 | [`crm02_inspection`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `crm.Crm02_Inspection.selectByFindText` |
