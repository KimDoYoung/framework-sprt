# tdm.Tdm33_RoleDigmFile

`server/tdm/Tdm33_RoleDigmFile.java`

서비스 키 `tdm.Tdm33_RoleDigmFile.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`tdm33_role_digm_file.selectById`](../../tdm/sql/tdm33_role_digm_file.md) | - |  |
| `selectByRoleDigmId` | 27 | [`tdm33_role_digm_file.selectByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md) | `Tdm36_TabPage_RoleReport` |  |
| `selectByFileType` | 32 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm33_role_digm_file.deleteByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) | `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigmAdmin`, `Tdm32_Tab_RoleDigm_20260310` |  |
| `deleteByRoleDigmId` | 56 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm33_role_digm_file.deleteByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) | `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigm_20260310` | `File` |
| `insertByRoleDigmId` | 72 | [`tdm33_role_digm_file.insertByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) | `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigm_20260310` |  |
| `upsertByRoleDigmId` | 83 | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.upsertByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md) | `Tdm32_Tab_RoleDigm` | `File` |
| `fileCheck` | 103 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm32_role_digm.selectByRegDate`](../../tdm/sql/tdm32_role_digm.md), [`tdm33_role_digm_file.deleteByRoleDigmFileId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) | `Tdm32_Tab_RoleDigm` |  |
| `update` | 136 | `UpdateDataModel(tdm33_role_digm_file)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 141 | `UpdateDataModel(tdm33_role_digm_file)` 동적 DELETE | - | `UpdateDataModel` |
