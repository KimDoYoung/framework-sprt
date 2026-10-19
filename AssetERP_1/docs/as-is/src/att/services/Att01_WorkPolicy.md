# att.Att01_WorkPolicy

`server/att/Att01_WorkPolicy.java`

서비스 키 `att.Att01_WorkPolicy.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`att01_work_policy.selectById`](../../att/sql/att01_work_policy.md) | - |  |
| `selectByCompanyId` | 25 | [`att01_work_policy.selectByCompanyId`](../../att/sql/att01_work_policy.md) | `Att01_Lookup_WorkPolicy` |  |
| `notWorkPolicyIdList` | 34 | [`att01_work_policy.notWorkPolicyIdList`](../../att/sql/att01_work_policy.md) | `Att01_Lookup_WorkPolicy` |  |
| `getModel` | 46 | [`att01_work_policy.getModel`](../../att/sql/att01_work_policy.md) | `Att02_Edit_CommuteBatch`, `Att02_Lookup_Commute`, `Att03_Lookup_OvertimeReq` |  |
| `update` | 57 | `UpdateDataModel(att01_work_policy)` 동적 INSERT/UPDATE | `Att01_Lookup_WorkPolicy` | `UpdateDataModel` |
| `delete` | 62 | `UpdateDataModel(att01_work_policy)` 동적 DELETE | `Att01_Lookup_WorkPolicy` | `UpdateDataModel` |
