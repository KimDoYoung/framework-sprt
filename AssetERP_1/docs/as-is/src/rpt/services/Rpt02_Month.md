# rpt.Rpt02_Month

`server/rpt/Rpt02_Month.java`

서비스 키 `rpt.Rpt02_Month.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`rpt02_month.selectById`](../../rpt/sql/rpt02_month.md) | - |  |
| `selectByText` | 23 | [`rpt02_month.selectByText`](../../rpt/sql/rpt02_month.md) | `Rpt02_Tab_MonthWrite` |  |
| `modelUpdate` | 32 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(rpt02_month)` 동적 INSERT/UPDATE | `Rpt02_Edit_MonthWrite` | `UpdateDataModel` |
| `update` | 45 | `UpdateDataModel(rpt02_month)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 50 | `UpdateDataModel(rpt02_month)` 동적 DELETE | `Rpt02_Tab_MonthWrite` | `UpdateDataModel` |
