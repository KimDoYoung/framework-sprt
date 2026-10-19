# apr.Apr40_DownloadHistory

`server/apr/Apr40_DownloadHistory.java`

서비스 키 `apr.Apr40_DownloadHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`apr40_download_history.selectById`](../../apr/sql/apr40_download_history.md) | - |  |
| `selectByText` | 25 | [`apr40_download_history.selectByText`](../../apr/sql/apr40_download_history.md) | - |  |
| `selectByTextPaging` | 37 | [`apr40_download_history.selectByTextPaging`](../../apr/sql/apr40_download_history.md), [`apr40_download_history.selectByTextPagingTotal`](../../apr/sql/apr40_download_history.md) | `Apr40_Lookup_DownloadHistory` |  |
| `updateList` | 52 | [`apr40_download_history.insert`](../../apr/sql/apr40_download_history.md) | `Dcr00_Tab_ApprList` |  |
| `modelUpdate` | 73 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr40_download_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 86 | `UpdateDataModel(apr40_download_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 91 | `UpdateDataModel(apr40_download_history)` 동적 DELETE | - | `UpdateDataModel` |
