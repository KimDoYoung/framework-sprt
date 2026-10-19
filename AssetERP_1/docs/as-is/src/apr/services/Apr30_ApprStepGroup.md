# apr.Apr30_ApprStepGroup

`server/apr/Apr30_ApprStepGroup.java`

서비스 키 `apr.Apr30_ApprStepGroup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`apr30_appr_step_group.selectById`](../../apr/sql/apr30_appr_step_group.md) | - |  |
| `selectByCompanyId` | 21 | [`apr30_appr_step_group.selectByCompanyId`](../../apr/sql/apr30_appr_step_group.md) | `Apr30_Lookup_ApprStepGroup`, `Apr30_Tab_ApprStepGroup` |  |
| `update` | 26 | `UpdateDataModel(apr30_appr_step_group)` 동적 INSERT/UPDATE | `Apr30_Tab_ApprStepGroup` | `UpdateDataModel` |
| `delete` | 31 | `UpdateDataModel(apr30_appr_step_group)` 동적 DELETE | `Apr30_Tab_ApprStepGroup` | `UpdateDataModel` |
