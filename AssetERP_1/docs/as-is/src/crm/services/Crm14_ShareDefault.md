# crm.Crm14_ShareDefault

`server/crm/Crm14_ShareDefault.java`

서비스 키 `crm.Crm14_ShareDefault.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 15 | [`crm14_share_default.selectById`](../../crm/sql/crm14_share_default.md) | - |  |
| `selectByContactId` | 20 | [`crm14_share_default.selectByContactId`](../../crm/sql/crm14_share_default.md) | `Crm14_Lookup_ShareDefault` |  |
| `selectShareInfo` | 25 | [`crm14_share_default.selectShareInfo`](../../crm/sql/crm14_share_default.md) | `Crm14_Lookup_ShareDefault` |  |
| `update` | 30 | `UpdateDataModel(crm14_share_default)` 동적 INSERT/UPDATE | `Crm14_Lookup_ShareDefault` | `UpdateDataModel` |
| `delete` | 35 | `UpdateDataModel(crm14_share_default)` 동적 DELETE | `Crm14_Lookup_ShareDefault` | `UpdateDataModel` |
