# tdm20_role

`server/tdm/mapper/tdm20_role.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm20_Role.selectById` |
| `selectByCompanyId` | select | 61 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm20_Role.selectByCompanyId` |
| `selectByDate` | select | 99 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm20_Role.selectByDate` |
| `selectCheckTargetRole` | select | 159 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md) |  | `tdm.Tdm20_Role.selectCheckTargetRole` |
| `checkCeoRoleId` | select | 178 | [`tdm20_role`](../../../db/tables/tdm.md) |  | `tdm.Tdm20_Role.checkCeoRoleId` |
| `getCeoRoleList` | select | 184 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md) |  | `tdm.Tdm20_Role.getCeoRoleList` |
| `countUseByRoleId` | select | 202 | [`tdm30_role_allc`](../../../db/tables/tdm.md) |  | `tdm.Tdm20_Role.countUseByRoleId`, `tdm.Tdm20_Role.delete` |
