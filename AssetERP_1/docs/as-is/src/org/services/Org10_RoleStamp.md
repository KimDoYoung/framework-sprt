# org.Org10_RoleStamp

`server/org/Org10_RoleStamp.java`

서비스 키 `org.Org10_RoleStamp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`org10_role_stamp.selectById`](../../org/sql/org10_role_stamp.md) | - |  |
| `selectByStampId` | 23 | [`org10_role_stamp.selectByStampId`](../../org/sql/org10_role_stamp.md) | `Org10_Lookup_RoleStamp` |  |
| `checkRole` | 31 | [`apr10_stamp.checkCloseDate`](../../apr/sql/apr10_stamp.md), [`org10_role_stamp.checkRole`](../../org/sql/org10_role_stamp.md) | `Apr01_Edit_ApprDoc` |  |
| `deleteByStampId` | 51 | [`org10_role_stamp.deleteByStampId`](../../org/sql/org10_role_stamp.md) | - |  |
| `update` | 56 | `UpdateDataModel(org10_role_stamp)` 동적 INSERT/UPDATE | `Org10_Lookup_RoleStamp` | `UpdateDataModel` |
| `delete` | 61 | `UpdateDataModel(org10_role_stamp)` 동적 DELETE | `Org10_Lookup_RoleStamp` | `UpdateDataModel` |
