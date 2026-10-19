# tdm.Tdm32_RoleDigm

`server/tdm/Tdm32_RoleDigm.java`

서비스 키 `tdm.Tdm32_RoleDigm.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm32_role_digm.selectById`](../../tdm/sql/tdm32_role_digm.md) | - |  |
| `selectByRegDate` | 25 | [`tdm32_role_digm.selectByRegDate`](../../tdm/sql/tdm32_role_digm.md) | `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigm_20260310` |  |
| `selectByRegDateAdmin` | 30 | [`tdm32_role_digm.selectByRegDateAdmin`](../../tdm/sql/tdm32_role_digm.md) | `Tdm32_Tab_RoleDigmAdmin` |  |
| `fileCheck` | 35 | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Tdm32_Tab_RoleDigmAdmin` | `File` |
| `updateUseFileType` | 48 | [`tdm32_role_digm.updateUseFileType`](../../tdm/sql/tdm32_role_digm.md) | `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigm_20260310` |  |
| `updateApprId` | 57 | [`tdm32_role_digm.updateApprId`](../../tdm/sql/tdm32_role_digm.md) | `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigm_20260310` |  |
| `update` | 66 | `UpdateDataModel(tdm32_role_digm)` 동적 INSERT/UPDATE | `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigm_20260310` | `UpdateDataModel` |
| `delete` | 71 | `UpdateDataModel(tdm32_role_digm)` 동적 DELETE | `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigm_20260310` | `UpdateDataModel` |
