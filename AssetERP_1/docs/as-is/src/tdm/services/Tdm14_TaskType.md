# tdm.Tdm14_TaskType

`server/tdm/Tdm14_TaskType.java`

서비스 키 `tdm.Tdm14_TaskType.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`tdm14_task_type.selectById`](../../tdm/sql/tdm14_task_type.md) | - |  |
| `selectByCompanyId` | 24 | [`tdm14_task_type.selectByCompanyId`](../../tdm/sql/tdm14_task_type.md) | `Tdm14_Lookup_TaskType` |  |
| `update` | 29 | [`tdm14_task_type.countDupByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.countUseByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.selectTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), `UpdateDataModel(tdm14_task_type)` 동적 INSERT/UPDATE | `Tdm14_Lookup_TaskType` | `UpdateDataModel` |
| `delete` | 63 | [`tdm14_task_type.countUseByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.selectById`](../../tdm/sql/tdm14_task_type.md), `UpdateDataModel(tdm14_task_type)` 동적 DELETE | `Tdm14_Lookup_TaskType` | `UpdateDataModel` |
