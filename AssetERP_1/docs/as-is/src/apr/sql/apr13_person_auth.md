# apr13_person_auth

`server/apr/mapper/apr13_person_auth.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`apr13_person_auth`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) |  | `apr.Apr13_PersonAuth.selectById` |
| `selectByApprId` | select | 25 | [`apr13_person_auth`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) |  | `apr.Apr13_PersonAuth.selectByApprId` |
| `deleteByApprId` | delete | 35 | [`apr13_person_auth`](../../../db/tables/apr.md) |  | - |
