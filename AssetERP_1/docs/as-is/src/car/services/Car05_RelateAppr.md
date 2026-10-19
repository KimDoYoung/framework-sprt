# car.Car05_RelateAppr

`server/car/Car05_RelateAppr.java`

서비스 키 `car.Car05_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`car05_relate_appr.selectById`](../../car/sql/car05_relate_appr.md) | - |  |
| `selectByStdMonth` | 25 | [`car05_relate_appr.selectByStdMonth`](../../car/sql/car05_relate_appr.md) | `Car04_Tab_Journal` |  |
| `updateApprId` | 37 | [`car05_relate_appr.updateApprId`](../../car/sql/car05_relate_appr.md) | `Car04_Tab_Journal` |  |
| `insert` | 46 | [`car05_relate_appr.checkRelateApprId`](../../car/sql/car05_relate_appr.md), [`car05_relate_appr.insert`](../../car/sql/car05_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Car04_Tab_Journal` |  |
| `update` | 78 | `UpdateDataModel(car05_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 83 | `UpdateDataModel(car05_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
