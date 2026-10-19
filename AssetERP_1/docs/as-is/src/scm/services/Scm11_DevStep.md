# scm.Scm11_DevStep

`server/scm/Scm11_DevStep.java`

서비스 키 `scm.Scm11_DevStep.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`scm11_dev_step.selectById`](../../scm/sql/scm11_dev_step.md) | - |  |
| `selectByDevId` | 26 | [`scm11_dev_step.selectByDevId`](../../scm/sql/scm11_dev_step.md) | `Scm11_Grid_DevStep`, `Scm11_Lookup_DevNote`, `Scm11_Lookup_DevStep` |  |
| `selectByPersonId` | 35 | [`scm11_dev_step.selectByPersonId`](../../scm/sql/scm11_dev_step.md) | - |  |
| `selectByDeployPersonId` | 50 | [`scm11_dev_step.selectByDeployPersonId`](../../scm/sql/scm11_dev_step.md) | `Scm13_Tab_Deploy` |  |
| `selectByMyTurnCheck` | 64 | [`scm11_dev_step.selectByMyTurnCheck`](../../scm/sql/scm11_dev_step.md) | `Scm11_Tab_DevTest` |  |
| `checkMyTurn` | 79 | [`scm11_dev_step.checkMyTurn`](../../scm/sql/scm11_dev_step.md) | `Scm11_Edit_DevStep` |  |
| `updateStatus` | 96 | [`scm10_dev.updateDate`](../../scm/sql/scm10_dev.md), [`scm11_dev_step.checkMyTurn`](../../scm/sql/scm11_dev_step.md), [`scm11_dev_step.updateDevStatusCode`](../../scm/sql/scm11_dev_step.md), `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE | `Scm11_Edit_DevStep` | `UpdateDataModel` |
| `updateResultCode` | 123 | [`scm11_dev_step.checkMyTurn`](../../scm/sql/scm11_dev_step.md), [`scm11_dev_step.updateResultCode`](../../scm/sql/scm11_dev_step.md), `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE | `Scm11_Edit_DevStepTest` | `UpdateDataModel` |
| `updateResult` | 147 | [`scm11_dev_step.updateResult`](../../scm/sql/scm11_dev_step.md) | `Scm11_Edit_DevStepTest`, `Scm11_Lookup_Result` |  |
| `deleteByDevId` | 161 | [`scm11_dev_step.deleteByDevId`](../../scm/sql/scm11_dev_step.md) | `Scm10_Grid_Dev` |  |
| `modelUpdate` | 166 | [`scm10_dev.updateDate`](../../scm/sql/scm10_dev.md), [`scm11_dev_step.updateResultDate`](../../scm/sql/scm11_dev_step.md), `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE | `Scm11_Edit_DevStep` | `UpdateDataModel` |
| `inUpdateProgress` | 190 | [`scm11_dev_step.inUpdateProgress`](../../scm/sql/scm11_dev_step.md) | `Scm11_Lookup_DevStep` |  |
| `update` | 212 | `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 217 | `UpdateDataModel(scm11_dev_step)` 동적 DELETE | `Scm11_Lookup_DevStep` | `UpdateDataModel` |
