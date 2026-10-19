# tdm.Tdm21_RoleRelateTask

`server/tdm/Tdm21_RoleRelateTask.java`

서비스 키 `tdm.Tdm21_RoleRelateTask.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`tdm21_role_relate_task.selectById`](../../tdm/sql/tdm21_role_relate_task.md) | - |  |
| `selectByRoloId` | 23 | [`tdm21_role_relate_task.selectByRoloId`](../../tdm/sql/tdm21_role_relate_task.md) | `Tdm21_Lookup_RoleRelateTask` |  |
| `selectByRoloIdAndDate` | 31 | [`tdm21_role_relate_task.selectByRoloIdAndDate`](../../tdm/sql/tdm21_role_relate_task.md) | `Tdm21_Lookup_TaskWithDetail` |  |
| `update` | 36 | `UpdateDataModel(tdm21_role_relate_task)` 동적 INSERT/UPDATE | `Tdm21_Lookup_RoleRelateTask` | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(tdm21_role_relate_task)` 동적 DELETE | `Tdm21_Lookup_RoleRelateTask` | `UpdateDataModel` |
