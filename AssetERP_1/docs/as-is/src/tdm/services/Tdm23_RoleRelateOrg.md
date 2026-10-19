# tdm.Tdm23_RoleRelateOrg

`server/tdm/Tdm23_RoleRelateOrg.java`

서비스 키 `tdm.Tdm23_RoleRelateOrg.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`tdm23_role_relate_org.selectById`](../../tdm/sql/tdm23_role_relate_org.md) | - |  |
| `selectByRoleId` | 21 | [`tdm23_role_relate_org.selectByRoleId`](../../tdm/sql/tdm23_role_relate_org.md) | `Tdm23_Lookup_RoleRelateOrg`, `Tdm23_Lookup_SelectOrg` |  |
| `update` | 26 | `UpdateDataModel(tdm23_role_relate_org)` 동적 INSERT/UPDATE | `Tdm23_Lookup_RoleRelateOrg` | `UpdateDataModel` |
| `delete` | 31 | `UpdateDataModel(tdm23_role_relate_org)` 동적 DELETE | `Tdm23_Lookup_RoleRelateOrg` | `UpdateDataModel` |
