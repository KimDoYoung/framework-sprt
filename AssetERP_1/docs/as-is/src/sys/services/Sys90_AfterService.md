# sys.Sys90_AfterService

`server/sys/Sys90_AfterService.java`

서비스 키 `sys.Sys90_AfterService.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 33 | [`sys90_after_service.selectById`](../../sys/sql/sys90_after_service.md) | `Sys90_Edit_Board`, `Sys90_Edit_BoardAdmin` |  |
| `selectByFileId` | 39 | [`sys90_after_service.selectByFileId`](../../sys/sql/sys90_after_service.md) | - |  |
| `view` | 47 | [`sys90_after_service.selectByFileId`](../../sys/sql/sys90_after_service.md) | - | `IdmsConfig` |
| `selectBySearchText` | 96 | [`sys90_after_service.selectBySearchText`](../../sys/sql/sys90_after_service.md) | `Sys90_Tab_AfterService` |  |
| `selectByAdmin` | 133 | [`sys90_after_service.selectByAdmin`](../../sys/sql/sys90_after_service.md) | - |  |
| `selectByIncomplete` | 171 | [`sys90_after_service.selectByIncomplete`](../../sys/sql/sys90_after_service.md) | - |  |
| `updateHappenRemedy` | 207 | [`sys90_after_service.updateHappenRemedy`](../../sys/sql/sys90_after_service.md) | - |  |
| `updateRemarks` | 218 | [`sys90_after_service.updateRemarks`](../../sys/sql/sys90_after_service.md) | `Sys90_Lookup_Remarks` |  |
| `userUpdate` | 229 | [`sys90_after_service.userUpdate`](../../sys/sql/sys90_after_service.md) | `Sys90_Edit_Board` |  |
| `adminUpdate` | 248 | [`sys90_after_service.adminUpdate`](../../sys/sql/sys90_after_service.md) | `Sys90_Edit_BoardAdmin` |  |
| `update` | 266 | `UpdateDataModel(sys90_after_service)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 279 | `UpdateDataModel(sys90_after_service)` 동적 DELETE | `Sys90_Edit_Board`, `Sys90_Edit_BoardAdmin` | `UpdateDataModel` |
