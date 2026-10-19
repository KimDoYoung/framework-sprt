# tdm23_role_relate_org

`server/tdm/mapper/tdm23_role_relate_org.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md) | `f_today`, `getorg` | `tdm.Tdm23_RoleRelateOrg.selectById` |
| `selectByRoleId` | select | 26 | [`tdm09_appr_step`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md) | `getorg` | `tdm.Tdm23_RoleRelateOrg.selectByRoleId` |
