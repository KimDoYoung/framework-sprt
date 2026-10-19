# sys.Sys95_Manual

`server/sys/Sys95_Manual.java`

서비스 키 `sys.Sys95_Manual.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sys95_manual.selectById`](../../sys/sql/sys95_manual.md) | - |  |
| `selectByCompanyId` | 24 | [`sys95_manual.selectByCompanyId`](../../sys/sql/sys95_manual.md) | - |  |
| `selectByText` | 34 | [`sys95_manual.selectByText`](../../sys/sql/sys95_manual.md) | `Sys95_Tab_Manual`, `Sys95_Tab_ManualAdmin` |  |
| `checkManualType` | 40 | [`sys95_manual.checkManualType`](../../sys/sql/sys95_manual.md) | `Sys09_Lookup_Code` |  |
| `update` | 49 | `UpdateDataModel(sys95_manual)` 동적 INSERT/UPDATE | `Sys95_Tab_ManualAdmin` | `UpdateDataModel` |
| `delete` | 54 | `UpdateDataModel(sys95_manual)` 동적 DELETE | `Sys95_Tab_ManualAdmin` | `UpdateDataModel` |
