# att.Att02_Commute

`server/att/Att02_Commute.java`

서비스 키 `att.Att02_Commute.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`att02_commute.selectById`](../../att/sql/att02_commute.md) | - |  |
| `selectByDate` | 27 | [`att02_commute.selectByDate`](../../att/sql/att02_commute.md) | `Att02_Lookup_Commute` |  |
| `selectByTextAdmin` | 39 | [`att02_commute.selectByTextAdmin`](../../att/sql/att02_commute.md) | `Att02_Tab_CommuteAdmin` |  |
| `getCommuteStatus` | 54 | [`att02_commute.getCommuteStatus`](../../att/sql/att02_commute.md) | `Att02_Tab_CommuteStatus` |  |
| `getPersonStatus` | 67 | [`att02_commute.getPersonStatus`](../../att/sql/att02_commute.md) | `Att02_Tab_PersonStatus` |  |
| `getLastInfo` | 80 | [`att02_commute.getLastInfo`](../../att/sql/att02_commute.md) | `Att02_Lookup_Commute`, `MainFrame` |  |
| `insert` | 91 | [`att02_commute.checkWorkDate`](../../att/sql/att02_commute.md), [`att02_commute.insert`](../../att/sql/att02_commute.md), [`att02_commute.updateOff`](../../att/sql/att02_commute.md) | `Att02_Lookup_Commute` |  |
| `insertOffWork` | 120 | [`att02_commute.selectByDate`](../../att/sql/att02_commute.md), [`att02_commute.updateOffWork`](../../att/sql/att02_commute.md) | `Att02_Lookup_Commute` |  |
| `insertBatch` | 139 | [`att02_commute.insertBatch`](../../att/sql/att02_commute.md) | `Att02_Lookup_InsertBatch` |  |
| `updateReason` | 153 | [`att02_commute.updateReason`](../../att/sql/att02_commute.md) | `Att02_Edit_Reason` |  |
| `updateCheckOutTime` | 163 | [`att02_commute.updateCheckOutTime`](../../att/sql/att02_commute.md) | `Att02_Edit_CheckOutTime` |  |
| `adminCheck` | 173 | [`att02_commute.adminCheck`](../../att/sql/att02_commute.md) | `Att02_Tab_CommuteAdmin` |  |
| `update` | 181 | `UpdateDataModel(att02_commute)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 186 | `UpdateDataModel(att02_commute)` 동적 DELETE | `Att02_Tab_CommuteAdmin` | `UpdateDataModel` |
