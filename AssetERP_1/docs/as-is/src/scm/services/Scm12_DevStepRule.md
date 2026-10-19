# scm.Scm12_DevStepRule

`server/scm/Scm12_DevStepRule.java`

서비스 키 `scm.Scm12_DevStepRule.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`scm12_dev_step_rule.selectById`](../../scm/sql/scm12_dev_step_rule.md) | - |  |
| `getList` | 21 | [`scm12_dev_step_rule.getList`](../../scm/sql/scm12_dev_step_rule.md) | `Scm12_Lookup_DevStepRule` |  |
| `updateList` | 26 | `UpdateDataModel(scm12_dev_step_rule)` 동적 INSERT/UPDATE | `Scm12_Lookup_DevStepRule` | `UpdateDataModel` |
| `update` | 32 | `UpdateDataModel(scm12_dev_step_rule)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 37 | `UpdateDataModel(scm12_dev_step_rule)` 동적 DELETE | `Scm12_Lookup_DevStepRule` | `UpdateDataModel` |
