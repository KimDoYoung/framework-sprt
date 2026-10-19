# apr.Apr31_ApprStepGroupMember

`server/apr/Apr31_ApprStepGroupMember.java`

서비스 키 `apr.Apr31_ApprStepGroupMember.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`apr31_appr_step_group_member.selectById`](../../apr/sql/apr31_appr_step_group_member.md) | - |  |
| `selectByApprStepGroupId` | 21 | [`apr31_appr_step_group_member.selectByApprStepGroupId`](../../apr/sql/apr31_appr_step_group_member.md) | `Apr31_Page_ApprStepGroupMember` |  |
| `update` | 26 | `UpdateDataModel(apr31_appr_step_group_member)` 동적 INSERT/UPDATE | `Apr31_Page_ApprStepGroupMember` | `UpdateDataModel` |
| `delete` | 31 | `UpdateDataModel(apr31_appr_step_group_member)` 동적 DELETE | `Apr31_Page_ApprStepGroupMember` | `UpdateDataModel` |
