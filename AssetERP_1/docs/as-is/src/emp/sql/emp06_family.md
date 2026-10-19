# emp06_family

`server/emp/mapper/emp06_family.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectByPersonId` | select | 29 | [`emp01_person`](../../../db/tables/emp.md), [`emp06_family`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp06_Family.selectByPersonId` |
| `selectById` | select | 41 | [`emp01_person`](../../../db/tables/emp.md), [`emp06_family`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | - |
