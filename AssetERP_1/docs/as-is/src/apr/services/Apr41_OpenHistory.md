# apr.Apr41_OpenHistory

`server/apr/Apr41_OpenHistory.java`

서비스 키 `apr.Apr41_OpenHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`apr41_open_history.selectById`](../../apr/sql/apr41_open_history.md) | - |  |
| `selectByApprId` | 22 | [`apr41_open_history.selectByApprId`](../../apr/sql/apr41_open_history.md) | - |  |
| `selectByApprIdPaging` | 27 | [`apr41_open_history.selectByApprIdPaging`](../../apr/sql/apr41_open_history.md), [`apr41_open_history.selectByApprIdTotal`](../../apr/sql/apr41_open_history.md) | `Apr41_Lookup_OpenHistory` |  |
| `insert` | 33 | [`apr41_open_history.insert`](../../apr/sql/apr41_open_history.md) | `Apr01_Edit_ApprDoc` |  |
