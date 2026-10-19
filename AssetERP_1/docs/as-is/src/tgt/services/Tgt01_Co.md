# tgt.Tgt01_Co

`server/tgt/Tgt01_Co.java`

서비스 키 `tgt.Tgt01_Co.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`tgt01_co.selectById`](../../tgt/sql/tgt01_co.md) | - |  |
| `selectByText` | 28 | [`tgt01_co.selectByText`](../../tgt/sql/tgt01_co.md) | `Tgt01_Lookup_Co`, `Tgt01_Tab_Co` |  |
| `update` | 46 | `UpdateDataModel(tgt01_co)` 동적 INSERT/UPDATE | `Tgt01_Tab_Co` | `UpdateDataModel` |
| `delete` | 51 | `UpdateDataModel(tgt01_co)` 동적 DELETE | `Tgt01_Tab_Co` | `UpdateDataModel` |
