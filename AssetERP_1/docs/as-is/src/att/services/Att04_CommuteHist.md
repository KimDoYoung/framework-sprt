# att.Att04_CommuteHist

`server/att/Att04_CommuteHist.java`

서비스 키 `att.Att04_CommuteHist.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`att04_commute_hist.selectById`](../../att/sql/att04_commute_hist.md) | - |  |
| `selectByCompanyId` | 27 | `att04_commute_hist.selectByCompanyId`(없음) | - |  |
| `updateAuto` | 37 | [`att04_commute_hist.insertAuto`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.selectByCommuteId`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.updateTimeAuto`](../../att/sql/att04_commute_hist.md) | `Att02_Tab_CommuteAdmin` |  |
| `insert` | 63 | [`att04_commute_hist.insert`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.selectByCommuteId`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.updateTime`](../../att/sql/att04_commute_hist.md) | `Att02_Edit_Commute` |  |
| `insertList` | 85 | [`att02_commute.selectById`](../../att/sql/att02_commute.md), [`att04_commute_hist.insert`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.selectByCommuteId`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.updateTime`](../../att/sql/att04_commute_hist.md) | `Att02_Edit_CommuteBatch` |  |
| `update` | 112 | `UpdateDataModel(att04_commute_hist)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 117 | `UpdateDataModel(att04_commute_hist)` 동적 DELETE | - | `UpdateDataModel` |
