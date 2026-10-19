# att.Att05_PmWork

`server/att/Att05_PmWork.java`

서비스 키 `att.Att05_PmWork.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`att05_pm_work.selectById`](../../att/sql/att05_pm_work.md) | - |  |
| `selectByPersonId` | 25 | [`att05_pm_work.selectByPersonId`](../../att/sql/att05_pm_work.md) | - |  |
| `selectByWorkDate` | 35 | [`att05_pm_work.selectByWorkDate`](../../att/sql/att05_pm_work.md) | `Att05_Lookup_PmWork` |  |
| `notInPmWorkIdList` | 46 | [`att05_pm_work.notInPmWorkIdList`](../../att/sql/att05_pm_work.md) | `Att05_Lookup_PmWork` |  |
| `getWorkDateInfo` | 59 | [`att05_pm_work.getWorkDateInfo`](../../att/sql/att05_pm_work.md) | `Att03_Lookup_OvertimeReq` |  |
| `updateApprId` | 70 | [`att05_pm_work.updateApprId`](../../att/sql/att05_pm_work.md) | - |  |
| `update` | 80 | `UpdateDataModel(att05_pm_work)` 동적 INSERT/UPDATE | `Att05_Lookup_PmWork` | `UpdateDataModel` |
| `delete` | 85 | `UpdateDataModel(att05_pm_work)` 동적 DELETE | `Att05_Lookup_PmWork` | `UpdateDataModel` |
