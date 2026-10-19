# sys.Sys14_Holiday

`server/sys/Sys14_Holiday.java`

서비스 키 `sys.Sys14_Holiday.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`sys14_holiday.selectById`](../../sys/sql/sys14_holiday.md) | - |  |
| `selectByYear` | 29 | [`sys14_holiday.selectByYear`](../../sys/sql/sys14_holiday.md) | `Sys14_Lookup_Holiday` |  |
| `insertInitData` | 54 | [`sys14_holiday.deleteByDay`](../../sys/sql/sys14_holiday.md), [`sys14_holiday.insertInitData`](../../sys/sql/sys14_holiday.md) | `Sys14_Lookup_Holiday` |  |
| `update` | 70 | `UpdateDataModel(sys14_holiday)` 동적 INSERT/UPDATE | `Sys14_Lookup_Holiday` | `UpdateDataModel` |
| `delete` | 75 | `UpdateDataModel(sys14_holiday)` 동적 DELETE | `Sys14_Lookup_Holiday` | `UpdateDataModel` |
