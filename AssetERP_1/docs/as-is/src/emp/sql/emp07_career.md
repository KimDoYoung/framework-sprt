# emp07_career

`server/emp/mapper/emp07_career.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 30 | [`emp01_person`](../../../db/tables/emp.md), [`emp07_career`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | - |
| `selectByPersonId` | select | 40 | [`emp01_person`](../../../db/tables/emp.md), [`emp07_career`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp07_Career.selectByPersonId` |
