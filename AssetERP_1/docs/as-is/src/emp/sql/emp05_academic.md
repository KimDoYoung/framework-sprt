# emp05_academic

`server/emp/mapper/emp05_academic.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectByPersonId` | select | 28 | [`emp01_person`](../../../db/tables/emp.md), [`emp05_academic`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp05_Academic.selectByPersonId` |
| `selectById` | select | 39 | [`emp01_person`](../../../db/tables/emp.md), [`emp05_academic`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | - |
