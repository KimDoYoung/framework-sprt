# dcr03_org_auth

`server/dcr/mapper/dcr03_org_auth.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`dcr03_org_auth`](../../../db/tables/dcr.md) |  | - |
| `selectByDcrOrgId` | select | 22 | [`dcr03_org_auth`](../../../db/tables/dcr.md) |  | `dcr.Dcr03_OrgAuth.selectByDcrOrgId`, `dcr.Dcr03_OrgAuth.update`, `org.Org01_Code.updateDcrAuth` |
| `update` | update | 30 | [`dcr03_org_auth`](../../../db/tables/dcr.md) |  | `dcr.Dcr30_Link.updateDcrAuth` |
| `updateByBakDcr` | update | 36 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md) |  | `dcr.Dcr30_Link.updateLink` |
| `inUpdateRight` | insert | 47 | [`dcr03_org_auth`](../../../db/tables/dcr.md) | `f_create_seq` | `org.Org01_Code.copyDcrRight` |
| `deleteByOrgAuthId` | delete | 72 | [`dcr03_org_auth`](../../../db/tables/dcr.md) |  | `org.Org01_Code.updateDcrAuth` |
