# tdm.Tdm13_TaskRelateDuty

`server/tdm/Tdm13_TaskRelateDuty.java`

서비스 키 `tdm.Tdm13_TaskRelateDuty.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`tdm13_task_relate_duty.selectById`](../../tdm/sql/tdm13_task_relate_duty.md) | - |  |
| `selectByTaskRelateDetailId` | 24 | [`tdm13_task_relate_duty.selectByTaskRelateDetailId`](../../tdm/sql/tdm13_task_relate_duty.md) | `Tdm13_TabPage_TaskDuty` |  |
| `countByDutyId` | 32 | [`tdm13_task_relate_duty.countByDutyId`](../../tdm/sql/tdm13_task_relate_duty.md) | `Tdm13_TabPage_TaskDuty` |  |
| `update` | 45 | `UpdateDataModel(tdm13_task_relate_duty)` 동적 INSERT/UPDATE | `Tdm13_TabPage_TaskDuty` | `Tdm96_ChangeDetail`, `UpdateDataModel` |
| `delete` | 60 | [`tdm13_task_relate_duty.countByDutyId`](../../tdm/sql/tdm13_task_relate_duty.md), `UpdateDataModel(tdm13_task_relate_duty)` 동적 DELETE | `Tdm13_TabPage_TaskDuty` | `Tdm96_ChangeDetail`, `UpdateDataModel` |
