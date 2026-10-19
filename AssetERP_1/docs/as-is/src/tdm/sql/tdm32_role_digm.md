# tdm32_role_digm

`server/tdm/mapper/tdm32_role_digm.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 30 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm32_role_digm`](../../../db/tables/tdm.md), [`tdm33_role_digm_file`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm32_RoleDigm.selectById` |
| `selectByRegDate` | select | 55 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm32_role_digm`](../../../db/tables/tdm.md), [`tdm33_role_digm_file`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm32_RoleDigm.selectByRegDate`, `tdm.Tdm33_RoleDigmFile.fileCheck` |
| `selectByRegDateAdmin` | select | 94 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm32_role_digm`](../../../db/tables/tdm.md), [`tdm33_role_digm_file`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_company_nm` | `tdm.Tdm32_RoleDigm.selectByRegDateAdmin` |
| `updateUseFileType` | update | 140 | [`tdm32_role_digm`](../../../db/tables/tdm.md) |  | `tdm.Tdm32_RoleDigm.updateUseFileType` |
| `updateApprId` | update | 146 | [`tdm32_role_digm`](../../../db/tables/tdm.md) |  | `tdm.Tdm32_RoleDigm.updateApprId` |
