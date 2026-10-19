# est.Est03_PfHistory

`server/est/Est03_PfHistory.java`

서비스 키 `est.Est03_PfHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`est03_pf_history.selectById`](../../est/sql/est03_pf_history.md) | - |  |
| `selectByPfContractId` | 27 | [`est03_pf_history.selectByPfContractId`](../../est/sql/est03_pf_history.md) | `Est03_TabPage_PfHistoryList`, `Est03_Tab_PfHistory` |  |
| `selectBySearchText` | 38 | [`est03_pf_history.selectBySearchText`](../../est/sql/est03_pf_history.md) | - |  |
| `selectByConfirmer01` | 51 | [`est03_pf_history.selectByConfirmer01`](../../est/sql/est03_pf_history.md) | `Est03_Tab_PfHistoryConfirm` |  |
| `selectByConfirmer02` | 65 | [`est03_pf_history.selectByConfirmer02`](../../est/sql/est03_pf_history.md) | `Est03_Tab_PfHistoryConfirm` |  |
| `checkList` | 77 | [`est03_pf_history.checkList`](../../est/sql/est03_pf_history.md) | `Est02_Tab_PfContract` |  |
| `getConfirmerParent` | 88 | [`est03_pf_history.getConfirmerParent`](../../est/sql/est03_pf_history.md) | `Est03_Tab_PfHistory` |  |
| `updateConfirm` | 99 | [`est03_pf_history.updateConfirm`](../../est/sql/est03_pf_history.md) | `Est03_Tab_PfHistoryConfirm` |  |
| `modelUpdate` | 114 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`est03_pf_history.checkNo`](../../est/sql/est03_pf_history.md), `UpdateDataModel(est03_pf_history)` 동적 INSERT/UPDATE | `Est03_TabPage_PfHistory` | `UpdateDataModel` |
| `update` | 146 | `UpdateDataModel(est03_pf_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 151 | `UpdateDataModel(est03_pf_history)` 동적 DELETE | `Est03_Tab_PfHistory` | `UpdateDataModel` |
