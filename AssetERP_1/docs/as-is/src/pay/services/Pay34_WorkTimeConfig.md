# pay.Pay34_WorkTimeConfig

`server/pay/Pay34_WorkTimeConfig.java`

서비스 키 `pay.Pay34_WorkTimeConfig.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay34_work_time_config.selectById`](../../pay/sql/pay34_work_time_config.md) | - |  |
| `selectByCompanyId` | 24 | [`pay34_work_time_config.selectByCompanyId`](../../pay/sql/pay34_work_time_config.md) | `Pay34_Tab_WorkTimeConfig` |  |
| `getModel` | 34 | [`pay34_work_time_config.getModel`](../../pay/sql/pay34_work_time_config.md) | `Att03_Lookup_OvertimeReq` |  |
| `update` | 44 | `UpdateDataModel(pay34_work_time_config)` 동적 INSERT/UPDATE | `Pay34_Tab_WorkTimeConfig` | `UpdateDataModel` |
| `delete` | 49 | `UpdateDataModel(pay34_work_time_config)` 동적 DELETE | `Pay34_Tab_WorkTimeConfig` | `UpdateDataModel` |
