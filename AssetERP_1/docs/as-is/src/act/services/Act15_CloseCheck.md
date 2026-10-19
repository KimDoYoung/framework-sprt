# act.Act15_CloseCheck

`server/act/Act15_CloseCheck.java`

서비스 키 `act.Act15_CloseCheck.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`act15_close_check.selectById`](../../act/sql/act15_close_check.md) | - |  |
| `selectByText` | 24 | [`act15_close_check.selectByText`](../../act/sql/act15_close_check.md) | `Act15_Tab_CloseCheck` |  |
| `update` | 30 | [`act15_close_check.selectById`](../../act/sql/act15_close_check.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(act15_close_check)` 동적 INSERT/UPDATE | `Act15_Tab_CloseCheck` | `UpdateDataModel` |
