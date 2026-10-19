# tgt.Tgt02_CoAcct

`server/tgt/Tgt02_CoAcct.java`

서비스 키 `tgt.Tgt02_CoAcct.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`tgt02_co_acct.selectById`](../../tgt/sql/tgt02_co_acct.md) | - |  |
| `selectByCoId` | 30 | [`tgt02_co_acct.selectByCoId`](../../tgt/sql/tgt02_co_acct.md) | `Tgt02_Grid_CoAcct` |  |
| `update` | 36 | `UpdateDataModel(tgt02_co_acct)` 동적 INSERT/UPDATE | `Tgt02_Grid_CoAcct` | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(tgt02_co_acct)` 동적 DELETE | `Tgt02_Grid_CoAcct` | `UpdateDataModel` |
