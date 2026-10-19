# emp09_evaluation

`server/emp/mapper/emp09_evaluation.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectByPersonId` | select | 22 | [`emp01_person`](../../../db/tables/emp.md), [`emp09_evaluation`](../../../db/tables/emp.md) |  | `emp.Emp09_Evaluation.selectByPersonId` |
| `selectById` | select | 31 | [`emp01_person`](../../../db/tables/emp.md), [`emp09_evaluation`](../../../db/tables/emp.md) |  | - |
