# att01_work_policy

`server/att/mapper/att01_work_policy.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`att01_work_policy`](../../../db/tables/att.md) |  | `att.Att01_WorkPolicy.selectById` |
| `selectByCompanyId` | select | 30 | [`att01_work_policy`](../../../db/tables/att.md) |  | `att.Att01_WorkPolicy.selectByCompanyId` |
| `notWorkPolicyIdList` | select | 37 | [`att01_work_policy`](../../../db/tables/att.md) |  | `att.Att01_WorkPolicy.notWorkPolicyIdList` |
| `getModel` | select | 51 | [`att01_work_policy`](../../../db/tables/att.md) |  | `att.Att01_WorkPolicy.getModel` |
