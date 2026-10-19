# crm.Crm15_Share

`server/crm/Crm15_Share.java`

서비스 키 `crm.Crm15_Share.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 15 | [`crm15_share.selectById`](../../crm/sql/crm15_share.md) | - |  |
| `selectByWorkDetailId` | 20 | [`crm15_share.selectByWorkDetailId`](../../crm/sql/crm15_share.md) | `Crm15_Lookup_Share` |  |
| `selectShareInfo` | 25 | [`crm15_share.selectShareInfo`](../../crm/sql/crm15_share.md) | `Crm15_Lookup_Share` |  |
| `insertDefaultShare` | 30 | [`crm15_share.insertDefaultShare`](../../crm/sql/crm15_share.md), [`crm15_share.selectShareInfo`](../../crm/sql/crm15_share.md) | `Crm12_Lookup_WorkDetail` |  |
| `deleteDefaultShare` | 39 | [`crm15_share.deleteByWorkDetailId`](../../crm/sql/crm15_share.md) | `Crm12_Lookup_WorkDetail` |  |
| `update` | 44 | `UpdateDataModel(crm15_share)` 동적 INSERT/UPDATE | `Crm15_Lookup_Share` | `UpdateDataModel` |
| `delete` | 49 | `UpdateDataModel(crm15_share)` 동적 DELETE | `Crm15_Lookup_Share` | `UpdateDataModel` |
