# rpt.Rpt01_Daily

`server/rpt/Rpt01_Daily.java`

서비스 키 `rpt.Rpt01_Daily.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`rpt01_daily.selectById`](../../rpt/sql/rpt01_daily.md) | - |  |
| `selectByText` | 26 | [`rpt01_daily.selectByText`](../../rpt/sql/rpt01_daily.md) | `Rpt01_Tab_DailyWrite` |  |
| `selectByConfirmText` | 39 | [`rpt01_daily.selectByConfirmText`](../../rpt/sql/rpt01_daily.md) | `Rpt01_Tab_DailyConfirm` |  |
| `modelUpdate` | 54 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(rpt01_daily)` 동적 INSERT/UPDATE | `Rpt01_Edit_DailyWrite` | `UpdateDataModel` |
| `confirmModelUpdate` | 69 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(rpt01_daily)` 동적 INSERT/UPDATE | `Rpt01_Edit_DailyConfirm` | `UpdateDataModel` |
| `confirmUpdate` | 83 | [`rpt01_daily.confirmUpdate`](../../rpt/sql/rpt01_daily.md) | `Rpt01_Tab_DailyConfirm` |  |
| `update` | 100 | `UpdateDataModel(rpt01_daily)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 105 | `UpdateDataModel(rpt01_daily)` 동적 DELETE | `Rpt01_Tab_DailyWrite` | `UpdateDataModel` |
