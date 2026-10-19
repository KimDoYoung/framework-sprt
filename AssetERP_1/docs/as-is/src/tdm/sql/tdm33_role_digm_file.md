# tdm33_role_digm_file

`server/tdm/mapper/tdm33_role_digm_file.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 12 | [`tdm33_role_digm_file`](../../../db/tables/tdm.md) |  | `tdm.Tdm33_RoleDigmFile.selectById` |
| `selectByRoleDigmId` | select | 18 | [`tdm33_role_digm_file`](../../../db/tables/tdm.md) |  | `tdm.Tdm33_RoleDigmFile.selectByRoleDigmId` |
| `selectByFileType` | select | 25 | [`tdm33_role_digm_file`](../../../db/tables/tdm.md) |  | `tdm.Tdm33_RoleDigmFile.deleteByRoleDigmId`, `tdm.Tdm33_RoleDigmFile.fileCheck`, `tdm.Tdm33_RoleDigmFile.insertByRoleDigmId`, `tdm.Tdm33_RoleDigmFile.selectByFileType`, `tdm.Tdm33_RoleDigmFile.upsertByRoleDigmId` |
| `insertByRoleDigmId` | insert | 32 | [`tdm33_role_digm_file`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm33_RoleDigmFile.insertByRoleDigmId` |
| `upsertByRoleDigmId` | insert | 48 | [`tdm33_role_digm_file`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm33_RoleDigmFile.upsertByRoleDigmId` |
| `deleteByRoleDigmId` | delete | 67 | [`tdm33_role_digm_file`](../../../db/tables/tdm.md) |  | `tdm.Tdm33_RoleDigmFile.deleteByRoleDigmId`, `tdm.Tdm33_RoleDigmFile.selectByFileType` |
| `deleteByRoleDigmFileId` | delete | 74 | [`tdm33_role_digm_file`](../../../db/tables/tdm.md) |  | `tdm.Tdm33_RoleDigmFile.fileCheck` |
