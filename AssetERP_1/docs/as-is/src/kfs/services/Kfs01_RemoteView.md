# kfs.Kfs01_RemoteView

`server/kfs/Kfs01_RemoteView.java`

서비스 키 `kfs.Kfs01_RemoteView.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`kfs01_remote_view.selectById`](../../kfs/sql/kfs01_remote_view.md) | - |  |
| `selectByText` | 24 | [`kfs01_remote_view.selectByText`](../../kfs/sql/kfs01_remote_view.md) | `Kfs01_Tab_RemoteView` |  |
| `selectByPersonName` | 38 | [`kfs01_remote_view.selectByPersonName`](../../kfs/sql/kfs01_remote_view.md) | `Kfs01_Tab_RemoteView` |  |
| `update` | 52 | `UpdateDataModel(kfs01_remote_view)` 동적 INSERT/UPDATE | `Kfs01_Tab_RemoteView` | `UpdateDataModel` |
| `delete` | 57 | `UpdateDataModel(kfs01_remote_view)` 동적 DELETE | `Kfs01_Tab_RemoteView` | `UpdateDataModel` |
