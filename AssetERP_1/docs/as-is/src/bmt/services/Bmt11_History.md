# bmt.Bmt11_History

`server/bmt/Bmt11_History.java`

서비스 키 `bmt.Bmt11_History.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`bmt11_history.selectById`](../../bmt/sql/bmt11_history.md) | - |  |
| `selectByInfoId` | 23 | [`bmt11_history.selectByInfoId`](../../bmt/sql/bmt11_history.md) | `Bmt11_Lookup_History`, `Bmt11_TabPage_History` |  |
| `update` | 31 | `UpdateDataModel(bmt11_history)` 동적 INSERT/UPDATE | `Bmt11_Lookup_History`, `Bmt11_TabPage_History` | `UpdateDataModel` |
| `delete` | 36 | `UpdateDataModel(bmt11_history)` 동적 DELETE | `Bmt11_Lookup_History`, `Bmt11_TabPage_History` | `UpdateDataModel` |
