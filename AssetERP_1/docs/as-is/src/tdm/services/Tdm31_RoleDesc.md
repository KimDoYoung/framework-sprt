# tdm.Tdm31_RoleDesc

`server/tdm/Tdm31_RoleDesc.java`

서비스 키 `tdm.Tdm31_RoleDesc.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`tdm31_role_desc.selectById`](../../tdm/sql/tdm31_role_desc.md) | - |  |
| `selectByRegDate` | 27 | [`tdm31_role_desc.selectByRegDate`](../../tdm/sql/tdm31_role_desc.md) | `Tdm31_Tab_RoleDesc` |  |
| `selectByRegDateAdmin` | 32 | [`tdm31_role_desc.selectByRegDateAdmin`](../../tdm/sql/tdm31_role_desc.md) | `Tdm31_Tab_RoleDescAdmin` |  |
| `getRollAllcDetailId` | 37 | [`tdm31_role_desc.getRollAllcDetailId`](../../tdm/sql/tdm31_role_desc.md) | `Tdm34_TabPage_RoleAllcDetail` |  |
| `updateApprId` | 42 | [`tdm31_role_desc.updateApprId`](../../tdm/sql/tdm31_role_desc.md) | `Tdm31_Tab_RoleDesc` |  |
| `updateWorkDate` | 51 | [`tdm31_role_desc.updateWorkDate1`](../../tdm/sql/tdm31_role_desc.md), [`tdm31_role_desc.updateWorkDate2`](../../tdm/sql/tdm31_role_desc.md) | `Tdm31_Tab_RoleDesc` |  |
| `fileCheck` | 66 | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Tdm31_Tab_RoleDesc`, `Tdm31_Tab_RoleDescAdmin` | `File` |
| `aprWorkCheck` | 81 | [`tdm31_role_desc.selectByParentId`](../../tdm/sql/tdm31_role_desc.md) | `Tdm31_Tab_RoleDesc` |  |
| `deleteRd` | 107 | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | - | `File` |
| `update` | 117 | `UpdateDataModel(tdm31_role_desc)` 동적 INSERT/UPDATE | `Tdm31_Tab_RoleDesc` | `UpdateDataModel` |
| `delete` | 129 | `UpdateDataModel(tdm31_role_desc)` 동적 DELETE | `Tdm31_Tab_RoleDesc` | `UpdateDataModel` |
