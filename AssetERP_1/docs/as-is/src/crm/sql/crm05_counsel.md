# crm05_counsel

`server/crm/mapper/crm05_counsel.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 32 | [`crm05_counsel`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `crm.Crm05_Counsel.selectById` |
| `selectByFindText` | select | 43 | [`crm05_counsel`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `crm.Crm05_Counsel.selectByFindText` |
