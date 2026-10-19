# tdm.Tdm22_RoleRelateCncl

`server/tdm/Tdm22_RoleRelateCncl.java`

서비스 키 `tdm.Tdm22_RoleRelateCncl.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`tdm22_role_relate_cncl.selectById`](../../tdm/sql/tdm22_role_relate_cncl.md) | - |  |
| `selectByRoleId` | 21 | [`tdm22_role_relate_cncl.selectByRoleId`](../../tdm/sql/tdm22_role_relate_cncl.md) | `Tdm22_Lookup_RoleRelateCncl` |  |
| `selectByCnclId` | 26 | [`tdm22_role_relate_cncl.selectByCnclId`](../../tdm/sql/tdm22_role_relate_cncl.md) | `Tdm22_Lookup_RoleRelateCncl2` |  |
| `update` | 31 | `UpdateDataModel(tdm22_role_relate_cncl)` 동적 INSERT/UPDATE | `Tdm22_Lookup_RoleRelateCncl`, `Tdm22_Lookup_RoleRelateCncl2` | `UpdateDataModel` |
| `delete` | 36 | `UpdateDataModel(tdm22_role_relate_cncl)` 동적 DELETE | `Tdm22_Lookup_RoleRelateCncl`, `Tdm22_Lookup_RoleRelateCncl2` | `UpdateDataModel` |
