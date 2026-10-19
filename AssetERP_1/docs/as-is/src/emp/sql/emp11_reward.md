# emp11_reward

`server/emp/mapper/emp11_reward.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`emp01_person`](../../../db/tables/emp.md), [`emp11_reward`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | - |
| `selectByPersonId` | select | 39 | [`emp01_person`](../../../db/tables/emp.md), [`emp11_reward`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp11_Reward.selectByPersonId` |
| `selectByHistory` | select | 49 | [`emp01_person`](../../../db/tables/emp.md), [`emp11_reward`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp11_Reward.selectByHistory`, `sys.Sys99_Print.insertRdEmp11History` |
