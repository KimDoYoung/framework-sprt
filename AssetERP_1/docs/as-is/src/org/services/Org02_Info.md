# org.Org02_Info

`server/org/Org02_Info.java`

서비스 키 `org.Org02_Info.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByOnlyOrgCodeId` | 20 | [`org02_info.selectByOnlyOrgCodeId`](../../org/sql/org02_info.md) | `Org02_Lookup_OrgInfo` |  |
| `deleteCheck` | 31 | [`emp03_trans.deleteOrgCheck`](../../emp/sql/emp03_trans.md), [`org01_code.checkUseOrgId`](../../org/sql/org01_code.md), [`org02_info.deleteOrgCheck`](../../org/sql/org02_info.md) | `Org02_Lookup_OrgInfo` |  |
| `deleteOrg` | 52 | [`org01_code.deleteOrg`](../../org/sql/org01_code.md), [`org02_info.deleteOrg`](../../org/sql/org02_info.md) | `Org02_Lookup_OrgInfo` |  |
| `update` | 60 | `UpdateDataModel(org02_info)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 65 | `UpdateDataModel(org02_info)` 동적 DELETE | `Org02_Lookup_OrgInfo` | `UpdateDataModel` |
