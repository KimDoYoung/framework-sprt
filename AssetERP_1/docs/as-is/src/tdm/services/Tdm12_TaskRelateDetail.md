# tdm.Tdm12_TaskRelateDetail

`server/tdm/Tdm12_TaskRelateDetail.java`

서비스 키 `tdm.Tdm12_TaskRelateDetail.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`tdm12_task_relate_detail.selectById`](../../tdm/sql/tdm12_task_relate_detail.md) | - |  |
| `selectByTaskId` | 24 | [`tdm12_task_relate_detail.selectByTaskId`](../../tdm/sql/tdm12_task_relate_detail.md) | `Tdm12_Lookup_TaskRelateDetail`, `Tdm12_TabPage_TaskRelateDetail` |  |
| `selectByText` | 32 | [`tdm12_task_relate_detail.selectByText`](../../tdm/sql/tdm12_task_relate_detail.md) | `Tdm13_Tab_TaskDuty` |  |
| `getHtmlData` | 37 | [`tdm12_task_relate_detail.getHtmlData`](../../tdm/sql/tdm12_task_relate_detail.md) | `Tdm34_TabPage_RoleAllcDetail`, `Tdm34_TabPage_RoleAllcDetail_20260406` |  |
| `countByTaskDetailId` | 47 | [`tdm12_task_relate_detail.countByTaskDetailId`](../../tdm/sql/tdm12_task_relate_detail.md) | `Tdm12_Lookup_TaskRelateDetail` |  |
| `update` | 60 | `UpdateDataModel(tdm12_task_relate_detail)` 동적 INSERT/UPDATE | `Tdm12_Lookup_TaskRelateDetail` | `Tdm96_ChangeDetail`, `UpdateDataModel` |
| `delete` | 75 | [`tdm12_task_relate_detail.countByTaskDetailId`](../../tdm/sql/tdm12_task_relate_detail.md), `UpdateDataModel(tdm12_task_relate_detail)` 동적 DELETE | `Tdm12_Lookup_TaskRelateDetail` | `Tdm96_ChangeDetail`, `UpdateDataModel` |
