# tdm.Tdm20_Role

`server/tdm/Tdm20_Role.java`

서비스 키 `tdm.Tdm20_Role.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm20_role.selectById`](../../tdm/sql/tdm20_role.md) | - |  |
| `selectByCompanyId` | 25 | [`tdm20_role.selectByCompanyId`](../../tdm/sql/tdm20_role.md) | - |  |
| `selectByDate` | 33 | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) | `Tdm20_Lookup_SelectMulti`, `Tdm20_Lookup_SelectRole`, `Tdm20_Lookup_SelectSingle`, `Tdm20_Tab_Role` |  |
| `selectCheckTargetRole` | 38 | [`tdm20_role.selectCheckTargetRole`](../../tdm/sql/tdm20_role.md) | `Tdm20_Lookup_SelectRole`, `Tdm59_Tab_CheckAppr` |  |
| `checkCeoRoleId` | 43 | [`tdm20_role.checkCeoRoleId`](../../tdm/sql/tdm20_role.md) | `Tdm20_Edit_Role` |  |
| `getCeoRoleList` | 48 | [`tdm20_role.getCeoRoleList`](../../tdm/sql/tdm20_role.md) | `Tdm50_Tab_CheckJob` |  |
| `countUseByRoleId` | 53 | [`tdm20_role.countUseByRoleId`](../../tdm/sql/tdm20_role.md) | `Tdm20_Tab_Role` |  |
| `modelUpdate` | 66 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm20_role)` 동적 INSERT/UPDATE | `Tdm20_Edit_Role`, `Tdm20_Lookup_SelectSingle` | `Tdm96_ChangeDetail`, `UpdateDataModel` |
| `update` | 89 | `UpdateDataModel(tdm20_role)` 동적 INSERT/UPDATE | `Tdm20_Lookup_CeoRoleList` | `UpdateDataModel` |
| `delete` | 94 | [`tdm20_role.countUseByRoleId`](../../tdm/sql/tdm20_role.md), `UpdateDataModel(tdm20_role)` 동적 DELETE | `Tdm20_Lookup_CeoRoleList`, `Tdm20_Tab_Role` | `Tdm96_ChangeDetail`, `UpdateDataModel` |
