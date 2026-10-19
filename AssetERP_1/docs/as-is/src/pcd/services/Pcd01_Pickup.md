# pcd.Pcd01_Pickup

`server/pcd/Pcd01_Pickup.java`

서비스 키 `pcd.Pcd01_Pickup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByApprDate` | 26 | `pcd01_pickup.selectByApprDate`(없음) | - |  |
| `selectByDate` | 44 | [`pcd01_pickup.selectByDate`](../../pcd/sql/pcd01_pickup.md) | `Pcd01_Tab_Pickup` | `DateUtil` |
| `selectByDateUnion` | 66 | [`pcd01_pickup.selectByDateUnion`](../../pcd/sql/pcd01_pickup.md) | `Pcd01_Popup_Pickup`, `Pcd01_Tab_Pickup` | `DateUtil` |
| `deleteBypickupId` | 89 | [`pcd01_pickup.deleteBypickupId`](../../pcd/sql/pcd01_pickup.md) | - |  |
| `checkAvailable` | 100 | `pcd01_pickup.checkAvailable`(없음) | - |  |
| `checkAvailablePeriod` | 126 | - | - | `DateUtil` |
| `update` | 144 | `UpdateDataModel(pcd01_pickup)` 동적 INSERT/UPDATE | `Pcd01_Popup_Pickup` | `DateUtil`, `UpdateDataModel` |
| `delete` | 158 | `UpdateDataModel(pcd01_pickup)` 동적 DELETE | `Pcd01_Tab_Pickup` | `UpdateDataModel` |
