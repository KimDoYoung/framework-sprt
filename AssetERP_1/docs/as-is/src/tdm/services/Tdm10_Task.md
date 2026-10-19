# tdm.Tdm10_Task

`server/tdm/Tdm10_Task.java`

서비스 키 `tdm.Tdm10_Task.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm10_task.selectById`](../../tdm/sql/tdm10_task.md) | `Tdm11_Lookup_TaskRelateRule` |  |
| `selectByText` | 25 | [`tdm10_task.selectByText`](../../tdm/sql/tdm10_task.md) | `Tdm10_Lookup_SelectMulti`, `Tdm10_Lookup_SelectSingle`, `Tdm10_Tab_Task` |  |
| `countUseByTaskId` | 30 | [`tdm10_task.countUseByTaskId`](../../tdm/sql/tdm10_task.md) | `Tdm10_Tab_Task` |  |
| `modelUpdate` | 43 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm10_task.createCopy`](../../tdm/sql/tdm10_task.md), `UpdateDataModel(tdm10_task)` 동적 INSERT/UPDATE | `Tdm10_Edit_Task` | `Tdm96_ChangeDetail`, `UpdateDataModel` |
| `update` | 85 | `UpdateDataModel(tdm10_task)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 90 | [`tdm10_task.countUseByTaskId`](../../tdm/sql/tdm10_task.md), `UpdateDataModel(tdm10_task)` 동적 DELETE | `Tdm10_Tab_Task` | `Tdm96_ChangeDetail`, `UpdateDataModel` |
