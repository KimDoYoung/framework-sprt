# tdm31_role_desc

`server/tdm/mapper/tdm31_role_desc.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 37 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_emptrans`, `f_get_tdmpersoninfo`, `gettdm30roleallc` | `tdm.Tdm31_RoleDesc.selectById` |
| `selectByParentId` | select | 61 | [`tdm31_role_desc`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm31_RoleDesc.aprWorkCheck` |
| `selectByRegDate` | select | 70 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_emptrans`, `f_get_tdmpersoninfo`, `gettdm30roleallc` | `tdm.Tdm31_RoleDesc.selectByRegDate` |
| `selectByRegDateAdmin` | select | 108 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_company_nm`, `f_get_emptrans`, `f_get_tdmpersoninfo`, `gettdm30roleallc` | `tdm.Tdm31_RoleDesc.selectByRegDateAdmin` |
| `getRollAllcDetailId` | select | 152 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm31_role_desc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) | `gettdm30roleallc` | `tdm.Tdm31_RoleDesc.getRollAllcDetailId` |
| `updateApprId` | update | 169 | [`tdm31_role_desc`](../../../db/tables/tdm.md) |  | `tdm.Tdm31_RoleDesc.updateApprId` |
| `updateWorkDate1` | update | 175 | [`tdm31_role_desc`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm31_RoleDesc.updateWorkDate` |
| `updateWorkDate2` | update | 181 | [`tdm31_role_desc`](../../../db/tables/tdm.md) |  | `tdm.Tdm31_RoleDesc.updateWorkDate` |
