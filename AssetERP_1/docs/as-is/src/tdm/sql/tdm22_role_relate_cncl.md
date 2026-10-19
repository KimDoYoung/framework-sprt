# tdm22_role_relate_cncl

`server/tdm/mapper/tdm22_role_relate_cncl.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`tdm05_cncl`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm22_RoleRelateCncl.selectById` |
| `selectByRoleId` | select | 38 | [`tdm05_cncl`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm22_RoleRelateCncl.selectByRoleId` |
| `selectByCnclId` | select | 52 | [`tdm05_cncl`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm22_RoleRelateCncl.selectByCnclId` |
