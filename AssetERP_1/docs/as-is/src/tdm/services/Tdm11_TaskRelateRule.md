# tdm.Tdm11_TaskRelateRule

`server/tdm/Tdm11_TaskRelateRule.java`

서비스 키 `tdm.Tdm11_TaskRelateRule.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm11_task_relate_rule.selectById`](../../tdm/sql/tdm11_task_relate_rule.md) | - |  |
| `selectBySearchText` | 25 | [`tdm11_task_relate_rule.selectBySearchText`](../../tdm/sql/tdm11_task_relate_rule.md) | `Tdm11_Lookup_TaskRelateRule` |  |
| `selectByTaskId` | 30 | `tdm11_task_relate_rule.selectByTaskId`(없음) | - |  |
| `update` | 35 | [`tdm11_task_relate_rule.countUseByRuleCode`](../../tdm/sql/tdm11_task_relate_rule.md), `UpdateDataModel(tdm11_task_relate_rule)` 동적 INSERT/UPDATE | `Tdm11_Lookup_TaskRelateRule` | `UpdateDataModel` |
| `delete` | 59 | `UpdateDataModel(tdm11_task_relate_rule)` 동적 DELETE | `Tdm11_Lookup_TaskRelateRule` | `UpdateDataModel` |
