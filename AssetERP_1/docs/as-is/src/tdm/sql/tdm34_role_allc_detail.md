# tdm34_role_allc_detail

`server/tdm/mapper/tdm34_role_allc_detail.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm34_RoleAllcDetail.selectById` |
| `selectByRoleAllcId` | select | 39 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm34_RoleAllcDetail.selectByRoleAllcId` |
| `notInRoleAllcDetailIdList` | select | 54 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm34_RoleAllcDetail.notInRoleAllcDetailIdList` |
| `updateApprId` | update | 72 | [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) |  | `tdm.Tdm34_RoleAllcDetail.updateApprId` |
| `deleteByRoleAllcId` | update | 78 | [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) |  | `tdm.Tdm30_RoleAllc.delete` |
